"use client";

/**
 * Hook for accessing the current theme palette.
 *
 * Combines useThemeContext and getPaletteByMode into a single call,
 * eliminating the repeated two-step pattern used across many components.
 *
 * @module hooks/usePalette
 */

import { useThemeContext } from "@/src/contexts/ThemeContext";
import { getPaletteByMode } from "@/src/lib/themes";
import type { ThemePalette, ThemeMode } from "@/src/types/theme";

/**
 * Return value for the usePalette hook.
 */
interface UsePaletteReturn {
  /** The resolved theme palette for the current mode */
  palette: ThemePalette;

  /** The current theme mode (light, dark, highContrast) */
  mode: ThemeMode;
}

/**
 * Hook that returns the current theme palette and mode.
 *
 * Replaces the common two-line pattern found across components:
 * ```ts
 * const { mode } = useThemeContext();
 * const palette = getPaletteByMode(mode);
 * ```
 *
 * For components that need hydration safety (e.g., resume components),
 * pass `{ hydrationSafe: true }` to fall back to the light palette
 * until the client is mounted.
 *
 * @param options - Optional configuration
 * @param options.hydrationSafe - When true, uses light palette until mounted (default: false)
 * @returns Object with palette and mode
 * @throws Error if used outside of ThemeContextProvider
 *
 * @example
 * ```tsx
 * // Basic usage
 * function MyComponent() {
 *   const { palette, mode } = usePalette();
 *   return <Box sx={{ color: palette.text.primary }}>...</Box>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Hydration-safe usage (for SSR components)
 * function ResumeComponent() {
 *   const { palette, mode } = usePalette({ hydrationSafe: true });
 *   return <Box sx={{ color: palette.secondary }}>...</Box>;
 * }
 * ```
 */
export function usePalette(
  options?: { hydrationSafe?: boolean }
): UsePaletteReturn {
  const { mode, isMounted } = useThemeContext();

  const effectiveMode =
    options?.hydrationSafe && !isMounted ? "light" : mode;

  return {
    palette: getPaletteByMode(effectiveMode),
    mode: effectiveMode,
  };
}
