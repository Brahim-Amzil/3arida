import type { Page } from '@playwright/test';

const cookieConsentValue = JSON.stringify({
  necessary: true,
  functional: true,
  analytics: true,
  timestamp: new Date().toISOString(),
});

/** Avoid CookieConsent modal blocking clicks (fixed z-50 overlay). */
export async function seedCookieConsent(page: Page) {
  await page.addInitScript((value) => {
    try {
      localStorage.setItem('cookie-consent', value);
    } catch {
      /* ignore */
    }
  }, cookieConsentValue);
}

/** Prefer over raw `goto`: Next dev + heavy client pages often stall `load`. */
export async function gotoReady(page: Page, path: string) {
  await seedCookieConsent(page);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}
