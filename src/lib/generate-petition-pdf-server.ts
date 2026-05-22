import { getReportVerificationData } from '@/lib/report-verification-server';
import { buildPetitionReportHtml } from '@/lib/petition-report-pdf-html';
import { launchPuppeteerBrowser } from '@/lib/puppeteer-server';

export async function generatePetitionPdfBuffer(
  petitionId: string,
): Promise<Buffer> {
  const data = await getReportVerificationData(petitionId);
  if (!data.valid) {
    throw new Error('Petition not found');
  }

  const html = await buildPetitionReportHtml(data);

  const browser = await launchPuppeteerBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    await page.setContent(html, {
      waitUntil: 'load',
      timeout: 60000,
    });

    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      await document.fonts.load('400 16px Cairo');
      await document.fonts.load('600 16px Cairo');
      await document.fonts.load('700 16px Cairo');
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
