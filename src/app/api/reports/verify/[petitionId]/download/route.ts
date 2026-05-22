import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';
import { isLaunchMode } from '@/lib/feature-flags';
import { evaluateReportDownloadAccess } from '@/lib/report-download-access-server';
import { recordDownload } from '@/lib/report-download-tracker';
import { generatePetitionPdfBuffer } from '@/lib/generate-petition-pdf-server';
import { serializeFirestoreDocument } from '@/lib/serialize-petition-firestore';
import type { Petition } from '@/types/petition';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function loadApprovedPetition(petitionId: string): Promise<Petition | null> {
  const petitionDoc = await adminDb.collection('petitions').doc(petitionId).get();
  if (!petitionDoc.exists) return null;

  const raw = serializeFirestoreDocument(
    petitionDoc.data() as Record<string, unknown>,
  );
  const petition = { id: petitionDoc.id, ...raw } as Petition;
  if (petition.status !== 'approved') return null;
  return petition;
}

function pdfResponse(pdfBuffer: Buffer, referenceCode: string) {
  const filename = `petition-report-${referenceCode}-${new Date().toISOString().split('T')[0]}.pdf`;
  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(pdfBuffer.length),
    },
  });
}

/**
 * Verify-page PDF download.
 * Launch mode (BETA100): public download for approved petitions.
 * Post-launch: creator auth + billing rules apply.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { petitionId: string } },
) {
  try {
    const petition = await loadApprovedPetition(params.petitionId);
    if (!petition) {
      return NextResponse.json(
        { error: 'Petition not found or not approved' },
        { status: 404 },
      );
    }

    const referenceCode = petition.referenceCode || params.petitionId;

    if (isLaunchMode()) {
      const pdfBuffer = await generatePetitionPdfBuffer(params.petitionId);
      return pdfResponse(pdfBuffer, referenceCode);
    }

    const userId = request.headers.get('x-user-id');
    const paymentId = request.nextUrl.searchParams.get('paymentId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to download this report PDF' },
        { status: 401 },
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
          error: accessDecision.message,
          code: accessDecision.code,
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

    const pdfBuffer = await generatePetitionPdfBuffer(params.petitionId);
    return pdfResponse(pdfBuffer, referenceCode);
  } catch (error) {
    console.error('[Report verify download] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report PDF' },
      { status: 500 },
    );
  }
}
