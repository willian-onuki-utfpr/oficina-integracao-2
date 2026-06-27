import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'icr6ib',
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(_on, _config) {},
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    env: {
      apiUrl: 'http://localhost:3000',
    },
  },
});
