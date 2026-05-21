/**
 * Puppeteer-based PDF Generator
 * Generates PDFs from HTML with proper Arabic RTL support
 */

import { launchPuppeteerBrowser } from '@/lib/puppeteer-server';

export interface PDFGeneratorOptions {
  url: string;
  waitForFonts?: boolean;
  timeout?: number;
}

export async function generatePDFFromHTML(
  options: PDFGeneratorOptions,
): Promise<Buffer> {
  const { url, waitForFonts = true, timeout = 60000 } = options;

  const browser = await launchPuppeteerBrowser();

  try {
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout,
    });

    if (waitForFonts) {
      await page.evaluate(() => document.fonts.ready);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

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

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export function getPDFFilename(referenceCode: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `petition-report-${referenceCode}-${date}.pdf`;
}
