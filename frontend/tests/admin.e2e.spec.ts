import { test, expect } from '@playwright/test';

test('admin can access admin dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'adminpassword');
  await page.click('button[type="submit"]');
  await page.goto('/admin');
  await expect(page.locator('h1')).toContainText(['Admin Dashboard', 'Admin Panel']);
});
