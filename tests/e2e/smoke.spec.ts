import { test, expect } from '@playwright/test';
import { gotoReady } from './nav-helpers';

/**
 * Always-on smoke checks (no Firebase credentials).
 * Run: npm run test:e2e:smoke
 */
test.describe('@smoke', () => {
  test('GET /api/health returns minimal ok payload', async ({ request }) => {
    const res = await request.get('/api/health?format=minimal');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe('healthy');
  });

  test('coming-soon shell visible without tester bypass', async ({ browser }) => {
    const context = await browser.newContext();
    const fresh = await context.newPage();
    await gotoReady(fresh, '/');
    await expect(
      fresh.getByText(/Coming soon|قريباً|Morocco/i).first(),
    ).toBeVisible();
    await context.close();
  });

  test('tester bypass then auth login page renders', async ({ page }) => {
    await gotoReady(page, '/bsk');
    await gotoReady(page, '/auth/login');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });
});
