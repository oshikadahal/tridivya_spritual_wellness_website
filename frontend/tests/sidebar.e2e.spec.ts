import { test, expect } from '@playwright/test';

test('sidebar navigation works for user', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.click('nav.sidebar a:has-text("Dashboard")');
  await expect(page).toHaveURL(/dashboard/);
  await page.click('nav.sidebar a:has-text("Yoga Programs")');
  await expect(page).toHaveURL(/yogaprograms/);
  await page.click('nav.sidebar a:has-text("Meditation Videos")');
  await expect(page).toHaveURL(/meditationvideos/);
});
