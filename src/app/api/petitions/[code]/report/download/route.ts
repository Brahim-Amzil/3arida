/**
 * GET /api/petitions/[code]/report/download
 *
 * Downloads the petition report PDF
 * Accepts both referenceCode and petition ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Petition } from '@/types/petition';
import { canGenerateReport } from '@/lib/report-access-control';
import puppeteer from 'puppeteer';
import { recordDownload } from '@/lib/report-download-tracker';

/**
 * Converts Firestore document data to Petition object
 * Handles Firestore Timestamp conversion
 */
function convertFirestoreData(data: any): any {
  const converted: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && 'toDate' in value) {
      // Convert Firestore Timestamp to ISO string
      converted[key] = (value as { toDate: () => Date }).toDate().toISOString();
    } else if (Array.isArray(value)) {
      // Handle arrays (might contain timestamps)
      converted[key] = value.map((item) =>
        item && typeof item === 'object' && 'toDate' in item
          ? item.toDate().toISOString()
          : item,
      );
    } else {
      converted[key] = value;
    }
  }

  return converted;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const code = params.code;
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('paymentId');

    // Get user from header
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      console.error('[Report Download] No user ID provided');
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
        },
        { status: 401 },
      );
    }

    console.log(
      '[Report Download] Looking up petition:',
      code,
      'for user:',
      userId,
    );

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
      console.log(
        '[Report Download] Found petition by referenceCode:',
        petition.id,
      );
    } else {
      // If not found by reference code, try by document ID
      try {
        const petitionDoc = await adminDb
          .collection('petitions')
          .doc(code)
          .get();
        if (petitionDoc.exists) {
          const rawData = petitionDoc.data();
          const convertedData = convertFirestoreData(rawData!);
          petition = { id: petitionDoc.id, ...convertedData } as Petition;
          console.log('[Report Download] Found petition by ID:', petition.id);
        }
      } catch (error) {
        console.error(
          '[Report Download] Error fetching petition by ID:',
          error,
        );
      }
    }

    if (!petition) {
      console.error('[Report Download] Petition not found:', code);
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Petition not found' },
        },
        { status: 404 },
      );
    }

    // Check access control
    console.log('[Report Download] Checking access control...');
    const accessDecision = canGenerateReport(petition, userId);

    if (!accessDecision.allowed) {
      console.error('[Report Download] Access denied:', accessDecision.reason);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: accessDecision.reason || 'ACCESS_DENIED',
            message: 'You do not have permission to download this report',
          },
        },
        { status: 403 },
      );
    }

    console.log('[Report Download] Access granted, generating PDF...');

    // TODO: If paymentId provided, verify payment before proceeding

    // Get IP address
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Record download
    console.log('[Report Download] Recording download...');
    await recordDownload(
      petition.id,
      userId,
      paymentId || undefined,
      ipAddress,
    );

    // Generate PDF
    console.log('[Report Download] Generating PDF report...');
    const downloadNumber = (petition.reportDownloads || 0) + 1;
    // Generate PDF using Puppeteer
    const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/pdf/petition/${petition.id}`;

    console.log('[Report Download] Launching Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    console.log('[Report Download] Navigating to:', pdfUrl);
    await page.goto(pdfUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    console.log('[Report Download] Waiting for fonts...');
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const fontLoaded = await page.evaluate(() => {
      return document.fonts.check('16px Cairo');
    });

    console.log('[Report Download] Cairo font loaded:', fontLoaded);

    console.log('[Report Download] Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    await browser.close();
    console.log('[Report Download] PDF generated successfully');

    console.log(
      '[Report Download] PDF generated successfully, size:',
      pdfBuffer.length,
      'bytes',
    );

    // Get filename
    const filename = `petition-report-${petition.referenceCode}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[Report Download] Error downloading report:', error);
    console.error(
      '[Report Download] Error stack:',
      error instanceof Error ? error.stack : 'No stack trace',
    );
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: 'Failed to generate report',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 },
    );
  }
}
