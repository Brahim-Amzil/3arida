import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getNewSignatureLimit } from '@/lib/petition-upgrade-utils';
import { PricingTier } from '@/types/petition';

/**
 * Fix targetSignatures for already upgraded petitions
 */
export async function POST(request: NextRequest) {
  try {
    const { petitionIds } = await request.json();
    
    if (!petitionIds || !Array.isArray(petitionIds)) {
      return NextResponse.json(
        { error: 'petitionIds array is required' },
        { status: 400 }
      );
    }

    const results = [];

    for (const petitionId of petitionIds) {
      try {
        const petitionRef = adminDb.collection('petitions').doc(petitionId);
        const petitionDoc = await petitionRef.get();

        if (!petitionDoc.exists) {
          results.push({ petitionId, success: false, error: 'Not found' });
          continue;
        }

        const data = petitionDoc.data();
        const tier = data?.pricingTier as PricingTier;
        const currentTarget = data?.targetSignatures;
        const newLimit = getNewSignatureLimit(tier);

        await petitionRef.update({
          targetSignatures: newLimit,
          signatureLimit: newLimit,
        });

        results.push({
          petitionId,
          success: true,
          oldTarget: currentTarget,
          newTarget: newLimit,
          tier,
        });
      } catch (error: any) {
        results.push({
          petitionId,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
