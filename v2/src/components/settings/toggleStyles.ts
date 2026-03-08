/**
 * Shared styling constants for toggle button groups used across settings switchers.
 *
 * These constants ensure visual consistency between ThemeSwitcher and LanguageSwitcher
 * components, which both use MUI ToggleButtonGroup with the same styling.
 */

/** Border color for toggle button groups. A light gray for subtle visual separation. */
export const TOGGLE_BORDER_COLOR = '#CCCCCC';

/** Shared styling for individual toggle buttons within a group */
export const TOGGLE_BUTTON_SX = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0.5,
  py: 1.5,
  px: 1,
  textTransform: 'none',
} as const;
