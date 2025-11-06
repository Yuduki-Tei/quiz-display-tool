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
 * E2E tests for Panel functionality
 *
 * These tests simulate the complete user workflow:
 * 1. Upload image files
 * 2. Set grid dimensions
 * 3. Switch to auto mode and test auto-reveal functionality
 * 4. Test different reveal modes
 * 5. Test pause/resume
 * 6. Verify Canvas rendering
 */

test.describe('Panel Functionality - Complete User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Panel page
    await page.goto('/quiz-display-tool/panel');

    // Wait for page load to complete
    await page.waitForLoadState('networkidle');
  });

  test('Should successfully upload image and display on Canvas', async ({ page }) => {
    // Step 1: Find file upload button (accept="image/*")
    const fileInput = page.locator('input[type="file"][accept="image/*"]');

    // Step 2: Upload test image
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // Step 3: Wait for image processing to complete
    // Check if Canvas element appears
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 4: Verify image has been loaded to store
    // After upload, automatically switches to the latest item (last one), so next button should be disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);

    // When at last item, next should be disabled
    await expect(nextButton).toBeDisabled();
  });

  test('Should be able to set grid dimensions', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // Wait for image to load (Panel has 2 canvases)
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Find grid dimension settings (using el-select dropdown)
    const gridSelects = page.locator('.grid-selector .el-select');
    const gridXSelect = gridSelects.first();
    const gridYSelect = gridSelects.nth(1);

    // Set grid to 8x6
    await selectOption(page, gridXSelect, '8');
    await selectOption(page, gridYSelect, '6');

    // Step 3: Verify Canvas is still visible (grid has been updated)
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('Should be able to manually click panels to reveal', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Set smaller grid for testing
    const gridSelects = page.locator('.grid-selector .el-select');

    // Set X = 3
    await selectOption(page, gridSelects.first(), '3');

    // Set Y = 3
    await selectOption(page, gridSelects.nth(1), '3');

    // Step 3: Click panels on Canvas
    const canvas = page.locator('canvas').first();
    const boundingBox = await canvas.boundingBox();

    if (boundingBox) {
      // Click top-left panel
      const clickX = boundingBox.x + boundingBox.width * 0.2;
      const clickY = boundingBox.y + boundingBox.height * 0.2;
      await page.mouse.click(clickX, clickY);

      await page.waitForTimeout(300);

      // Click center panel
      const clickX2 = boundingBox.x + boundingBox.width * 0.5;
      const clickY2 = boundingBox.y + boundingBox.height * 0.5;
      await page.mouse.click(clickX2, clickY2);

      await page.waitForTimeout(300);
    }

    // Verify Canvas is still visible
    await expect(canvas).toBeVisible();
  });

  test('Should be able to switch to auto mode and perform auto-reveal', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Set smaller grid
    const gridSelects = page.locator('.grid-selector .el-select');

    // Set X = 4
    await selectOption(page, gridSelects.first(), '4');

    // Set Y = 4
    await selectOption(page, gridSelects.nth(1), '4');

    // Step 3: Switch to auto mode
    // Note: mode toggle button will be disabled when panels are revealed, but should be all hidden right after upload
    const modeToggleButton = page.locator('.mode-toggle button').first();

    // Wait for button to be enabled (may need to wait for grid settings to complete)
    await page.waitForTimeout(500);
    await expect(modeToggleButton).toBeEnabled({ timeout: 5000 });
    await modeToggleButton.click();

    // Wait for mode switch animation to complete
    await page.waitForTimeout(500);

    // Step 4: Confirm switched to auto mode (play button should appear)
    const playButton = page.locator('.floating-play-button button');
    await expect(playButton).toBeVisible({ timeout: 5000 });

    // Step 5: Verify duration control and mode selector both appear
    const durationControl = page.locator('.duration-control');
    await expect(durationControl).toBeVisible();

    const modeSelect = page.locator('.text-select').first();
    await expect(modeSelect).toBeVisible();

    // Step 6: Start auto playback (using default duration value)
    // Note: duration input will be disabled during playback, so don't modify it
    await playButton.click();

    // Step 7: Wait for some time to ensure panels are revealed
    await page.waitForTimeout(1500);

    // Step 8: Pause (button icon will change to pause after playing)
    await playButton.click();

    // Verify state after pause
    // Canvas should still be there with some content already revealed
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('Should be able to show all and hide all', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Click "Show All"
    // PhFrameCorners icon button, second button in el-button-group of common-utils
    const showAllButton = page.locator('.common-utils .el-button-group button').nth(1);

    await showAllButton.click();

    // Verify: Canvas should display complete image
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Step 3: Click "Hide All"
    // PhEyeClosed icon button, first button in el-button-group of common-utils
    const hideAllButton = page.locator('.common-utils .el-button-group button').first();

    await hideAllButton.click();

    // Verify: Canvas should still be there but content is covered
    await expect(canvas).toBeVisible();
  });

  test('Should be able to test different auto-reveal modes', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Set smaller grid
    const gridSelects = page.locator('.grid-selector .el-select');

    // Set X = 3
    await selectOption(page, gridSelects.first(), '3');

    // Set Y = 3
    await selectOption(page, gridSelects.nth(1), '3');

    // Step 3: Switch to auto mode
    const modeToggleButton = page.locator('.mode-toggle button').first();
    await modeToggleButton.click();

    // Step 4: Verify reveal mode selector is visible (multiple text-select, take first)
    const modeSelect = page.locator('.text-select').first();
    await expect(modeSelect).toBeVisible();

    // Step 5: Try to select different reveal modes
    // Click dropdown
    await modeSelect.click();
    await page.waitForTimeout(300);

    // Select an option (e.g.: linear mode)
    await page.waitForTimeout(300);
    const option = page.getByRole('option').first();
    await option.click();
    await page.waitForTimeout(200);

    // Step 6: Start playback to test auto-reveal
    const playButton = page.locator('.floating-play-button button');
    await playButton.click();

    // Wait for partial reveal
    await page.waitForTimeout(500);

    // Pause
    await playButton.click();

    // Verify Canvas is still visible
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('Should be able to upload multiple images and switch', async ({ page }) => {
    // Step 1: Upload first image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Set grid dimensions for first image
    const gridSelects = page.locator('.grid-selector .el-select');
    await selectOption(page, gridSelects.first(), '7');

    // Step 3: Upload second image
    // Use different image (same image will be deduplicated)
    const testImagePath2 = path.join(__dirname, 'fixtures', 'test-image-1.svg');
    await fileInput.setInputFiles(testImagePath2);
    await page.waitForTimeout(500);

    // Step 4: Verify currently at last item, next button disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);
    await expect(nextButton).toBeDisabled();

    // Step 5: Switch to previous image
    const prevButton = page.locator('.file-utils .el-button-group button').first();
    await expect(prevButton).toBeEnabled();
    await prevButton.click();
    await page.waitForTimeout(300);

    // Verify: Canvas should remain visible
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('Should display image list in sidebar', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Open sidebar
    const sidebarButton = page.locator('.file-utils button').first();
    await sidebarButton.click();

    // Step 3: Verify image items in sidebar
    await page.waitForTimeout(500);

    // Sidebar should be visible
    const sidebar = page.locator('.el-drawer');
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });

  test('Canvas should render correctly and support screenshot comparison', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // Wait for Canvas to render
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000); // Wait for rendering to complete

    // Step 2: Get Canvas element
    const canvas = page.locator('canvas').first();

    // Verify Canvas has correct dimensions (not 0x0)
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // Step 3: Take screenshot for visual regression testing
    // First run will create baseline, subsequent runs will compare differences
    await expect(canvas).toHaveScreenshot('panel-canvas-initial.png', {
      maxDiffPixels: 100, // Allow small pixel differences
    });
  });

  test('Should be able to adjust grid and re-render', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Set initial grid
    const gridSelects = page.locator('.grid-selector .el-select');

    // Set X = 3
    await selectOption(page, gridSelects.first(), '3');

    // Set Y = 3
    await selectOption(page, gridSelects.nth(1), '3');

    // Step 3: Reveal some panels
    const showAllButton = page.locator('.common-utils .el-button-group button').nth(1);
    await showAllButton.click();
    await page.waitForTimeout(300);

    // Step 4: Change grid dimensions
    // Set X = 5
    await selectOption(page, gridSelects.first(), '5');

    // Set Y = 5
    await selectOption(page, gridSelects.nth(1), '5');

    // Verify: Canvas should re-render with new grid
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });
});

/**
 * Performance tests: Ensure large number of operations don't cause memory leaks or performance issues
 */
test.describe('Panel Functionality - Performance Tests', () => {
  test('Should be able to quickly switch between multiple images', async ({ page }) => {
    await page.goto('/quiz-display-tool/panel');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"][accept="image/*"]');

    // Prepare different test images (same image will be deduplicated)
    const testImages = [
      path.join(__dirname, 'fixtures', 'test-image-1.svg'),
      path.join(__dirname, 'fixtures', 'test-image-2.svg'),
      path.join(__dirname, 'fixtures', 'test-image-3.svg'),
    ];

    const startTime = Date.now();

    // Quickly upload 3 different images
    for (const imagePath of testImages) {
      await fileInput.setInputFiles(imagePath);
      await page.waitForTimeout(200);
    }

    const uploadTime = Date.now() - startTime;

    // Verify upload time is reasonable (not exceeding 5 seconds)
    expect(uploadTime).toBeLessThan(5000);

    // Verify Canvas is visible
    await expect(page.locator('canvas').first()).toBeVisible();

    // Test quick switching between items
    // Should currently be at last item, use Previous button to switch back
    const prevButton = page.locator('.file-utils .el-button-group button').first();
    for (let i = 0; i < 2; i++) {
      if (await prevButton.isEnabled()) {
        await prevButton.click();
        await page.waitForTimeout(100);
      }
    }

    // Canvas should still display normally
    await expect(page.locator('canvas').first()).toBeVisible();
  });

  test('Should be able to handle large number of panel reveals', async ({ page }) => {
    await page.goto('/quiz-display-tool/panel');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Set larger grid
    const gridSelects = page.locator('.grid-selector .el-select');

    // Set X = 10
    await selectOption(page, gridSelects.first(), '10');

    // Set Y = 10
    await selectOption(page, gridSelects.nth(1), '10');

    const startTime = Date.now();

    // Show all (100 panels)
    const showAllButton = page.locator('.common-utils .el-button-group button').nth(1);
    await showAllButton.click();
    await page.waitForTimeout(100);

    // Hide all
    const hideAllButton = page.locator('.common-utils .el-button-group button').first();
    await hideAllButton.click();
    await page.waitForTimeout(100);

    const operationTime = Date.now() - startTime;

    // Verify operation time is reasonable (not exceeding 2 seconds)
    expect(operationTime).toBeLessThan(2000);

    // Canvas should still display normally
    await expect(page.locator('canvas').first()).toBeVisible();
  });
});
