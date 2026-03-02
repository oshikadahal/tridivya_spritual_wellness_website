import { test, expect } from '@playwright/test';

test('user can view yoga program details', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/yogaprograms');
  await page.click('.yoga-program-card:first-child');
  await expect(page.locator('.yoga-program-detail')).toBeVisible();
});
