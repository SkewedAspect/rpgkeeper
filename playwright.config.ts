//----------------------------------------------------------------------------------------------------------------------
// Playwright Configuration
//----------------------------------------------------------------------------------------------------------------------

import { defineConfig, devices } from '@playwright/test';

//----------------------------------------------------------------------------------------------------------------------

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Single worker for stability with dev server
    reporter: 'html',

    use: {
        // Base URL for all tests - assumes dev server is running
        baseURL: 'http://localhost:5678',

        // Collect trace on first retry
        trace: 'on-first-retry',

        // Screenshot on failure
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    // Run local dev server before starting tests (optional - can also run manually)
    // webServer: {
    //     command: 'npm run dev',
    //     url: 'http://localhost:5678',
    //     reuseExistingServer: !process.env.CI,
    // },
});

//----------------------------------------------------------------------------------------------------------------------
