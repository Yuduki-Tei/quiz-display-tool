import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 測試配置
 * 用於測試完整的使用者體驗，包括檔案上傳、Canvas 渲染等
 */
export default defineConfig({
  testDir: './e2e',

  /* 最大測試執行時間 */
  timeout: 30 * 1000,

  /* 每個測試重試次數 */
  retries: process.env.CI ? 2 : 0,

  /* 並行執行的 worker 數量 */
  workers: process.env.CI ? 1 : undefined,

  /* 測試報告 */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  /* 所有測試的共用配置 */
  use: {
    /* 基礎 URL */
    baseURL: 'http://localhost:5173',

    /* 收集 trace 以便除錯 */
    trace: 'on-first-retry',

    /* 截圖設定 */
    screenshot: 'only-on-failure',

    /* 影片錄製 */
    video: 'retain-on-failure',
  },

  /* 測試專案配置 - 只用 Chromium */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* 開發伺服器配置 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
