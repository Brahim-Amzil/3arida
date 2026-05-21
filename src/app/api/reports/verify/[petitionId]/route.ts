/**
 * GET /api/reports/verify/[petitionId]
 *
 * Verifies a petition report and returns verification information
 */

import { NextRequest, NextResponse } from 'next/server';
import { getReportVerificationData } from '@/lib/report-verification-server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { petitionId: string } },
) {
  try {
    const data = await getReportVerificationData(params.petitionId);

    if (!data.valid) {
      return NextResponse.json(
        {
          valid: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Petition not found or report does not exist',
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying report:', error);
    return NextResponse.json(
      {
        valid: false,
        error: {
          code: 'VERIFICATION_FAILED',
          message: 'Failed to verify report',
        },
      },
      { status: 500 },
    );
  }
}
