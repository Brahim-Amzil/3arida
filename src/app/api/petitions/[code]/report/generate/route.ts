/**
 * POST /api/petitions/[code]/report/generate
 *
 * Generates a petition report (or returns payment requirement)
 * Accepts both referenceCode and petition ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Petition } from '@/types/petition';
import {
  canGenerateReport,
  requiresPayment,
  getRemainingFreeDownloads,
  getDownloadPrice,
} from '@/lib/report-access-control';

/**
 * Converts Firestore document data to Petition object
 * Handles Firestore Timestamp conversion
 */
function convertFirestoreData(data: any): any {
  const converted: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    const maybeTimestamp = value as { toDate?: () => Date };
    if (value && typeof value === 'object' && typeof maybeTimestamp.toDate === 'function') {
      // Convert Firestore Timestamp to ISO string
      converted[key] = maybeTimestamp.toDate().toISOString();
    } else if (Array.isArray(value)) {
      // Handle arrays (might contain timestamps)
      converted[key] = value.map((item) => {
        const ts = item as { toDate?: () => Date };
        return item && typeof item === 'object' && typeof ts.toDate === 'function'
          ? ts.toDate().toISOString()
          : item;
      });
    } else {
      converted[key] = value;
    }
  }
  
  return converted;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const code = params.code;

    // Get user from request body
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'User not authenticated' } },
        { status: 401 },
      );
    }

    // Try to find petition by reference code first
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
      // If not found by reference code, try by document ID
      try {
        const petitionDoc = await adminDb.collection('petitions').doc(code).get();
        if (petitionDoc.exists) {
          const rawData = petitionDoc.data();
          const convertedData = convertFirestoreData(rawData!);
          petition = { id: petitionDoc.id, ...convertedData } as Petition;
        }
      } catch (error) {
        console.error('Error fetching petition by ID:', error);
      }
    }

    if (!petition) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Petition not found' } },
        { status: 404 },
      );
    }

    // Check access control
    const accessDecision = canGenerateReport(petition, userId);

    if (!accessDecision.allowed) {
      if (accessDecision.requiresUpgrade) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UPGRADE_REQUIRED',
              message: 'Report generation is only available for paid tiers',
            },
            requiresUpgrade: true,
          },
          { status: 403 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: accessDecision.reason || 'ACCESS_DENIED',
            message: 'You do not have permission to generate this report',
          },
        },
        { status: 403 },
      );
    }

    // Check if payment is required
    if (requiresPayment(petition)) {
      const price = getDownloadPrice(petition);
      return NextResponse.json({
        success: false,
        requiresPayment: true,
        price,
        downloadCount: petition.reportDownloads || 0,
        freeDownloadsRemaining: 0,
        message: `Payment of ${price} MAD required for additional downloads`,
      });
    }

    // Free download available - return success with download info
    const downloadCount = petition.reportDownloads || 0;
    const freeDownloadsRemaining = getRemainingFreeDownloads(petition);

    return NextResponse.json({
      success: true,
      downloadUrl: `/api/petitions/${code}/report/download`,
      requiresPayment: false,
      downloadCount,
      freeDownloadsRemaining,
      message: 'Report ready for download',
    });
  } catch (error) {
    console.error('Error in report generation:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process report generation request',
        },
      },
      { status: 500 },
    );
  }
}
