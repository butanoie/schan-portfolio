/**
 * Theme definitions for the portfolio application.
 *
 * Provides three complete theme configurations:
 * - Light theme: Default with sage green and maroon palette
 * - Dark theme: Inverted colors for low-light environments
 * - High-contrast: Black and white for maximum accessibility
 *
 * All themes meet WCAG 2.2 AA contrast requirements.
 * High-contrast theme meets WCAG AAA (7:1+) standards.
 */

import { createTheme } from "@mui/material/styles";
import { ThemeMode, ThemePalette } from "@/src/types/theme";
import { THEME_PALETTES } from "@/src/constants/colors";

/**
 * Create a Material UI theme from a palette configuration.
 *
 * Applies common theme settings (typography, component overrides)
 * and merges with palette-specific settings.
 *
 * @param palette - Theme palette configuration
 * @returns Complete MUI theme object
 */
function createThemeFromPalette(palette: ThemePalette) {
  return createTheme({
    palette: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mode: palette.mode === "highContrast" ? "dark" : (palette.mode as any),
      primary: {
        main: palette.primary,
        light: palette.accents.blue,
        dark: palette.secondary,
        contrastText: palette.text.primary,
      },
      secondary: {
        main: palette.secondary,
        light: palette.accents.green,
        dark: palette.primary,
        contrastText: palette.text.primary,
      },
      background: {
        default: palette.background,
        paper: palette.surface,
      },
      text: {
        primary: palette.text.primary,
        secondary: palette.text.secondary,
        disabled: palette.text.disabled,
      },
      divider: palette.borders,
    },
    typography: {
      fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
        color: palette.text.primary,
      },
      h2: {
        fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
        fontWeight: 700,
        color: palette.text.primary,
      },
      h3: {
        fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        color: palette.text.primary,
      },
      h4: {
        fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        color: palette.text.primary,
      },
      h5: {
        fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        color: palette.text.primary,
      },
      h6: {
        fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        color: palette.text.primary,
      },
      body1: {
        color: palette.text.primary,
      },
      body2: {
        color: palette.text.secondary,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            transition: "all 150ms ease-in-out",
            "&:focus-visible": {
              outline:
                palette.mode === "highContrast"
                  ? "2px solid #FFFF00"
                  : `2px solid ${palette.primary}`,
              outlineOffset: "2px",
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 150ms ease-in-out",
            "&:focus-visible": {
              outline:
                palette.mode === "highContrast"
                  ? "2px solid #FFFF00"
                  : `2px solid ${palette.primary}`,
              outlineOffset: "2px",
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: palette.primary,
            cursor: "pointer",
            textDecoration: "underline",
            transition: "all 150ms ease-in-out",
            "&:hover": {
              color: palette.secondary,
            },
            "&:focus-visible": {
              outline:
                palette.mode === "highContrast"
                  ? "2px solid #FFFF00"
                  : `2px solid ${palette.primary}`,
              outlineOffset: "2px",
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: palette.surface,
            borderColor: palette.borders,
            transition: "all 200ms ease-out",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background,
            color: palette.text.primary,
            transition: "background-color 300ms ease-in-out, color 300ms ease-in-out",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          "@media (prefers-reduced-motion: reduce)": {
            "*": {
              animationDuration: "0.01ms !important",
              animationIterationCount: "1 !important",
              transitionDuration: "0.01ms !important",
            },
            body: {
              transition: "none",
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  });
}

/**
 * Light theme configuration.
 * Default theme using sage green and maroon palette.
 */
export const lightTheme = createThemeFromPalette(THEME_PALETTES.light);

/**
 * Dark theme configuration.
 * Inverted colors for reduced eye strain in low-light environments.
 */
export const darkTheme = createThemeFromPalette(THEME_PALETTES.dark);

/**
 * High-contrast theme configuration.
 * Black and white theme for maximum accessibility (WCAG AAA).
 */
export const highContrastTheme = createThemeFromPalette(THEME_PALETTES.highContrast);

/**
 * Get a theme by mode.
 *
 * @param mode - Theme mode (light, dark, highContrast)
 * @returns The corresponding MUI theme object
 */
export function getThemeByMode(mode: ThemeMode) {
  switch (mode) {
    case "dark":
      return darkTheme;
    case "highContrast":
      return highContrastTheme;
    case "light":
    default:
      return lightTheme;
  }
}

/**
 * Get palette configuration by mode.
 *
 * @param mode - Theme mode
 * @returns The theme palette configuration
 */
export function getPaletteByMode(mode: ThemeMode): ThemePalette {
  return THEME_PALETTES[mode] ?? THEME_PALETTES.light;
}
