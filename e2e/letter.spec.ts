import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * E2E tests for Letter functionality
 *
 * These tests simulate complete user workflows:
 * 1. Upload text files (.txt)
 * 2. Set characters per line
 * 3. Switch to auto mode and test auto-reveal functionality
 * 4. Test pause/resume
 * 5. Verify Canvas rendering
 * 6. Test handling of multi-line text files (newlines auto-split into multiple items)
 */

test.describe('Letter Feature - Complete User Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Letter page (text-panel)
    await page.goto('/quiz-display-tool/text-panel');

    // Wait for page load to complete
    await page.waitForLoadState('networkidle');
  });

  test('Should successfully upload text file and display on Canvas', async ({ page }) => {
    // Step 1: Find file upload button (accept=".txt")
    const fileInput = page.locator('input[type="file"][accept=".txt"]');

    // Step 2: Upload test text file
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    // Step 3: Wait for text processing to complete
    // Check if Canvas element appears
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // Step 4: Verify text is loaded into store
    // After upload, automatically switches to latest item (last one), so next button should be disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);

    // When on last item, next should be disabled
    await expect(nextButton).toBeDisabled();
  });

  test('Should be able to set characters per line', async ({ page }) => {
    // Step 1: Upload text file
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    // Wait for text to load
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // Step 2: Find character count setting (characters per line)
    const charsInput = page.locator('input[type="number"]').first();

    // Set characters per line to 20
    await charsInput.fill('20');

    // Step 3: Confirm setting is applied
    await expect(charsInput).toHaveValue('20');
  });

  test('Should be able to switch to auto mode and perform auto-reveal', async ({ page }) => {
    // Step 1: Upload text file
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // Step 2: Find mode toggle button (switch from manual to auto mode)
    // According to LetterManager.vue, mode toggle button is in top-bar-section mode-toggle
    const modeToggleButton = page.locator('.mode-toggle button').first();
    await modeToggleButton.click();

    // Step 3: Confirm switched to auto mode (play button should appear)
    const playButton = page.locator('.floating-play-button button');
    await expect(playButton).toBeVisible();

    // Step 4: Start auto-play
    await playButton.click();

    // Step 5: Wait for a moment to ensure some characters are revealed
    await page.waitForTimeout(1000);

    // Step 6: Pause (button icon changes to pause after playing)
    await playButton.click();

    // Verify state after pausing
    // Canvas should still be there with some content revealed
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('Should be able to show all and hide all', async ({ page }) => {
    // Step 1: Upload text file
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // Step 2: Click "Show all"
    // Button with PhFrameCorners icon, second button in common-utils el-button-group
    const showAllButton = page.locator('.common-utils .el-button-group button').nth(1);

    await showAllButton.click();

    // Verify: Canvas should display complete text
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Step 3: Click "Hide all"
    // Button with PhEyeClosed icon, first button in common-utils el-button-group
    const hideAllButton = page.locator('.common-utils .el-button-group button').first();

    await hideAllButton.click();

    // Verify: Canvas should still be there but content is covered
    await expect(canvas).toBeVisible();
  });

  test('Should be able to upload multi-line text file and auto-split into multiple items', async ({ page }) => {
    // Step 1: Upload multi-line text file (contains 5 lines)
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const multiLineTextPath = path.join(__dirname, 'fixtures', 'multi-line-text.txt');
    await fileInput.setInputFiles(multiLineTextPath);

    // Wait for last item to load (automatically switches to last one after upload)
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // Step 2: Verify on last item, next button should be disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);
    await expect(nextButton).toBeDisabled();

    // Step 3: Verify prev button should be enabled (because not on first item)
    const prevButton = page.locator('.file-utils .el-button-group button').first();
    await expect(prevButton).toBeEnabled();

    // Step 4: Click prev button to switch to second-to-last item
    await prevButton.click();
    await page.waitForTimeout(300);

    // Step 5: Verify both buttons should be enabled now (on middle item)
    await expect(prevButton).toBeEnabled();
    await expect(nextButton).toBeEnabled();

    // Step 6: Continue switching backwards to first item
    for (let i = 0; i < 3; i++) {
      await prevButton.click();
      await page.waitForTimeout(200);
    }

    // Step 7: Verify on first item, prev should be disabled
    await expect(prevButton).toBeDisabled();
    await expect(nextButton).toBeEnabled();

    // Canvas should remain visible
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('Should display text item list in sidebar', async ({ page }) => {
    // Step 1: Upload multi-line text file
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const multiLineTextPath = path.join(__dirname, 'fixtures', 'multi-line-text.txt');
    await fileInput.setInputFiles(multiLineTextPath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // Step 2: Open sidebar
    const sidebarButton = page.locator('button').filter({
      hasText: /sidebar|側邊欄|列表/i
    }).first();

    // If sidebar button exists, click it
    if (await sidebarButton.isVisible()) {
      await sidebarButton.click();

      // Step 3: Verify text items in sidebar
      // Should have at least multiple text items (from multi-line text file)
      await page.waitForTimeout(500);

      // Sidebar should be visible
      const sidebar = page.locator('[role="dialog"], .sidebar, .drawer').first();
      await expect(sidebar).toBeVisible({ timeout: 5000 });
    }
  });

  test('Canvas should render correctly and allow screenshot comparison', async ({ page }) => {
    // Step 1: Upload text file
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    // Wait for Canvas rendering
    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000); // Wait for rendering to complete

    // Step 2: Get Canvas element
    const canvas = page.locator('canvas').first();

    // Verify Canvas has correct dimensions (not 0x0)
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // Step 3: Take screenshot for visual regression testing
    // First run creates baseline, subsequent runs compare differences
    await expect(canvas).toHaveScreenshot('letter-canvas-initial.png', {
      maxDiffPixels: 100, // Allow minor differences
    });
  });

  test('Should be able to test different auto-reveal modes', async ({ page }) => {
    // Step 1: Upload text file
    const fileInput = page.locator('input[type="file"][accept=".txt"]');
    const testTextPath = path.join(__dirname, 'fixtures', 'test.txt');
    await fileInput.setInputFiles(testTextPath);

    await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });

    // Step 2: Switch to auto mode
    const modeToggleButton = page.locator('.mode-toggle button').first();
    await modeToggleButton.click();

    // Step 3: Verify reveal mode selector is visible
    const modeSelect = page.locator('.text-select');
    await expect(modeSelect).toBeVisible();

    // Step 4: Start playing to test auto-reveal
    const playButton = page.locator('.floating-play-button button');
    await playButton.click();

    // Wait for partial reveal
    await page.waitForTimeout(500);

    // Pause
    await playButton.click();

    // Verify Canvas is still visible
    await expect(page.locator('canvas')).toBeVisible();
  });
});

/**
 * Performance tests: Ensure bulk operations do not cause memory leaks or performance issues
 */
test.describe('Letter Feature - Performance Tests', () => {
  test('Should be able to quickly upload and switch multiple text items', async ({ page }) => {
    await page.goto('/quiz-display-tool/text-panel');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"][accept=".txt"]');

    // Prepare different test files (identical files will be deduplicated)
    const testFiles = [
      path.join(__dirname, 'fixtures', 'test-1.txt'),
      path.join(__dirname, 'fixtures', 'test-2.txt'),
      path.join(__dirname, 'fixtures', 'test-3.txt'),
    ];

    const startTime = Date.now();

    // Quickly upload 3 different text files (each contains 2 lines, total 6 items)
    for (const filePath of testFiles) {
      await fileInput.setInputFiles(filePath);
      await page.waitForTimeout(200);
    }

    const uploadTime = Date.now() - startTime;

    // Verify upload time is reasonable (not exceeding 5 seconds)
    expect(uploadTime).toBeLessThan(5000);

    // Verify Canvas is visible
    await expect(page.locator('canvas')).toBeVisible();

    // Test quick item switching
    // Should be on last item, use Previous button to switch backwards
    const prevButton = page.locator('.file-utils .el-button-group button').first();
    for (let i = 0; i < 5; i++) {
      if (await prevButton.isEnabled()) {
        await prevButton.click();
        await page.waitForTimeout(100);
      }
    }

    // Canvas should still display correctly
    await expect(page.locator('canvas')).toBeVisible();
  });
});