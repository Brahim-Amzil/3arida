/**
 * Puppeteer-based PDF Generator
 * Generates PDFs from HTML with proper Arabic RTL support
 */

import puppeteer, { Browser, Page } from 'puppeteer';

export interface PDFGeneratorOptions {
  url: string;
  waitForFonts?: boolean;
  timeout?: number;
}

export async function generatePDFFromHTML(
  options: PDFGeneratorOptions
): Promise<Buffer> {
  const { url, waitForFonts = true, timeout = 30000 } = options;

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('[PDF Generator] Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    page = await browser.newPage();

    console.log('[PDF Generator] Navigating to:', url);
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout,
    });

    if (waitForFonts) {
      console.log('[PDF Generator] Waiting for fonts...');
      await page.evaluateHandle('document.fonts.ready');
      // Additional wait to ensure fonts are fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

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

    console.log('[PDF Generator] PDF generated successfully');
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('[PDF Generator] Error:', error);
    throw error;
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

export function getPDFFilename(referenceCode: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `petition-report-${referenceCode}-${date}.pdf`;
}
