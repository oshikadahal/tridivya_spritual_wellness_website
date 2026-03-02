import { test, expect } from '@playwright/test';

test('user can view latest announcements', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/');
  await expect(page.locator('.announcement-card')).toBeVisible();
});
