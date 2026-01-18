import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    globals: false,
    testTimeout: 10000,
    hookTimeout: 30000,
    globalSetup: ['./tests/global-setup.ts'],
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false,
    sequence: {
      hooks: 'stack'
    }
  }
})
