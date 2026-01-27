import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest configuration for testing Next.js application.
 *
 * This configuration enables:
 * - React component testing with Testing Library
 * - TypeScript support with path aliases
 * - JSDOM environment for DOM testing
 * - Code coverage reporting with v8
 * - Global test utilities
 */
export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment for DOM testing
    environment: 'jsdom',

    // Global test utilities (describe, it, expect, etc.)
    globals: true,

    // Setup files to run before each test file
    setupFiles: ['./vitest.setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'out/',
        'coverage/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/types/**',
        '**/__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      // Aim for 80% coverage as per modernization plan
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    // Include test files
    include: ['**/__tests__/**/*.{test,spec}.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],

    // Exclude files from testing
    exclude: [
      'node_modules',
      '.next',
      'out',
      'coverage',
      '**/*.config.{js,ts}',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
