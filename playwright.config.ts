import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    browserName: 'chromium',
    headless: true,
    baseURL: 'http://localhost:3000',
  },
});
