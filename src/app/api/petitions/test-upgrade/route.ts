import { NextRequest, NextResponse } from 'next/server';
import { upgradePetition } from '@/lib/petition-upgrade-service';
import { PricingTier } from '@/types/petition';

/**
 * TEST ENDPOINT - Manually trigger petition upgrade
 * This simulates what the Stripe webhook would do
 * USE ONLY IN DEVELOPMENT
 */
export async function POST(request: NextRequest) {
  console.log('[Test Upgrade] ========== UPGRADE REQUEST RECEIVED ==========');
  
  try {
    const body = await request.json();
    const { petitionId, selectedTier, paymentIntentId, upgradePrice } = body;

    console.log('[Test Upgrade] Request body:', JSON.stringify(body, null, 2));

    if (!petitionId || !selectedTier) {
      console.error('[Test Upgrade] Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing petitionId or selectedTier' },
        { status: 400 }
      );
    }

    console.log('[Test Upgrade] Calling upgradePetition service...');

    // Call the upgrade service directly
    const result = await upgradePetition(
      petitionId,
      selectedTier as PricingTier,
      paymentIntentId || 'test_' + Date.now(),
      upgradePrice || 0,
    );

    console.log('[Test Upgrade] Upgrade result:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('[Test Upgrade] ✅ Successfully upgraded petition');
      return NextResponse.json({
        success: true,
        message: 'Petition upgraded successfully',
        petition: result.petition,
      });
    } else {
      console.error('[Test Upgrade] ❌ Failed to upgrade:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[Test Upgrade] ❌ Exception:', error);
    console.error('[Test Upgrade] Stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upgrade petition' },
      { status: 500 }
    );
  }
}
