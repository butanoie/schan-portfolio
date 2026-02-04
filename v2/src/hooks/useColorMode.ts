/**
 * Hook to detect system color scheme preference.
 *
 * Listens to prefers-color-scheme media query changes and returns
 * the current system color preference. Useful for respecting OS-level
 * dark mode settings if no user preference is saved.
 */

"use client";

import { useEffect, useState } from "react";
import { ColorScheme } from "@/src/types/theme";

/**
 * Hook to detect the system's color scheme preference.
 *
 * Listens to the prefers-color-scheme media query and updates
 * when the system preference changes (e.g., when user toggles
 * dark mode in their OS settings).
 *
 * @returns Current system color mode: 'light' or 'dark'
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const systemMode = useColorMode();
 *   return <p>Your OS prefers: {systemMode} mode</p>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Use to initialize theme based on system preference
 * function ThemeInitializer() {
 *   const systemMode = useColorMode();
 *   const { setTheme } = useTheme();
 *
 *   useEffect(() => {
 *     // Only set if user hasn't saved a preference
 *     const saved = localStorage.getItem('theme-preference');
 *     if (!saved) {
 *       setTheme(systemMode === 'dark' ? 'dark' : 'light');
 *     }
 *   }, [systemMode, setTheme]);
 *
 *   return null;
 * }
 * ```
 */
export function useColorMode(): ColorScheme {
  const [mode, setMode] = useState<ColorScheme>(() => {
    // Initialize with system preference during SSR-safe initialization
    if (typeof window === "undefined") {
      return "light";
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return mediaQuery.matches ? "dark" : "light";
  });

  useEffect(() => {
    // Avoid running during server-side rendering
    if (typeof window === "undefined") return;

    // Set up listener for changes to system color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    /**
     * Handle changes to system color scheme preference.
     * This fires when the user changes their OS dark mode setting.
     *
     * @param e - MediaQueryListEvent from the media query listener
     */
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? "dark" : "light");
    };

    // Listen for changes to the media query
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return mode;
}
