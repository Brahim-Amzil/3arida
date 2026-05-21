import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';
import { generatePetitionPdfBuffer } from '@/lib/generate-petition-pdf-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Public PDF download from the verification page (approved petitions only).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { petitionId: string } },
) {
  try {
    const petitionDoc = await adminDb
      .collection('petitions')
      .doc(params.petitionId)
      .get();

    if (!petitionDoc.exists) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    const data = petitionDoc.data();
    if (data?.status !== 'approved') {
      return NextResponse.json(
        { error: 'Report PDF is only available for approved petitions' },
        { status: 403 },
      );
    }

    const referenceCode = data.referenceCode || params.petitionId;
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
