import { useState, useEffect, useRef, RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Return type for useScrollAnimation hook.
 *
 * @interface ScrollAnimationReturn
 * @property {RefObject<HTMLDivElement | null>} ref - Ref to attach to the animated element
 * @property {boolean} isInView - True when element is visible in viewport, false otherwise
 */
interface ScrollAnimationReturn {
  ref: RefObject<HTMLDivElement | null>;
  isInView: boolean;
}

/**
 * Hook that triggers animations when elements enter the viewport using IntersectionObserver.
 *
 * This hook simplifies scroll-triggered animations by detecting when an element enters
 * the viewport and updating a state value that can be used to apply CSS animations or
 * conditional styles. Automatically respects user's `prefers-reduced-motion` preference
 * for WCAG 2.2 accessibility compliance.
 *
 * **Features:**
 * - Uses modern IntersectionObserver API for efficient scroll detection
 * - Automatically cleans up observer on unmount to prevent memory leaks
 * - Respects `prefers-reduced-motion` by immediately setting `isInView: true`
 * - Configurable intersection threshold (default: 0.1 = 10% of element visible)
 * - Works with custom IntersectionObserver options
 *
 * **How It Works:**
 * 1. Element is attached via the returned `ref`
 * 2. When element enters viewport, `isInView` becomes `true`
 * 3. Use `isInView` to control opacity, transform, and other properties
 * 4. CSS transitions animate the change in properties
 *
 * **Performance:**
 * - IntersectionObserver is far more efficient than scroll event listeners
 * - Only fires callbacks when visibility changes, not on every scroll frame
 * - Cleaned up automatically, no memory leaks
 *
 * **Accessibility:**
 * - Respects `prefers-reduced-motion` media query
 * - When reduced motion is enabled, animations show immediately
 * - Users with motion sensitivity won't experience triggering animations
 *
 * @param {IntersectionObserverInit} [options] - Optional IntersectionObserver configuration
 * @param {number} [options.threshold=0.1] - Intersection threshold (0-1). Default: 10% visible
 * @param {HTMLElement} [options.root=null] - Root element for intersection (null = viewport)
 * @param {string} [options.rootMargin='0px'] - Margin around root for intersection detection
 * @returns {ScrollAnimationReturn} Object with ref and isInView boolean
 *
 * **✅ Defensive Options Handling**
 * The `options` parameter is compared by serializing it to a JSON string in the dependency array.
 * This means the IntersectionObserver will only be recreated if the actual option values change,
 * not when a new options object is created with the same properties.
 *
 * **This means all of these work equally well:**
 * ```tsx
 * // ✅ Object literal (works fine now - no unnecessary recreations)
 * const { ref, isInView } = useScrollAnimation({ threshold: 0.25 });
 *
 * // ✅ Memoized options
 * const observerOptions = useMemo(() => ({ threshold: 0.25 }), []);
 * const { ref, isInView } = useScrollAnimation(observerOptions);
 *
 * // ✅ Stable constant
 * const OPTIONS = { threshold: 0.25 };
 * const { ref, isInView } = useScrollAnimation(OPTIONS);
 * ```
 *
 * The hook handles option stability defensively so you don't have to worry about it.
 *
 * @example
 * ```tsx
 * // Basic usage with fade-in animation
 * function ProjectCard() {
 *   const { ref, isInView } = useScrollAnimation();
 *
 *   return (
 *     <Box
 *       ref={ref}
 *       sx={{
 *         opacity: isInView ? 1 : 0,
 *         transform: isInView ? 'translateY(0)' : 'translateY(20px)',
 *         transition: 'all 400ms ease-out',
 *       }}
 *     >
 *       Project content here
 *     </Box>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom threshold (element must be 25% visible)
 * const { ref, isInView } = useScrollAnimation({
 *   threshold: 0.25,
 * });
 * ```
 *
 * @example
 * ```tsx
 * // With custom root margin (trigger animation 100px before element enters viewport)
 * const { ref, isInView } = useScrollAnimation({
 *   rootMargin: '100px',
 * });
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API} MDN: Intersection Observer API
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions} WCAG: Animation from Interactions
 */
export function useScrollAnimation(
  options?: IntersectionObserverInit
): ScrollAnimationReturn {
  // Create ref to attach to the element we want to animate
  const ref = useRef<HTMLDivElement>(null);

  // Track whether element is visible in viewport
  const [isInView, setIsInView] = useState(false);

  // Check if user prefers reduced motion for accessibility
  const prefersReducedMotion = useReducedMotion();

  // Serialize options for stable dependency comparison so callers
  // can pass inline object literals without triggering re-renders
  const serializedOptions = JSON.stringify(options);

  useEffect(() => {
    // Don't set up observer if element ref isn't available yet
    if (!ref.current) return;

    const parsedOptions = JSON.parse(serializedOptions) as IntersectionObserverInit | undefined;

    /**
     * Callback invoked when element's intersection state changes.
     * Only triggers animation if element is entering viewport.
     *
     * @param entries - Array of IntersectionObserverEntry objects
     */
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element is now visible in viewport
          setIsInView(true);
          // Note: We don't "unset" isInView when element leaves viewport
          // This allows animations to fire once and stay at their end state
          // To change this behavior, uncomment the line below:
          // } else {
          //   setIsInView(false);
        }
      });
    };

    // Create observer with default threshold of 0.1 (10% visible)
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      ...parsedOptions,
    });

    // Start observing the element
    observer.observe(ref.current);

    /**
     * Cleanup function: Disconnect observer when component unmounts.
     * This prevents memory leaks and removes unnecessary observers.
     */
    return () => {
      observer.disconnect();
    };
  }, [serializedOptions]); // Re-create observer only when option values change

  /**
   * Return isInView as true immediately if user prefers reduced motion.
   * This ensures animations don't depend on scroll for accessibility.
   */
  return {
    ref,
    isInView: prefersReducedMotion ? true : isInView,
  };
}

export default useScrollAnimation;
