import { test, expect } from '@playwright/test';

test('user can submit a mood check-in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/user/dashboard');
  await page.click('button:has-text("Mood Check-In")');
  await page.click('button:has-text("Happy")');
  await page.click('button:has-text("Submit")');
  await expect(page.locator('.mood-checkin-success')).toBeVisible();
});
