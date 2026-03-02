import { test, expect } from '@playwright/test';
import path from 'path';

test('admin can upload a new media file', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'adminpassword');
  await page.click('button[type="submit"]');
  await page.goto('/admin/media');
  const filePath = path.resolve(__dirname, '../public/audio/sample.mp3');
  await page.setInputFiles('input[type="file"]', filePath);
  await page.click('button:has-text("Upload")');
  await expect(page.locator('.media-upload-success')).toBeVisible();
});
