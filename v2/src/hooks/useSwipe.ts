import { useRef, useCallback } from 'react';

/**
 * Configuration options for the useSwipe hook.
 */
interface UseSwipeConfig {
  /** Minimum swipe distance in pixels before triggering action (default: 50) */
  threshold?: number;

  /** Maximum number of images for determining valid swipe actions (default: Infinity) */
  maxImages?: number;
}

/**
 * Result object returned by the useSwipe hook.
 */
interface UseSwipeResult {
  /** Event handler for touch start events - attach to a DOM element */
  onTouchStart: (e: React.TouchEvent) => void;

  /** Event handler for touch end events - attach to a DOM element */
  onTouchEnd: (e: React.TouchEvent) => void;
}

/**
 * Custom hook to detect and handle touch swipe gestures.
 *
 * Detects swipe direction and triggers appropriate callbacks:
 *
 * - **Horizontal swipes**: Left (>50px) triggers onSwipeLeft, Right (>50px) triggers onSwipeRight
 * - **Vertical swipes**: Down (>50px) triggers onSwipeDown
 * - **Thresholds**: Requires minimum 50px movement and isolated direction (prevents diagonal detection)
 * - **Optimization**: Skips horizontal navigation if maxImages <= 1
 *
 * The hook returns touch event handlers that should be attached to the element where
 * swipe detection is needed (typically a modal or scrollable container).
 *
 * @param onSwipeLeft - Callback when user swipes left (typically "next" action)
 * @param onSwipeRight - Callback when user swipes right (typically "previous" action)
 * @param onSwipeDown - Callback when user swipes down (typically "close" action)
 * @param config - Optional configuration object for threshold and maxImages
 * @returns Object with onTouchStart and onTouchEnd handlers to attach to a DOM element
 *
 * @example
 * ```tsx
 * function LightboxModal() {
 *   const handleSwipeLeft = () => console.log('Next image');
 *   const handleSwipeRight = () => console.log('Previous image');
 *   const handleSwipeDown = () => console.log('Close lightbox');
 *
 *   const { onTouchStart, onTouchEnd } = useSwipe(
 *     handleSwipeLeft,
 *     handleSwipeRight,
 *     handleSwipeDown,
 *     { threshold: 50, maxImages: 10 }
 *   );
 *
 *   return (
 *     <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
 *       Modal content here
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With default configuration (50px threshold, no image count limit)
 * const { onTouchStart, onTouchEnd } = useSwipe(
 *   () => navigateNext(),
 *   () => navigatePrevious(),
 *   () => closeModal()
 * );
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Touch_events} MDN: Touch Events
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  onSwipeDown: () => void,
  config?: UseSwipeConfig
): UseSwipeResult {
  const threshold = config?.threshold ?? 50;
  const maxImages = config?.maxImages ?? Infinity;

  // Store initial touch position as a ref to avoid re-renders on every touch.
  // This value is only read in handleTouchEnd and never drives rendering.
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  /**
   * Handles touch start event by capturing initial touch position.
   * This position is used in handleTouchEnd to calculate swipe direction and distance.
   *
   * @param e - React touch event from the touched element
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  /**
   * Handles touch end event to detect swipe direction and trigger appropriate callback.
   *
   * Swipe detection logic:
   *
   * Vertical swipes (down): verticalDistance > threshold AND minimal horizontal movement
   * - Triggered regardless of image count
   * - Typical use case: closing modal/lightbox
   *
   * Horizontal swipes (left/right): horizontalDistance > threshold AND minimal vertical movement
   * - Only triggered if maxImages > 1 (prevents navigation with single image)
   * - Left swipe: typically "next" action
   * - Right swipe: typically "previous" action
   *
   * Diagonal swipes: Ignored (requires movement to be primarily in one direction)
   * - Must satisfy: Math.abs(movement1) > threshold AND Math.abs(movement2) < threshold
   * - Prevents accidental navigation from diagonal touches
   *
   * @param {React.TouchEvent} e - React touch event with changedTouches containing end position
   */
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touchStart = touchStartRef.current;

      // If touch start wasn't captured, skip processing
      if (touchStart === null) {
        return;
      }

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      // Calculate distance moved in each direction
      const horizontalDistance = touchStart.x - touchEnd.x; // Positive = left swipe
      const verticalDistance = touchEnd.y - touchStart.y; // Positive = downward swipe

      // Reset touch start position
      touchStartRef.current = null;

      // Check for downward swipe to close (works regardless of image count)
      // Requires: significant downward movement + minimal horizontal movement
      if (verticalDistance >= threshold && Math.abs(horizontalDistance) < threshold) {
        onSwipeDown();
        return;
      }

      // Skip horizontal navigation if there's only one image
      if (maxImages <= 1) {
        return;
      }

      // Check for horizontal swipes to navigate (left or right)
      // Requires: significant horizontal movement + minimal vertical movement
      if (Math.abs(horizontalDistance) >= threshold && Math.abs(verticalDistance) < threshold) {
        if (horizontalDistance > 0) {
          // Swipe left: typically "next image"
          onSwipeLeft();
        } else {
          // Swipe right: typically "previous image"
          onSwipeRight();
        }
      }
    },
    [threshold, maxImages, onSwipeLeft, onSwipeRight, onSwipeDown]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
}
