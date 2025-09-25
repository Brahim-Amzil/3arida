import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
  });

  test('should register a new user successfully', async ({ page }) => {
    // Navigate to registration page
    await page.click('text=Get Started');
    await expect(page).toHaveURL('/auth/register');

    // Fill in registration form
    await page.fill('input[type="text"]', 'John Doe');
    await page.fill('input[type="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'SecurePass123');
    await page.fill(
      'input[placeholder="Confirm your password"]',
      'SecurePass123'
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or email verification
    await expect(page).toHaveURL(/\/(dashboard|auth\/verify-email)/);
  });

  test('should login existing user', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/auth/login');

    // Fill in login form with test credentials
    await page.fill('input[type="email"]', 'test@3arida.ma');
    await page.fill('input[type="password"]', 'TestPassword123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/auth/register');

    // Try to submit with invalid data
    await page.fill('input[type="text"]', 'A'); // Too short name
    await page.fill('input[type="email"]', 'invalid-email'); // Invalid email
    await page.fill('input[type="password"]', '123'); // Weak password
    await page.fill('input[placeholder="Confirm your password"]', '456'); // Mismatched password

    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Please enter your name')).toBeVisible();
  });

  test('should handle forgot password flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Click forgot password link
    await page.click('text=Forgot your password?');
    await expect(page).toHaveURL('/auth/forgot-password');

    // Fill in email
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=Check Your Email')).toBeVisible();
  });

  test('should logout user successfully', async ({ page }) => {
    // First login
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test@3arida.ma');
    await page.fill('input[type="password"]', 'TestPassword123');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.click('text=Sign Out');

    // Should redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should redirect authenticated users from auth pages', async ({
    page,
  }) => {
    // First login
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test@3arida.ma');
    await page.fill('input[type="password"]', 'TestPassword123');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');

    // Try to access login page while authenticated
    await page.goto('/auth/login');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
