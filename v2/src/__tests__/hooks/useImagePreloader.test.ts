import { renderHook, act } from '../test-utils';
import { useImagePreloader } from '../../hooks/useImagePreloader';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Test suite for useImagePreloader hook.
 * Verifies image preloading, caching, timeout behavior, and adjacent preloading.
 */
describe('useImagePreloader', () => {
  /** Stores the original Image constructor for restoration after tests */
  let originalImage: typeof globalThis.Image;

  /** Mock onload/onerror handlers set by the mock Image constructor */
  let mockOnLoad: (() => void) | null;
  let mockOnError: (() => void) | null;
  /** Tracks the src set on the mock Image */
  let mockSrc: string | null;

  beforeEach(() => {
    vi.useFakeTimers();
    originalImage = globalThis.Image;
    mockOnLoad = null;
    mockOnError = null;
    mockSrc = null;

    /**
     * Mock Image constructor that captures onload/onerror/src assignments.
     * Allows tests to control when images "load" or "fail".
     */
    globalThis.Image = class MockImage {
      /** Captures the onload handler for test control. */
      set onload(fn: (() => void) | null) {
        mockOnLoad = fn;
      }
      /** Captures the onerror handler for test control. */
      set onerror(fn: (() => void) | null) {
        mockOnError = fn;
      }
      /** Records the src URL and triggers the browser fetch in production. */
      set src(val: string) {
        mockSrc = val;
      }
      /**
       * Returns the currently set src URL.
       *
       * @returns The mock src value or empty string
       */
      get src() {
        return mockSrc ?? '';
      }
    } as unknown as typeof globalThis.Image;
  });

  afterEach(() => {
    globalThis.Image = originalImage;
    vi.useRealTimers();
  });

  /**
   * Test: preloadImage resolves true on successful load
   */
  it('resolves true when image loads successfully', async () => {
    const { result } = renderHook(() => useImagePreloader());

    let resolved: boolean | undefined;

    act(() => {
      result.current.preloadImage('/test.jpg').then((val) => {
        resolved = val;
      });
    });

    // Simulate image load
    act(() => {
      mockOnLoad?.();
    });

    // Flush microtasks
    await vi.runAllTimersAsync();

    expect(resolved).toBe(true);
    expect(mockSrc).toBe('/test.jpg');
  });

  /**
   * Test: preloadImage resolves false on error
   */
  it('resolves false when image fails to load', async () => {
    const { result } = renderHook(() => useImagePreloader());

    let resolved: boolean | undefined;

    act(() => {
      result.current.preloadImage('/broken.jpg').then((val) => {
        resolved = val;
      });
    });

    // Simulate image error
    act(() => {
      mockOnError?.();
    });

    await vi.runAllTimersAsync();

    expect(resolved).toBe(false);
  });

  /**
   * Test: preloadImage resolves false on timeout
   */
  it('resolves false after timeout expires', async () => {
    const { result } = renderHook(() => useImagePreloader());

    let resolved: boolean | undefined;

    act(() => {
      result.current.preloadImage('/slow.jpg', 3000).then((val) => {
        resolved = val;
      });
    });

    // Advance past timeout
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await vi.runAllTimersAsync();

    expect(resolved).toBe(false);
  });

  /**
   * Test: Cached images resolve immediately without new Image request
   */
  it('resolves immediately for cached images', async () => {
    const { result } = renderHook(() => useImagePreloader());

    // First load
    let firstResolved = false;
    act(() => {
      result.current.preloadImage('/cached.jpg').then(() => {
        firstResolved = true;
      });
    });

    act(() => {
      mockOnLoad?.();
    });

    await vi.runAllTimersAsync();
    expect(firstResolved).toBe(true);

    // Reset mock to verify no new Image is created
    mockSrc = null;

    // Second load — should resolve from cache
    let secondResolved: boolean | undefined;
    await act(async () => {
      secondResolved = await result.current.preloadImage('/cached.jpg');
    });

    expect(secondResolved).toBe(true);
    // src should not be set again (no new Image request)
    expect(mockSrc).toBeNull();
  });

  /**
   * Test: onload after timeout is a no-op (settled guard)
   */
  it('ignores onload after timeout has fired', async () => {
    const { result } = renderHook(() => useImagePreloader());

    let resolved: boolean | undefined;

    act(() => {
      result.current.preloadImage('/slow.jpg', 1000).then((val) => {
        resolved = val;
      });
    });

    // Timeout fires first
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await vi.runAllTimersAsync();
    expect(resolved).toBe(false);

    // Late onload — should not change result
    act(() => {
      mockOnLoad?.();
    });

    await vi.runAllTimersAsync();
    // Still false (timeout already settled)
    expect(resolved).toBe(false);
  });

  /**
   * Installs a tracking MockImage on globalThis that records all src assignments.
   * Used by preloadAdjacent tests to verify which URLs are preloaded.
   *
   * @returns Array that accumulates each src URL set on mock Image instances
   */
  function installTrackingMockImage(): string[] {
    const srcAssignments: string[] = [];
    globalThis.Image = class TrackingMockImage {
      /** No-op onload setter — adjacent preloads are fire-and-forget. */
      set onload(_fn: (() => void) | null) { /* no-op */ }
      /** No-op onerror setter — adjacent preloads are fire-and-forget. */
      set onerror(_fn: (() => void) | null) { /* no-op */ }
      /** Records the src URL for assertion. */
      set src(val: string) {
        srcAssignments.push(val);
      }
      /**
       * Returns empty string — not used by tests.
       *
       * @returns Empty string placeholder
       */
      get src() {
        return '';
      }
    } as unknown as typeof globalThis.Image;
    return srcAssignments;
  }

  /**
   * Test: preloadAdjacent preloads prev and next images
   */
  it('preloads adjacent images for given index', () => {
    const { result } = renderHook(() => useImagePreloader());
    const urls = ['/a.jpg', '/b.jpg', '/c.jpg'];

    const srcAssignments = installTrackingMockImage();

    act(() => {
      result.current.preloadAdjacent(urls, 1);
    });

    // Should preload index 0 (/a.jpg) and index 2 (/c.jpg)
    expect(srcAssignments).toContain('/a.jpg');
    expect(srcAssignments).toContain('/c.jpg');
  });

  /**
   * Test: preloadAdjacent wraps around for first image
   */
  it('wraps around when preloading adjacent for first image', () => {
    const { result } = renderHook(() => useImagePreloader());
    const urls = ['/a.jpg', '/b.jpg', '/c.jpg'];

    const srcAssignments = installTrackingMockImage();

    act(() => {
      result.current.preloadAdjacent(urls, 0);
    });

    // Should preload last (/c.jpg) and second (/b.jpg)
    expect(srcAssignments).toContain('/c.jpg');
    expect(srcAssignments).toContain('/b.jpg');
  });

  /**
   * Test: preloadAdjacent is a no-op for single-image arrays
   */
  it('does not preload for single-image arrays', () => {
    const { result } = renderHook(() => useImagePreloader());

    const srcAssignments = installTrackingMockImage();

    act(() => {
      result.current.preloadAdjacent(['/only.jpg'], 0);
    });

    expect(srcAssignments).toHaveLength(0);
  });

  /**
   * Test: Uses default 5000ms timeout when not specified
   */
  it('uses default 5000ms timeout', async () => {
    const { result } = renderHook(() => useImagePreloader());

    let resolved: boolean | undefined;

    act(() => {
      result.current.preloadImage('/default-timeout.jpg').then((val) => {
        resolved = val;
      });
    });

    // Not yet timed out at 4999ms
    await act(async () => {
      vi.advanceTimersByTime(4999);
    });
    expect(resolved).toBeUndefined();

    // Times out at 5000ms
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(resolved).toBe(false);
  });
});
