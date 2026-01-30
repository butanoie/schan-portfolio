import { useEffect, useRef, useState } from 'react';

/**
 * Options for configuring the Intersection Observer behavior.
 */
export interface UseInViewOptions {
  /**
   * A number between 0 and 1 indicating what percentage of the element
   * must be visible before triggering the intersection callback.
   *
   * @default 0.1
   */
  threshold?: number | number[];

  /**
   * Margin around the root element (viewport) for intersection calculation.
   * Can expand or contract the effective area for intersection.
   *
   * @default '0px'
   * @example '50px' // 50px margin on all sides
   * @example '10px 20px' // 10px top/bottom, 20px left/right
   */
  rootMargin?: string;

  /**
   * If true, the element will only trigger the intersection once and
   * remain in the "has been in view" state afterward.
   *
   * @default false
   */
  triggerOnce?: boolean;

  /**
   * A specific element to use as the viewport for intersection.
   * If not specified, the browser viewport is used.
   *
   * @default null (browser viewport)
   */
  root?: Element | null;
}

/**
 * Return type for the useInView hook.
 *
 * @template T - The type of element being observed (defaults to HTMLElement)
 */
export type UseInViewReturn<T extends HTMLElement = HTMLElement> = [
  ref: (node: T | null) => void,
  isInView: boolean,
  hasBeenInView: boolean
];

/**
 * A React hook that detects when an element enters or exits the viewport
 * using the Intersection Observer API. Useful for lazy loading, animations,
 * and performance optimizations.
 *
 * @template T - The type of HTML element being observed
 * @param options - Configuration options for the Intersection Observer
 * @returns A tuple containing:
 * - ref: A callback ref to attach to the element you want to observe
 * - isInView: Boolean indicating if the element is currently in view
 * - hasBeenInView: Boolean indicating if the element has ever been in view
 *
 * @example
 * Basic usage with default options
 * ```tsx
 * function LazyImage({ src, alt }) {
 *   const [ref, isInView] = useInView({ threshold: 0.5 });
 *
 *   return (
 *     <div ref={ref}>
 *       {isInView && <img src={src} alt={alt} />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Trigger animation only once when element appears
 * ```tsx
 * function FadeInCard({ children }) {
 *   const [ref, isInView, hasBeenInView] = useInView({
 *     threshold: 0.1,
 *     triggerOnce: true
 *   });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         opacity: hasBeenInView ? 1 : 0,
 *         transition: 'opacity 200ms'
 *       }}
 *     >
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Track visibility with custom root element
 * ```tsx
 * function ScrollContainer() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const [itemRef, isInView] = useInView({
 *     root: containerRef.current,
 *     rootMargin: '50px'
 *   });
 *
 *   return (
 *     <div ref={containerRef} style={{ overflow: 'auto', height: '500px' }}>
 *       <div ref={itemRef}>
 *         {isInView ? 'Visible in container' : 'Not visible'}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * Automatically cleans up the observer when the component unmounts.
 * SSR-safe: Returns false values during server-side rendering.
 * The `hasBeenInView` flag is useful for one-time animations.
 * If `triggerOnce` is true, the observer is disconnected after first intersection.
 * Supports custom root elements for observing within scrollable containers.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): UseInViewReturn<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    root = null,
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * Callback ref function that sets up the Intersection Observer
   * when attached to a DOM element.
   *
   * @param node - The DOM element to observe, or null to clean up
   */
  const ref = (node: T | null) => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Don't observe if no node or if already triggered once
    if (!node || (triggerOnce && hasBeenInView)) {
      return;
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        if (inView && !hasBeenInView) {
          setHasBeenInView(true);

          // Disconnect observer if triggerOnce is enabled
          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observerRef.current.observe(node);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [ref, isInView, hasBeenInView];
}
