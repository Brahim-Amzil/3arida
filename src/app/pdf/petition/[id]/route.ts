import { NextRequest, NextResponse } from 'next/server';
import { getPetitionByIdAdmin } from '@/lib/get-petition-admin-server';
import { buildPetitionReportHtml } from '@/lib/petition-report-pdf-html';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const petition = await getPetitionByIdAdmin(params.id);

  if (!petition) {
    return new NextResponse('Petition not found', { status: 404 });
  }

  const html = buildPetitionReportHtml(petition);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
