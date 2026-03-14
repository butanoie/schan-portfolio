/**
 * High-contrast theme MUI component overrides.
 *
 * Provides a dedicated override layer for the high-contrast theme that is
 * deep-merged on top of the base theme produced by `createThemeFromPalette`.
 * This keeps all HC-specific styling in one auditable file rather than
 * scattering `palette.mode === 'highContrast'` checks throughout the
 * base theme factory.
 *
 * Design decisions:
 * - All shadows and elevation replaced with 1px solid borders
 * - No gradients — solid fills only
 * - No rgba() borders — solid white on black, solid black on white
 * - Links always underlined
 * - Focus indicators: 3px solid yellow (#FFFF00) with 2px offset
 * - Disabled elements use a hatched pattern overlay instead of opacity
 * - WCAG AAA (7:1+) contrast ratios for all text and interactive states
 *
 * @module lib/highContrastOverrides
 */

import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

/** High-contrast foreground color (white on black background) */
const HC_WHITE = '#FFFFFF';

/** High-contrast background color (pure black) */
const HC_BLACK = '#000000';

/** High-contrast accent color for focus indicators and interactive highlights */
const HC_YELLOW = '#FFFF00';

/** Muted color for disabled elements (4.48:1 on black, augmented by hatch pattern) */
const HC_DISABLED = '#767676';

/**
 * Shared focus-visible outline style for high-contrast interactive elements.
 * Uses 3px solid yellow for maximum visibility, meeting WCAG 2.4.11 Focus Appearance.
 */
const HC_FOCUS_VISIBLE = {
  outline: `3px solid ${HC_YELLOW}`,
  outlineOffset: '2px',
};

/**
 * Shared disabled state style with hatched pattern overlay.
 * Uses a diagonal stripe pattern instead of opacity to satisfy
 * the requirement that disabled states are visually distinct
 * without relying on opacity alone.
 */
const HC_DISABLED_STYLE = {
  color: HC_DISABLED,
  backgroundColor: HC_BLACK,
  backgroundImage: `repeating-linear-gradient(
    45deg,
    ${HC_DISABLED},
    ${HC_DISABLED} 1px,
    transparent 1px,
    transparent 6px
  )`,
  border: `1px solid ${HC_DISABLED}`,
  opacity: 1,
  pointerEvents: 'none' as const,
};

/**
 * Apply high-contrast-specific MUI component overrides to a base theme.
 *
 * Uses MUI's `createTheme(baseTheme, overrides)` deep merge to layer
 * HC-specific component style overrides on top of the base theme without
 * modifying the base factory.
 *
 * @param baseTheme - The base MUI theme produced by `createThemeFromPalette`
 * @returns A new theme with HC-specific component overrides merged in
 *
 * @example
 * ```ts
 * const hcTheme = applyHighContrastOverrides(
 *   createThemeFromPalette(THEME_PALETTES.highContrast)
 * );
 * ```
 */
export function applyHighContrastOverrides(baseTheme: Theme): Theme {
  return createTheme(baseTheme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'none',
          },
          /**
           * Force underline on all anchor tags in sanitized HTML content
           * (e.g., ButaStory which uses DOMPurify-sanitized HTML) that
           * bypass MuiLink styling. Excludes MuiButtonBase (nav buttons
           * render as <a> via href prop) to avoid overriding button colors.
           */
          'a:not(.MuiLink-root):not(.MuiButtonBase-root)': {
            textDecoration: 'underline',
            color: HC_YELLOW,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: `1px solid ${HC_WHITE}`,
            borderRadius: 0,
            backgroundImage: 'none',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: `1px solid ${HC_WHITE}`,
            borderRadius: 0,
            transition: 'none',
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${HC_WHITE}`,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: HC_WHITE,
          },
        },
      },

      MuiAccordion: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: `1px solid ${HC_WHITE}`,
            backgroundImage: 'none',
            '&:before': {
              display: 'none',
            },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            transition: 'none',
            '&:focus-visible': HC_FOCUS_VISIBLE,
            '&:hover': {
              boxShadow: 'none',
            },
            '&.Mui-disabled': HC_DISABLED_STYLE,
          },
          contained: {
            backgroundColor: HC_WHITE,
            color: HC_BLACK,
            border: `1px solid ${HC_WHITE}`,
            '&:hover': {
              backgroundColor: HC_BLACK,
              color: HC_WHITE,
              border: `1px solid ${HC_WHITE}`,
              boxShadow: 'none',
            },
          },
          outlined: {
            borderColor: HC_WHITE,
            color: HC_WHITE,
            '&:hover': {
              backgroundColor: HC_WHITE,
              color: HC_BLACK,
              borderColor: HC_WHITE,
            },
          },
          text: {
            color: HC_WHITE,
            textDecoration: 'underline',
            '&:hover': {
              color: HC_YELLOW,
              textDecoration: 'underline',
            },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'none',
            '&:focus-visible': HC_FOCUS_VISIBLE,
            '&.Mui-disabled': HC_DISABLED_STYLE,
          },
        },
      },

      MuiLink: {
        styleOverrides: {
          root: {
            color: HC_WHITE,
            textDecoration: 'underline',
            textDecorationColor: 'inherit',
            transition: 'none',
            '&:hover': {
              color: HC_YELLOW,
              textDecoration: 'underline',
            },
            '&:focus-visible': HC_FOCUS_VISIBLE,
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: HC_WHITE,
            color: HC_BLACK,
            border: `1px solid ${HC_BLACK}`,
            boxShadow: 'none',
          },
          arrow: {
            color: HC_WHITE,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            border: `1px solid ${HC_WHITE}`,
            borderRadius: 0,
          },
        },
      },

      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: '#333333',
          },
        },
      },

      MuiPopover: {
        styleOverrides: {
          paper: {
            boxShadow: 'none',
            border: `1px solid ${HC_WHITE}`,
          },
        },
      },
    },
  });
}
