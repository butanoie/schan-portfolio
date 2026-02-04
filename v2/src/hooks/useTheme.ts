/**
 * Hook for accessing and managing theme state.
 *
 * Provides the current theme mode and a function to change it.
 * Automatically persists user preference and respects system settings.
 */

"use client";

import { useThemeContext } from "@/src/contexts/ThemeContext";
import { ThemeMode } from "@/src/types/theme";

/**
 * Interface for the useTheme hook return value.
 */
interface UseThemeReturn {
  /** Current theme mode */
  theme: ThemeMode;

  /** Set the theme mode */
  setTheme: (mode: ThemeMode) => void;

  /** Check if a specific theme is active */
  isTheme: (mode: ThemeMode) => boolean;

  /** Get the next theme in the cycle */
  getNextTheme: () => ThemeMode;

  /** Whether the component is mounted (useful for avoiding hydration mismatches) */
  isMounted: boolean;
}

/**
 * Hook to access and manage the application theme.
 *
 * Provides easy access to theme mode, setter, and utilities for
 * common theme operations like cycling through themes.
 *
 * @returns Object with theme state and utilities
 * @throws Error if used outside of ThemeContextProvider
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTheme();
 *
 *   return (
 *     <button onClick={() => setTheme('dark')}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Cycle through themes
 * function ThemeCycler() {
 *   const { theme, getNextTheme, setTheme } = useTheme();
 *
 *   return (
 *     <button onClick={() => setTheme(getNextTheme())}>
 *       Cycle theme (currently: {theme})
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  const { mode, setMode, isMounted } = useThemeContext();

  /**
   * Check if a specific theme is currently active.
   *
   * @param checkMode - Theme mode to check
   * @returns True if the theme matches the current mode
   */
  const isTheme = (checkMode: ThemeMode): boolean => {
    return mode === checkMode;
  };

  /**
   * Get the next theme in the cycle.
   * Cycles: light → dark → highContrast → light
   *
   * @returns The next theme mode
   */
  const getNextTheme = (): ThemeMode => {
    const themeOrder: ThemeMode[] = ["light", "dark", "highContrast"];
    const currentIndex = themeOrder.indexOf(mode);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    return themeOrder[nextIndex];
  };

  return {
    theme: mode,
    setTheme: setMode,
    isTheme,
    getNextTheme,
    isMounted,
  };
}
