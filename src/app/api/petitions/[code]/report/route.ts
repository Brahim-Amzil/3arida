import { NextRequest, NextResponse } from 'next/server';
import { getPetitionById } from '@/lib/petitions';
import { generatePetitionPdfBuffer } from '@/lib/generate-petition-pdf-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const petitionId = params.code;

    const petition = await getPetitionById(petitionId);
    if (!petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    const pdfBuffer = await generatePetitionPdfBuffer(petitionId);
    const filename = `petition-report-${petition.referenceCode}-${new Date().toISOString().split('T')[0]}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[PDF Generator] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
