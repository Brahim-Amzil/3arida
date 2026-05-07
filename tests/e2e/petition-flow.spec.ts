import { test, expect } from '@playwright/test';
import { gotoReady } from './nav-helpers';

async function bypassComingSoon(page: import('@playwright/test').Page) {
  await gotoReady(page, '/bsk');
}

const e2eEmail = process.env.E2E_AUTH_EMAIL || '';
const e2ePassword = process.env.E2E_AUTH_PASSWORD || '';
const hasFirebaseCreds = Boolean(e2eEmail && e2ePassword);

test.describe('Petition pages (public shell)', () => {
  test.beforeEach(async ({ page }) => {
    await bypassComingSoon(page);
  });

  test('petitions browse page loads', async ({ page }) => {
    await gotoReady(page, '/petitions');
    await expect(page.locator('header')).toBeVisible({ timeout: 30_000 });
    await expect(page).toHaveURL(/\/petitions/);
  });

  test('petition create page requires auth and redirects to login when logged out', async ({
    page,
  }) => {
    await gotoReady(page, '/petitions/create');
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 20_000 });
  });
});

test.describe('Petition flows with signed-in user (optional credentials)', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasFirebaseCreds, 'Set E2E_AUTH_EMAIL and E2E_AUTH_PASSWORD');
    await bypassComingSoon(page);
    await gotoReady(page, '/auth/login');
    await page.getByPlaceholder('Enter your email').fill(e2eEmail);
    await page.getByPlaceholder('Enter your password').fill(e2ePassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 45_000 });
  });

  test('dashboard shows petition section after login', async ({ page }) => {
    await expect(
      page.getByText(/petitions|عرائض|dashboard/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('create petition page loads when authenticated', async ({ page }) => {
    await gotoReady(page, '/petitions/create');
    await expect(page).toHaveURL(/\/petitions\/create/);
    await expect(page.locator('form').first()).toBeVisible({ timeout: 20_000 });
  });
});
