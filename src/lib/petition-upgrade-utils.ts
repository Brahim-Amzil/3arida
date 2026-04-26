/**
 * Petition Tier Upgrade Utilities
 *
 * Provides functions for:
 * - Filtering available upgrade tiers
 * - Calculating upgrade prices
 * - Managing tier upgrade logic
 */

import { PricingTier, PricingTierConfig } from '@/types/petition';

// ============================================================================
// TYPES
// ============================================================================

export interface TierOption {
  tier: PricingTier;
  name: string;
  price: number;
  signatureLimit: number;
  features: string[];
  upgradePrice: number; // Full price or difference based on upgrade type
}

export interface UpgradeCalculation {
  currentTier: PricingTier;
  selectedTier: PricingTier;
  currentPrice: number;
  selectedPrice: number;
  upgradePrice: number;
  upgradeType: 'free-to-paid' | 'paid-to-paid';
}

// ============================================================================
// PRICING TIER CONFIGURATION
// ============================================================================

/**
 * Complete pricing tier configuration
 * Matches requirements: FREE (0, 2.5K), STARTER (69, 10K), PRO (129, 30K),
 * ADVANCED (229, 75K), ENTERPRISE (369, 100K)
 */
export const UPGRADE_PRICING_TIERS: Record<PricingTier, PricingTierConfig> = {
  free: {
    name: 'الخطة المجانية',
    maxSignatures: 2500,
    price: 0,
    features: [
      'حتى 2,500 توقيع',
      'إنشاء عريضة أساسية',
      'مشاركة اجتماعية',
    ],
  },
  basic: {
    // Maps to STARTER
    name: 'الخطة الأساسية',
    maxSignatures: 10000,
    price: 69,
    features: [
      'حتى 10,000 توقيع',
      'تحميلان مجانيان للتقرير',
      'رمز QR',
      'دعم محسّن',
    ],
  },
  premium: {
    // Maps to PRO
    name: 'الخطة الاحترافية',
    maxSignatures: 30000,
    price: 129,
    features: [
      'حتى 30,000 توقيع',
      'تحميلان مجانيان للتقرير',
      'علامة تجارية مخصصة',
      'لوحة تحليلات',
    ],
  },
  advanced: {
    name: 'الخطة المتقدمة',
    maxSignatures: 75000,
    price: 229,
    features: [
      'حتى 75,000 توقيع',
      'تحميلان مجانيان للتقرير',
      'تحليلات متقدمة',
      'وصول API',
    ],
  },
  enterprise: {
    name: 'الخطة المؤسسية',
    maxSignatures: 100000,
    price: 369,
    features: [
      'حتى 100,000 توقيع',
      'تحميلان مجانيان للتقرير',
      'دعم مخصص',
      'ميزات مخصصة',
    ],
  },
};

/**
 * Tier order for comparison (lowest to highest)
 */
const TIER_ORDER: PricingTier[] = [
  'free',
  'basic',
  'premium',
  'advanced',
  'enterprise',
];

// ============================================================================
// TIER FILTERING
// ============================================================================

/**
 * Get all tiers higher than the current tier
 *
 * @param currentTier - The current pricing tier
 * @returns Array of tier options available for upgrade
 *
 * Examples:
 * - FREE tier: returns [STARTER, PRO, ADVANCED, ENTERPRISE]
 * - STARTER tier: returns [PRO, ADVANCED, ENTERPRISE]
 * - ENTERPRISE tier: returns []
 */
export function filterAvailableTiers(
  currentTier: PricingTier,
): TierOption[] {
  const currentIndex = TIER_ORDER.indexOf(currentTier);

  if (currentIndex === -1) {
    console.error(`Invalid tier: ${currentTier}`);
    return [];
  }

  // Get all tiers after current tier
  const higherTiers = TIER_ORDER.slice(currentIndex + 1);

  // Map to TierOption with upgrade price calculation
  return higherTiers.map((tier) => {
    const config = UPGRADE_PRICING_TIERS[tier];
    const upgradePrice = calculateUpgradePrice(currentTier, tier);

    return {
      tier,
      name: config.name,
      price: config.price,
      signatureLimit: config.maxSignatures,
      features: config.features,
      upgradePrice,
    };
  });
}

// ============================================================================
// PRICE CALCULATION
// ============================================================================

/**
 * Calculate the upgrade price based on current and selected tiers
 *
 * Rules:
 * - FREE → PAID: Full price of selected tier
 * - PAID → PAID: Difference between selected and current tier prices
 *
 * @param currentTier - The current pricing tier
 * @param selectedTier - The target pricing tier
 * @returns The amount to charge for the upgrade
 *
 * Examples:
 * - FREE → STARTER: 69 MAD (full price)
 * - STARTER → PRO: 60 MAD (129 - 69)
 * - FREE → ENTERPRISE: 369 MAD (full price)
 */
export function calculateUpgradePrice(
  currentTier: PricingTier,
  selectedTier: PricingTier,
): number {
  const currentConfig = UPGRADE_PRICING_TIERS[currentTier];
  const selectedConfig = UPGRADE_PRICING_TIERS[selectedTier];

  if (!currentConfig || !selectedConfig) {
    console.error(
      `Invalid tiers: current=${currentTier}, selected=${selectedTier}`,
    );
    return 0;
  }

  // FREE to PAID: full price
  if (currentConfig.price === 0) {
    return selectedConfig.price;
  }

  // PAID to PAID: difference
  const difference = selectedConfig.price - currentConfig.price;

  // Ensure positive difference (should always be true if tiers are filtered correctly)
  return Math.max(0, difference);
}

/**
 * Get detailed upgrade calculation information
 *
 * @param currentTier - The current pricing tier
 * @param selectedTier - The target pricing tier
 * @returns Detailed upgrade calculation
 */
export function getUpgradeCalculation(
  currentTier: PricingTier,
  selectedTier: PricingTier,
): UpgradeCalculation {
  const currentConfig = UPGRADE_PRICING_TIERS[currentTier];
  const selectedConfig = UPGRADE_PRICING_TIERS[selectedTier];

  const upgradePrice = calculateUpgradePrice(currentTier, selectedTier);
  const upgradeType: 'free-to-paid' | 'paid-to-paid' =
    currentConfig.price === 0 ? 'free-to-paid' : 'paid-to-paid';

  return {
    currentTier,
    selectedTier,
    currentPrice: currentConfig.price,
    selectedPrice: selectedConfig.price,
    upgradePrice,
    upgradeType,
  };
}

// ============================================================================
// TIER UTILITIES
// ============================================================================

/**
 * Check if a tier can be upgraded
 *
 * @param tier - The pricing tier to check
 * @returns True if tier can be upgraded (not ENTERPRISE)
 */
export function canUpgradeTier(tier: PricingTier): boolean {
  return tier !== 'enterprise';
}

/**
 * Get tier configuration
 *
 * @param tier - The pricing tier
 * @returns Tier configuration
 */
export function getTierConfig(tier: PricingTier): PricingTierConfig {
  return UPGRADE_PRICING_TIERS[tier];
}

/**
 * Check if selected tier is higher than current tier
 *
 * @param currentTier - The current pricing tier
 * @param selectedTier - The target pricing tier
 * @returns True if selected tier is higher
 */
export function isHigherTier(
  currentTier: PricingTier,
  selectedTier: PricingTier,
): boolean {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  const selectedIndex = TIER_ORDER.indexOf(selectedTier);

  return selectedIndex > currentIndex;
}

/**
 * Get the new signature limit after upgrade
 *
 * @param selectedTier - The target pricing tier
 * @returns New signature limit
 */
export function getNewSignatureLimit(selectedTier: PricingTier): number {
  return UPGRADE_PRICING_TIERS[selectedTier].maxSignatures;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const PetitionUpgradeUtils = {
  filterAvailableTiers,
  calculateUpgradePrice,
  getUpgradeCalculation,
  canUpgradeTier,
  getTierConfig,
  isHigherTier,
  getNewSignatureLimit,
  UPGRADE_PRICING_TIERS,
  TIER_ORDER,
} as const;

export default PetitionUpgradeUtils;
