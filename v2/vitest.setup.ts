import '@testing-library/jest-dom';
import 'vitest-axe/extend-expect';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, expect, vi } from 'vitest';
import { configureAxe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';

/**
 * Vitest setup file that runs before each test file.
 *
 * This file:
 * - Imports jest-dom matchers for enhanced DOM assertions
 * - Configures vitest-axe matchers for accessibility testing
 * - Configures automatic cleanup after each test
 * - Sets up global test environment
 * - Mocks window.matchMedia for useReducedMotion hook
 * - Configures axe-core for accessibility testing
 *
 * Note: i18next is initialized in the test environment detection within
 * i18next-config.ts which uses inline resources for testing.
 */

/**
 * Extend Vitest's expect with vitest-axe matchers for accessibility testing.
 */
expect.extend(matchers);

/**
 * Configure axe-core for accessibility testing.
 *
 * This enables comprehensive WCAG 2.2 Level AA compliance testing across all tests.
 * Key rules enabled:
 * - region: Ensures proper landmark structure
 * - color-contrast: WCAG 1.4.3 color contrast requirements
 * - landmark-one-main: Ensures single main landmark
 */
configureAxe({
  rules: {
    region: { enabled: true },
    'color-contrast': { enabled: true },
    'landmark-one-main': { enabled: true },
  },
});

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
 * Mock HTMLCanvasElement.getContext for icon rendering in tests.
 *
 * Some icon libraries and MUI components may attempt to use canvas for
 * rendering. This mock prevents errors in jsdom environments where canvas
 * is either not implemented or throws errors.
 */
beforeAll(() => {
  /**
   * Mock implementation of canvas getContext method.
   *
   * @param contextId - The context type (e.g., "2d")
   * @returns A mock canvas context object with common drawing methods
   */
  HTMLCanvasElement.prototype.getContext = vi.fn(
    (contextId: string) => {
      if (contextId === '2d') {
        return {
          fillRect: vi.fn(),
          clearRect: vi.fn(),
          getImageData: vi.fn(() => ({ data: [] })),
          putImageData: vi.fn(),
          createImageData: vi.fn(() => ({ data: [] })),
          setTransform: vi.fn(),
          drawImage: vi.fn(),
          save: vi.fn(),
          fillText: vi.fn(),
          restore: vi.fn(),
          beginPath: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          closePath: vi.fn(),
          stroke: vi.fn(),
          translate: vi.fn(),
          scale: vi.fn(),
          rotate: vi.fn(),
          arc: vi.fn(),
          fill: vi.fn(),
          measureText: vi.fn(() => ({ width: 0 })),
          transform: vi.fn(),
          rect: vi.fn(),
          clip: vi.fn(),
        } as unknown as CanvasRenderingContext2D;
      }
      return null;
    }
  ) as unknown as HTMLCanvasElement['getContext'];
});

/**
 * Mock IntersectionObserver for testing scroll-triggered animations.
 *
 * The IntersectionObserver API is used by useScrollAnimation hook to detect
 * when elements enter the viewport. This mock provides a basic implementation.
 */
beforeAll(() => {
  /**
   * Mock implementation of IntersectionObserver for testing.
   * Allows tests to trigger intersection callbacks manually.
   */
  class MockIntersectionObserver {
    /**
     * Callback invoked when intersection state changes.
     */
    callback: IntersectionObserverCallback;

    /**
     * Elements currently being observed.
     */
    observedElements: Set<Element> = new Set();

    /**
     * Creates a new MockIntersectionObserver instance.
     *
     * @param callback - Function to invoke on intersection changes
     */
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    /**
     * Start observing an element.
     *
     * @param element - Element to observe
     */
    observe(element: Element) {
      this.observedElements.add(element);
      // Immediately trigger callback with isIntersecting: true
      // This allows tests and animations to work in test environments
      const entry = {
        target: element,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry;
      this.callback([entry], this as unknown as IntersectionObserver);
    }

    /**
     * Stop observing an element.
     *
     * @param element - Element to stop observing
     */
    unobserve(element: Element) {
      this.observedElements.delete(element);
    }

    /**
     * Stop observing all elements.
     */
    disconnect() {
      this.observedElements.clear();
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
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
 * Suppress MUI sx kebab-case warnings in tests.
 *
 * MUI's sx validator warns about kebab-case in media query strings, but this is
 * a known limitation of using custom breakpoints. The warning doesn't affect
 * functionality, so we suppress it to keep test output clean.
 */
(() => {
  /**
   * Checks if a warning message should be suppressed.
   *
   * @param message - The warning message to check
   * @returns True if the message matches suppression criteria
   */
  const shouldSuppressWarning = (message: unknown) => {
    const text = String(message);
    return text.includes('Using kebab-case for css properties in objects is not supported');
  };

  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = vi.fn((...args: unknown[]) => {
    if (!shouldSuppressWarning(args[0])) {
      originalWarn.apply(console, args as []);
    }
  });

  console.error = vi.fn((...args: unknown[]) => {
    if (!shouldSuppressWarning(args[0])) {
      originalError.apply(console, args as []);
    }
  });
})();

/**
 * Cleanup after each test to prevent memory leaks and test pollution.
 * This ensures that each test starts with a clean DOM.
 */
afterEach(() => {
  cleanup();
  // Clear localStorage between tests to prevent test pollution
  localStorage.clear();
});
