/**
 * Playwright configuration for E2E testing.
 *
 * Runs tests against a production build (`next start`) on Chromium and WebKit.
 * All page.goto() calls use relative paths resolved against baseURL.
 *
 * @see {@link https://playwright.dev/docs/test-configuration} Playwright configuration docs
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  outputDir: './e2e/test-results',
  reporter: [['html', { outputFolder: 'e2e/reports/html' }], ['list']],

  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run start -- -p 3100',
    port: 3100,
    reuseExistingServer: false,
  },

  globalSetup: './e2e/global-setup.ts',
});
