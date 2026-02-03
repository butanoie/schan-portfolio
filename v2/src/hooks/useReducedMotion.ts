import { useState, useEffect } from 'react';

/**
 * Hook to detect user's motion preference and respect WCAG 2.2 accessibility standards.
 *
 * Uses the `prefers-reduced-motion` media query to determine if the user has
 * enabled reduced motion in their operating system or browser settings. This is
 * important for users with vestibular disorders or other motion sensitivities.
 *
 * The hook listens for changes to the media query and updates in real-time if
 * the user changes their motion preference. Returns `true` if motion should be
 * reduced, `false` if animations and transitions are safe to use.
 *
 * @returns {boolean} `true` if motion should be reduced, `false` otherwise
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <Box
 *       sx={{
 *         transition: prefersReducedMotion
 *           ? 'none'
 *           : 'opacity 0.3s ease-in-out',
 *         opacity: isLoading ? 0.5 : 1,
 *       }}
 *     >
 *       Content here
 *     </Box>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function Lightbox() {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   const slideVariants = {
 *     enter: {
 *       opacity: 1,
 *       x: 0,
 *       transition: prefersReducedMotion
 *         ? { duration: 0 }
 *         : { duration: 0.3, ease: 'easeOut' },
 *     },
 *     exit: {
 *       opacity: 0,
 *       x: 100,
 *       transition: prefersReducedMotion
 *         ? { duration: 0 }
 *         : { duration: 0.3, ease: 'easeIn' },
 *     },
 *   };
 *
 *   return <motion.div variants={slideVariants}>Image</motion.div>;
 * }
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion} MDN: prefers-reduced-motion
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions} WCAG: Animation from Interactions
 */
export function useReducedMotion(): boolean {
  // Initialize with media query value on first render
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return false; // SSR: default to false
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    // Create media query list for prefers-reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    /**
     * Listener function to update state when user changes their motion preference.
     * This handles the case where a user changes their OS/browser settings without
     * reloading the page.
     *
     * @param event - MediaQueryListEvent with matches property indicating new preference
     */
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener for media query changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup: remove listener when component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
