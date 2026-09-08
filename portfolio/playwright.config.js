import { defineConfig } from '@playwright/test'

const url = 'http://127.0.0.1:5174'

export default defineConfig({
  testDir: './tests',
  workers: 1,
  reporter: 'list',
  timeout: 15_000,
  expect: { timeout: 3_000 },
  use: {
    baseURL: url,
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  // Tests start their own local server and stop it when they finish.
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
    url,
    reuseExistingServer: false,
  },
})
