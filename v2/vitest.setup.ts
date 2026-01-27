import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Vitest setup file that runs before each test file.
 *
 * This file:
 * - Imports jest-dom matchers for enhanced DOM assertions
 * - Configures automatic cleanup after each test
 * - Sets up global test environment
 */

/**
 * Cleanup after each test to prevent memory leaks and test pollution.
 * This ensures that each test starts with a clean DOM.
 */
afterEach(() => {
  cleanup();
});
