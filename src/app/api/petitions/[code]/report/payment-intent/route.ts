import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';
import { Petition } from '@/types/petition';
import { createReportDownloadPaymentIntent } from '@/lib/report-download-payment-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function convertFirestoreData(data: Record<string, unknown>): Record<string, unknown> {
  const converted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && 'toDate' in value) {
      converted[key] = (value as { toDate: () => Date }).toDate().toISOString();
    } else if (Array.isArray(value)) {
      converted[key] = value.map((item) =>
        item && typeof item === 'object' && 'toDate' in item
          ? (item as { toDate: () => Date }).toDate().toISOString()
          : item,
      );
    } else {
      converted[key] = value;
    }
  }

  return converted;
}

async function loadPetition(code: string): Promise<Petition | null> {
  let petitionsSnapshot = await adminDb
    .collection('petitions')
    .where('referenceCode', '==', code)
    .limit(1)
    .get();

  if (!petitionsSnapshot.empty) {
    const petitionDoc = petitionsSnapshot.docs[0];
    const convertedData = convertFirestoreData(petitionDoc.data());
    return { id: petitionDoc.id, ...convertedData } as Petition;
  }

  const petitionDoc = await adminDb.collection('petitions').doc(code).get();
  if (!petitionDoc.exists) {
    return null;
  }

  const convertedData = convertFirestoreData(petitionDoc.data()!);
  return { id: petitionDoc.id, ...convertedData } as Petition;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const body = await request.json();
    const userId = body.userId as string | undefined;
    const userEmail = body.userEmail as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 },
      );
    }

    const petition = await loadPetition(params.code);
    if (!petition) {
      return NextResponse.json(
        { success: false, error: 'Petition not found' },
        { status: 404 },
      );
    }

    const payment = await createReportDownloadPaymentIntent(
      petition,
      userId,
      userEmail,
    );

    return NextResponse.json({
      success: true,
      clientSecret: payment.clientSecret,
      paymentIntentId: payment.paymentIntentId,
      price: payment.price,
    });
  } catch (error) {
    console.error('[Report payment-intent] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create report payment',
      },
      { status: 400 },
    );
  }
}
