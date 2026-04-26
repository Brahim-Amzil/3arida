/**
 * Beta Coupon Service
 *
 * Manages automatic coupon application during beta period:
 * - Checks beta mode status
 * - Auto-applies 100% discount coupons
 * - Logs coupon applications
 */

import { adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// ============================================================================
// TYPES
// ============================================================================

export interface CouponLog {
  id: string;
  petitionId: string;
  userId: string;
  couponCode: string;
  discountAmount: number;
  originalAmount: number;
  appliedAt: Timestamp;
  upgradeType: 'free-to-paid' | 'paid-to-paid';
  fromTier: string;
  toTier: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BETA_COUPON_CODE = 'BETA100';
const BETA_DISCOUNT_PERCENT = 100;

// ============================================================================
// BETA MODE CHECK
// ============================================================================

/**
 * Check if the application is in beta mode
 *
 * Beta mode is determined by the NEXT_PUBLIC_BETA_MODE environment variable
 * During beta, all upgrades are free (100% discount auto-applied)
 *
 * @returns True if in beta mode
 */
export function isBetaMode(): boolean {
  const betaMode = process.env.NEXT_PUBLIC_BETA_MODE;
  return betaMode === 'true' || betaMode === '1';
}

/**
 * Check if coupon should be applied for an upgrade
 *
 * @param isUpgrade - Whether this is an upgrade payment
 * @returns True if coupon should be applied
 */
export function shouldApplyCoupon(isUpgrade: boolean): boolean {
  return isBetaMode() && isUpgrade;
}

/**
 * Get the beta coupon code
 *
 * @returns The coupon code to apply
 */
export function getBetaCouponCode(): string {
  return BETA_COUPON_CODE;
}

/**
 * Get the beta discount percentage
 *
 * @returns The discount percentage (100 for beta)
 */
export function getBetaDiscountPercent(): number {
  return BETA_DISCOUNT_PERCENT;
}

// ============================================================================
// COUPON APPLICATION
// ============================================================================

/**
 * Calculate discounted amount
 *
 * @param originalAmount - Original payment amount
 * @returns Discounted amount (0 during beta)
 */
export function calculateDiscountedAmount(originalAmount: number): number {
  if (!isBetaMode()) {
    return originalAmount;
  }

  return 0; // 100% discount
}

/**
 * Apply coupon to Stripe payment intent
 *
 * Note: This is a placeholder. Actual Stripe coupon application
 * should be done in the payment intent creation API route.
 *
 * @param paymentIntentId - Stripe payment intent ID
 * @param couponCode - Coupon code to apply
 */
export async function applyCoupon(
  paymentIntentId: string,
  couponCode: string,
): Promise<void> {
  // This function is a placeholder for Stripe integration
  // Actual coupon application happens in the Stripe API
  console.log(
    `[Beta Coupon] Would apply coupon ${couponCode} to payment intent ${paymentIntentId}`,
  );
}

// ============================================================================
// COUPON LOGGING
// ============================================================================

/**
 * Log coupon application to Firestore
 *
 * Creates a record in the couponLogs collection for tracking and analytics
 *
 * @param petitionId - Petition being upgraded
 * @param userId - User performing the upgrade
 * @param couponCode - Coupon code applied
 * @param originalAmount - Original payment amount
 * @param discountAmount - Discount amount applied
 * @param upgradeType - Type of upgrade (free-to-paid or paid-to-paid)
 * @param fromTier - Current tier
 * @param toTier - Target tier
 */
export async function logCouponApplication(
  petitionId: string,
  userId: string,
  couponCode: string,
  originalAmount: number,
  discountAmount: number,
  upgradeType: 'free-to-paid' | 'paid-to-paid',
  fromTier: string,
  toTier: string,
): Promise<void> {
  try {
    const couponLogRef = adminDb.collection('couponLogs').doc();

    const couponLog: Omit<CouponLog, 'id'> = {
      petitionId,
      userId,
      couponCode,
      discountAmount,
      originalAmount,
      appliedAt: Timestamp.now(),
      upgradeType,
      fromTier,
      toTier,
    };

    await couponLogRef.set(couponLog);

    console.log(
      `[Beta Coupon] Logged coupon application: ${couponCode} for petition ${petitionId}`,
    );
  } catch (error) {
    console.error('[Beta Coupon] Failed to log coupon application:', error);
    // Don't throw - logging failure shouldn't block the upgrade
  }
}

/**
 * Get coupon application metadata for payment intent
 *
 * Returns metadata to include in Stripe payment intent
 *
 * @param petitionId - Petition being upgraded
 * @param fromTier - Current tier
 * @param toTier - Target tier
 * @param originalAmount - Original payment amount
 * @returns Metadata object for Stripe
 */
export function getCouponMetadata(
  petitionId: string,
  fromTier: string,
  toTier: string,
  originalAmount: number,
): Record<string, string> {
  if (!isBetaMode()) {
    return {};
  }

  return {
    betaCoupon: BETA_COUPON_CODE,
    betaDiscount: BETA_DISCOUNT_PERCENT.toString(),
    originalAmount: originalAmount.toString(),
    discountedAmount: '0',
    betaMode: 'true',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const BetaCouponService = {
  isBetaMode,
  shouldApplyCoupon,
  getBetaCouponCode,
  getBetaDiscountPercent,
  calculateDiscountedAmount,
  applyCoupon,
  logCouponApplication,
  getCouponMetadata,
} as const;

export default BetaCouponService;
