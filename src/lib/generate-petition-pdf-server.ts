import { getPetitionByIdAdmin } from '@/lib/get-petition-admin-server';
import { buildPetitionReportHtml } from '@/lib/petition-report-pdf-html';
import { launchPuppeteerBrowser } from '@/lib/puppeteer-server';

export async function generatePetitionPdfBuffer(
  petitionId: string,
): Promise<Buffer> {
  const petition = await getPetitionByIdAdmin(petitionId);
  if (!petition) {
    throw new Error('Petition not found');
  }

  const html = buildPetitionReportHtml(petition);

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
