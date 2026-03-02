import { test, expect } from '@playwright/test';

test('user can book a yoga session', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await page.click('button[type="submit"]');
  await page.goto('/yogaprograms');
  await page.click('button:has-text("Book Now")');
  await page.fill('input[name="date"]', '2024-06-10');
  await page.click('button:has-text("Confirm Booking")');
  await expect(page.locator('.booking-success')).toBeVisible();
});
