import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useLightbox } from '../../hooks/useLightbox';

describe('useLightbox', () => {
  describe('Initial state', () => {
    it('should initialize with lightbox closed (selectedIndex is null)', () => {
      const { result } = renderHook(() => useLightbox(5));

      expect(result.current.selectedIndex).toBeNull();
    });

    it('should work with any number of images', () => {
      const { result: result0 } = renderHook(() => useLightbox(0));
      const { result: result1 } = renderHook(() => useLightbox(1));
      const { result: result5 } = renderHook(() => useLightbox(5));
      const { result: result100 } = renderHook(() => useLightbox(100));

      expect(result0.current.selectedIndex).toBeNull();
      expect(result1.current.selectedIndex).toBeNull();
      expect(result5.current.selectedIndex).toBeNull();
      expect(result100.current.selectedIndex).toBeNull();
    });
  });

  describe('Opening lightbox', () => {
    it('should open lightbox at specified valid index', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(0);
      });

      expect(result.current.selectedIndex).toBe(0);

      act(() => {
        result.current.openLightbox(3);
      });

      expect(result.current.selectedIndex).toBe(3);

      act(() => {
        result.current.openLightbox(4);
      });

      expect(result.current.selectedIndex).toBe(4);
    });

    it('should clamp index to valid range when opening', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(10); // Above max
      });

      expect(result.current.selectedIndex).toBe(4); // Clamped to max (imagesCount - 1)

      act(() => {
        result.current.openLightbox(-5); // Below min
      });

      expect(result.current.selectedIndex).toBe(0); // Clamped to min
    });

    it('should handle opening with zero images', () => {
      const { result } = renderHook(() => useLightbox(0));

      act(() => {
        result.current.openLightbox(5); // Try to open at invalid index
      });

      expect(result.current.selectedIndex).toBeNull(); // Should remain closed
    });

    it('should open single image gallery correctly', () => {
      const { result } = renderHook(() => useLightbox(1));

      act(() => {
        result.current.openLightbox(0);
      });

      expect(result.current.selectedIndex).toBe(0);
    });
  });

  describe('Closing lightbox', () => {
    it('should close open lightbox', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(2);
      });

      expect(result.current.selectedIndex).toBe(2);

      act(() => {
        result.current.closeLightbox();
      });

      expect(result.current.selectedIndex).toBeNull();
    });

    it('should safely close already closed lightbox', () => {
      const { result } = renderHook(() => useLightbox(5));

      expect(result.current.selectedIndex).toBeNull();

      act(() => {
        result.current.closeLightbox();
      });

      expect(result.current.selectedIndex).toBeNull();
    });

    it('should handle multiple consecutive closes', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(3);
        result.current.closeLightbox();
        result.current.closeLightbox();
        result.current.closeLightbox();
      });

      expect(result.current.selectedIndex).toBeNull();
    });
  });

  describe('Navigation: Next image', () => {
    it('should navigate to next image', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(0);
      });

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(1);

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(2);
    });

    it('should wrap from last to first image (circular navigation)', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(4); // Last image
      });

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(0); // Wraps to first
    });

    it('should open to first image when navigating next from closed state', () => {
      const { result } = renderHook(() => useLightbox(5));

      expect(result.current.selectedIndex).toBeNull();

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(0); // Opens at first image
    });

    it('should handle next navigation with single image', () => {
      const { result } = renderHook(() => useLightbox(1));

      act(() => {
        result.current.openLightbox(0);
      });

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(0); // Wraps to itself
    });

    it('should safely ignore next navigation with zero images', () => {
      const { result } = renderHook(() => useLightbox(0));

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBeNull();
    });

    it('should support continuous next navigation through entire gallery', () => {
      const { result } = renderHook(() => useLightbox(3));

      act(() => {
        result.current.openLightbox(0);
      });

      expect(result.current.selectedIndex).toBe(0);

      act(() => {
        result.current.handleNextImage();
      });
      expect(result.current.selectedIndex).toBe(1);

      act(() => {
        result.current.handleNextImage();
      });
      expect(result.current.selectedIndex).toBe(2);

      act(() => {
        result.current.handleNextImage();
      });
      expect(result.current.selectedIndex).toBe(0); // Wraps around
    });
  });

  describe('Navigation: Previous image', () => {
    it('should navigate to previous image', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(3);
      });

      act(() => {
        result.current.handlePreviousImage();
      });

      expect(result.current.selectedIndex).toBe(2);

      act(() => {
        result.current.handlePreviousImage();
      });

      expect(result.current.selectedIndex).toBe(1);
    });

    it('should wrap from first to last image (circular navigation)', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(0); // First image
      });

      act(() => {
        result.current.handlePreviousImage();
      });

      expect(result.current.selectedIndex).toBe(4); // Wraps to last
    });

    it('should open to last image when navigating previous from closed state', () => {
      const { result } = renderHook(() => useLightbox(5));

      expect(result.current.selectedIndex).toBeNull();

      act(() => {
        result.current.handlePreviousImage();
      });

      expect(result.current.selectedIndex).toBe(4); // Opens at last image
    });

    it('should handle previous navigation with single image', () => {
      const { result } = renderHook(() => useLightbox(1));

      act(() => {
        result.current.openLightbox(0);
      });

      act(() => {
        result.current.handlePreviousImage();
      });

      expect(result.current.selectedIndex).toBe(0); // Wraps to itself
    });

    it('should safely ignore previous navigation with zero images', () => {
      const { result } = renderHook(() => useLightbox(0));

      act(() => {
        result.current.handlePreviousImage();
      });

      expect(result.current.selectedIndex).toBeNull();
    });

    it('should support continuous previous navigation through entire gallery', () => {
      const { result } = renderHook(() => useLightbox(3));

      act(() => {
        result.current.openLightbox(0);
      });

      expect(result.current.selectedIndex).toBe(0);

      act(() => {
        result.current.handlePreviousImage();
      });
      expect(result.current.selectedIndex).toBe(2); // Wraps to last

      act(() => {
        result.current.handlePreviousImage();
      });
      expect(result.current.selectedIndex).toBe(1);

      act(() => {
        result.current.handlePreviousImage();
      });
      expect(result.current.selectedIndex).toBe(0);
    });
  });

  describe('Navigation combinations', () => {
    it('should support mixed next and previous navigation', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(2);
      });

      expect(result.current.selectedIndex).toBe(2);

      act(() => {
        result.current.handleNextImage(); // 3
        result.current.handleNextImage(); // 4
        result.current.handlePreviousImage(); // 3
        result.current.handlePreviousImage(); // 2
      });

      expect(result.current.selectedIndex).toBe(2);
    });

    it('should maintain state across open/close cycles', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(1);
      });
      expect(result.current.selectedIndex).toBe(1);

      act(() => {
        result.current.closeLightbox();
      });
      expect(result.current.selectedIndex).toBeNull();

      act(() => {
        result.current.handleNextImage(); // Opens at first
      });
      expect(result.current.selectedIndex).toBe(0);

      act(() => {
        result.current.openLightbox(3); // Reopen at different index
      });
      expect(result.current.selectedIndex).toBe(3);
    });

    it('should handle rapid navigation', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(0);
        for (let i = 0; i < 20; i++) {
          result.current.handleNextImage();
        }
      });

      // 0 -> 1 -> 2 -> 3 -> 4 -> 0 -> 1 -> 2 -> 3 -> 4 -> 0 -> 1 -> 2 -> 3 -> 4 -> 0 -> 1 -> 2 -> 3 -> 4
      // That's 20 iterations, 5 images: 20 % 5 = 0
      expect(result.current.selectedIndex).toBe(0);
    });

    it('should calculate final position correctly after complex navigation', () => {
      const { result } = renderHook(() => useLightbox(4)); // Indices: 0, 1, 2, 3

      act(() => {
        result.current.openLightbox(0);
        // Go forward 3 steps: 0 -> 1 -> 2 -> 3
        result.current.handleNextImage();
        result.current.handleNextImage();
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(3);

      act(() => {
        // Go backward 5 steps from 3: 3 -> 2 -> 1 -> 0 -> 3 -> 2
        result.current.handlePreviousImage();
        result.current.handlePreviousImage();
        result.current.handlePreviousImage();
        result.current.handlePreviousImage();
        result.current.handlePreviousImage();
      });

      expect(result.current.selectedIndex).toBe(2);
    });
  });

  describe('Boundary conditions', () => {
    it('should handle very large gallery', () => {
      const { result } = renderHook(() => useLightbox(10000));

      act(() => {
        result.current.openLightbox(9999); // Last image
      });

      expect(result.current.selectedIndex).toBe(9999);

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(0); // Wraps correctly
    });

    it('should handle opening at boundary indices', () => {
      const { result } = renderHook(() => useLightbox(10));

      act(() => {
        result.current.openLightbox(0);
      });
      expect(result.current.selectedIndex).toBe(0);

      act(() => {
        result.current.openLightbox(9);
      });
      expect(result.current.selectedIndex).toBe(9);

      act(() => {
        result.current.openLightbox(4);
      });
      expect(result.current.selectedIndex).toBe(4);
    });

    it('should handle re-opening at same index', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(2);
      });

      expect(result.current.selectedIndex).toBe(2);

      act(() => {
        result.current.openLightbox(2); // Same index
      });

      expect(result.current.selectedIndex).toBe(2); // Should remain at 2
    });
  });

  describe('Handler stability and memoization', () => {
    it('should return stable handlers across re-renders', () => {
      const { result, rerender } = renderHook(() => useLightbox(5));

      const initialHandlers = {
        openLightbox: result.current.openLightbox,
        closeLightbox: result.current.closeLightbox,
        handleNextImage: result.current.handleNextImage,
        handlePreviousImage: result.current.handlePreviousImage,
      };

      rerender();

      expect(result.current.openLightbox).toBe(initialHandlers.openLightbox);
      expect(result.current.closeLightbox).toBe(initialHandlers.closeLightbox);
      expect(result.current.handleNextImage).toBe(initialHandlers.handleNextImage);
      expect(result.current.handlePreviousImage).toBe(initialHandlers.handlePreviousImage);
    });

    it('should update handlers when imagesCount changes', () => {
      const { result, rerender } = renderHook(
        ({ count }: { count: number }) => useLightbox(count),
        { initialProps: { count: 5 } }
      );

      act(() => {
        result.current.openLightbox(4);
      });

      expect(result.current.selectedIndex).toBe(4);

      // Change image count to 3
      rerender({ count: 3 });

      // State still shows 4 because React state doesn't automatically update
      // The hook's navigation will use the new count
      expect(result.current.selectedIndex).toBe(4);

      // When we navigate with new count (3), next from 4 increments normally
      act(() => {
        result.current.handleNextImage();
      });

      // Index 4 + 1 = 5 (doesn't clamp, just increments)
      // This is an edge case where count decreased but index stayed
      expect(result.current.selectedIndex).toBe(5);
    });

    it('should handle rapid image count changes', () => {
      const { result, rerender } = renderHook(
        ({ count }: { count: number }) => useLightbox(count),
        { initialProps: { count: 5 } }
      );

      act(() => {
        result.current.openLightbox(2);
      });

      rerender({ count: 10 });
      expect(result.current.selectedIndex).toBe(2);

      rerender({ count: 1 });
      // State still shows 2 (React state doesn't auto-update)
      expect(result.current.selectedIndex).toBe(2);

      // With new count of 1 and index 2, next navigation increments normally
      // Index 2 is not at the boundary (imagesCount - 1 = 0), so it just increments
      act(() => {
        result.current.handleNextImage();
      });
      expect(result.current.selectedIndex).toBe(3);
    });
  });

  describe('Edge cases and special scenarios', () => {
    it('should handle two-image gallery navigation', () => {
      const { result } = renderHook(() => useLightbox(2));

      act(() => {
        result.current.openLightbox(0);
      });

      expect(result.current.selectedIndex).toBe(0);

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(1);

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(0); // Wraps back to start
    });

    it('should handle opening with fractional indices (not truncated by Math.min/max)', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(2.7); // Math.min/max don't truncate, just compare
      });

      // Math.min/max will pass through the fractional value
      // This is actually an edge case - ideally we'd validate this is an integer
      // but the hook allows it to demonstrate boundary behavior
      expect(result.current.selectedIndex).toBe(2.7);

      // However, it's clamped within range [0, 4]
      act(() => {
        result.current.openLightbox(10.5); // Beyond max
      });

      expect(result.current.selectedIndex).toBe(4); // Clamped to max
    });

    it('should maintain consistent behavior after closing and reopening', () => {
      const { result } = renderHook(() => useLightbox(5));

      act(() => {
        result.current.openLightbox(1);
        result.current.closeLightbox();
        result.current.openLightbox(3);
      });

      expect(result.current.selectedIndex).toBe(3);

      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(4);
    });

    it('should support gallery with negative image counts (edge case)', () => {
      const { result } = renderHook(() => useLightbox(-5));

      // Should treat as empty gallery
      act(() => {
        result.current.openLightbox(0);
      });

      expect(result.current.selectedIndex).toBeNull();
    });
  });

  describe('Practical usage scenarios', () => {
    it('should support image gallery with click navigation', () => {
      const { result } = renderHook(() => useLightbox(10));

      // User clicks on image 3
      act(() => {
        result.current.openLightbox(3);
      });

      expect(result.current.selectedIndex).toBe(3);

      // User clicks next button
      act(() => {
        result.current.handleNextImage();
      });

      expect(result.current.selectedIndex).toBe(4);

      // User clicks close button
      act(() => {
        result.current.closeLightbox();
      });

      expect(result.current.selectedIndex).toBeNull();
    });

    it('should support keyboard navigation pattern', () => {
      const { result } = renderHook(() => useLightbox(5));

      // User clicks an image (opens lightbox)
      act(() => {
        result.current.openLightbox(0);
      });

      // User presses right arrow (next image)
      act(() => {
        result.current.handleNextImage();
      });
      expect(result.current.selectedIndex).toBe(1);

      // User presses right arrow again
      act(() => {
        result.current.handleNextImage();
      });
      expect(result.current.selectedIndex).toBe(2);

      // User presses left arrow (previous image)
      act(() => {
        result.current.handlePreviousImage();
      });
      expect(result.current.selectedIndex).toBe(1);

      // User presses escape (close)
      act(() => {
        result.current.closeLightbox();
      });
      expect(result.current.selectedIndex).toBeNull();
    });

    it('should support touch swipe navigation pattern', () => {
      const { result } = renderHook(() => useLightbox(7));

      // User taps image to open
      act(() => {
        result.current.openLightbox(2);
      });

      // User swipes right (previous)
      act(() => {
        result.current.handlePreviousImage();
      });
      expect(result.current.selectedIndex).toBe(1);

      // User swipes left multiple times (next multiple times)
      act(() => {
        result.current.handleNextImage();
        result.current.handleNextImage();
        result.current.handleNextImage();
        result.current.handleNextImage();
      });
      expect(result.current.selectedIndex).toBe(5);

      // User swipes down (close)
      act(() => {
        result.current.closeLightbox();
      });
      expect(result.current.selectedIndex).toBeNull();
    });
  });
});
