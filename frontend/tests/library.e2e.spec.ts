import { test, expect } from '@playwright/test';

test('user can view and save a wisdom library item', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/wisdomlibrary');
  await page.click('.library-item-card:first-child');
  await expect(page.locator('.library-item-detail')).toBeVisible();
  await page.click('button:has-text("Save")');
  await expect(page.locator('.save-success')).toBeVisible();
});
