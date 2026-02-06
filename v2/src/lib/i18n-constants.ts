/**
 * i18n constants and type definitions.
 *
 * This module contains only constants and types for internationalization.
 * It does not import i18next configuration or any client-side dependencies,
 * making it safe to use in both server and client components.
 *
 * @module lib/i18n-constants
 */

/**
 * Supported locales in the application.
 * Add new locales here when implementing additional languages.
 */
export const LOCALES = ['en', 'fr'] as const;

/**
 * Default locale when no preference is specified.
 */
export const DEFAULT_LOCALE = 'en' as const;

/**
 * Type representing a supported locale.
 */
export type Locale = (typeof LOCALES)[number];
