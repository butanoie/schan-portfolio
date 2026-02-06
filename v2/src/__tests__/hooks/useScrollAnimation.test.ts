import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

describe('useScrollAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should return isInView as false initially', () => {
      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.isInView).toBe(false);
    });

    it('should return a ref object', () => {
      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.ref).toBeDefined();
      expect(result.current.ref.current).toBeNull();
    });

    it('should immediately return isInView as true when prefers-reduced-motion is enabled', () => {
      // Mock prefers-reduced-motion as enabled
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      global.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;

      const { result } = renderHook(() => useScrollAnimation());

      expect(result.current.isInView).toBe(true);
    });
  });

  describe('Accessibility: prefers-reduced-motion', () => {
    it('should return isInView immediately when prefers-reduced-motion is enabled', () => {
      // Mock prefers-reduced-motion
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      global.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;

      const { result } = renderHook(() => useScrollAnimation());

      // Should be true immediately even without intersection
      expect(result.current.isInView).toBe(true);

      // Verify it's using the mock
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should respect user changing motion preference at runtime', () => {
      let mockMatchMediaCallback: ((event: MediaQueryListEvent) => void) | null = null;

      /**
       * Mock addEventListener that captures the callback for testing.
       *
       * @param _event - Event name (unused)
       * @param callback - Callback function to register
       */
      const mockAddEventListener = (_event: string, callback: (event: MediaQueryListEvent) => void): void => {
        mockMatchMediaCallback = callback;
      };

      const mockMatchMedia = vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: query === '(prefers-reduced-motion: reduce)' ? mockAddEventListener : vi.fn(),
        removeEventListener: vi.fn(),
      }));
      global.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;

      const { result, rerender } = renderHook(() => useScrollAnimation());

      expect(result.current.isInView).toBe(false);

      // Simulate user enabling reduced motion
      if (mockMatchMediaCallback) {
        const event = new Event('change') as MediaQueryListEvent;
        Object.defineProperty(event, 'matches', { value: true });
        const cb: (event: MediaQueryListEvent) => void = mockMatchMediaCallback;

        act(() => {
          cb(event);
        });

        rerender();
        expect(result.current.isInView).toBe(true);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle ref being null on mount', () => {
      const { result } = renderHook(() => useScrollAnimation());

      // Don't attach ref to any element
      expect(result.current.ref.current).toBeNull();
      expect(result.current.isInView).toBe(false);
    });

    it('should handle rapid re-renders', () => {
      const { result, rerender } = renderHook(() => useScrollAnimation());

      const mockElement = document.createElement('div');
      (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = mockElement;

      // Multiple rapid re-renders
      rerender();
      rerender();
      rerender();

      expect(result.current.isInView).toBe(false);
    });
  });
});
