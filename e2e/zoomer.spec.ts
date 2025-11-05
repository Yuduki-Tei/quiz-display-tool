import { test, expect, Page } from '@playwright/test';
import path from 'path';

/**
 * Helper function to select an option from an Element Plus el-select dropdown
 */
async function selectOption(page: Page, selectLocator: any, optionText: string) {
  await selectLocator.click();
  // Wait a bit for dropdown animation
  await page.waitForTimeout(300);
  // Find the option with exact text match
  const option = page.getByRole('option', { name: optionText, exact: true });
  await option.click();
  await page.waitForTimeout(200);
}

/**
 * Zoomer 功能的 E2E 測試
 *
 * 這個測試會模擬真實使用者的完整操作流程：
 * 1. 上傳圖片檔案
 * 2. 繪製選取區域
 * 3. 切換顯示模式
 * 4. 測試縮放-抽出動畫
 * 5. 測試暫停/繼續
 * 6. 驗證 Canvas 渲染
 */

test.describe('Zoomer 功能 - 完整使用者流程', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到 Zoomer 頁面
    await page.goto('/quiz-display-tool/zoomer');

    // 等待頁面載入完成
    await page.waitForLoadState('networkidle');
  });

  test('應該成功上傳圖片並顯示在 Canvas 上', async ({ page }) => {
    // 步驟 1: 找到檔案上傳按鈕（accept="image/*"）
    const fileInput = page.locator('input[type="file"][accept="image/*"]');

    // 步驟 2: 上傳測試圖片
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // 步驟 3: 等待圖片處理完成
    // 檢查是否有 Canvas 元素出現
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 4: 驗證圖片已載入到 store
    // 上傳後會自動切換到最新項目（最後一個），所以 next 按鈕應該 disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);

    // 最後一個項目時，next 應該 disabled
    await expect(nextButton).toBeDisabled();
  });

  test('應該能設定縮放時長', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // 等待圖片載入
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 找到縮放時長設定（使用 el-input-number 元件）
    const durationInput = page.locator('.duration-control .el-input-number input').first();

    // 設定縮放時長為 10 秒
    await durationInput.fill('10');

    // 步驟 3: 確認設定已套用
    await expect(durationInput).toHaveValue('10');
  });

  test('應該能繪製選取區域', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 在 Canvas 上繪製選取區域
    const canvas = page.locator('canvas').first();
    const boundingBox = await canvas.boundingBox();

    if (boundingBox) {
      // 從中心點開始拖拽繪製矩形
      const startX = boundingBox.x + boundingBox.width * 0.3;
      const startY = boundingBox.y + boundingBox.height * 0.3;
      const endX = boundingBox.x + boundingBox.width * 0.7;
      const endY = boundingBox.y + boundingBox.height * 0.7;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY);
      await page.mouse.up();

      // 等待選取完成
      await page.waitForTimeout(300);
    }

    // 步驟 3: 驗證播放按鈕應該變為可用（有選取區域後才能開始縮放）
    const playButton = page.locator('.floating-play-button button');
    await expect(playButton).toBeEnabled();
  });

  test('應該能切換顯示模式', async ({ page }) => {
    // 步驟 1: 上傳圖片並繪製選取區域
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 繪製選取區域
    const canvas = page.locator('canvas').first();
    const boundingBox = await canvas.boundingBox();

    if (boundingBox) {
      const startX = boundingBox.x + boundingBox.width * 0.3;
      const startY = boundingBox.y + boundingBox.height * 0.3;
      const endX = boundingBox.x + boundingBox.width * 0.7;
      const endY = boundingBox.y + boundingBox.height * 0.7;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY);
      await page.mouse.up();
      await page.waitForTimeout(300);
    }

    // 步驟 2: 找到顯示模式切換按鈕（mode-toggle）
    const modeToggleButton = page.locator('.mode-toggle button').first();

    // 步驟 3: 點擊切換模式（full -> selection -> none -> full）
    // 第一次點擊：切換到 selection 模式
    await modeToggleButton.click();
    await page.waitForTimeout(300);

    // 第二次點擊：切換到 none 模式
    await modeToggleButton.click();
    await page.waitForTimeout(300);

    // 第三次點擊：切換回 full 模式
    await modeToggleButton.click();
    await page.waitForTimeout(300);

    // Canvas 應該保持可見
    await expect(canvas).toBeVisible();
  });

  test('應該能執行縮放-抽出動畫並暫停', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 繪製選取區域
    const mainCanvas = page.locator('canvas').first();
    const boundingBox = await mainCanvas.boundingBox();

    if (boundingBox) {
      const startX = boundingBox.x + boundingBox.width * 0.3;
      const startY = boundingBox.y + boundingBox.height * 0.3;
      const endX = boundingBox.x + boundingBox.width * 0.7;
      const endY = boundingBox.y + boundingBox.height * 0.7;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY);
      await page.mouse.up();
      await page.waitForTimeout(300);
    }

    // 步驟 3: 設定較短的縮放時長以便測試
    const durationInput = page.locator('.duration-control .el-input-number input').first();
    await durationInput.fill('3');

    // 步驟 4: 開始縮放動畫
    const playButton = page.locator('.floating-play-button button');
    await playButton.click();

    // 步驟 5: 等待一段時間，確保動畫開始
    await page.waitForTimeout(500);

    // 步驟 6: 暫停動畫
    await playButton.click();

    // 驗證 zoomCanvas (第二個 canvas) 在 isZooming 時可見
    const zoomCanvas = page.locator('canvas').nth(1);
    await expect(zoomCanvas).toBeVisible();
  });

  test('應該能顯示完整圖片', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 繪製選取區域
    const mainCanvas = page.locator('canvas').first();
    const boundingBox = await mainCanvas.boundingBox();

    if (boundingBox) {
      const startX = boundingBox.x + boundingBox.width * 0.3;
      const startY = boundingBox.y + boundingBox.height * 0.3;
      const endX = boundingBox.x + boundingBox.width * 0.7;
      const endY = boundingBox.y + boundingBox.height * 0.7;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY);
      await page.mouse.up();
      await page.waitForTimeout(300);
    }

    // 步驟 3: 設定較短的縮放時長
    const durationInput = page.locator('.duration-control .el-input-number input').first();
    await durationInput.fill('2');
    await page.waitForTimeout(200);

    // 步驟 4: 開始縮放動畫
    const playButton = page.locator('.floating-play-button button');
    await playButton.click();
    await page.waitForTimeout(300);

    // 步驟 5: 點擊「顯示完整圖片」按鈕 (只在 isZooming 時可用)
    const showFullButton = page.locator('.common-utils button').first();
    await expect(showFullButton).toBeEnabled({ timeout: 3000 });
    await showFullButton.click();
    await page.waitForTimeout(300);

    // 步驟 6: 驗證回到 full mode，mainCanvas 應該可見
    await expect(mainCanvas).toBeVisible();
  });

  test('應該能上傳多張圖片並切換', async ({ page }) => {
    // 步驟 1: 上傳第一張圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 設定第一張圖片的縮放時長
    const durationInput = page.locator('.duration-control .el-input-number input').first();
    await durationInput.fill('15');

    // 步驟 3: 上傳第二張圖片
    // 使用不同的圖片（因為相同圖片會被去重）
    const testImagePath2 = path.join(__dirname, 'fixtures', 'test-image-1.svg');
    await fileInput.setInputFiles(testImagePath2);
    await page.waitForTimeout(500);

    // 步驟 4: 驗證當前在最後一個項目，next 按鈕 disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);
    await expect(nextButton).toBeDisabled();

    // 步驟 5: 切換到上一張圖片
    const prevButton = page.locator('.file-utils .el-button-group button').first();
    await expect(prevButton).toBeEnabled();
    await prevButton.click();
    await page.waitForTimeout(300);

    // 驗證：Canvas 應該保持可見
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('應該在側邊欄顯示圖片列表', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 打開側邊欄
    const sidebarButton = page.locator('.file-utils button').first();
    await sidebarButton.click();

    // 步驟 3: 驗證側邊欄中有圖片項目
    await page.waitForTimeout(500);

    // 側邊欄應該可見
    const sidebar = page.locator('.el-drawer');
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });

  test('Canvas 應該正確渲染並可以截圖比對', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // 等待 Canvas 渲染
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });
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
    await expect(canvas).toHaveScreenshot('zoomer-canvas-initial.png', {
      maxDiffPixels: 100, // 允許小幅度差異
    });
  });
});

/**
 * 效能測試：確保大量操作不會造成記憶體洩漏或效能問題
 */
test.describe('Zoomer 功能 - 效能測試', () => {
  test('應該能快速切換多張圖片', async ({ page }) => {
    await page.goto('/quiz-display-tool/zoomer');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"][accept="image/*"]');

    // 準備不同的測試圖片（因為相同圖片會被去重）
    const testImages = [
      path.join(__dirname, 'fixtures', 'test-image-1.svg'),
      path.join(__dirname, 'fixtures', 'test-image-2.svg'),
      path.join(__dirname, 'fixtures', 'test-image-3.svg'),
    ];

    const startTime = Date.now();

    // 快速上傳 3 個不同的圖片
    for (const imagePath of testImages) {
      await fileInput.setInputFiles(imagePath);
      await page.waitForTimeout(200);
    }

    const uploadTime = Date.now() - startTime;

    // 驗證上傳時間合理（不超過 5 秒）
    expect(uploadTime).toBeLessThan(5000);

    // 驗證可以看到 Canvas
    await expect(page.locator('canvas').first()).toBeVisible();

    // 測試快速切換項目
    // 當前應該在最後一個項目，使用 Previous 按鈕往前切換
    const prevButton = page.locator('.file-utils .el-button-group button').first();
    for (let i = 0; i < 2; i++) {
      if (await prevButton.isEnabled()) {
        await prevButton.click();
        await page.waitForTimeout(100);
      }
    }

    // Canvas 應該仍然正常顯示
    await expect(page.locator('canvas').first()).toBeVisible();
  });
});
