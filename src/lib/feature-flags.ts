/**
 * Feature Flags System
 *
 * Controls which features are enabled based on environment variables.
 * This allows running the same codebase as either:
 * - FREE MVP (all features free, no payments)
 * - PAID VERSION (full tier system with payments)
 *
 * Usage:
 * - MVP Mode: Set NEXT_PUBLIC_MVP_MODE=true
 * - Paid Mode: Set NEXT_PUBLIC_MVP_MODE=false (or omit)
 */

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Master switch: When true, all paid features become free
 * When false, normal tier restrictions apply
 */
const IS_MVP_MODE =
  typeof window !== 'undefined'
    ? ((window as any).__NEXT_DATA__?.props?.pageProps?.mvpMode ?? false)
    : process.env.NEXT_PUBLIC_MVP_MODE === 'true';

/**
 * Beta mode for report feature: When true, unlimited free report downloads
 * When false, normal tier restrictions apply (2 free, then 19 MAD)
 */
const IS_BETA_MODE =
  typeof window !== 'undefined'
    ? ((window as any).__NEXT_DATA__?.props?.pageProps?.betaMode ?? false)
    : process.env.NEXT_PUBLIC_BETA_MODE === 'true';

/**
 * Individual feature toggles (only used when NOT in MVP mode)
 */
const ENABLE_PAYMENTS = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS !== 'false';
const ENABLE_TIERS = process.env.NEXT_PUBLIC_ENABLE_TIERS !== 'false';
const SHOW_PRICING_PAGE = process.env.NEXT_PUBLIC_SHOW_PRICING_PAGE !== 'false';
const ENABLE_INFLUENCERS =
  process.env.NEXT_PUBLIC_ENABLE_INFLUENCERS !== 'false';
const ENABLE_COUPONS = process.env.NEXT_PUBLIC_ENABLE_COUPONS !== 'false';

// ============================================================================
// FEATURE FLAG FUNCTIONS
// ============================================================================

/**
 * Check if we're running in MVP mode (all features free)
 */
/**
 * Check if we're running in MVP mode (all features free)
 */
export function isMVPMode(): boolean {
  return IS_MVP_MODE;
}

/**
 * Check if we're running in beta mode for report feature
 * In beta mode: Unlimited free report downloads for all tiers
 * In production: 2 free downloads for paid tiers, then 19 MAD
 */
export function isBetaMode(): boolean {
  return IS_BETA_MODE;
}

/**
 * Check if payments are enabled
 * In MVP mode: Always false (no payments)
 * In paid mode: Based on ENABLE_PAYMENTS flag
 */
export function isPaymentsEnabled(): boolean {
  if (IS_MVP_MODE) return false;
  return ENABLE_PAYMENTS;
}

/**
 * Check if tier restrictions are enabled
 * In MVP mode: Always false (no restrictions)
 * In paid mode: Based on ENABLE_TIERS flag
 */
export function isTiersEnabled(): boolean {
  if (IS_MVP_MODE) return false;
  return ENABLE_TIERS;
}

/**
 * Check if pricing page should be shown
 * In MVP mode: Always false (hide pricing)
 * In paid mode: Based on SHOW_PRICING_PAGE flag
 */
export function shouldShowPricingPage(): boolean {
  if (IS_MVP_MODE) return false;
  return SHOW_PRICING_PAGE;
}

/**
 * Check if influencer program is enabled
 * In MVP mode: Can be enabled (doesn't require payment)
 * In paid mode: Based on ENABLE_INFLUENCERS flag
 */
export function isInfluencersEnabled(): boolean {
  // Influencers can work in MVP mode (just no coupons)
  return ENABLE_INFLUENCERS;
}

/**
 * Check if coupon system is enabled
 * In MVP mode: Always false (no coupons without payments)
 * In paid mode: Based on ENABLE_COUPONS flag
 */
export function isCouponsEnabled(): boolean {
  if (IS_MVP_MODE) return false;
  return ENABLE_COUPONS;
}

/**
 * Get the maximum signatures allowed in MVP mode
 * This is the default limit for all free petitions
 */
export function getMVPMaxSignatures(): number {
  return 10000; // Generous limit for MVP
}

/**
 * Get the maximum images allowed in MVP mode
 */
export function getMVPMaxImages(): number {
  return 3; // Reasonable limit for MVP
}

/**
 * Check if a feature should be locked based on tier
 * In MVP mode: Nothing is locked
 * In paid mode: Use normal tier restrictions
 */
export function isFeatureLocked(
  feature: 'signatures' | 'updates' | 'appeals' | 'images',
  tier: string,
): boolean {
  if (IS_MVP_MODE) return false; // Nothing locked in MVP

  // In paid mode, free tier has restrictions
  if (tier === 'free') {
    switch (feature) {
      case 'signatures':
        return false; // Can view signatures in free tier
      case 'updates':
        return true; // Updates locked in free tier
      case 'appeals':
        return true; // Appeals locked in free tier
      case 'images':
        return false; // Can upload 1 image in free tier
      default:
        return false;
    }
  }

  return false; // Paid tiers have no restrictions
}

/**
 * Get display mode for UI elements
 */
export function getDisplayMode(): 'mvp' | 'paid' {
  return IS_MVP_MODE ? 'mvp' : 'paid';
}

/**
 * Get banner message for MVP mode (optional)
 */
export function getMVPBannerMessage(): string | null {
  if (!IS_MVP_MODE) return null;

  return 'Welcome to our Beta! All features are currently free during our launch period.';
}

// ============================================================================
// LOGGING & DEBUGGING
// ============================================================================

/**
 * Log current feature flag configuration (for debugging)
 */
export function logFeatureFlags(): void {
  if (typeof window === 'undefined') return; // Only log in browser

  console.log('🚩 Feature Flags Configuration:');
  console.log('  MVP Mode:', IS_MVP_MODE);
  console.log('  Payments:', isPaymentsEnabled());
  console.log('  Tiers:', isTiersEnabled());
  console.log('  Pricing Page:', shouldShowPricingPage());
  console.log('  Influencers:', isInfluencersEnabled());
  console.log('  Coupons:', isCouponsEnabled());
  console.log('  Display Mode:', getDisplayMode());
}

// ============================================================================
// EXPORTS
// ============================================================================

export const FeatureFlags = {
  isBetaMode,
  isMVPMode,
  isPaymentsEnabled,
  isTiersEnabled,
  shouldShowPricingPage,
  isInfluencersEnabled,
  isCouponsEnabled,
  getMVPMaxSignatures,
  getMVPMaxImages,
  isFeatureLocked,
  getDisplayMode,
  getMVPBannerMessage,
  logFeatureFlags,
} as const;

export default FeatureFlags;
