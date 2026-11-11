import { defineConfig, devices } from '@playwright/test';

// Uses the Chrome already installed on this PC, so no browser download is needed.
export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4173/matchday/' },
  // Builds, then serves the built site, so tests always check what will be published.
  webServer: { command: 'npm run build && npm run preview', url: 'http://localhost:4173/matchday/', reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: 'desktop', use: { channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'iphone', use: { ...devices['iPhone 14'], defaultBrowserType: 'chromium', channel: 'chrome' } },
  ],
});
