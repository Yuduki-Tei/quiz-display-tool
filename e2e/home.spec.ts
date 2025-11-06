import { test, expect } from "@playwright/test";

/**
 * Basic navigation handling tests
 */

test.describe("Verify correct page loading for all pages", () => {
  test("Should be able to navigate to home page", async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto("/quiz-display-tool/");

    // Step 2: Wait for page to load
    await page.waitForLoadState("networkidle");

    // Step 3: Verify page title or content
    // Check if page loaded successfully
    await expect(page).toHaveURL(/quiz-display-tool/);

    // Step 4: Take screenshot of home page
    await page.screenshot({ path: "playwright-report/homepage.png" });
  });

  test("Should be able to navigate to Letter page", async ({ page }) => {
    // Navigate to Letter page
    await page.goto("/quiz-display-tool/text-panel");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Verify URL is correct
    await expect(page).toHaveURL(/text-panel/);

    // Check if file upload inputs exist
    const fileInputs = page.locator('input[type="file"]');
    const count = await fileInputs.count();

    console.log(`Found ${count} file upload buttons`);

    // Take screenshot of page
    await page.screenshot({ path: "playwright-report/letter-page.png" });
  });

  test("Should be able to navigate to Panel page", async ({ page }) => {
    await page.goto("/quiz-display-tool/panel");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/panel/);

    await page.screenshot({ path: "playwright-report/panel-page.png" });
  });

  test("Should be able to navigate to Zoomer page", async ({ page }) => {
    await page.goto("/quiz-display-tool/zoomer");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/zoomer/);

    await page.screenshot({ path: "playwright-report/zoomer-page.png" });
  });
});
