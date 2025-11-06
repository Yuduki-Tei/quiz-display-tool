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
 * Zoomer functionality E2E tests
 *
 * These tests simulate a complete user workflow:
 * 1. Upload image files
 * 2. Draw selection area
 * 3. Toggle display mode
 * 4. Test zoom-extract animation
 * 5. Test pause/resume
 * 6. Verify Canvas rendering
 */

test.describe('Zoomer functionality - Complete user workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Zoomer page
    await page.goto('/quiz-display-tool/zoomer');

    // Wait for page to finish loading
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

    // Step 4: Verify image is loaded in store
    // After upload, it will automatically switch to the latest item (the last one),
    // so the next button should be disabled
    const nextButton = page.locator('.file-utils .el-button-group button').nth(1);

    // When at the last item, next button should be disabled
    await expect(nextButton).toBeDisabled();
  });

  test('Should be able to set zoom duration', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    // Wait for image to load
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Find zoom duration setting (using el-input-number component)
    const durationInput = page.locator('.duration-control .el-input-number input').first();

    // Set zoom duration to 10 seconds
    await durationInput.fill('10');

    // Step 3: Verify setting has been applied
    await expect(durationInput).toHaveValue('10');
  });

  test('Should be able to draw selection area', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Draw selection area on Canvas
    const canvas = page.locator('canvas').first();
    const boundingBox = await canvas.boundingBox();

    if (boundingBox) {
      // Start dragging from center point to draw rectangle
      const startX = boundingBox.x + boundingBox.width * 0.3;
      const startY = boundingBox.y + boundingBox.height * 0.3;
      const endX = boundingBox.x + boundingBox.width * 0.7;
      const endY = boundingBox.y + boundingBox.height * 0.7;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY);
      await page.mouse.up();

      // Wait for selection to complete
      await page.waitForTimeout(300);
    }

    // Step 3: Verify play button should become enabled
    // (play button is only enabled after selection area exists)
    const playButton = page.locator('.floating-play-button button');
    await expect(playButton).toBeEnabled();
  });

  test('Should be able to toggle display mode', async ({ page }) => {
    // Step 1: Upload image and draw selection area
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Draw selection area
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

    // Step 2: Find display mode toggle button (mode-toggle)
    const modeToggleButton = page.locator('.mode-toggle button').first();

    // Step 3: Click to toggle mode (full -> selection -> none -> full)
    // First click: switch to selection mode
    await modeToggleButton.click();
    await page.waitForTimeout(300);

    // Second click: switch to none mode
    await modeToggleButton.click();
    await page.waitForTimeout(300);

    // Third click: switch back to full mode
    await modeToggleButton.click();
    await page.waitForTimeout(300);

    // Canvas should remain visible
    await expect(canvas).toBeVisible();
  });

  test('Should be able to execute zoom-extract animation and pause', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Draw selection area
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

    // Step 3: Set shorter zoom duration for testing
    const durationInput = page.locator('.duration-control .el-input-number input').first();
    await durationInput.fill('3');

    // Step 4: Start zoom animation
    const playButton = page.locator('.floating-play-button button');
    await playButton.click();

    // Step 5: Wait a moment to ensure animation has started
    await page.waitForTimeout(500);

    // Step 6: Pause animation
    await playButton.click();

    // Verify zoomCanvas (second canvas) is visible during isZooming
    const zoomCanvas = page.locator('canvas').nth(1);
    await expect(zoomCanvas).toBeVisible();
  });

  test('Should be able to display full image', async ({ page }) => {
    // Step 1: Upload image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);

    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Draw selection area
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

    // Step 3: Set shorter zoom duration
    const durationInput = page.locator('.duration-control .el-input-number input').first();
    await durationInput.fill('2');
    await page.waitForTimeout(200);

    // Step 4: Start zoom animation
    const playButton = page.locator('.floating-play-button button');
    await playButton.click();
    await page.waitForTimeout(300);

    // Step 5: Click "Show full image" button (only available during isZooming)
    const showFullButton = page.locator('.common-utils button').first();
    await expect(showFullButton).toBeEnabled({ timeout: 3000 });
    await showFullButton.click();
    await page.waitForTimeout(300);

    // Step 6: Verify back to full mode, mainCanvas should be visible
    await expect(mainCanvas).toBeVisible();
  });

  test('Should be able to upload multiple images and switch between them', async ({ page }) => {
    // Step 1: Upload first image
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    const testImagePath = path.join(__dirname, 'fixtures', 'test-image.svg');
    await fileInput.setInputFiles(testImagePath);
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Set zoom duration for first image
    const durationInput = page.locator('.duration-control .el-input-number input').first();
    await durationInput.fill('15');

    // Step 3: Upload second image
    // Use a different image (identical images will be deduped)
    const testImagePath2 = path.join(__dirname, 'fixtures', 'test-image-1.svg');
    await fileInput.setInputFiles(testImagePath2);
    await page.waitForTimeout(500);

    // Step 4: Verify currently at last item, next button is disabled
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
    // First execution will create baseline, subsequent runs will compare differences
    await expect(canvas).toHaveScreenshot('zoomer-canvas-initial.png', {
      maxDiffPixels: 100, // Allow minor pixel differences
    });
  });
});

/**
 * Performance tests: Ensure bulk operations don't cause memory leaks or performance issues
 */
test.describe('Zoomer functionality - Performance tests', () => {
  test('Should be able to quickly switch between multiple images', async ({ page }) => {
    await page.goto('/quiz-display-tool/zoomer');
    await page.waitForLoadState('networkidle');

    const fileInput = page.locator('input[type="file"][accept="image/*"]');

    // Prepare different test images (identical images will be deduped)
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

    // Verify upload time is reasonable (less than 5 seconds)
    expect(uploadTime).toBeLessThan(5000);

    // Verify Canvas is visible
    await expect(page.locator('canvas').first()).toBeVisible();

    // Test quick item switching
    // Currently should be at the last item, use Previous button to switch backwards
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
});
