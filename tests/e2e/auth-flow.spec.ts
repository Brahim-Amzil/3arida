import { test, expect } from '@playwright/test';
import { gotoReady } from './nav-helpers';

async function bypassComingSoon(page: import('@playwright/test').Page) {
  await gotoReady(page, '/bsk');
}

const e2eEmail = process.env.E2E_AUTH_EMAIL || '';
const e2ePassword = process.env.E2E_AUTH_PASSWORD || '';
const hasFirebaseCreds = Boolean(e2eEmail && e2ePassword);

test.describe('Auth pages (no Firebase account required)', () => {
  test.beforeEach(async ({ page }) => {
    await bypassComingSoon(page);
  });

  test('login page shows email and password fields', async ({ page }) => {
    await gotoReady(page, '/auth/login');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  });

  test('register client-side validation for short name', async ({ page }) => {
    await gotoReady(page, '/auth/register');
    await page.getByPlaceholder('Enter your full name').fill('A');
    await page.getByPlaceholder('Enter your email').fill('e2e-check@example.com');
    await page.getByPlaceholder('Create a password').fill('SecurePass123');
    await page.getByPlaceholder('Confirm your password').fill('SecurePass123');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(
      page.getByText(/Name must be at least 2 characters long/i),
    ).toBeVisible();
  });

  test('forgot password flow shows success (auth mock)', async ({ page }) => {
    await gotoReady(page, '/auth/login');
    await page.getByRole('link', { name: /Forgot your password/i }).click();
    await expect(page).toHaveURL('/auth/forgot-password');
    // auth-mock resetPassword only succeeds for seeded users (e.g. test@example.com)
    await page.getByPlaceholder('Enter your email address').fill('test@example.com');
    await page.getByRole('button', { name: 'Send Reset Link' }).click();
    await expect(page.getByText('Check Your Email')).toBeVisible({ timeout: 15_000 });
  });

  test('dashboard redirects unauthenticated users to login', async ({ page }) => {
    await gotoReady(page, '/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('Auth with Firebase (optional E2E_AUTH_EMAIL / E2E_AUTH_PASSWORD)', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasFirebaseCreds, 'Set E2E_AUTH_EMAIL and E2E_AUTH_PASSWORD for this block');
    await bypassComingSoon(page);
  });

  test('login and reach dashboard', async ({ page }) => {
    await gotoReady(page, '/auth/login');
    await page.getByPlaceholder('Enter your email').fill(e2eEmail);
    await page.getByPlaceholder('Enter your password').fill(e2ePassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 45_000 });
    await expect(
      page.getByRole('heading').filter({ hasText: /مرحبًا بعودتك|Bon retour/i }),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('register new user then redirected toward login', async ({ page }) => {
    const unique = `e2e-${Date.now()}@example.com`;
    await gotoReady(page, '/auth/register');
    await page.getByPlaceholder('Enter your full name').fill('E2E User');
    await page.getByPlaceholder('Enter your email').fill(unique);
    await page.getByPlaceholder('Create a password').fill('E2ESecurePass123');
    await page.getByPlaceholder('Confirm your password').fill('E2ESecurePass123');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText(/Account created successfully/i)).toBeVisible({
      timeout: 30_000,
    });
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 });
  });

  test('logout returns to home', async ({ page }) => {
    await gotoReady(page, '/auth/login');
    await page.getByPlaceholder('Enter your email').fill(e2eEmail);
    await page.getByPlaceholder('Enter your password').fill(e2ePassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 45_000 });

    const localPart = e2eEmail.split('@')[0];
    await page
      .getByRole('button')
      .filter({ hasText: new RegExp(localPart, 'i') })
      .first()
      .click();
    await page.getByRole('button', { name: /تسجيل الخروج|Déconnexion/i }).click();

    await expect(page).toHaveURL('/', { timeout: 20_000 });
  });

  test('authenticated session skips login page to dashboard', async ({ page }) => {
    await gotoReady(page, '/auth/login');
    await page.getByPlaceholder('Enter your email').fill(e2eEmail);
    await page.getByPlaceholder('Enter your password').fill(e2ePassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 45_000 });

    await gotoReady(page, '/auth/login');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
  });
});
