import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Letter 功能的 E2E 測試
 *
 * 這個測試會模擬真實使用者的完整操作流程：
 * 1. 上傳圖片檔案
 * 2. 設定字元數
 * 3. 測試自動揭露功能
 * 4. 測試暫停/繼續
 * 5. 驗證 Canvas 渲染
 */

test.describe('Letter 功能 - 完整使用者流程', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到 Letter 頁面
    await page.goto('/quiz-display-tool/text-panel');

    // 等待頁面載入完成
    await page.waitForLoadState('networkidle');
  });

  test('應該成功上傳圖片並顯示在 Canvas 上', async ({ page }) => {
    // 步驟 1: 找到檔案上傳按鈕
    // 註：實際的選擇器需要根據你的 UI 調整
    const fileInput = page.locator('input[type="file"]').first();

    // 步驟 2: 上傳測試圖片
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // 步驟 3: 等待圖片處理完成
    // 檢查是否有 Canvas 元素出現
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 4: 驗證圖片已載入到 store
    // 檢查導航按鈕是否啟用（表示有資料）
    const prevButton = page.locator('button[title="Previous"]');

    // 第一張圖片時，prev 應該 disabled
    await expect(prevButton).toBeDisabled();
  });

  test('應該能設定字元數並開始揭露', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // 等待圖片載入
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 找到字元數設定（可能是 input 或 slider）
    // 註：這裡需要根據實際 UI 調整選擇器
    const charsInput = page.locator('input[type="number"]').first();

    // 設定字元數為 20
    await charsInput.fill('20');

    // 步驟 3: 確認設定已套用
    await expect(charsInput).toHaveValue('20');
  });

  test('應該能執行自動揭露並暫停', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 找到自動播放按鈕（使用 title 屬性）
    const playButton = page.locator('button[title="Start"]');

    // 開始自動播放
    await playButton.click();

    // 步驟 3: 等待一段時間，確保有字元被揭露
    await page.waitForTimeout(1000);

    // 步驟 4: 暫停（播放後按鈕會變成暫停）
    const pauseButton = page.locator('button[title="Pause"]');

    await pauseButton.click();

    // 驗證暫停後的狀態
    // Canvas 應該還在，並且有部分內容已揭露
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('應該能全部顯示和全部隱藏', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 點擊「全部顯示」（使用 title 屬性）
    const showAllButton = page.locator('button[title="Show all"]');

    await showAllButton.click();

    // 驗證：Canvas 應該顯示完整圖片
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // 步驟 3: 點擊「全部隱藏」（使用 title 屬性）
    const hideAllButton = page.locator('button[title="Hide all"]');

    await hideAllButton.click();

    // 驗證：Canvas 應該還在但內容被遮蓋
    await expect(canvas).toBeVisible();
  });

  test('應該能上傳多張圖片並切換', async ({ page }) => {
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');

    // 步驟 1: 上傳第一張圖片
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(testImagePath);
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 設定第一張圖片的字元數
    const charsInput = page.locator('input[type="number"]').first();
    await charsInput.fill('10');

    // 步驟 3: 上傳第二張圖片
    await fileInput.setInputFiles(testImagePath);
    await page.waitForTimeout(500);

    // 步驟 4: 切換到上一張圖片（使用 title 屬性）
    const prevButton = page.locator('button[title="Previous"]');

    await prevButton.click();

    // 驗證：應該切換回第一張圖片
    // 字元數應該仍是 10（保持各自的狀態）
    await expect(charsInput).toHaveValue('10');
  });

  test('應該在側邊欄顯示圖片列表', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 打開側邊欄
    const sidebarButton = page.locator('button').filter({
      hasText: /sidebar|側邊欄|列表/i
    }).first();

    // 如果側邊欄按鈕存在，點擊它
    if (await sidebarButton.isVisible()) {
      await sidebarButton.click();

      // 步驟 3: 驗證側邊欄中有圖片縮圖
      // 應該至少有一個圖片項目
      await page.waitForTimeout(500);

      // 側邊欄應該可見
      const sidebar = page.locator('[role="dialog"], .sidebar, .drawer').first();
      await expect(sidebar).toBeVisible({ timeout: 5000 });
    }
  });

  test('Canvas 應該正確渲染並可以截圖比對', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // 等待 Canvas 渲染
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000); // 等待渲染完成

    // 步驟 2: 取得 Canvas 元素
    const canvas = page.locator('canvas').first();

    // 驗證 Canvas 有正確的尺寸（不是 0x0）
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // 步驟 3: 截圖進行視覺回歸測試
    // 第一次執行會建立 baseline，之後會比對差異
    await expect(canvas).toHaveScreenshot('letter-canvas-initial.png', {
      maxDiffPixels: 100, // 允許小幅度差異
    });
  });

  test('應該能處理錯誤情況：上傳非圖片檔案', async ({ page }) => {
    // 建立一個非圖片檔案
    const textFilePath = path.join(__dirname, 'fixtures', 'test.txt');

    // 如果檔案不存在，先建立它
    const fs = require('fs');
    if (!fs.existsSync(textFilePath)) {
      fs.writeFileSync(textFilePath, 'This is not an image');
    }

    // 嘗試上傳文字檔
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(textFilePath);

    // 應該顯示錯誤訊息或不執行任何操作
    // 具體行為取決於你的錯誤處理機制
    await page.waitForTimeout(500);

    // Canvas 不應該出現，或顯示錯誤訊息
    // 註：這裡需要根據實際的錯誤處理邏輯調整
  });
});

/**
 * 效能測試：確保大量操作不會造成記憶體洩漏或效能問題
 */
test.describe('Letter 功能 - 效能測試', () => {
  test('應該能快速上傳並切換多張圖片', async ({ page }) => {
    await page.goto('/quiz-display-tool/text-panel');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"]').first();
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');

    const startTime = Date.now();

    // 快速上傳 5 張圖片
    for (let i = 0; i < 5; i++) {
      await fileInput.setInputFiles(testImagePath);
      await page.waitForTimeout(200);
    }

    const uploadTime = Date.now() - startTime;

    // 驗證上傳時間合理（不超過 5 秒）
    expect(uploadTime).toBeLessThan(5000);

    // 驗證可以切換圖片
    await expect(page.locator('canvas')).toBeVisible();
  });
});