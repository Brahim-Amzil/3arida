/**
 * GET /api/reports/verify/[petitionId]
 *
 * Verifies a petition report and returns verification information
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Petition } from '@/types/petition';
import { getLastDownloadDate } from '@/lib/report-download-tracker';

export async function GET(
  request: NextRequest,
  { params }: { params: { petitionId: string } },
) {
  try {
    const petitionId = params.petitionId;

    // Fetch petition
    const petitionDoc = await adminDb.collection('petitions').doc(petitionId).get();

    if (!petitionDoc.exists) {
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

    const petition = { id: petitionDoc.id, ...petitionDoc.data() } as Petition;

    // Get last download date
    const lastDownloaded = await getLastDownloadDate(petitionId);

    // Return verification information
    return NextResponse.json({
      valid: true,
      petition: {
        title: petition.title,
        referenceCode: petition.referenceCode || 'N/A',
        createdAt: petition.createdAt,
        currentSignatures: petition.currentSignatures,
        targetSignatures: petition.targetSignatures,
        status: petition.status,
        category: petition.category,
      },
      reportInfo: {
        totalDownloads: petition.reportDownloads || 0,
        lastDownloaded: lastDownloaded || null,
      },
    });
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
