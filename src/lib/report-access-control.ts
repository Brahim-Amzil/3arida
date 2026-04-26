/**
 * Report Access Control Service
 *
 * Manages access control for petition report generation based on:
 * - Beta mode status
 * - Petition pricing tier
 * - Download count
 * - User permissions
 */

import { Petition, PricingTier } from '../types/petition';
import { isBetaMode } from './feature-flags';

// ============================================================================
// TYPES
// ============================================================================

export interface AccessDecision {
  allowed: boolean;
  reason?: string;
  requiresUpgrade?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FREE_DOWNLOADS_PER_TIER = 2;
const PAID_DOWNLOAD_PRICE_MAD = 19;

// ============================================================================
// ACCESS CONTROL FUNCTIONS
// ============================================================================

/**
 * Determines if a user can generate a report for a petition
 */
export function canGenerateReport(
  petition: Petition,
  userId: string,
): AccessDecision {
  // Check if user owns the petition
  if (petition.creatorId !== userId) {
    return {
      allowed: false,
      reason: 'UNAUTHORIZED',
    };
  }

  // In beta mode, everyone can generate reports
  if (isBetaMode()) {
    return {
      allowed: true,
    };
  }

  // Check tier restrictions (post-beta)
  if (petition.pricingTier === 'free') {
    return {
      allowed: false,
      reason: 'UPGRADE_REQUIRED',
      requiresUpgrade: true,
    };
  }

  // Paid tiers can generate reports
  return {
    allowed: true,
  };
}

/**
 * Determines if payment is required for the next download
 */
export function requiresPayment(petition: Petition): boolean {
  // In beta mode, no payment required
  if (isBetaMode()) {
    return false;
  }

  // Free tier cannot download (should upgrade first)
  if (petition.pricingTier === 'free') {
    return false; // Not applicable - they can't download at all
  }

  // Check download count
  const downloadCount = petition.reportDownloads || 0;

  // First 2 downloads are free for paid tiers
  return downloadCount >= FREE_DOWNLOADS_PER_TIER;
}

/**
 * Calculates remaining free downloads
 */
export function getRemainingFreeDownloads(petition: Petition): number {
  // In beta mode, unlimited downloads
  if (isBetaMode()) {
    return Infinity;
  }

  // Free tier has no free downloads (must upgrade)
  if (petition.pricingTier === 'free') {
    return 0;
  }

  // Calculate remaining for paid tiers
  const downloadCount = petition.reportDownloads || 0;
  const remaining = FREE_DOWNLOADS_PER_TIER - downloadCount;

  return Math.max(0, remaining);
}

/**
 * Gets the price for the next download
 */
export function getDownloadPrice(petition: Petition): number {
  if (requiresPayment(petition)) {
    return PAID_DOWNLOAD_PRICE_MAD;
  }
  return 0;
}

/**
 * Gets button state for UI
 */
export function getButtonState(petition: Petition): {
  disabled: boolean;
  badge: 'free' | 'beta' | 'paid' | 'locked';
  badgeText: string;
  onClick: 'generate' | 'upgrade' | 'payment';
} {
  // Beta mode
  if (isBetaMode()) {
    return {
      disabled: false,
      badge: 'beta',
      badgeText: 'مجاني - بيتا',
      onClick: 'generate',
    };
  }

  // Free tier (post-beta)
  if (petition.pricingTier === 'free') {
    return {
      disabled: true,
      badge: 'locked',
      badgeText: 'يجب الترقية',
      onClick: 'upgrade',
    };
  }

  // Paid tier with free downloads remaining
  const remaining = getRemainingFreeDownloads(petition);
  if (remaining > 0) {
    return {
      disabled: false,
      badge: 'free',
      badgeText: `مجاني (${remaining} متبقي)`,
      onClick: 'generate',
    };
  }

  // Paid tier, payment required
  return {
    disabled: false,
    badge: 'paid',
    badgeText: `${PAID_DOWNLOAD_PRICE_MAD} درهم`,
    onClick: 'payment',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ReportAccessControl = {
  canGenerateReport,
  requiresPayment,
  getRemainingFreeDownloads,
  getDownloadPrice,
  getButtonState,
  FREE_DOWNLOADS_PER_TIER,
  PAID_DOWNLOAD_PRICE_MAD,
} as const;

export default ReportAccessControl;
