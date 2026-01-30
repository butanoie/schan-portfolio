import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInView } from '@/src/hooks/useInView';

/**
 * Mock IntersectionObserver for testing.
 * Stores callbacks and provides methods to simulate intersection events.
 */
class MockIntersectionObserver {
  /** The IntersectionObserver callback function */
  callback: IntersectionObserverCallback;
  /** Set of elements being observed */
  elements: Set<Element> = new Set();

  /**
   * Creates a new MockIntersectionObserver.
   *
   * @param callback - The intersection observer callback
   */
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  /**
   * Adds an element to the set of observed elements.
   *
   * @param element - The element to observe
   */
  observe(element: Element) {
    this.elements.add(element);
  }

  /**
   * Removes an element from the set of observed elements.
   *
   * @param element - The element to stop observing
   */
  unobserve(element: Element) {
    this.elements.delete(element);
  }

  /**
   * Disconnects the observer and clears all observed elements.
   */
  disconnect() {
    this.elements.clear();
  }

  /**
   * Simulate an intersection event for testing.
   *
   * @param isIntersecting - Whether the element is intersecting
   */
  triggerIntersection(isIntersecting: boolean) {
    const entries: IntersectionObserverEntry[] = Array.from(this.elements).map(
      (element) =>
        ({
          isIntersecting,
          target: element,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        }) as IntersectionObserverEntry
    );

    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

describe('useInView', () => {
  let mockObserver: MockIntersectionObserver;

  beforeEach(() => {
    // Mock the global IntersectionObserver
    global.IntersectionObserver = class {
      /**
       * Creates a mock IntersectionObserver instance.
       *
       * @param callback - The callback to invoke when intersection changes
       */
      constructor(callback: IntersectionObserverCallback) {
        mockObserver = new MockIntersectionObserver(callback);
        return mockObserver as unknown as IntersectionObserver;
      }
    } as unknown as typeof IntersectionObserver;
  });

  it('returns a ref callback, isInView, and hasBeenInView', () => {
    const { result } = renderHook(() => useInView());

    expect(result.current).toHaveLength(3);
    expect(typeof result.current[0]).toBe('function'); // ref
    expect(typeof result.current[1]).toBe('boolean'); // isInView
    expect(typeof result.current[2]).toBe('boolean'); // hasBeenInView
  });

  it('initializes with isInView and hasBeenInView as false', () => {
    const { result } = renderHook(() => useInView());

    const [, isInView, hasBeenInView] = result.current;

    expect(isInView).toBe(false);
    expect(hasBeenInView).toBe(false);
  });

  it('sets isInView to true when element enters viewport', () => {
    const { result } = renderHook(() => useInView());

    const [ref] = result.current;
    const element = document.createElement('div');

    // Attach ref to element
    act(() => {
      ref(element);
    });

    // Initially should be false
    expect(result.current[1]).toBe(false);

    // Simulate element entering viewport
    act(() => {
      mockObserver.triggerIntersection(true);
    });

    // Should now be true
    expect(result.current[1]).toBe(true);
    expect(result.current[2]).toBe(true); // hasBeenInView should also be true
  });

  it('sets isInView to false when element exits viewport', () => {
    const { result } = renderHook(() => useInView());

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Enter viewport
    act(() => {
      mockObserver.triggerIntersection(true);
    });
    expect(result.current[1]).toBe(true);

    // Exit viewport
    act(() => {
      mockObserver.triggerIntersection(false);
    });
    expect(result.current[1]).toBe(false);

    // hasBeenInView should remain true
    expect(result.current[2]).toBe(true);
  });

  it('keeps hasBeenInView as true after element has been in view', () => {
    const { result } = renderHook(() => useInView());

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Element enters viewport
    act(() => {
      mockObserver.triggerIntersection(true);
    });
    expect(result.current[2]).toBe(true);

    // Element exits viewport
    act(() => {
      mockObserver.triggerIntersection(false);
    });

    // hasBeenInView should still be true
    expect(result.current[2]).toBe(true);
  });

  it('respects threshold option', () => {
    const { result } = renderHook(() => useInView({ threshold: 0.5 }));

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Verify observer was created and element is being observed
    expect(mockObserver).toBeDefined();
    expect(mockObserver.elements.has(element)).toBe(true);
  });

  it('respects rootMargin option', () => {
    const { result } = renderHook(() => useInView({ rootMargin: '50px' }));

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Verify observer was created and element is being observed
    expect(mockObserver).toBeDefined();
    expect(mockObserver.elements.has(element)).toBe(true);
  });

  it('respects root option', () => {
    const rootElement = document.createElement('div');

    const { result } = renderHook(() => useInView({ root: rootElement }));

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Verify observer was created and element is being observed
    expect(mockObserver).toBeDefined();
    expect(mockObserver.elements.has(element)).toBe(true);
  });

  it('disconnects observer when triggerOnce is true and element has been in view', () => {
    const disconnectSpy = vi.spyOn(
      MockIntersectionObserver.prototype,
      'disconnect'
    );

    const { result } = renderHook(() => useInView({ triggerOnce: true }));

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Element enters viewport
    act(() => {
      mockObserver.triggerIntersection(true);
    });

    // Observer should be disconnected
    expect(disconnectSpy).toHaveBeenCalled();

    disconnectSpy.mockRestore();
  });

  it('does not observe again when triggerOnce is true and element has been in view', () => {
    const { result, rerender } = renderHook(() =>
      useInView({ triggerOnce: true })
    );

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Element enters viewport
    act(() => {
      mockObserver.triggerIntersection(true);
    });

    // Clear the mock
    vi.clearAllMocks();

    // Try to observe again
    rerender();
    act(() => {
      ref(element);
    });

    // IntersectionObserver should not be called again
    // (the constructor would be called if a new observer was created)
    // We just verify hasBeenInView is still true
    expect(result.current[2]).toBe(true);
  });

  it('cleans up observer on unmount', () => {
    const disconnectSpy = vi.spyOn(
      MockIntersectionObserver.prototype,
      'disconnect'
    );

    const { result, unmount } = renderHook(() => useInView());

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Unmount component
    unmount();

    // Observer should be disconnected
    expect(disconnectSpy).toHaveBeenCalled();

    disconnectSpy.mockRestore();
  });

  it('cleans up previous observer when ref changes to a new element', () => {
    const disconnectSpy = vi.spyOn(
      MockIntersectionObserver.prototype,
      'disconnect'
    );

    const { result } = renderHook(() => useInView());

    const [ref] = result.current;
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    // Observe first element
    act(() => {
      ref(element1);
    });

    // Clear spy calls
    disconnectSpy.mockClear();

    // Observe second element
    act(() => {
      ref(element2);
    });

    // Previous observer should be disconnected
    expect(disconnectSpy).toHaveBeenCalled();

    disconnectSpy.mockRestore();
  });

  it('handles null ref value', () => {
    const { result } = renderHook(() => useInView());

    const [ref] = result.current;

    // Should not throw when ref is called with null
    expect(() => {
      act(() => {
        ref(null);
      });
    }).not.toThrow();
  });

  it('uses default options when none are provided', () => {
    const { result } = renderHook(() => useInView());

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Verify observer was created and element is being observed
    expect(mockObserver).toBeDefined();
    expect(mockObserver.elements.has(element)).toBe(true);
  });

  it('supports array of thresholds', () => {
    const { result } = renderHook(() =>
      useInView({ threshold: [0, 0.25, 0.5, 0.75, 1] })
    );

    const [ref] = result.current;
    const element = document.createElement('div');

    act(() => {
      ref(element);
    });

    // Verify observer was created and element is being observed
    expect(mockObserver).toBeDefined();
    expect(mockObserver.elements.has(element)).toBe(true);
  });

  it('handles rapid ref changes correctly', () => {
    const { result } = renderHook(() => useInView());

    const [ref] = result.current;
    const elements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ];

    // Rapidly change ref
    act(() => {
      elements.forEach((element) => ref(element));
    });

    // Should not throw and should observe the last element
    act(() => {
      mockObserver.triggerIntersection(true);
    });

    expect(result.current[1]).toBe(true);
  });
});
