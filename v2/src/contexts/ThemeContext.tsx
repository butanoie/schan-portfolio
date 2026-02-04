/**
 * Theme context for managing application theme state.
 *
 * Provides theme mode, setter function, and system preference detection
 * to all components in the application tree.
 *
 * Handles persistence to localStorage and respects system preferences
 * while allowing user override.
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeMode, ColorScheme } from "@/src/types/theme";

/**
 * Context value shape for theme management.
 */
interface ThemeContextType {
  /** Current theme mode */
  mode: ThemeMode;

  /** Set the theme mode */
  setMode: (mode: ThemeMode) => void;

  /** System color scheme preference (light or dark) */
  systemScheme: ColorScheme;

  /** Whether the component is mounted (for SSR hydration) */
  isMounted: boolean;
}

/**
 * Theme context instance.
 * Provides theme mode and related utilities to child components.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Storage key for persisting theme preference.
 */
const THEME_STORAGE_KEY = "portfolio-theme-mode";

/**
 * Apply theme to document element and update meta tags.
 *
 * @param themeMode - Theme mode to apply
 */
function applyTheme(themeMode: ThemeMode): void {
  if (typeof document === "undefined") return;

  // Update data attribute for CSS-based theme switching
  document.documentElement.setAttribute("data-theme", themeMode);

  // Update meta theme-color tag for browser chrome
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) {
    metaThemeColor = document.createElement("meta");
    metaThemeColor.setAttribute("name", "theme-color");
    document.head.appendChild(metaThemeColor);
  }

  // Set theme color based on mode
  const themeColors = {
    light: "#8BA888", // Sage green
    dark: "#121212", // Dark background
    highContrast: "#000000", // Pure black
  };

  metaThemeColor.setAttribute("content", themeColors[themeMode]);
}

/**
 * Provider component that manages theme state.
 *
 * Features:
 * - Detects system theme preference via prefers-color-scheme
 * - Loads user preference from localStorage
 * - Applies theme to document
 * - Updates meta tags for theme-color
 * - Prevents flash of unstyled content (FOUC) during hydration
 *
 * @param props - Component props
 * @param props.children - Child components to wrap with theme context
 * @returns Theme provider wrapping children with context
 *
 * @example
 * ```tsx
 * <ThemeContextProvider>
 *   <App />
 * </ThemeContextProvider>
 * ```
 */
export function ThemeContextProvider({ children }: { children: ReactNode }) {
  // Initialize state with system preference during SSR-safe setup
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return saved || (darkModeQuery.matches ? "dark" : "light");
  });

  const [systemScheme, setSystemScheme] = useState<ColorScheme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return darkModeQuery.matches ? "dark" : "light";
  });

  const [isMounted, setIsMounted] = useState(false);

  /**
   * Detect system color scheme preference changes and apply initial theme.
   * Runs once on mount to set up listeners.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Apply theme to document immediately
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const currentMode = saved || mode;
    applyTheme(currentMode);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    // Set up listener for system preference changes
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    /**
     * Handle changes to system color scheme preference.
     * Updates both system scheme and theme if no saved preference exists.
     *
     * @param e - MediaQueryListEvent from the media query listener
     */
    const handleChange = (e: MediaQueryListEvent) => {
      const newScheme = e.matches ? "dark" : "light";
      setSystemScheme(newScheme);

      // If no saved preference, update theme when system changes
      if (!saved) {
        const newMode: ThemeMode = e.matches ? "dark" : "light";
        setModeState(newMode);
        applyTheme(newMode);
      }
    };

    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, [mode]);

  /**
   * Apply theme to the document and save preference.
   *
   * @param themeMode - Theme mode to apply
   */
  const setMode = (themeMode: ThemeMode) => {
    setModeState(themeMode);
    applyTheme(themeMode);
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);

    // Dispatch custom event for other listeners
    const event = new CustomEvent("themechange", {
      detail: { mode: themeMode },
    });
    window.dispatchEvent(event);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        systemScheme,
        isMounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context.
 *
 * @returns Theme context value with mode, setMode, systemScheme, and isMounted
 * @throws Error if used outside of ThemeContextProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mode, setMode } = useThemeContext();
 *   return (
 *     <button onClick={() => setMode('dark')}>
 *       Switch to {mode === 'dark' ? 'light' : 'dark'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider"
    );
  }
  return context;
}
