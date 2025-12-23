// @ts-nocheck - Playwright E2E tests have different type requirements
import { test, expect } from '@playwright/test';

test.describe('Petition Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test@3arida.ma');
    await page.fill('input[type="password"]', 'TestPassword123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new petition successfully', async ({ page }) => {
    // Navigate to create petition page
    await page.click('text=Create New Petition');
    await expect(page).toHaveURL('/petitions/create');

    // Fill in petition form
    await page.fill(
      'input[placeholder*="title"]',
      'Save Our Local Environment'
    );
    await page.fill(
      'textarea[placeholder*="description"]',
      'We need to protect our local environment from pollution and development. This petition aims to raise awareness and gather support for environmental protection measures in our community.'
    );

    // Select category
    await page.selectOption('select', 'Environment');

    // Set target signatures
    await page.fill('input[type="number"]', '1000');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to petition detail or dashboard
    await expect(page).toHaveURL(/\/(petitions\/|dashboard)/);

    // Should show success message or petition details
    await expect(page.locator('text=Save Our Local Environment')).toBeVisible();
  });

  test('should display petition list with filtering', async ({ page }) => {
    // Navigate to petitions page
    await page.goto('/petitions');

    // Should show petition cards
    await expect(
      page.locator('[data-testid="petition-card"]').first()
    ).toBeVisible();

    // Test category filtering
    await page.selectOption('select[name="category"]', 'Environment');

    // Should filter results
    await expect(page.locator('text=Environment')).toBeVisible();

    // Test search functionality
    await page.fill('input[placeholder*="search"]', 'environment');
    await page.press('input[placeholder*="search"]', 'Enter');

    // Should show search results
    await expect(page.locator('text=environment')).toBeVisible();
  });

  test('should view petition details', async ({ page }) => {
    // Navigate to petitions page
    await page.goto('/petitions');

    // Click on first petition
    await page.click('[data-testid="petition-card"]').first();

    // Should navigate to petition detail page
    await expect(page).toHaveURL(/\/petitions\/[a-zA-Z0-9-]+$/);

    // Should show petition details
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=signatures')).toBeVisible();
    await expect(
      page.locator('button:has-text("Sign Petition")')
    ).toBeVisible();
  });

  test('should handle petition signing flow', async ({ page }) => {
    // Navigate to a petition detail page
    await page.goto('/petitions');
    await page.click('[data-testid="petition-card"]').first();

    // Click sign petition button
    await page.click('button:has-text("Sign Petition")');

    // Should show phone verification form
    await expect(page.locator('text=Verify Your Phone')).toBeVisible();

    // Fill in phone number
    await page.fill('input[type="tel"]', '0612345678');
    await page.click('button:has-text("Send Verification Code")');

    // Should show OTP input (in real test, you'd need to handle OTP)
    await expect(page.locator('text=Verification Code')).toBeVisible();
  });

  test('should show petition analytics for creator', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // Click on a petition's analytics
    await page.click('text=View Analytics').first();

    // Should show analytics page
    await expect(page).toHaveURL(/\/dashboard\/analytics\/[a-zA-Z0-9-]+$/);

    // Should show analytics data
    await expect(page.locator('text=Petition Analytics')).toBeVisible();
    await expect(page.locator('text=Total Views')).toBeVisible();
    await expect(page.locator('text=Signatures')).toBeVisible();
  });

  test('should handle QR code upgrade flow', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // Click QR code button on a petition
    await page.click('text=QR').first();

    // Should navigate to QR page
    await expect(page).toHaveURL(/\/petitions\/[a-zA-Z0-9-]+\/qr$/);

    // Should show QR upgrade options
    await expect(page.locator('text=QR Code Upgrade')).toBeVisible();
    await expect(page.locator('text=10 MAD')).toBeVisible();

    // Click upgrade button
    await page.click('button:has-text("Upgrade for 10 MAD")');

    // Should show payment form
    await expect(page.locator('text=Complete Payment')).toBeVisible();
  });

  test('should validate petition creation form', async ({ page }) => {
    // Navigate to create petition page
    await page.goto('/petitions/create');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=required')).toBeVisible();

    // Fill in title that's too short
    await page.fill('input[placeholder*="title"]', 'Short');
    await page.click('button[type="submit"]');

    // Should show title length error
    await expect(page.locator('text=at least')).toBeVisible();

    // Fill in description that's too short
    await page.fill('input[placeholder*="title"]', 'Valid Petition Title');
    await page.fill('textarea[placeholder*="description"]', 'Too short');
    await page.click('button[type="submit"]');

    // Should show description length error
    await expect(page.locator('text=at least')).toBeVisible();
  });

  test('should show petition progress correctly', async ({ page }) => {
    // Navigate to petitions page
    await page.goto('/petitions');

    // Find a petition with signatures
    const petitionCard = page.locator('[data-testid="petition-card"]').first();
    await expect(petitionCard).toBeVisible();

    // Should show progress bar
    await expect(petitionCard.locator('[role="progressbar"]')).toBeVisible();

    // Should show signature count
    await expect(petitionCard.locator('text=signatures')).toBeVisible();
  });

  test('should handle petition sharing', async ({ page }) => {
    // Navigate to petition detail
    await page.goto('/petitions');
    await page.click('[data-testid="petition-card"]').first();

    // Click share button
    await page.click('button[aria-label*="share"]');

    // Should show share options or copy link
    // Note: Actual sharing behavior depends on browser support
    // This test just verifies the button exists and is clickable
  });
});
