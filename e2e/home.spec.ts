import { test, expect } from '@playwright/test';

/**
 * 簡單的示範測試
 * 這個測試展示 E2E 測試的基本概念
 */

test.describe('E2E 測試示範', () => {
  test('應該能夠導航到首頁', async ({ page }) => {
    // 步驟 1: 導航到首頁
    await page.goto('/quiz-display-tool/');

    // 步驟 2: 等待頁面載入
    await page.waitForLoadState('networkidle');

    // 步驟 3: 驗證頁面標題或內容
    // 檢查頁面是否載入成功
    await expect(page).toHaveURL(/quiz-display-tool/);

    // 步驟 4: 截圖記錄首頁
    await page.screenshot({ path: 'playwright-report/homepage.png' });
  });

  test('應該能夠導航到 Letter 頁面', async ({ page }) => {
    // 導航到 Letter 頁面
    await page.goto('/quiz-display-tool/text-panel');

    // 等待載入
    await page.waitForLoadState('networkidle');

    // 驗證 URL 正確
    await expect(page).toHaveURL(/text-panel/);

    // 檢查是否有檔案上傳輸入
    const fileInputs = page.locator('input[type="file"]');
    const count = await fileInputs.count();

    console.log(`找到 ${count} 個檔案上傳按鈕`);

    // 截圖記錄頁面
    await page.screenshot({ path: 'playwright-report/letter-page.png' });
  });

  test('應該能夠導航到 Panel 頁面', async ({ page }) => {
    await page.goto('/quiz-display-tool/panel');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/panel/);

    await page.screenshot({ path: 'playwright-report/panel-page.png' });
  });

  test('應該能夠導航到 Zoomer 頁面', async ({ page }) => {
    await page.goto('/quiz-display-tool/zoomer');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/zoomer/);

    await page.screenshot({ path: 'playwright-report/zoomer-page.png' });
  });
});
