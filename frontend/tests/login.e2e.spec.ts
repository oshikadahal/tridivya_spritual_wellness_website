import { test, expect } from '@playwright/test';

test('user can login with invalid credentials and see error', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'invalid@example.com');
  await page.fill('input[name="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');
  await expect(page.locator('body')).toContainText(/User not found|invalid/i);
});
