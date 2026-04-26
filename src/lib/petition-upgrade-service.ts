/**
 * Petition Upgrade Service
 *
 * Manages petition tier upgrades in Firestore:
 * - Updates petition tier and signature limit atomically
 * - Tracks upgrade history
 * - Handles errors with failedUpgrades collection
 */

import { adminDb } from './firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { PricingTier } from '@/types/petition';
import { getNewSignatureLimit } from './petition-upgrade-utils';

// ============================================================================
// TYPES
// ============================================================================

export interface UpgradeResult {
  success: boolean;
  petition?: any;
  error?: string;
}

export interface UpgradeHistoryEntry {
  fromTier: PricingTier;
  toTier: PricingTier;
  upgradedAt: Timestamp;
  paymentIntentId: string;
  amountPaid: number;
}

export interface FailedUpgrade {
  petitionId: string;
  paymentIntentId: string;
  targetTier: PricingTier;
  failedAt: Timestamp;
  error: string;
  resolved: boolean;
}

// ============================================================================
// UPGRADE FUNCTIONS
// ============================================================================

/**
 * Upgrade a petition to a new tier
 *
 * Updates both pricingTier and signatureLimit atomically in Firestore
 * Adds upgrade history entry
 * Handles errors by creating failedUpgrade documents
 *
 * @param petitionId - ID of the petition to upgrade
 * @param newTier - Target pricing tier
 * @param paymentIntentId - Stripe payment intent ID
 * @param amountPaid - Amount paid for the upgrade (0 during beta)
 * @returns UpgradeResult with success status and updated petition or error
 */
export async function upgradePetition(
  petitionId: string,
  newTier: PricingTier,
  paymentIntentId: string,
  amountPaid: number = 0,
): Promise<UpgradeResult> {
  try {
    console.log(
      `[Upgrade Service] Starting upgrade for petition ${petitionId} to ${newTier}`,
    );

    const petitionRef = adminDb.collection('petitions').doc(petitionId);

    // Get current petition data
    const petitionDoc = await petitionRef.get();

    if (!petitionDoc.exists) {
      console.error(`[Upgrade Service] Petition ${petitionId} not found`);
      return {
        success: false,
        error: 'Petition not found',
      };
    }

    const currentPetition = petitionDoc.data();
    const currentTier = currentPetition?.pricingTier as PricingTier;
    const newLimit = getNewSignatureLimit(newTier);

    // Create upgrade history entry
    const historyEntry: UpgradeHistoryEntry = {
      fromTier: currentTier,
      toTier: newTier,
      upgradedAt: Timestamp.now(),
      paymentIntentId,
      amountPaid,
    };

    // Update petition with new tier, limit, targetSignatures, and history
    // Set targetSignatures to the new limit so the petition can collect more signatures
    await petitionRef.update({
      pricingTier: newTier,
      signatureLimit: newLimit,
      targetSignatures: newLimit,
      lastUpgradeAt: Timestamp.now(),
      lastUpgradePaymentId: paymentIntentId,
      upgradeHistory: FieldValue.arrayUnion(historyEntry),
      updatedAt: Timestamp.now(),
    });

    console.log(
      `[Upgrade Service] Successfully upgraded petition ${petitionId} from ${currentTier} to ${newTier}`,
    );

    // Get updated petition
    const updatedPetitionDoc = await petitionRef.get();
    const updatedPetition = updatedPetitionDoc.data();

    return {
      success: true,
      petition: updatedPetition,
    };
  } catch (error) {
    console.error('[Upgrade Service] Failed to upgrade petition:', error);

    // Create failed upgrade entry for manual review
    await createFailedUpgradeEntry(
      petitionId,
      newTier,
      paymentIntentId,
      error instanceof Error ? error.message : 'Unknown error',
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a failed upgrade entry for manual review
 *
 * When a payment succeeds but Firestore update fails, we create a record
 * so support team can manually apply the upgrade
 *
 * @param petitionId - ID of the petition
 * @param targetTier - Target tier that failed to apply
 * @param paymentIntentId - Stripe payment intent ID
 * @param error - Error message
 */
async function createFailedUpgradeEntry(
  petitionId: string,
  targetTier: PricingTier,
  paymentIntentId: string,
  error: string,
): Promise<void> {
  try {
    const failedUpgradeRef = adminDb.collection('failedUpgrades').doc();

    const failedUpgrade: Omit<FailedUpgrade, 'id'> = {
      petitionId,
      paymentIntentId,
      targetTier,
      failedAt: Timestamp.now(),
      error,
      resolved: false,
    };

    await failedUpgradeRef.set(failedUpgrade);

    console.log(
      `[Upgrade Service] Created failed upgrade entry for petition ${petitionId}`,
    );
  } catch (logError) {
    console.error(
      '[Upgrade Service] Failed to create failed upgrade entry:',
      logError,
    );
    // Don't throw - this is just logging
  }
}

/**
 * Resolve a failed upgrade manually
 *
 * Support team can use this to manually apply an upgrade after fixing the issue
 *
 * @param failedUpgradeId - ID of the failed upgrade document
 * @param petitionId - ID of the petition
 * @param newTier - Target tier
 * @param paymentIntentId - Stripe payment intent ID
 * @returns UpgradeResult
 */
export async function resolveFailedUpgrade(
  failedUpgradeId: string,
  petitionId: string,
  newTier: PricingTier,
  paymentIntentId: string,
): Promise<UpgradeResult> {
  try {
    // Attempt the upgrade
    const result = await upgradePetition(petitionId, newTier, paymentIntentId);

    if (result.success) {
      // Mark failed upgrade as resolved
      await adminDb
        .collection('failedUpgrades')
        .doc(failedUpgradeId)
        .update({
          resolved: true,
          resolvedAt: Timestamp.now(),
        });

      console.log(
        `[Upgrade Service] Resolved failed upgrade ${failedUpgradeId}`,
      );
    }

    return result;
  } catch (error) {
    console.error('[Upgrade Service] Failed to resolve failed upgrade:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get upgrade history for a petition
 *
 * @param petitionId - ID of the petition
 * @returns Array of upgrade history entries
 */
export async function getUpgradeHistory(
  petitionId: string,
): Promise<UpgradeHistoryEntry[]> {
  try {
    const petitionDoc = await adminDb
      .collection('petitions')
      .doc(petitionId)
      .get();

    if (!petitionDoc.exists) {
      return [];
    }

    const petition = petitionDoc.data();
    return (petition?.upgradeHistory as UpgradeHistoryEntry[]) || [];
  } catch (error) {
    console.error('[Upgrade Service] Failed to get upgrade history:', error);
    return [];
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const PetitionUpgradeService = {
  upgradePetition,
  resolveFailedUpgrade,
  getUpgradeHistory,
} as const;

export default PetitionUpgradeService;
