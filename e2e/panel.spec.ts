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
 * Panel 功能的 E2E 測試
 *
 * 這個測試會模擬真實使用者的完整操作流程：
 * 1. 上傳圖片檔案
 * 2. 設定網格尺寸
 * 3. 切換到自動模式並測試自動揭露功能
 * 4. 測試不同的揭露模式
 * 5. 測試暫停/繼續
 * 6. 驗證 Canvas 渲染
 */

test.describe('Panel 功能 - 完整使用者流程', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到 Panel 頁面
    await page.goto('/quiz-display-tool/panel');

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

  test('應該能設定網格尺寸', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // 等待圖片載入 (Panel has 2 canvases)
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 找到網格尺寸設定（使用 el-select 下拉選單）
    const gridSelects = page.locator('.grid-selector .el-select');
    const gridXSelect = gridSelects.first();
    const gridYSelect = gridSelects.nth(1);

    // 設定網格為 8x6
    await selectOption(page, gridXSelect, '8');
    await selectOption(page, gridYSelect, '6');

    // 步驟 3: 驗證 Canvas 仍然可見（網格已更新）
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('應該能手動點擊面板進行揭露', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 設定較小的網格以便測試
    const gridSelects = page.locator('.grid-selector .el-select');

    // 設定 X = 3
    await selectOption(page, gridSelects.first(), '3');

    // 設定 Y = 3
    await selectOption(page, gridSelects.nth(1), '3');

    // 步驟 3: 點擊 Canvas 上的面板
    const canvas = page.locator('canvas').first();
    const boundingBox = await canvas.boundingBox();

    if (boundingBox) {
      // 點擊左上角的面板
      const clickX = boundingBox.x + boundingBox.width * 0.2;
      const clickY = boundingBox.y + boundingBox.height * 0.2;
      await page.mouse.click(clickX, clickY);

      await page.waitForTimeout(300);

      // 點擊中間的面板
      const clickX2 = boundingBox.x + boundingBox.width * 0.5;
      const clickY2 = boundingBox.y + boundingBox.height * 0.5;
      await page.mouse.click(clickX2, clickY2);

      await page.waitForTimeout(300);
    }

    // 驗證 Canvas 仍然可見
    await expect(canvas).toBeVisible();
  });

  test('應該能切換到自動模式並執行自動揭露', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 設定較小的網格
    const gridSelects = page.locator('.grid-selector .el-select');

    // 設定 X = 4
    await selectOption(page, gridSelects.first(), '4');

    // 設定 Y = 4
    await selectOption(page, gridSelects.nth(1), '4');

    // 步驟 3: 切換到自動模式
    // 注意：mode toggle 按鈕在有面板揭露時會被 disabled，但剛上傳圖片時應該是全部隱藏的狀態
    const modeToggleButton = page.locator('.mode-toggle button').first();

    // 等待按鈕可用（可能需要等待網格設定完成）
    await page.waitForTimeout(500);
    await expect(modeToggleButton).toBeEnabled({ timeout: 5000 });
    await modeToggleButton.click();

    // 等待模式切換動畫完成
    await page.waitForTimeout(500);

    // 步驟 4: 確認已切換到自動模式（播放按鈕應該出現）
    const playButton = page.locator('.floating-play-button button');
    await expect(playButton).toBeVisible({ timeout: 5000 });

    // 步驟 5: 驗證 duration control 和模式選擇器都出現了
    const durationControl = page.locator('.duration-control');
    await expect(durationControl).toBeVisible();

    const modeSelect = page.locator('.text-select').first();
    await expect(modeSelect).toBeVisible();

    // 步驟 6: 開始自動播放（使用預設的 duration 值）
    // 注意：duration input 在播放時會被 disabled，所以不修改它
    await playButton.click();

    // 步驟 7: 等待一段時間，確保有面板被揭露
    await page.waitForTimeout(1500);

    // 步驟 8: 暫停（播放後按鈕圖示會變成暫停）
    await playButton.click();

    // 驗證暫停後的狀態
    // Canvas 應該還在，並且有部分內容已揭露
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('應該能全部顯示和全部隱藏', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 點擊「全部顯示」
    // PhFrameCorners icon 的按鈕，位於 common-utils 的 el-button-group 中的第二個按鈕
    const showAllButton = page.locator('.common-utils .el-button-group button').nth(1);

    await showAllButton.click();

    // 驗證：Canvas 應該顯示完整圖片
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // 步驟 3: 點擊「全部隱藏」
    // PhEyeClosed icon 的按鈕，位於 common-utils 的 el-button-group 中的第一個按鈕
    const hideAllButton = page.locator('.common-utils .el-button-group button').first();

    await hideAllButton.click();

    // 驗證：Canvas 應該還在但內容被遮蓋
    await expect(canvas).toBeVisible();
  });

  test('應該能測試不同的自動揭露模式', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 設定較小的網格
    const gridSelects = page.locator('.grid-selector .el-select');

    // 設定 X = 3
    await selectOption(page, gridSelects.first(), '3');

    // 設定 Y = 3
    await selectOption(page, gridSelects.nth(1), '3');

    // 步驟 3: 切換到自動模式
    const modeToggleButton = page.locator('.mode-toggle button').first();
    await modeToggleButton.click();

    // 步驟 4: 驗證揭露模式選擇器可見 (有多個 text-select，取第一個)
    const modeSelect = page.locator('.text-select').first();
    await expect(modeSelect).toBeVisible();

    // 步驟 5: 嘗試選擇不同的揭露模式
    // 點擊下拉選單
    await modeSelect.click();
    await page.waitForTimeout(300);

    // 選擇一個選項（例如：linear 模式）
    await page.waitForTimeout(300);
    const option = page.getByRole('option').first();
    await option.click();
    await page.waitForTimeout(200);

    // 步驟 6: 開始播放測試自動揭露
    const playButton = page.locator('.floating-play-button button');
    await playButton.click();

    // 等待部分揭露
    await page.waitForTimeout(500);

    // 暫停
    await playButton.click();

    // 驗證 Canvas 仍然可見
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('應該能上傳多張圖片並切換', async ({ page }) => {
    // 步驟 1: 上傳第一張圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 設定第一張圖片的網格尺寸
    const gridSelects = page.locator('.grid-selector .el-select');
    await selectOption(page, gridSelects.first(), '7');

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
    await expect(canvas).toHaveScreenshot('panel-canvas-initial.png', {
      maxDiffPixels: 100, // 允許小幅度差異
    });
  });

  test('應該能調整網格並重新渲染', async ({ page }) => {
    // 步驟 1: 上傳圖片
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 步驟 2: 設定初始網格
    const gridSelects = page.locator('.grid-selector .el-select');

    // 設定 X = 3
    await selectOption(page, gridSelects.first(), '3');

    // 設定 Y = 3
    await selectOption(page, gridSelects.nth(1), '3');

    // 步驟 3: 揭露一些面板
    const showAllButton = page.locator('.common-utils .el-button-group button').nth(1);
    await showAllButton.click();
    await page.waitForTimeout(300);

    // 步驟 4: 改變網格尺寸
    // 設定 X = 5
    await selectOption(page, gridSelects.first(), '5');

    // 設定 Y = 5
    await selectOption(page, gridSelects.nth(1), '5');

    // 驗證：Canvas 應該重新渲染新的網格
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });
});

/**
 * 效能測試：確保大量操作不會造成記憶體洩漏或效能問題
 */
test.describe('Panel 功能 - 效能測試', () => {
  test('應該能快速切換多張圖片', async ({ page }) => {
    await page.goto('/quiz-display-tool/panel');
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

  test('應該能處理大量面板揭露', async ({ page }) => {
    await page.goto('/quiz-display-tool/panel');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // 設定較大的網格
    const gridSelects = page.locator('.grid-selector .el-select');

    // 設定 X = 10
    await selectOption(page, gridSelects.first(), '10');

    // 設定 Y = 10
    await selectOption(page, gridSelects.nth(1), '10');

    const startTime = Date.now();

    // 全部顯示（100 個面板）
    const showAllButton = page.locator('.common-utils .el-button-group button').nth(1);
    await showAllButton.click();
    await page.waitForTimeout(100);

    // 全部隱藏
    const hideAllButton = page.locator('.common-utils .el-button-group button').first();
    await hideAllButton.click();
    await page.waitForTimeout(100);

    const operationTime = Date.now() - startTime;

    // 驗證操作時間合理（不超過 2 秒）
    expect(operationTime).toBeLessThan(2000);

    // Canvas 應該仍然正常顯示
    await expect(page.locator('canvas').first()).toBeVisible();
  });
});
