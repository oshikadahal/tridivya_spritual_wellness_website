import { test, expect } from '@playwright/test';

test('user can update settings', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/user/settings');
  await page.check('input[name="notifications"]');
  await page.click('button:has-text("Save Settings")');
  await expect(page.locator('.settings-update-success')).toBeVisible();
});
