import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  test('Dashboard画面が表示される', async ({ page }) => {
    await page.goto('/Dashboad');

    await expect(page.getByText('店舗一覧')).toBeVisible();
  });

  test('Dashboardページがロードされる', async ({ page }) => {
    await page.goto('/Dashboad');

    await expect(page).toHaveURL(/Dashboad/);
  });
});
