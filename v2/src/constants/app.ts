/**
 * Application-wide constants for portfolio project.
 *
 * This file centralizes shared constants used across multiple files.
 * Only constants that are actually imported by components/hooks/utilities
 * belong here. Component-specific values should remain inline.
 *
 * **Categories:**
 * - Project Loading: pagination and data fetching
 * - Timing & Animation: delays, transitions, durations
 * - Dimensions & Spacing: pixel measurements
 * - UI Interactions: swipe thresholds
 * - Constraints: min/max values for validation
 * - Validation Patterns: regex for data validation
 *
 * @example
 * // Import and use constants
 * import { LOADING_DELAY, DIALOG_FADE_DURATION } from '@/constants/app';
 */

/**
 * ============================================================================
 * PROJECT LOADING & PAGINATION
 * ============================================================================
 */

/**
 * Simulated loading delay in milliseconds for demonstrating skeleton animations.
 * Set to 0 in production for instant loading. Automatically reduced to 0 in tests.
 * Useful for testing the loading states and skeleton UI without network latency.
 *
 * @default 1000 (production) | 0 (test/SSR)
 */
export const LOADING_DELAY = 1000;

/**
 * ============================================================================
 * TIMING & ANIMATION
 * ============================================================================
 *
 * All animation durations and delays in milliseconds.
 */

/** Dialog/modal fade-in transition duration in milliseconds */
export const DIALOG_FADE_DURATION = 300;

/**
 * ============================================================================
 * DIMENSIONS & SPACING
 * ============================================================================
 *
 * All measurements in pixels. UI control sizes and positioning.
 */

/** Standard offset for lightbox controls (close, prev/next buttons, counter) */
export const LIGHTBOX_CONTROL_OFFSET = 16; // pixels

/** Swipe gesture detection threshold in pixels */
export const SWIPE_THRESHOLD = 50; // pixels

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
