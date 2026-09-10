import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    // `npm run dev` locally for speed. CI overrides this with `npm start` so
    // the share card tests read the same production HTML a scraper would,
    // rather than dev output that can differ.
    command: process.env.PLAYWRIGHT_WEB_SERVER ?? 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
    timeout: 60000,
  },
})
