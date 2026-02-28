/**
 * Theme type definitions for the application.
 *
 * Defines theme modes, palette colors, and theme configuration types
 * used throughout the theme system.
 */

/**
 * Available theme modes for the application.
 *
 * - light: Default theme with sage green and maroon palette
 * - dark: Dark mode with inverted colors for reduced eye strain
 * - highContrast: High contrast black and white for accessibility
 */
export type ThemeMode = "light" | "dark" | "highContrast";

/**
 * System color scheme preference.
 * Reflects the user's OS-level dark mode setting.
 */
export type ColorScheme = "light" | "dark";

/**
 * Theme color palette configuration.
 * Includes all colors used throughout the application.
 */
export interface ThemePalette {
  mode: ThemeMode;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  borders: string;
  accents: {
    blue: string;
    green: string;
    red: string;
  };
  card: {
    /** Card background color */
    background: string;
    /** Card heading text color */
    heading: string;
    /** Card body text color */
    text: string;
  };
}

