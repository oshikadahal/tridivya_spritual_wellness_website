import { test, expect } from '@playwright/test';

test('user can play a mantra audio', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/mantraprogram');
  await page.click('.mantra-audio-card:first-child');
  await expect(page.locator('audio')).toBeVisible();
  await expect(page.locator('audio')).toHaveAttribute('src', /mantra/);
});
