import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const petitionId = params.code;
    console.log('[Check Tier] Checking petition:', petitionId);
    
    const petitionRef = adminDb.collection('petitions').doc(petitionId);
    const petitionDoc = await petitionRef.get();

    if (!petitionDoc.exists) {
      return NextResponse.json(
        { error: 'Petition not found' },
        { status: 404 }
      );
    }

    const data = petitionDoc.data();
    
    return NextResponse.json({
      id: petitionId,
      pricingTier: data?.pricingTier,
      signatureLimit: data?.signatureLimit,
      lastUpgradeAt: data?.lastUpgradeAt?.toDate?.() || data?.lastUpgradeAt,
      upgradeHistory: data?.upgradeHistory || [],
    });
  } catch (error: any) {
    console.error('[Check Tier] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
