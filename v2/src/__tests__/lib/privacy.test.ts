/**
 * Tests for the shared privacy utility module.
 *
 * Verifies:
 * - Returns false during SSR (no `window`)
 * - Returns true when DNT is "1" or "yes"
 * - Returns false when DNT is null/unset
 * - Handles the legacy `window.doNotTrack` property
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isDoNotTrackEnabled } from '@/src/lib/privacy';

/**
 * Sets navigator.doNotTrack to the given value.
 *
 * @param value - The DNT value to set (e.g., "1", "yes", or null)
 */
function setDoNotTrack(value: string | null): void {
  Object.defineProperty(navigator, 'doNotTrack', {
    value,
    writable: true,
    configurable: true,
  });
}

describe('isDoNotTrackEnabled', () => {
  beforeEach(() => {
    setDoNotTrack(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false during SSR (no window)', () => {
    // Temporarily remove window to simulate SSR
    const originalWindow = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window = undefined;

    try {
      expect(isDoNotTrackEnabled()).toBe(false);
    } finally {
      // Restore window even if assertion fails
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).window = originalWindow;
    }
  });

  it('should return true when DNT is "1"', () => {
    setDoNotTrack('1');
    expect(isDoNotTrackEnabled()).toBe(true);
  });

  it('should return true when DNT is "yes"', () => {
    setDoNotTrack('yes');
    expect(isDoNotTrackEnabled()).toBe(true);
  });

  it('should return false when DNT is null', () => {
    setDoNotTrack(null);
    expect(isDoNotTrackEnabled()).toBe(false);
  });

  it('should return false when DNT is "0" (explicitly disabled)', () => {
    setDoNotTrack('0');
    expect(isDoNotTrackEnabled()).toBe(false);
  });

  it('should return true when navigator.doNotTrack is null but window.doNotTrack is "1" (legacy IE/Edge)', () => {
    setDoNotTrack(null);
    Object.defineProperty(window, 'doNotTrack', {
      value: '1',
      writable: true,
      configurable: true,
    });

    try {
      expect(isDoNotTrackEnabled()).toBe(true);
    } finally {
      // Clean up legacy property even if assertion fails
      Object.defineProperty(window, 'doNotTrack', {
        value: undefined,
        writable: true,
        configurable: true,
      });
    }
  });
});
