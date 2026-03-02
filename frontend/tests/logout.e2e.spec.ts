import { test, expect } from '@playwright/test';

test('user can log out successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Logout")');
  await expect(page).toHaveURL('/login');
});
