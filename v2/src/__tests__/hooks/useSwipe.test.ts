import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSwipe } from '../../hooks/useSwipe';

/**
 * Helper function to create a mock touch event with specified coordinates.
 * Used to simulate both touch start and touch end events.
 *
 * @param type - Event type ('touchstart' or 'touchend')
 * @param clientX - X coordinate of touch point
 * @param clientY - Y coordinate of touch point
 * @returns Mock touch event object
 */
function createTouchEvent(type: 'touchstart' | 'touchend', clientX: number, clientY: number) {
  const touches = type === 'touchstart' ? [{ clientX, clientY }] : [];
  const changedTouches = [{ clientX, clientY }];

  return {
    touches: touches as any,
    changedTouches: changedTouches as any,
  } as React.TouchEvent;
}

describe('useSwipe', () => {
  let onSwipeLeft: ReturnType<typeof vi.fn>;
  let onSwipeRight: ReturnType<typeof vi.fn>;
  let onSwipeDown: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSwipeLeft = vi.fn();
    onSwipeRight = vi.fn();
    onSwipeDown = vi.fn();
  });

  /**
   * Helper to cast mock functions to callbacks for the hook.
   * This allows using vi.fn() mocks while maintaining type safety.
   */
  const castToCallbacks = (left: ReturnType<typeof vi.fn>, right: ReturnType<typeof vi.fn>, down: ReturnType<typeof vi.fn>) => ({
    left: left as () => void,
    right: right as () => void,
    down: down as () => void,
  });

  describe('Basic swipe detection', () => {
    it('should detect left swipe with default threshold (50px)', () => {
      const { left, right, down } = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown);
      const { result } = renderHook(() =>
        useSwipe(left, right, down)
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();
      expect(onSwipeRight).not.toHaveBeenCalled();
      expect(onSwipeDown).not.toHaveBeenCalled();
    });

    it('should detect right swipe with default threshold (50px)', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 50, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 100, 100) as any);
      });

      expect(onSwipeRight).toHaveBeenCalledOnce();
      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeDown).not.toHaveBeenCalled();
    });

    it('should detect downward swipe with default threshold (50px)', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 100, 150) as any);
      });

      expect(onSwipeDown).toHaveBeenCalledOnce();
      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });
  });

  describe('Threshold enforcement', () => {
    it('should not trigger swipe if distance is below threshold', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 90, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
      expect(onSwipeDown).not.toHaveBeenCalled();
    });

    it('should respect custom threshold configuration', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down, { threshold: 100 }); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();

      onSwipeLeft.mockClear();
      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', -10, 100) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();
    });

    it('should trigger swipe at threshold distance boundary', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down, { threshold: 50 }); })()
      );

      // Test at exactly threshold distance (50px)
      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();
    });
  });

  describe('Direction isolation', () => {
    it('should ignore diagonal swipes (left movement with vertical movement)', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 40, 160) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeDown).not.toHaveBeenCalled();
    });

    it('should detect left swipe with minimal vertical movement', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 40, 90) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();
      expect(onSwipeDown).not.toHaveBeenCalled();
    });

    it('should detect down swipe with minimal horizontal movement', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 90, 160) as any);
      });

      expect(onSwipeDown).toHaveBeenCalledOnce();
      expect(onSwipeLeft).not.toHaveBeenCalled();
    });
  });

  describe('maxImages configuration', () => {
    it('should skip horizontal navigation when maxImages is 1', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down, { maxImages: 1 }); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should skip horizontal navigation when maxImages is 0', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down, { maxImages: 0 }); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should allow horizontal navigation when maxImages > 1', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down, { maxImages: 5 }); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();
    });

    it('should allow down swipe regardless of maxImages setting', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down, { maxImages: 1 }); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 100, 160) as any);
      });

      expect(onSwipeDown).toHaveBeenCalledOnce();
    });
  });

  describe('Edge cases and special scenarios', () => {
    it('should handle multiple swipes in sequence', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 40, 100) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();

      onSwipeLeft.mockClear();
      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 40, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 100, 100) as any);
      });

      expect(onSwipeRight).toHaveBeenCalledOnce();

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 100, 160) as any);
      });

      expect(onSwipeDown).toHaveBeenCalledOnce();
    });

    it('should handle touch end without prior touch start', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
      expect(onSwipeDown).not.toHaveBeenCalled();
    });

    it('should handle upward swipe (ignored)', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 100, 40) as any);
      });

      expect(onSwipeDown).not.toHaveBeenCalled();
      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    it('should handle very large swipe distances', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', -500, 100) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();
    });

    it('should handle zero movement (no swipe)', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 100, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
      expect(onSwipeDown).not.toHaveBeenCalled();
    });

    it('should reset state after touch end', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      onSwipeLeft.mockClear();

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 40, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();
    });
  });

  describe('Callback execution and independence', () => {
    it('should only call the triggered swipe callback', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();
      expect(onSwipeRight).not.toHaveBeenCalled();
      expect(onSwipeDown).not.toHaveBeenCalled();
    });
  });

  describe('Configuration combinations', () => {
    it('should work with both custom threshold and maxImages', () => {
      const { result } = renderHook(() => {
        const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown);
        return useSwipe(c.left, c.right, c.down, {
          threshold: 100,
          maxImages: 2,
        });
      });

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 60, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', -20, 100) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();
    });

    it('should enforce maxImages boundary even with sufficient swipe distance', () => {
      const { result } = renderHook(() => {
        const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown);
        return useSwipe(c.left, c.right, c.down, {
          threshold: 30,
          maxImages: 1,
        });
      });

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 100, 100) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 50, 100) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();
    });
  });

  describe('Touch event handler return values', () => {
    it('should return valid touch event handlers', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      expect(result.current).toHaveProperty('onTouchStart');
      expect(result.current).toHaveProperty('onTouchEnd');
      expect(typeof result.current.onTouchStart).toBe('function');
      expect(typeof result.current.onTouchEnd).toBe('function');
    });

    it('should return stable handler functions across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down); })()
      );

      const initialHandlers = result.current;

      rerender();

      expect(result.current.onTouchStart).toBe(initialHandlers.onTouchStart);
      expect(result.current.onTouchEnd).toBe(initialHandlers.onTouchEnd);
    });
  });

  describe('Practical usage scenarios', () => {
    it('should support image gallery navigation pattern', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down, { maxImages: 10 }); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 200, 300) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 140, 300) as any);
      });

      expect(onSwipeLeft).toHaveBeenCalledOnce();

      onSwipeLeft.mockClear();
      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 140, 300) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 200, 300) as any);
      });

      expect(onSwipeRight).toHaveBeenCalledOnce();
    });

    it('should support modal close pattern', () => {
      const { result } = renderHook(() =>
        (() => { const c = castToCallbacks(onSwipeLeft, onSwipeRight, onSwipeDown); return useSwipe(c.left, c.right, c.down, { maxImages: 1 }); })()
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 200, 300) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 140, 300) as any);
      });

      expect(onSwipeLeft).not.toHaveBeenCalled();

      act(() => {
        result.current.onTouchStart(createTouchEvent('touchstart', 200, 300) as any);
      });

      act(() => {
        result.current.onTouchEnd(createTouchEvent('touchend', 200, 400) as any);
      });

      expect(onSwipeDown).toHaveBeenCalledOnce();
    });
  });
});
