"use client";

/**
 * Hook for accessing and managing animations state.
 *
 * Provides the current animations enabled state and a function to toggle it.
 * Automatically persists user preference and respects system settings.
 */

import { useAnimationsContext } from "@/src/contexts/AnimationsContext";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Interface for the useAnimations hook return value.
 */
interface UseAnimationsReturn {
  /** Whether animations are currently enabled */
  animationsEnabled: boolean;

  /** Set whether animations are enabled */
  setAnimationsEnabled: (enabled: boolean) => void;

  /** Toggle animations on/off */
  toggleAnimations: () => void;

  /**
   * Whether animations should play, combining both user setting and OS preference.
   * True only when animationsEnabled is true AND the user has not enabled
   * prefers-reduced-motion at the OS level.
   */
  shouldAnimate: boolean;

  /** Whether the component is mounted (useful for avoiding hydration mismatches) */
  isMounted: boolean;
}

/**
 * Hook to access and manage animations state.
 *
 * Provides easy access to animations enabled state and utilities for
 * toggling animations on/off. Useful for components that need to conditionally
 * apply animations based on user preference.
 *
 * @returns Object with animations state and utilities
 * @throws Error if used outside of AnimationsContextProvider
 *
 * @example
 * ```tsx
 * function AnimatedButton() {
 *   const { animationsEnabled } = useAnimations();
 *
 *   return (
 *     <button
 *       style={{
 *         transition: animationsEnabled ? 'all 0.3s ease' : 'none',
 *       }}
 *     >
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Toggle animations
 * function AnimationsToggle() {
 *   const { animationsEnabled, toggleAnimations } = useAnimations();
 *
 *   return (
 *     <button onClick={toggleAnimations}>
 *       Animations: {animationsEnabled ? 'on' : 'off'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useAnimations(): UseAnimationsReturn {
  const { animationsEnabled, setAnimationsEnabled, isMounted } =
    useAnimationsContext();
  const prefersReducedMotion = useReducedMotion();

  /**
   * Toggle animations on/off.
   */
  const toggleAnimations = (): void => {
    setAnimationsEnabled(!animationsEnabled);
  };

  /** Combines user setting and OS-level reduced motion preference */
  const shouldAnimate = animationsEnabled && !prefersReducedMotion;

  return {
    animationsEnabled,
    setAnimationsEnabled,
    toggleAnimations,
    shouldAnimate,
    isMounted,
  };
}
