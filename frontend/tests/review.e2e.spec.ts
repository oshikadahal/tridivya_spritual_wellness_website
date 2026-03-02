import { test, expect } from '@playwright/test';

test('user can submit a review for a session', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/user/dashboard');
  await page.click('.booking-card:first-child button:has-text("Review")');
  await page.fill('textarea[name="review"]', 'Great session!');
  await page.click('button:has-text("Submit Review")');
  await expect(page.locator('.review-success')).toBeVisible();
});
