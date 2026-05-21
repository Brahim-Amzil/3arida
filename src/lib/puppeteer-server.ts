import puppeteerCore from 'puppeteer-core';
import type { Browser } from 'puppeteer-core';

const LOCAL_PUPPETEER_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--disable-gpu',
  '--font-render-hinting=none',
];

function isServerlessRuntime(): boolean {
  return (
    process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_VERSION)
  );
}

export async function launchPuppeteerBrowser(): Promise<Browser> {
  if (isServerlessRuntime()) {
    const chromium = (await import('@sparticuz/chromium')).default;
    chromium.setGraphicsMode = false;

    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = await import('puppeteer');
  return puppeteerCore.launch({
    headless: true,
    args: LOCAL_PUPPETEER_ARGS,
    executablePath: puppeteer.default.executablePath(),
  });
}
