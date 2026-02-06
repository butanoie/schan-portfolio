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
 *
 * Note: i18next is initialized in the test environment detection within
 * i18next-config.ts which uses inline resources for testing.
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
 * Mock localStorage for testing environments.
 *
 * jsdom provides basic localStorage, but we need to ensure it's properly configured.
 * This provides a complete mock implementation that works reliably in tests.
 *
 * @returns A mock Storage object with all required methods
 */
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    /**
     * Get an item from localStorage.
     *
     * @param key - The key to retrieve
     * @returns The stored value or null if not found
     */
    getItem: (key: string) => store[key] || null,

    /**
     * Set an item in localStorage.
     *
     * @param key - The key to store under
     * @param value - The value to store
     */
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },

    /**
     * Remove an item from localStorage.
     *
     * @param key - The key to remove
     */
    removeItem: (key: string) => {
      delete store[key];
    },

    /**
     * Clear all items from localStorage.
     */
    clear: () => {
      store = {};
    },

    /**
     * Get a key at a specific index.
     *
     * @param index - The index to retrieve
     * @returns The key at that index or null
     */
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },

    /**
     * Get the number of items in localStorage.
     *
     * @returns The number of items currently in storage
     */
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

/**
 * Cleanup after each test to prevent memory leaks and test pollution.
 * This ensures that each test starts with a clean DOM.
 */
afterEach(() => {
  cleanup();
  // Clear localStorage between tests to prevent test pollution
  localStorage.clear();
});
