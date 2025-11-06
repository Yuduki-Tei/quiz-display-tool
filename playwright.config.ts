import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration
 * Used to test complete user experience, including file upload, Canvas rendering, etc.
 */
export default defineConfig({
  testDir: './e2e',

  /* Maximum test execution time */
  timeout: 30 * 1000,

  /* Number of retries per test */
  retries: process.env.CI ? 2 : 0,

  /* Number of parallel workers */
  workers: process.env.CI ? 1 : undefined,

  /* Test reporter */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  /* Shared configuration for all tests */
  use: {
    /* Base URL */
    baseURL: 'http://localhost:5173',

    /* Collect trace for debugging */
    trace: 'on-first-retry',

    /* Screenshot settings */
    screenshot: 'only-on-failure',

    /* Video recording */
    video: 'retain-on-failure',
  },

  /* Test project configuration - Chromium only */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Development server configuration */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
