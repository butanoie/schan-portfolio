/**
 * Shared high-contrast styling utilities for component-level sx overrides.
 *
 * These helpers generate sx-compatible style objects for common HC patterns
 * that cannot be handled by MUI theme overrides alone (due to sx specificity
 * beating styleOverrides).
 *
 * @module utils/highContrastStyles
 */

import { BRAND_COLORS } from '../constants';

/** Plain style object that can be spread into MUI sx props */
type StyleObject = Record<string, unknown>;

/**
 * Returns sx styles for a container with a colored background (e.g., duck egg green).
 * In HC mode, renders as black with a white border and no border radius.
 *
 * @param isHighContrast - Whether high-contrast mode is active
 * @param defaultBg - Default background color for non-HC modes
 * @returns SxProps with backgroundColor, border, and borderRadius
 *
 * @example
 * ```tsx
 * <Box sx={{ ...getHcContainerSx(isHighContrast), p: 2.5 }}>
 *   ...
 * </Box>
 * ```
 */
export function getHcContainerSx(
  isHighContrast: boolean,
  defaultBg: string = BRAND_COLORS.duckEgg
): StyleObject {
  return {
    backgroundColor: isHighContrast ? '#000000' : defaultBg,
    border: isHighContrast ? '1px solid #FFFFFF' : 'none',
    borderRadius: isHighContrast ? 0 : 2,
  };
}

/**
 * Returns sx styles for a chip inside a colored container.
 * In HC mode, renders as black with white text and white border.
 *
 * @param isHighContrast - Whether high-contrast mode is active
 * @param defaultBg - Default background color for non-HC modes
 * @returns SxProps with backgroundColor, color, border, and borderRadius
 *
 * @example
 * ```tsx
 * <Chip sx={{ ...getHcChipSx(isHighContrast), fontWeight: 600 }} />
 * ```
 */
export function getHcChipSx(
  isHighContrast: boolean,
  defaultBg: string = BRAND_COLORS.sage
): StyleObject {
  return {
    backgroundColor: isHighContrast ? '#000000' : defaultBg,
    color: '#ffffff',
    border: isHighContrast ? '1px solid #FFFFFF' : 'none',
    borderRadius: isHighContrast ? 0 : '3px',
  };
}
