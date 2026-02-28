"use client";

/**
 * Hook for accessing and managing theme state.
 *
 * Provides the current theme mode and a function to change it.
 * Automatically persists user preference and respects system settings.
 */

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

  /** Whether the component is mounted (useful for avoiding hydration mismatches) */
  isMounted: boolean;
}

/**
 * Hook to access and manage the application theme.
 *
 * Provides easy access to theme mode, setter, and hydration state.
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
 */
export function useTheme(): UseThemeReturn {
  const { mode, setMode, isMounted } = useThemeContext();

  return {
    theme: mode,
    setTheme: setMode,
    isMounted,
  };
}
