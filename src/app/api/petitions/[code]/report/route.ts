import { NextRequest, NextResponse } from 'next/server';
import { getPetitionByIdAdmin } from '@/lib/get-petition-admin-server';
import { generatePetitionPdfBuffer } from '@/lib/generate-petition-pdf-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(
  _request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const petition = await getPetitionByIdAdmin(params.code);
    if (!petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    const pdfBuffer = await generatePetitionPdfBuffer(petition.id);
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
