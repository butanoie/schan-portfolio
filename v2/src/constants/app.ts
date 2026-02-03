/**
 * Application-wide constants for portfolio project.
 *
 * This file centralizes all magic numbers used throughout the application,
 * making them easy to find, update, and maintain. Organized by category
 * for quick lookup and modification.
 *
 * **Categories:**
 * - Project Loading: pagination and data fetching
 * - Timing & Animation: delays, transitions, durations
 * - Dimensions & Spacing: pixel measurements, padding, margins
 * - Layout Grids: column configurations, aspect ratios
 * - UI Interactions: swipe thresholds, focus states
 * - Constraints: min/max values for validation
 * - Responsive Breakpoints: media query breakpoints
 *
 * @example
 * // Import and use constants
 * import {
 *   TOTAL_PROJECTS,
 *   DEFAULT_PAGE_SIZE,
 *   LOADING_DELAY,
 *   DIALOG_FADE_DURATION,
 *   LIGHTBOX_CONTROL_OFFSET,
 * } from '@/constants/app';
 *
 * // Use in code
 * const hasMore = projects.length < TOTAL_PROJECTS;
 * const nextBatch = await loadProjects(pageNumber, DEFAULT_PAGE_SIZE);
 * const timeout = DIALOG_FADE_DURATION; // 300ms
 */

/**
 * ============================================================================
 * PROJECT LOADING & PAGINATION
 * ============================================================================
 *
 * Configuration for fetching and displaying projects progressively.
 *
 * **Note on TOTAL_PROJECTS:** This is not exported as a constant here.
 * Instead, use `getTotalProjectCount()` from `lib/projectData.ts` to get
 * the total dynamically from the actual project data. This ensures the count
 * automatically updates when new projects are added to the portfolio.
 */

/** Default number of projects loaded per batch/page */
export const DEFAULT_PAGE_SIZE = 5;

/**
 * Simulated loading delay in milliseconds for demonstrating skeleton animations.
 * Set to 0 in production for instant loading. Automatically reduced to 0 in tests.
 * Useful for testing the loading states and skeleton UI without network latency.
 *
 * @default 1500 (production) | 0 (test/SSR)
 */
export const LOADING_DELAY = 1500;

/** Initial page number for project pagination (1-based indexing) */
export const INITIAL_PAGE = 1;

/**
 * ============================================================================
 * TIMING & ANIMATION
 * ============================================================================
 *
 * All animation durations and delays in milliseconds.
 */

/** Dialog/modal fade-in transition duration in milliseconds */
export const DIALOG_FADE_DURATION = 300;

/** Button/control transition duration for hover and focus states */
export const BUTTON_TRANSITION_DURATION = 200; // milliseconds (0.2s)

/**
 * ============================================================================
 * DIMENSIONS & SPACING
 * ============================================================================
 *
 * All measurements in pixels. UI control sizes and positioning.
 */

/** Standard offset for lightbox controls (close, prev/next buttons, counter) */
export const LIGHTBOX_CONTROL_OFFSET = 16; // pixels

/**
 * Lightbox control positioning (buttons and counter in corners).
 * Used for: Close button (top-right), navigation arrows (left/right),
 * image counter (bottom-center).
 */
export const CONTROL_POSITIONING = {
  offset: LIGHTBOX_CONTROL_OFFSET, // 16px from edge
} as const;

/** Swipe gesture detection threshold in pixels */
export const SWIPE_THRESHOLD = 50; // pixels

/** Minimum swipe distance required to trigger image navigation */
export const SWIPE_MIN_DISTANCE = SWIPE_THRESHOLD;

/**
 * Spinner/loading indicator dimensions.
 */
export const SPINNER = {
  size: 20, // pixels
  thickness: 4, // line thickness
} as const;

/**
 * Focus ring styling for keyboard navigation.
 */
export const FOCUS_RING = {
  width: 2, // pixels
  offset: 2, // pixels gap between element and ring
} as const;

/**
 * Close button styling in lightbox.
 */
export const CLOSE_BUTTON = {
  size: 32, // pixels
  iconSize: 20, // pixels (icon within button)
} as const;

/**
 * ============================================================================
 * LAYOUT GRID CONFIGURATIONS
 * ============================================================================
 *
 * Grid column counts and aspect ratio values for responsive layouts.
 */

/**
 * Gallery grid column configurations for different screen sizes.
 * Narrow: 4 columns, Wide: 4 columns (can be overridden per component).
 */
export const GALLERY_GRID = {
  narrow: 4, // columns
  wide: 4, // columns
  alternate: 2, // columns for alternate layout
} as const;

/**
 * Project detail layout grid configurations.
 * For different component types: featured, secondary, tertiary layouts.
 */
export const DETAIL_GRID = {
  featured: '1fr 2fr', // Featured image takes 1/3, content takes 2/3
  secondary: '2fr 1fr', // Content takes 2/3, secondary image takes 1/3
  tertiary: '1fr 2fr', // Alternate layout matching featured
} as const;

/**
 * Image aspect ratios used throughout the portfolio.
 */
export const ASPECT_RATIO = {
  square: '1 / 1',
  standard: '4 / 3', // 1.33:1 - traditional photo aspect ratio
  widescreen: '16 / 9', // 1.78:1 - modern video aspect ratio
} as const;

/**
 * Skeleton placeholder aspect ratios (as percentages for padding-bottom hack).
 * Used to maintain layout stability while loading actual content.
 */
export const SKELETON_ASPECT_RATIO = {
  standard: '75%', // 4:3 aspect ratio (3/4 = 0.75)
  widescreen: '56.25%', // 16:9 aspect ratio (9/16 ≈ 0.5625)
} as const;

/**
 * ============================================================================
 * SKELETON PLACEHOLDER CONFIGURATIONS
 * ============================================================================
 *
 * Default counts for skeleton elements while content loads.
 */

export const SKELETON = {
  tagCount: 3, // Number of tag placeholders
  descriptionLineCount: 3, // Number of text line placeholders
  imageCount: 4, // Number of image placeholders
  lastLineWidth: '80%', // Last text line shorter (more natural)
  tagWidth: 80, // pixels
  tagHeight: 24, // pixels
  lineHeight: 20, // pixels (text skeleton)
  titleHeight: 48, // pixels
} as const;

/**
 * ============================================================================
 * FOOTER COMPONENT DIMENSIONS
 * ============================================================================
 *
 * Positioning and sizing for thought bubble and Buta mascot.
 * Different values for mobile vs. desktop layouts.
 */

export const THOUGHT_BUBBLE = {
  mobile: {
    bottom: 230,
    right: 145,
    width: 180,
    height: 90,
    padding: '15px 16px',
    borderRadius: '160px / 80px',
  },
  desktop: {
    bottom: 165,
    right: 225,
    width: 250,
    height: 125,
    padding: '25px 20px',
  },
} as const;

/**
 * Small decorative circles for thought bubble tails.
 */
export const THOUGHT_BUBBLE_CIRCLE = {
  small: {
    bottom: -25,
    right: 30,
    width: 17,
    height: 17,
  },
  tiny: {
    bottom: -35,
    right: 20,
    width: 8,
    height: 8,
  },
} as const;

/**
 * Buta character mascot positioning and sizing.
 */
export const BUTA_MASCOT = {
  mobile: {
    bottom: 90,
    right: 16,
    width: 180,
    height: 125,
  },
  desktop: {
    bottom: -56,
    right: 16,
    width: 300,
    height: 209,
  },
} as const;

/**
 * Footer padding values (margin-top) for mobile vs. desktop.
 */
export const FOOTER = {
  mobilePadding: 30, // pixels
  desktopPadding: 25, // pixels
  sidePaddingXs: 2, // MUI units
  sidePaddingMd: 3, // MUI units
  sidePaddingLg: 4, // MUI units
  sidePaddingLgMax: 10, // MUI units
  rightPaddingXs: 3, // MUI units
  rightPaddingMd: 5, // MUI units
} as const;

/**
 * ============================================================================
 * DIVIDER & SPACING
 * ============================================================================
 *
 * Spacing around content dividers.
 */

export const DIVIDER = {
  marginTop: 6, // MUI units
  marginBottom: 4, // MUI units
  marginX: 8, // MUI units (horizontal)
} as const;

/**
 * Video embed vertical margins (responsive).
 */
export const VIDEO_EMBED = {
  marginXs: 2, // MUI units (extra small screens)
  marginSm: 3, // MUI units (small screens)
  marginMd: 4, // MUI units (medium+ screens)
  borderRadius: 4, // pixels
} as const;

/**
 * ============================================================================
 * UI STATE & DISABLED STATES
 * ============================================================================
 *
 * Opacity and visibility values for different UI states.
 */

/** Opacity for disabled buttons */
export const DISABLED_OPACITY = 0.6;

/**
 * Box shadow elevation levels (from Material Design).
 * Used in gallery image cards on hover.
 */
export const SHADOW_ELEVATION = {
  default: 2,
  hover: 4,
} as const;

/**
 * ============================================================================
 * RESPONSIVE BREAKPOINTS
 * ============================================================================
 *
 * Media query breakpoints aligned with Material Design UI breakpoints.
 * Used for responsive styling decisions.
 */

/**
 * Custom responsive breakpoint for load more button.
 * Adjust layout at 750px to account for component sizing.
 */
export const CUSTOM_BREAKPOINT = 750; // pixels

/**
 * Next.js Image Optimization breakpoints.
 * Aligned with common device sizes for proper responsive image serving.
 */
export const IMAGE_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/**
 * Image srcSet sizes for responsive image loading.
 * Matches Next.js Image defaults optimized for this portfolio.
 */
export const IMAGE_SIZES = [16, 32, 48, 64, 96, 128, 256, 384];

/**
 * Image cache TTL for production optimization.
 * One year in seconds = 365 days × 24 hours × 60 minutes × 60 seconds.
 * Allows static images to be cached for maximum performance.
 */
export const IMAGE_CACHE_TTL = 31536000; // 1 year in seconds

/**
 * ============================================================================
 * VALIDATION CONSTRAINTS
 * ============================================================================
 *
 * Min/max values for input validation and bounds checking.
 * These prevent oversized data and catch malformed inputs.
 */

/**
 * String length constraints for text validation.
 * Used to prevent DoS attacks via oversized payloads.
 */
export const STRING_CONSTRAINTS = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 10000,
} as const;

/**
 * Image and dimension constraints (in pixels).
 * Used to validate image dimensions and prevent invalid values.
 */
export const DIMENSION_CONSTRAINTS = {
  MIN: 1,
  MAX: 10000,
} as const;

/**
 * Video dimension constraints.
 * YouTube and Vimeo videos should have reasonable player dimensions.
 */
export const VIDEO_CONSTRAINTS = {
  minWidth: 300,
  maxWidth: 1920,
  minHeight: 200,
  maxHeight: 1080,
} as const;

/**
 * ============================================================================
 * VALIDATION PATTERNS
 * ============================================================================
 *
 * Regular expressions for validating specific data formats.
 */

/**
 * Video ID validation patterns for different platforms.
 */
export const VIDEO_ID_PATTERNS = {
  vimeo: /^\d{8,11}$/, // 8-11 digits only
  youtube: /^[a-zA-Z0-9_-]{11}$/, // Exactly 11 alphanumeric + - + _
} as const;
