import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Mock implementation of MediaQueryList for testing.
 * This allows us to simulate different motion preferences and
 * trigger changes to test the hook's reactivity.
 */
class MockMediaQueryList {
  matches: boolean;
  listeners: Set<(event: MediaQueryListEvent) => void> = new Set();

  constructor(matches: boolean) {
    this.matches = matches;
  }

  addEventListener(
    _event: string,
    listener: (event: MediaQueryListEvent) => void
  ) {
    this.listeners.add(listener);
  }

  removeEventListener(
    _event: string,
    listener: (event: MediaQueryListEvent) => void
  ) {
    this.listeners.delete(listener);
  }

  /**
   * Simulate user changing their motion preference.
   * Triggers all registered listeners with new preference value.
   *
   * @param matches - New motion preference (true = reduce motion)
   */
  triggerChange(matches: boolean) {
    this.matches = matches;
    const event = new Event('change') as MediaQueryListEvent;
    Object.defineProperty(event, 'matches', { value: matches });
    this.listeners.forEach((listener) => listener(event));
  }
}

describe('useReducedMotion', () => {
  let mockMediaQuery: MockMediaQueryList;

  beforeEach(() => {
    // Create mock that returns reduced motion disabled by default
    mockMediaQuery = new MockMediaQueryList(false);

    // Mock window.matchMedia
    global.matchMedia = vi.fn((query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return mockMediaQuery as any;
      }
      throw new Error(`Unexpected matchMedia query: ${query}`);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should return false when user has not enabled reduced motion', () => {
      mockMediaQuery.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);
    });

    it('should return true when user has enabled reduced motion', () => {
      mockMediaQuery.matches = true;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);
    });

    it('should query the correct media query', () => {
      renderHook(() => useReducedMotion());

      expect(global.matchMedia).toHaveBeenCalledWith(
        '(prefers-reduced-motion: reduce)'
      );
    });
  });

  describe('Media query changes', () => {
    it('should update state when user enables reduced motion', () => {
      mockMediaQuery.matches = false;
      const { result, rerender } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);

      // Simulate user enabling reduced motion
      act(() => {
        mockMediaQuery.triggerChange(true);
      });

      rerender();

      expect(result.current).toBe(true);
    });

    it('should update state when user disables reduced motion', () => {
      mockMediaQuery.matches = true;
      const { result, rerender } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);

      // Simulate user disabling reduced motion
      act(() => {
        mockMediaQuery.triggerChange(false);
      });

      rerender();

      expect(result.current).toBe(false);
    });

    it('should handle multiple preference changes', () => {
      mockMediaQuery.matches = false;
      const { result, rerender } = renderHook(() => useReducedMotion());

      const changes = [true, false, true, false];

      for (const preference of changes) {
        act(() => {
          mockMediaQuery.triggerChange(preference);
        });
        rerender();
        expect(result.current).toBe(preference);
      }
    });
  });

  describe('Event listener management', () => {
    it('should add event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(mockMediaQuery, 'addEventListener');

      renderHook(() => useReducedMotion());

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(
        mockMediaQuery,
        'removeEventListener'
      );

      const { unmount } = renderHook(() => useReducedMotion());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('should not have multiple listeners after multiple renders', () => {
      const addEventListenerSpy = vi.spyOn(mockMediaQuery, 'addEventListener');

      const { rerender } = renderHook(() => useReducedMotion());

      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

      // Re-render multiple times
      rerender();
      rerender();
      rerender();

      // Should still only have been called once (effect dependency array prevents multiple additions)
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hook stability', () => {
    it('should return consistent value without re-rendering on non-change', () => {
      mockMediaQuery.matches = false;
      const { result, rerender } = renderHook(() => useReducedMotion());

      const initialResult = result.current;

      // Re-render without changing preference
      rerender();

      expect(result.current).toBe(initialResult);
    });

    it('should work correctly when hook is used multiple times', () => {
      mockMediaQuery.matches = false;

      const { result: result1 } = renderHook(() => useReducedMotion());
      const { result: result2 } = renderHook(() => useReducedMotion());

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(false);

      // Change preference
      act(() => {
        mockMediaQuery.triggerChange(true);
      });

      expect(result1.current).toBe(true);
      expect(result2.current).toBe(true);
    });
  });

  describe('Accessibility compliance', () => {
    it('should respect WCAG 2.2 prefers-reduced-motion standard', () => {
      // This test verifies the hook queries the correct W3C standard media query
      mockMediaQuery.matches = true;

      const { result } = renderHook(() => useReducedMotion());

      // When user has enabled reduce motion in OS/browser, hook should return true
      expect(result.current).toBe(true);

      // This allows components to disable animations/transitions as required by:
      // WCAG 2.2 Success Criterion 2.3.3 Animation from Interactions
      // https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions
    });

    it('should update immediately when user changes system preference', () => {
      mockMediaQuery.matches = false;
      const { result, rerender } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);

      // Simulate user changing system settings without page reload
      act(() => {
        mockMediaQuery.triggerChange(true);
      });

      rerender();

      // Hook should immediately reflect new preference
      expect(result.current).toBe(true);
    });
  });

  describe('SSR compatibility', () => {
    it('should have safe default on initial render', () => {
      // Before effect runs (SSR scenario), default state should be false
      // This is safe because it allows motion by default
      mockMediaQuery.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      // Should return a boolean, not undefined or null
      expect(typeof result.current).toBe('boolean');
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid preference changes', () => {
      mockMediaQuery.matches = false;
      const { result, rerender } = renderHook(() => useReducedMotion());

      // Simulate rapid changes (e.g., user toggling setting quickly)
      for (let i = 0; i < 10; i++) {
        act(() => {
          mockMediaQuery.triggerChange(i % 2 === 0);
        });
        rerender();
      }

      // Final state should be correct (even index = false)
      expect(result.current).toBe(false);
    });

    it('should not leak memory on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(
        mockMediaQuery,
        'removeEventListener'
      );

      const { unmount } = renderHook(() => useReducedMotion());

      // Verify listener cleanup
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalled();
      expect(mockMediaQuery.listeners.size).toBe(0);
    });
  });

  describe('Component integration scenarios', () => {
    it('should work for disabling animations', () => {
      mockMediaQuery.matches = true;

      const { result } = renderHook(() => useReducedMotion());

      // When true, component would use no transition
      const transitionStyle = result.current ? 'none' : 'opacity 0.3s ease-in';

      expect(transitionStyle).toBe('none');
    });

    it('should work for conditional animation logic', () => {
      mockMediaQuery.matches = false;

      const { result, rerender } = renderHook(() => useReducedMotion());

      // Component would use animation duration
      let animationDuration = result.current ? 0 : 300;
      expect(animationDuration).toBe(300);

      // User enables reduced motion
      act(() => {
        mockMediaQuery.triggerChange(true);
      });

      rerender();

      // Component updates animation settings
      animationDuration = result.current ? 0 : 300;
      expect(animationDuration).toBe(0);
    });
  });
});
