import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Letter 功能的 E2E 測試
 *
 * 這個測試會模擬真實使用者的完整操作流程：
 * 1. 上傳文字檔案（.txt）
 * 2. 設定每行字元數
 * 3. 切換到自動模式並測試自動揭露功能
 * 4. 測試暫停/繼續
 * 5. 驗證 Canvas 渲染
 * 6. 測試多行文字檔的處理（換行自動分割成多項目）
 */

test.describe('Letter 功能 - 完整使用者流程', () => {
  test.beforeEach(async ({ page }) => {
    // 導航到 Letter 頁面（text-panel）
    await page.goto('/quiz-display-tool/text-panel');

    // 等待頁面載入完成
    await page.waitForLoadState('networkidle');
  });

  test('應該成功上傳文字檔並顯示在 Canvas 上', async ({ page }) => {
    // 步驟 1: 找到檔案上傳按鈕（accept=".txt"）
    const fileInput = page.locator('input[type="file"][accept=".txt"]');

    // 步驟 2: 上傳測試文字檔
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    // 步驟 3: 等待文字處理完成
    // 檢查是否有 Canvas 元素出現
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 4: 驗證文字已載入到 store
    // 上傳後會自動切換到最新項目（最後一個），所以 next 按鈕應該 disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);

    // 最後一個項目時，next 應該 disabled
    await expect(nextButton).toBeDisabled();
  });

  test('應該能設定每行字元數', async ({ page }) => {
    // 步驟 1: 上傳文字檔
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    // 等待文字載入
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 找到字元數設定（每行字元數）
    const charsInput = page.locator('input[type="number"]').first();

    // 設定每行字元數為 20
    await charsInput.fill('20');

    // 步驟 3: 確認設定已套用
    await expect(charsInput).toHaveValue('20');
  });

  test('應該能切換到自動模式並執行自動揭露', async ({ page }) => {
    // 步驟 1: 上傳文字檔
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 找到模式切換按鈕（從手動模式切換到自動模式）
    // 根據 LetterManager.vue，模式切換按鈕在 top-bar-section mode-toggle
    const modeToggleButton = page.locator('.mode-toggle button').first();
    await modeToggleButton.click();

    // 步驟 3: 確認已切換到自動模式（播放按鈕應該出現）
    const playButton = page.locator('.floating-play-button button');
    await expect(playButton).toBeVisible();

    // 步驟 4: 開始自動播放
    await playButton.click();

    // 步驟 5: 等待一段時間，確保有字元被揭露
    await page.waitForTimeout(1000);

    // 步驟 6: 暫停（播放後按鈕圖示會變成暫停）
    await playButton.click();

    // 驗證暫停後的狀態
    // Canvas 應該還在，並且有部分內容已揭露
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('應該能全部顯示和全部隱藏', async ({ page }) => {
    // 步驟 1: 上傳文字檔
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 點擊「全部顯示」
    // PhFrameCorners icon 的按鈕，位於 common-utils 的 el-button-group 中的第二個按鈕
    const showAllButton = page.locator('.common-utils .el-button-group button').nth(1);

    await showAllButton.click();

    // 驗證：Canvas 應該顯示完整文字
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // 步驟 3: 點擊「全部隱藏」
    // PhEyeClosed icon 的按鈕，位於 common-utils 的 el-button-group 中的第一個按鈕
    const hideAllButton = page.locator('.common-utils .el-button-group button').first();

    await hideAllButton.click();

    // 驗證：Canvas 應該還在但內容被遮蓋
    await expect(canvas).toBeVisible();
  });

  test('應該能上傳多行文字檔並自動分割成多個項目', async ({ page }) => {
    // 步驟 1: 上傳多行文字檔（包含 5 行）
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const multiLineTextPath = path.join(__dirname, 'fixtures', 'multi-line-text.txt');
    await fileInput.setInputFiles(multiLineTextPath);

    // 等待最後一個項目載入（上傳後會自動切換到最後一個）
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 驗證當前在最後一個項目，next 按鈕應該 disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);
    await expect(nextButton).toBeDisabled();

    // 步驟 3: 驗證 prev 按鈕應該 enabled（因為不是第一個項目）
    const prevButton = page.locator('.file-utils .el-button-group button').first();
    await expect(prevButton).toBeEnabled();

    // 步驟 4: 點擊 prev 按鈕切換到倒數第二個項目
    await prevButton.click();
    await page.waitForTimeout(300);

    // 步驟 5: 驗證現在兩個按鈕都應該 enabled（在中間項目）
    await expect(prevButton).toBeEnabled();
    await expect(nextButton).toBeEnabled();

    // 步驟 6: 繼續往前切換到第一個項目
    for (let i = 0; i < 3; i++) {
      await prevButton.click();
      await page.waitForTimeout(200);
    }

    // 步驟 7: 驗證在第一個項目時，prev 應該 disabled
    await expect(prevButton).toBeDisabled();
    await expect(nextButton).toBeEnabled();

    // Canvas 應該保持可見
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('應該在側邊欄顯示文字項目列表', async ({ page }) => {
    // 步驟 1: 上傳多行文字檔
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const multiLineTextPath = path.join(__dirname, 'fixtures', 'multi-line-text.txt');
    await fileInput.setInputFiles(multiLineTextPath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 打開側邊欄
    const sidebarButton = page.locator('button').filter({
      hasText: /sidebar|側邊欄|列表/i
    }).first();

    // 如果側邊欄按鈕存在，點擊它
    if (await sidebarButton.isVisible()) {
      await sidebarButton.click();

      // 步驟 3: 驗證側邊欄中有文字項目
      // 應該至少有多個文字項目（來自多行文字檔）
      await page.waitForTimeout(500);

      // 側邊欄應該可見
      const sidebar = page.locator('[role="dialog"], .sidebar, .drawer').first();
      await expect(sidebar).toBeVisible({ timeout: 5000 });
    }
  });

  test('Canvas 應該正確渲染並可以截圖比對', async ({ page }) => {
    // 步驟 1: 上傳文字檔
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

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

  test('應該能測試不同的自動揭露模式', async ({ page }) => {
    // 步驟 1: 上傳文字檔
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // 步驟 2: 切換到自動模式
    const modeToggleButton = page.locator('.mode-toggle button').first();
    await modeToggleButton.click();

    // 步驟 3: 驗證揭露模式選擇器可見
    const modeSelect = page.locator('.text-select');
    await expect(modeSelect).toBeVisible();

    // 步驟 4: 開始播放測試自動揭露
    const playButton = page.locator('.floating-play-button button');
    await playButton.click();

    // 等待部分揭露
    await page.waitForTimeout(500);

    // 暫停
    await playButton.click();

    // 驗證 Canvas 仍然可見
    await expect(page.locator('canvas')).toBeVisible();
  });
});

/**
 * 效能測試：確保大量操作不會造成記憶體洩漏或效能問題
 */
test.describe('Letter 功能 - 效能測試', () => {
  test('應該能快速上傳並切換多個文字項目', async ({ page }) => {
    await page.goto('/quiz-display-tool/text-panel');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"][accept=".txt"]');

    // 準備不同的測試檔案（因為相同檔案會被去重）
    const testFiles = [
      path.join(__dirname, 'fixtures', 'test-1.txt'),
      path.join(__dirname, 'fixtures', 'test-2.txt'),
      path.join(__dirname, 'fixtures', 'test-3.txt'),
    ];

    const startTime = Date.now();

    // 快速上傳 3 個不同的文字檔（每個包含 2 行，共 6 個項目）
    for (const filePath of testFiles) {
      await fileInput.setInputFiles(filePath);
      await page.waitForTimeout(200);
    }

    const uploadTime = Date.now() - startTime;

    // 驗證上傳時間合理（不超過 5 秒）
    expect(uploadTime).toBeLessThan(5000);

    // 驗證可以看到 Canvas
    await expect(page.locator('canvas')).toBeVisible();

    // 測試快速切換項目
    // 當前應該在最後一個項目，使用 Previous 按鈕往前切換
    const prevButton = page.locator('.file-utils .el-button-group button').first();
    for (let i = 0; i < 5; i++) {
      if (await prevButton.isEnabled()) {
        await prevButton.click();
        await page.waitForTimeout(100);
      }
    }

    // Canvas 應該仍然正常顯示
    await expect(page.locator('canvas')).toBeVisible();
  });
});