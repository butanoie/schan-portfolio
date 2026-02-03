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
  /**
   * Mock implementation of window.matchMedia for testing environments.
   *
   * @param {string} query - The media query string to test
   * @returns {MediaQueryList} A mock MediaQueryList object with required properties and methods
   */
  const mockMatchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    /** Mock listener registration method */
    addListener: () => {},
    /** Mock listener removal method */
    removeListener: () => {},
    /** Mock event listener registration method */
    addEventListener: () => {},
    /** Mock event listener removal method */
    removeEventListener: () => {},
    /** Mock event dispatch method */
    dispatchEvent: () => {},
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
});

/**
 * Cleanup after each test to prevent memory leaks and test pollution.
 * This ensures that each test starts with a clean DOM.
 */
afterEach(() => {
  cleanup();
});
