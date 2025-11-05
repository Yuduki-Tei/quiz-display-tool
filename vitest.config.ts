import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

export default defineConfig({
  plugins: [vue() as any],
  test: {
    globals: true,
    environment: "happy-dom",
    exclude: ["node_modules/**", "dist/**", "e2e/**", "**/*.e2e.spec.ts"],
    silent: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/**/*.spec.ts", "src/**/*.test.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
