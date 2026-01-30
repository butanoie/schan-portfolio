import { useEffect, useState } from 'react';

/**
 * A React hook that detects the user's motion preference based on the
 * `prefers-reduced-motion` media query. This is critical for WCAG 2.2
 * Level AA compliance and ensures animations respect user accessibility preferences.
 *
 * @returns A boolean indicating whether the user prefers reduced motion.
 * - `true`: User has enabled reduced motion (disable animations)
 * - `false`: User has not enabled reduced motion (animations allowed)
 *
 * @example
 * Basic usage to conditionally apply animations
 * ```tsx
 * function AnimatedCard() {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <div
 *       style={{
 *         transition: prefersReducedMotion ? 'none' : 'transform 200ms ease'
 *       }}
 *     >
 *       Card content
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Using with Framer Motion or animation libraries
 * ```tsx
 * function FadeInComponent({ children }) {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
 *       animate={{ opacity: 1 }}
 *       transition={{
 *         duration: prefersReducedMotion ? 0 : 0.3
 *       }}
 *     >
 *       {children}
 *     </motion.div>
 *   );
 * }
 * ```
 *
 * @example
 * Disable all animations in a component tree
 * ```tsx
 * function ProjectCard({ project }) {
 *   const prefersReducedMotion = useReducedMotion();
 *   const [ref, isInView] = useInView({ threshold: 0.1 });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         // Instant visibility if reduced motion, fade in otherwise
 *         opacity: isInView || prefersReducedMotion ? 1 : 0,
 *         transition: prefersReducedMotion ? 'none' : 'opacity 200ms'
 *       }}
 *     >
 *       {project.title}
 *     </div>
 *   );
 * }
 * ```
 *
 * SSR-safe: Returns `false` during server-side rendering.
 * Automatically updates when user changes their OS motion preferences.
 * Cleans up media query listener on component unmount.
 * Respects system-level accessibility settings (Windows, macOS, iOS, Android).
 * Required for WCAG 2.2 Level AA compliance (Success Criterion 2.3.3).
 * Users enable this setting if they experience motion sickness or vestibular disorders.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 * @see https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
 */
export function useReducedMotion(): boolean {
  // Default to false (animations enabled) for SSR
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window and matchMedia are available (client-side only)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    // Create media query matcher for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mediaQuery.matches);

    /**
     * Event handler that updates state when media query changes.
     * This allows the hook to respond to real-time changes in user preferences.
     *
     * @param event - The media query change event
     */
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Listen for changes to the media query
    // Note: addEventListener is preferred over deprecated addListener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
