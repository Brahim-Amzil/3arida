/**
 * Report Access Control Service
 *
 * Per-petition download quotas:
 * - Paid tier: 10 free downloads, then 10 MAD each
 * - Free tier: 4 free downloads, then 19 MAD or upgrade
 *
 * Launch/beta mode (BETA100) applies to checkout only — not unlimited PDFs.
 */

import { Petition } from '../types/petition';

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

export const FREE_TIER_FREE_DOWNLOADS = 4;
export const PAID_TIER_FREE_DOWNLOADS = 10;
export const FREE_EXTRA_DOWNLOAD_PRICE_MAD = 19;
export const PAID_EXTRA_DOWNLOAD_PRICE_MAD = 10;

/** @deprecated Use tier-specific constants */
export const FREE_DOWNLOADS_PER_TIER = PAID_TIER_FREE_DOWNLOADS;
/** @deprecated Use tier-specific constants */
export const PAID_DOWNLOAD_PRICE_MAD = PAID_EXTRA_DOWNLOAD_PRICE_MAD;

// ============================================================================
// HELPERS
// ============================================================================

export function isPaidPetitionTier(petition: Petition): boolean {
  return petition.pricingTier !== 'free';
}

export function getFreeDownloadAllowance(petition: Petition): number {
  return isPaidPetitionTier(petition)
    ? PAID_TIER_FREE_DOWNLOADS
    : FREE_TIER_FREE_DOWNLOADS;
}

export function getExtraDownloadPrice(petition: Petition): number {
  return isPaidPetitionTier(petition)
    ? PAID_EXTRA_DOWNLOAD_PRICE_MAD
    : FREE_EXTRA_DOWNLOAD_PRICE_MAD;
}

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
  if (petition.creatorId !== userId) {
    return {
      allowed: false,
      reason: 'UNAUTHORIZED',
    };
  }

  return { allowed: true };
}

/**
 * Determines if payment is required for the next download
 */
export function requiresPayment(petition: Petition): boolean {
  const downloadCount = petition.reportDownloads || 0;
  return downloadCount >= getFreeDownloadAllowance(petition);
}

/**
 * Free tier at quota: user chooses pay 19 MAD or upgrade
 */
export function isFreeTierLimitChoice(petition: Petition): boolean {
  return petition.pricingTier === 'free' && requiresPayment(petition);
}

/**
 * Calculates remaining free downloads
 */
export function getRemainingFreeDownloads(petition: Petition): number {
  const downloadCount = petition.reportDownloads || 0;
  const remaining = getFreeDownloadAllowance(petition) - downloadCount;
  return Math.max(0, remaining);
}

/**
 * Gets the price for the next download
 */
export function getDownloadPrice(petition: Petition): number {
  if (!requiresPayment(petition)) {
    return 0;
  }
  return getExtraDownloadPrice(petition);
}

/**
 * Gets button state for UI
 */
export function getButtonState(petition: Petition): {
  disabled: boolean;
  badge: 'free' | 'paid' | 'locked' | 'choice';
  badgeText: string;
  onClick: 'generate' | 'upgrade' | 'payment' | 'limit_choice';
} {
  const remaining = getRemainingFreeDownloads(petition);

  if (remaining > 0) {
    return {
      disabled: false,
      badge: 'free',
      badgeText: `مجاني (${remaining} متبقي)`,
      onClick: 'generate',
    };
  }

  if (petition.pricingTier === 'free') {
    return {
      disabled: false,
      badge: 'choice',
      badgeText: `${FREE_EXTRA_DOWNLOAD_PRICE_MAD} درهم أو ترقية`,
      onClick: 'limit_choice',
    };
  }

  return {
    disabled: false,
    badge: 'paid',
    badgeText: `${PAID_EXTRA_DOWNLOAD_PRICE_MAD} درهم`,
    onClick: 'payment',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ReportAccessControl = {
  canGenerateReport,
  requiresPayment,
  isFreeTierLimitChoice,
  getRemainingFreeDownloads,
  getDownloadPrice,
  getButtonState,
  isPaidPetitionTier,
  getFreeDownloadAllowance,
  getExtraDownloadPrice,
  FREE_TIER_FREE_DOWNLOADS,
  PAID_TIER_FREE_DOWNLOADS,
  FREE_EXTRA_DOWNLOAD_PRICE_MAD,
  PAID_EXTRA_DOWNLOAD_PRICE_MAD,
  FREE_DOWNLOADS_PER_TIER,
  PAID_DOWNLOAD_PRICE_MAD,
} as const;

export default ReportAccessControl;
