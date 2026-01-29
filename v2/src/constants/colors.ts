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
  /** Deep red for headings, CTAs, and active states */
  maroon: "#8B1538",

  /** Darker maroon for hover states */
  maroonDark: "#6B1028",

  /** Dark charcoal for primary text */
  graphite: "#2C2C2C",

  /** Sage green for footer background */
  sage: "#85b09c",
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
  active: "#ae113d",

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
 * All colors exported as a single object for convenience.
 */
export const COLORS = {
  brand: BRAND_COLORS,
  ui: UI_COLORS,
  nav: NAV_COLORS,
} as const;
