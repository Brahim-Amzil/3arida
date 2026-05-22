import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';
import { evaluateReportDownloadAccess } from '@/lib/report-download-access-server';
import { recordDownload } from '@/lib/report-download-tracker';
import { generatePetitionPdfBuffer } from '@/lib/generate-petition-pdf-server';
import { serializeFirestoreDocument } from '@/lib/serialize-petition-firestore';
import type { Petition } from '@/types/petition';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Creator-only PDF download (same access rules as dashboard).
 * Public verification uses the HTML report on the verify page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { petitionId: string } },
) {
  try {
    const userId = request.headers.get('x-user-id');
    const paymentId = request.nextUrl.searchParams.get('paymentId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required to download this report PDF' },
        { status: 401 },
      );
    }

    const petitionDoc = await adminDb
      .collection('petitions')
      .doc(params.petitionId)
      .get();

    if (!petitionDoc.exists) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    const raw = serializeFirestoreDocument(
      petitionDoc.data() as Record<string, unknown>,
    );
    const petition = { id: petitionDoc.id, ...raw } as Petition;

    if (petition.status !== 'approved') {
      return NextResponse.json(
        { error: 'Report PDF is only available for approved petitions' },
        { status: 403 },
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

    const referenceCode = petition.referenceCode || params.petitionId;
    const pdfBuffer = await generatePetitionPdfBuffer(params.petitionId);
    const filename = `petition-report-${referenceCode}-${new Date().toISOString().split('T')[0]}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error('[Report verify download] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report PDF' },
      { status: 500 },
    );
  }
}
