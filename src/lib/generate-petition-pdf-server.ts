import { getPublicAppUrl } from '@/lib/app-url';
import { launchPuppeteerBrowser } from '@/lib/puppeteer-server';

export async function generatePetitionPdfBuffer(
  petitionId: string,
): Promise<Buffer> {
  const pdfUrl = `${getPublicAppUrl()}/pdf/petition/${petitionId}`;

  const browser = await launchPuppeteerBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    await page.goto(pdfUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    await page.evaluate(() => document.fonts.ready);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
