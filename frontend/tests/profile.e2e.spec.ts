import { test, expect } from '@playwright/test';

test('user can update profile information', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/user/profile');
  await page.fill('input[name="displayName"]', 'Test User Updated');
  await page.click('button:has-text("Save Changes")');
  await expect(page.locator('.profile-update-success')).toBeVisible();
});
