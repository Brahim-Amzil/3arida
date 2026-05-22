import { NextRequest, NextResponse } from 'next/server';
import { buildPetitionReportHtml } from '@/lib/petition-report-pdf-html';
import { getReportVerificationData } from '@/lib/report-verification-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await getReportVerificationData(params.id);

  if (!data.valid) {
    return new NextResponse('Petition not found', { status: 404 });
  }

  const html = await buildPetitionReportHtml(data);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
