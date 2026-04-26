import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { getPetitionById } from '@/lib/petitions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const petitionId = params.code;
    
    // Fetch petition
    const petition = await getPetitionById(petitionId);
    if (!petition) {
      return NextResponse.json(
        { error: 'Petition not found' },
        { status: 404 }
      );
    }

    // Generate PDF URL
    const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/pdf/petition/${petitionId}`;
    
    console.log('[PDF Generator] Launching Puppeteer...');
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
    
    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });
    
    console.log('[PDF Generator] Navigating to:', pdfUrl);
    await page.goto(pdfUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    // Wait for fonts to load
    console.log('[PDF Generator] Waiting for fonts...');
    await page.evaluateHandle('document.fonts.ready');
    
    // Additional wait to ensure fonts are fully rendered
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify font is loaded
    const fontLoaded = await page.evaluate(() => {
      return document.fonts.check('16px Cairo');
    });
    
    console.log('[PDF Generator] Cairo font loaded:', fontLoaded);
    
    console.log('[PDF Generator] Generating PDF...');
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
    console.log('[PDF Generator] PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF
    const filename = `petition-report-${petition.referenceCode}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[PDF Generator] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
