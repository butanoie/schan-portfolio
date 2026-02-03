import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

/**
 * Vitest setup file that runs before each test file.
 *
 * This file:
 * - Imports jest-dom matchers for enhanced DOM assertions
 * - Configures automatic cleanup after each test
 * - Sets up global test environment
 * - Mocks window.matchMedia for useReducedMotion hook
 */

/**
 * Mock window.matchMedia for media query testing.
 * jsdom doesn't implement matchMedia by default, so we provide a mock.
 * This is essential for useReducedMotion hook and responsive components.
 */
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
});

/**
 * Cleanup after each test to prevent memory leaks and test pollution.
 * This ensures that each test starts with a clean DOM.
 */
afterEach(() => {
  cleanup();
});
