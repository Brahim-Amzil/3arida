/**
 * GET /api/petitions/[code]/report/download
 *
 * Downloads the petition report PDF
 * Accepts both referenceCode and petition ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Petition } from '@/types/petition';
import { evaluateReportDownloadAccess } from '@/lib/report-download-access-server';
import { recordDownload } from '@/lib/report-download-tracker';
import { generatePetitionPdfBuffer } from '@/lib/generate-petition-pdf-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Converts Firestore document data to Petition object
 * Handles Firestore Timestamp conversion
 */
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

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const code = params.code;
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('paymentId');

    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
        },
        { status: 401 },
      );
    }

    let petitionsSnapshot = await adminDb
      .collection('petitions')
      .where('referenceCode', '==', code)
      .limit(1)
      .get();

    let petition: Petition | null = null;

    if (!petitionsSnapshot.empty) {
      const petitionDoc = petitionsSnapshot.docs[0];
      const rawData = petitionDoc.data();
      const convertedData = convertFirestoreData(rawData);
      petition = { id: petitionDoc.id, ...convertedData } as Petition;
    } else {
      const petitionDoc = await adminDb.collection('petitions').doc(code).get();
      if (petitionDoc.exists) {
        const rawData = petitionDoc.data();
        const convertedData = convertFirestoreData(rawData!);
        petition = { id: petitionDoc.id, ...convertedData } as Petition;
      }
    }

    if (!petition) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Petition not found' },
        },
        { status: 404 },
      );
    }

    const accessDecision = evaluateReportDownloadAccess(
      petition,
      userId,
      paymentId,
    );

    if (!accessDecision.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: accessDecision.code,
            message: accessDecision.message,
          },
          requiresUpgrade: accessDecision.requiresUpgrade,
          requiresPayment: accessDecision.requiresPayment,
          price: accessDecision.price,
        },
        { status: accessDecision.status },
      );
    }

    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    await recordDownload(
      petition.id,
      userId,
      paymentId || undefined,
      ipAddress,
    );

    const pdfBuffer = await generatePetitionPdfBuffer(petition.id);
    const filename = `petition-report-${petition.referenceCode}-${new Date().toISOString().split('T')[0]}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error('[Report Download] Error downloading report:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: 'Failed to generate report',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 },
    );
  }
}
