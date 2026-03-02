import { test, expect } from '@playwright/test';

test('user can play a meditation video', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/meditationvideos');
  await page.click('.meditation-video-card:first-child');
  await expect(page.locator('video')).toBeVisible();
  await expect(page.locator('video')).toHaveAttribute('src', /meditation/);
});
