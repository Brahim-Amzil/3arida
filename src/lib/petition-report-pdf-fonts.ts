import fs from 'fs';
import path from 'path';

let cachedFontFaceCss: string | null = null;

function fontDataUrl(filename: string, mimeType: string): string {
  const filePath = path.join(process.cwd(), 'public', 'fonts', filename);
  const base64 = fs.readFileSync(filePath).toString('base64');
  return `data:${mimeType};charset=utf-8;base64,${base64}`;
}

/** Inline Cairo fonts so Puppeteer PDF generation works without network font loads. */
export function getPetitionReportFontFaceCss(): string {
  if (cachedFontFaceCss) {
    return cachedFontFaceCss;
  }

  cachedFontFaceCss = `
    @font-face {
      font-family: 'Cairo';
      src: url('${fontDataUrl('Cairo-Variable.ttf', 'font/truetype')}') format('truetype');
      font-weight: 200 1000;
      font-style: normal;
      font-display: block;
    }
  `;

  return cachedFontFaceCss;
}
