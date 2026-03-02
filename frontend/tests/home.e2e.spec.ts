import { test, expect } from '@playwright/test';

test('user can access the home page after login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/');
  await expect(page.locator('h1')).toContainText(['Welcome', 'Dashboard']);
});
