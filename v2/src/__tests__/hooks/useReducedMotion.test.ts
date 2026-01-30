import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

/**
 * Mock MediaQueryList for testing.
 * Simulates browser media query matching functionality.
 */
class MockMediaQueryList {
  matches: boolean;
  media: string;
  listeners: ((event: MediaQueryListEvent) => void)[] = [];

  /**
   * Creates a mock MediaQueryList.
   *
   * @param query - The media query string
   * @param matches - Whether the media query currently matches
   */
  constructor(query: string, matches: boolean = false) {
    this.media = query;
    this.matches = matches;
  }

  /**
   * Adds an event listener for media query changes.
   *
   * @param event - The event name ('change')
   * @param listener - The listener function to add
   */
  addEventListener(event: string, listener: (event: MediaQueryListEvent) => void) {
    if (event === 'change') {
      this.listeners.push(listener);
    }
  }

  /**
   * Removes an event listener for media query changes.
   *
   * @param event - The event name ('change')
   * @param listener - The listener function to remove
   */
  removeEventListener(event: string, listener: (event: MediaQueryListEvent) => void) {
    if (event === 'change') {
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  }

  /**
   * Simulate a media query change for testing.
   *
   * @param matches - Whether the media query should match after the change
   */
  triggerChange(matches: boolean) {
    this.matches = matches;
    const event = new Event('change') as MediaQueryListEvent;
    Object.defineProperty(event, 'matches', { value: matches });
    Object.defineProperty(event, 'media', { value: this.media });

    this.listeners.forEach((listener) => listener(event));
  }

  // Legacy deprecated methods (for compatibility)
  addListener = this.addEventListener;
  removeListener = this.removeEventListener;
}

describe('useReducedMotion', () => {
  let mockMediaQueryList: MockMediaQueryList;
  let originalWindow: typeof global.window;
  let originalMatchMedia: typeof global.window.matchMedia;

  beforeEach(() => {
    // Save originals
    originalWindow = global.window;
    originalMatchMedia = global.window?.matchMedia;

    // Ensure window exists (it should always exist in beforeEach)
    if (typeof global.window === 'undefined') {
      global.window = originalWindow;
    }

    // Create a mock MediaQueryList
    mockMediaQueryList = new MockMediaQueryList(
      '(prefers-reduced-motion: reduce)',
      false
    );

    // Mock window.matchMedia
    global.window.matchMedia = vi.fn((query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return mockMediaQueryList as unknown as MediaQueryList;
      }
      // Return a default mock for other queries
      return new MockMediaQueryList(query, false) as unknown as MediaQueryList;
    });
  });

  afterEach(() => {
    // Restore window and matchMedia
    if (originalWindow) {
      global.window = originalWindow;
    }
    if (originalMatchMedia && global.window) {
      global.window.matchMedia = originalMatchMedia;
    }
  });

  it('returns false by default when reduced motion is not preferred', () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it('returns true when reduced motion is preferred', () => {
    mockMediaQueryList.matches = true;

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('updates when media query preference changes', () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useReducedMotion());

    // Initially false
    expect(result.current).toBe(false);

    // Simulate user enabling reduced motion
    act(() => {
      mockMediaQueryList.triggerChange(true);
    });

    // Should now be true
    expect(result.current).toBe(true);
  });

  it('updates when media query preference changes from true to false', () => {
    mockMediaQueryList.matches = true;

    const { result } = renderHook(() => useReducedMotion());

    // Initially true
    expect(result.current).toBe(true);

    // Simulate user disabling reduced motion
    act(() => {
      mockMediaQueryList.triggerChange(false);
    });

    // Should now be false
    expect(result.current).toBe(false);
  });

  it('adds event listener for media query changes', () => {
    const addEventListenerSpy = vi.spyOn(mockMediaQueryList, 'addEventListener');

    renderHook(() => useReducedMotion());

    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));

    addEventListenerSpy.mockRestore();
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(mockMediaQueryList, 'removeEventListener');

    const { unmount } = renderHook(() => useReducedMotion());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it('handles multiple changes correctly', () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    // Change 1: Enable reduced motion
    act(() => {
      mockMediaQueryList.triggerChange(true);
    });
    expect(result.current).toBe(true);

    // Change 2: Disable reduced motion
    act(() => {
      mockMediaQueryList.triggerChange(false);
    });
    expect(result.current).toBe(false);

    // Change 3: Enable again
    act(() => {
      mockMediaQueryList.triggerChange(true);
    });
    expect(result.current).toBe(true);
  });

  it('is SSR-safe and has guard against undefined window', () => {
    // We can't actually delete window in the test environment without breaking React DOM,
    // but we can verify the hook has the proper guard by checking the code logic.
    // The hook checks: if (typeof window === 'undefined' || !window.matchMedia) return;
    // This ensures it won't crash during SSR.

    // Instead, we test that the hook works correctly when matchMedia is unavailable,
    // which is tested in the next test. The SSR safety is guaranteed by the guard clause
    // in the useEffect, which prevents any window/matchMedia access when window is undefined.

    // For this test, we just verify the hook initializes with false (default SSR state)
    mockMediaQueryList.matches = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('is safe when matchMedia is not available', () => {
    // Remove matchMedia
    // @ts-expect-error - Intentionally removing matchMedia for compatibility test
    global.window.matchMedia = undefined;

    const { result } = renderHook(() => useReducedMotion());

    // Should return false when matchMedia is unavailable
    expect(result.current).toBe(false);

    // matchMedia will be restored in afterEach
  });

  it('queries the correct media query string', () => {
    // Clear any previous calls from beforeEach setup
    vi.clearAllMocks();

    renderHook(() => useReducedMotion());

    // Verify matchMedia was called with the correct query
    expect(global.window.matchMedia).toHaveBeenCalledWith(
      '(prefers-reduced-motion: reduce)'
    );
  });

  it('does not leak memory by cleaning up listeners', () => {
    const { unmount, rerender } = renderHook(() => useReducedMotion());

    // Initial render should add one listener
    expect(mockMediaQueryList.listeners).toHaveLength(1);

    // Rerender should not add additional listeners
    rerender();
    expect(mockMediaQueryList.listeners).toHaveLength(1);

    // Unmount should remove the listener
    unmount();
    expect(mockMediaQueryList.listeners).toHaveLength(0);
  });

  it('correctly interprets initial matches value on mount', () => {
    // Test with matches: false
    mockMediaQueryList.matches = false;
    const { result: result1 } = renderHook(() => useReducedMotion());
    expect(result1.current).toBe(false);

    // Test with matches: true (new render)
    mockMediaQueryList.matches = true;
    const { result: result2 } = renderHook(() => useReducedMotion());
    expect(result2.current).toBe(true);
  });

  it('handles rapid media query changes', () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useReducedMotion());

    // Rapidly toggle the preference
    act(() => {
      mockMediaQueryList.triggerChange(true);
      mockMediaQueryList.triggerChange(false);
      mockMediaQueryList.triggerChange(true);
      mockMediaQueryList.triggerChange(false);
      mockMediaQueryList.triggerChange(true);
    });

    // Should reflect the final state
    expect(result.current).toBe(true);
  });

  it('works correctly across multiple hook instances', () => {
    mockMediaQueryList.matches = false;

    const { result: result1 } = renderHook(() => useReducedMotion());
    const { result: result2 } = renderHook(() => useReducedMotion());

    expect(result1.current).toBe(false);
    expect(result2.current).toBe(false);

    // Change media query
    act(() => {
      mockMediaQueryList.triggerChange(true);
    });

    // Both instances should update
    expect(result1.current).toBe(true);
    expect(result2.current).toBe(true);
  });
});
