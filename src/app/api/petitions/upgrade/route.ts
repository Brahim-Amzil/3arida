import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PricingTier } from '@/types/petition';
import { UPGRADE_PRICING_TIERS } from '@/lib/petition-upgrade-utils';
import { isBetaMode, getBetaCouponCode, calculateDiscountedAmount, getBetaMetadata } from '@/lib/beta-coupon-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  console.log('[Upgrade API] ========== UPGRADE REQUEST RECEIVED ==========');
  
  try {
    const body = await request.json();
    const { petitionId, currentTier, selectedTier, userId } = body;

    console.log('[Upgrade API] Request body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!petitionId || !currentTier || !selectedTier || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get tier configurations
    const currentConfig = UPGRADE_PRICING_TIERS[currentTier as PricingTier];
    const selectedConfig = UPGRADE_PRICING_TIERS[selectedTier as PricingTier];

    console.log('[Upgrade API] Tier configs:', { 
      currentConfig, 
      selectedConfig,
      availableTiers: Object.keys(UPGRADE_PRICING_TIERS)
    });

    if (!currentConfig || !selectedConfig) {
      console.error('[Upgrade API] Invalid tiers:', { currentTier, selectedTier });
      return NextResponse.json(
        { success: false, error: `Invalid tiers: current=${currentTier}, selected=${selectedTier}` },
        { status: 400 }
      );
    }

    // Calculate upgrade price
    let originalUpgradePrice: number;
    if (currentConfig.price === 0) {
      // FREE to PAID: full price
      originalUpgradePrice = selectedConfig.price;
    } else {
      // PAID to PAID: difference
      originalUpgradePrice = selectedConfig.price - currentConfig.price;
    }

    // Apply beta coupon if in beta mode
    const betaMode = isBetaMode();
    const upgradePrice = betaMode ? 0 : originalUpgradePrice;
    const couponCode = betaMode ? getBetaCouponCode() : null;

    console.log('[Upgrade API] Pricing:', { 
      currentPrice: currentConfig.price,
      selectedPrice: selectedConfig.price,
      originalUpgradePrice,
      betaMode,
      couponCode,
      finalUpgradePrice: upgradePrice
    });

    if (originalUpgradePrice <= 0 || isNaN(originalUpgradePrice)) {
      console.error('[Upgrade API] Invalid upgrade price:', originalUpgradePrice);
      return NextResponse.json(
        { success: false, error: 'Invalid tier upgrade price' },
        { status: 400 }
      );
    }

    // In beta mode with 0 price, skip Stripe and upgrade directly
    if (betaMode && upgradePrice === 0) {
      console.log('[Upgrade API] Beta mode - free upgrade, skipping Stripe');
      return NextResponse.json({
        success: true,
        betaMode: true,
        upgradePrice: 0,
        originalPrice: originalUpgradePrice,
        couponCode,
        // No clientSecret needed for free upgrades
      });
    }

    const amountInCents = Math.round(upgradePrice * 100);
    
    console.log('[Upgrade API] Creating payment intent:', { upgradePrice, amountInCents });

    // Create Stripe payment intent with beta metadata
    const metadata: Record<string, string> = {
      petitionId,
      currentTier,
      selectedTier,
      userId,
      isUpgrade: 'true',
      ...getBetaMetadata(originalUpgradePrice),
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'mad',
      metadata,
      description: `Upgrade petition ${petitionId} from ${currentTier} to ${selectedTier}`,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      upgradePrice,
      originalPrice: originalUpgradePrice,
      betaMode,
      couponCode,
    });
  } catch (error: any) {
    console.error('[Upgrade API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create upgrade payment' },
      { status: 500 }
    );
  }
}
