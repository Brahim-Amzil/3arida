/**
 * Tier-based feature restrictions
 *
 * This module handles feature access control based on petition pricing tiers.
 * Used to gate premium features and show upgrade prompts.
 */

import { PricingTier } from '@/types/petition';

export interface TierFeatureAccess {
  canViewTotalSignatures: boolean;
  canAddPetitionUpdates: boolean;
  canAccessAppeals: boolean;
  canViewMySignatures: boolean;
  canUseComments: boolean;
  canGenerateQRCode: boolean;
  maxImages: number;
}

// Absolute maximum images allowed in the system
export const ABSOLUTE_MAX_IMAGES = 10;

/**
 * Check if a tier has access to specific features
 */
export function getTierFeatureAccess(tier: PricingTier): TierFeatureAccess {
  // Free tier restrictions
  if (tier === 'free') {
    return {
      canViewTotalSignatures: false, // ❌ Hidden - upgrade to see
      canAddPetitionUpdates: false, // ❌ Locked - upgrade to add updates
      canAccessAppeals: false, // ❌ Locked - upgrade for appeals
      canViewMySignatures: true, // ✅ Allowed - encourage engagement
      canUseComments: true, // ✅ Allowed - encourage engagement
      canGenerateQRCode: true, // ✅ Allowed - free for all
      maxImages: 1, // ❌ Limited to 1 image
    };
  }

  // All paid tiers have full access
  return {
    canViewTotalSignatures: true,
    canAddPetitionUpdates: true,
    canAccessAppeals: true,
    canViewMySignatures: true,
    canUseComments: true,
    canGenerateQRCode: true,
    maxImages: 5, // ✅ Up to 5 images
  };
}

/**
 * Check if user can view total signatures stat
 */
export function canViewTotalSignatures(tier: PricingTier): boolean {
  return getTierFeatureAccess(tier).canViewTotalSignatures;
}

/**
 * Check if user can add petition updates
 */
export function canAddPetitionUpdates(tier: PricingTier): boolean {
  return getTierFeatureAccess(tier).canAddPetitionUpdates;
}

/**
 * Check if user can access appeals
 */
export function canAccessAppeals(tier: PricingTier): boolean {
  return getTierFeatureAccess(tier).canAccessAppeals;
}

/**
 * Get upgrade message for locked feature
 */
export function getUpgradeMessage(
  feature: 'signatures' | 'updates' | 'appeals',
): {
  title: string;
  description: string;
  minTier: PricingTier;
  minPrice: number;
} {
  switch (feature) {
    case 'signatures':
      return {
        title: 'Upgrade to View Total Signatures',
        description:
          "Track your petition's total impact across all your campaigns. Upgrade to Starter tier or higher.",
        minTier: 'basic',
        minPrice: 69,
      };
    case 'updates':
      return {
        title: 'Upgrade to Add Petition Updates',
        description:
          'Keep your supporters informed with regular updates. Upgrade to Starter tier or higher.',
        minTier: 'basic',
        minPrice: 69,
      };
    case 'appeals':
      return {
        title: 'Upgrade to Access Appeals',
        description:
          'Submit appeals for rejected petitions. Upgrade to Starter tier or higher.',
        minTier: 'basic',
        minPrice: 69,
      };
  }
}

/**
 * Get tier name for display
 */
export function getTierDisplayName(tier: PricingTier): string {
  const names: Record<PricingTier, string> = {
    free: 'Free',
    basic: 'Starter',
    premium: 'Pro',
    advanced: 'Advanced',
    enterprise: 'Enterprise',
  };
  return names[tier];
}

/**
 * Get maximum images allowed for a tier
 */
export function getMaxImages(tier: PricingTier): number {
  return getTierFeatureAccess(tier).maxImages;
}

/**
 * Check if user can add more images
 */
export function canAddMoreImages(
  tier: PricingTier,
  currentCount: number,
): boolean {
  return currentCount < getMaxImages(tier);
}
