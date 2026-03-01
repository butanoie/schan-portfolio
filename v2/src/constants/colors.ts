/**
 * Color constants for the portfolio site.
 *
 * These colors are used throughout the colophon page and footer components.
 * Centralizing them here ensures consistency and makes updates easier.
 *
 * Note: These complement the MUI theme colors. For theme-level colors,
 * see the MUI theme configuration.
 */

/**
 * Primary brand colors used for key UI elements.
 */
export const BRAND_COLORS = {
  /** Cherry blossom pink - inspirational pastel color */
  sakura: "#FFF0F5",

  /** Light blue - primary accent color for interactive elements */
  skyBlue: "#E0EDF8",

  /** Pastel green - used for secondary elements and tags */
  duckEgg: "#DCEBE4",

  /** Deep red for headings, CTAs, and active states */
  maroon: "#8B1538",

  /** Darker maroon for hover states */
  maroonDark: "#6B1028",

  /** Maroon at 8% opacity, used for icon button hover backgrounds */
  maroonHover: "rgba(139, 21, 56, 0.08)",

  /** Dark charcoal for primary text */
  graphite: "#2C2C2C",

  /** Sage green for footer background */
  sage: "#85B09C",
} as const;

/**
 * UI element colors for cards, backgrounds, and decorative elements.
 */
export const UI_COLORS = {
  /** Light blue for card backgrounds and thought bubble */
  cardBackground: "#f5f9fd",

  /** Border color for thought bubble and decorative elements */
  border: "#333333",

  /** Secondary text color for thought bubble */
  secondaryText: "#555555",

  /** Light gray for copyright text on dark backgrounds */
  copyrightText: "#f1f1f1",
} as const;

/**
 * Navigation button colors for the footer.
 */
export const NAV_COLORS = {
  /** Active navigation button background */
  active: "#8B1538",

  /** Active navigation button hover */
  activeHover: "#8B1538",

  /** Inactive navigation button background */
  inactive: "#6a8a7a",

  /** Inactive navigation button hover */
  inactiveHover: "#5a7a6a",

  /** Navigation button text color */
  text: "#ffffff",
} as const;

/**
 * MUI theme palette colors.
 * These are used to configure the Material UI theme.
 */
export const THEME_COLORS = {
  /** Primary palette - Sky Blue tones */
  primary: {
    /** Main sky blue for primary actions */
    main: "#87CEEB",
    /** Lighter sky blue variant */
    light: "#B0E0E6",
    /** Darker steel blue variant */
    dark: "#4682B4",
  },

  /** Secondary palette - extends Duck Egg green */
  secondary: {
    /** Lighter mint green variant */
    light: "#E8F5E9",
    /** Darker green variant */
    dark: "#81C784",
  },

  /** Background colors */
  background: {
    /** Default page background */
    default: "#FFFFFF",
    /** Paper/card background */
    paper: "#FFFFFF",
  },

  /** Text colors */
  text: {
    /** Dark gray for secondary text */
    secondary: "#5A5A5A",
    /** Near-black for contrast text on light backgrounds */
    contrast: "#212121",
  },
} as const;

/**
 * Complete theme palette definitions for all three theme modes.
 *
 * Each palette includes:
 * - Primary and secondary colors
 * - Background and surface colors
 * - Text colors (primary, secondary, disabled)
 * - Border colors
 * - Accent colors (blue, green, red)
 * - Card-specific colors
 */
export const THEME_PALETTES = {
  /**
   * Light theme palette.
   * Uses sage green and maroon with light backgrounds.
   * Complies with WCAG AA contrast ratios.
   */
  light: {
    mode: "light" as const,
    primary: "#8BA888", // Sage green
    secondary: "#8B1538", // Maroon
    background: "#FFFFFF",
    surface: "#FAFAFA",
    text: {
      primary: "#1A1A1A",
      secondary: "#333333",
      disabled: "#CCCCCC",
    },
    borders: "#EEEEEE",
    accents: {
      blue: "#87CEEB", // Sky blue
      green: "#C8E6C9", // Light green
      red: "#FFCDD2", // Light red
    },
    card: {
      background: "#f5f9fd",
      heading: "#1A1A1A",
      text: "#333333",
    },
  },

  /**
   * Dark theme palette.
   * Inverted colors for comfortable viewing in low-light environments.
   * Complies with WCAG AA contrast ratios.
   */
  dark: {
    mode: "dark" as const,
    primary: "#A8D5A8", // Light sage
    secondary: "#E85775", // Light maroon
    background: "#121212",
    surface: "#1F1F1F",
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
      disabled: "#666666",
    },
    borders: "#333333",
    accents: {
      blue: "#64B5F6", // Light blue
      green: "#81C784", // Medium green
      red: "#EF9A9A", // Light red
    },
    card: {
      // Card colors use light palette for visual separation and content readability
      // in dark environments. Light background (#f5f9fd) provides contrast against
      // the dark theme background (#121212), ensuring card content is distinct
      // and readable. Dark text (#1A1A1A) on light card background meets WCAG AA.
      background: "#f5f9fd",
      heading: "#1A1A1A",
      text: "#333333",
    },
  },

  /**
   * High-contrast black and white theme palette.
   * Meets WCAG AAA contrast requirements (7:1+).
   * Maximum accessibility for users with low vision.
   */
  highContrast: {
    mode: "highContrast" as const,
    primary: "#FFFFFF",
    secondary: "#FFFFFF",
    background: "#000000",
    surface: "#000000",
    text: {
      primary: "#FFFFFF",
      secondary: "#FFFFFF",
      disabled: "#CCCCCC",
    },
    borders: "#FFFFFF",
    accents: {
      blue: "#FFFF00", // Bright yellow
      green: "#FFFF00",
      red: "#FFFF00",
    },
    card: {
      // High-contrast card uses inverted colors for maximum accessibility.
      // White background (#FFFFFF) ensures complete separation from black (#000000)
      // page background. Black text (#000000) on white card meets WCAG AAA (21:1).
      background: "#FFFFFF",
      heading: "#000000",
      text: "#000000",
    },
  },
} as const;

/**
 * All colors exported as a single object for convenience.
 */
export const COLORS = {
  brand: BRAND_COLORS,
  ui: UI_COLORS,
  nav: NAV_COLORS,
  theme: THEME_COLORS,
  palettes: THEME_PALETTES,
} as const;
