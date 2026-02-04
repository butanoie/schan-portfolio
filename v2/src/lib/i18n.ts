/**
 * i18n (Internationalization) configuration and utilities.
 *
 * Centralizes internationalization setup including:
 * - Locale list and defaults
 * - Locale-aware formatting (dates, numbers, currency)
 * - RTL support foundation
 *
 * Translation strings are loaded from JSON files in the locales directory
 * using i18next with dynamic imports.
 *
 * Supported locales: English (en), French (fr)
 *
 * @module lib/i18n
 */

// Initialize i18next configuration
import '@/src/lib/i18next-config';

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

/**
 * Format date according to locale.
 *
 * Uses Intl.DateTimeFormat for locale-aware date formatting.
 * Automatically handles locale-specific date ordering and separators.
 *
 * @param date - Date to format
 * @param locale - Locale (default: en-US)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2026-02-03'), 'en-US');
 * // Returns: "February 3, 2026"
 * formatDate(new Date('2026-02-03'), 'de-DE');
 * // Returns: "3. Februar 2026"
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format number according to locale.
 *
 * Uses Intl.NumberFormat for locale-aware number formatting.
 * Automatically handles locale-specific grouping and decimal separators.
 *
 * @param number - Number to format
 * @param locale - Locale (default: en-US)
 * @param options - Intl.NumberFormat options for customization
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234.56, 'en-US'); // Returns: "1,234.56"
 * formatNumber(1234.56, 'de-DE'); // Returns: "1.234,56"
 * formatNumber(1234.56, 'fr-FR'); // Returns: "1 234,56"
 */
export function formatNumber(
  number: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format currency according to locale.
 *
 * Uses Intl.NumberFormat with style: 'currency' for locale-aware currency formatting.
 * Automatically handles currency symbol placement and decimal formatting.
 *
 * @param amount - Amount to format
 * @param currency - Currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param locale - Locale (default: en-US)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56, 'USD', 'en-US');
 * // Returns: "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE');
 * // Returns: "1.234,56 €"
 * formatCurrency(1234.56, 'GBP', 'en-GB');
 * // Returns: "£1,234.56"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Detect user's preferred locale from browser settings.
 *
 * Checks navigator.language and matches against supported locales.
 * Falls back to DEFAULT_LOCALE if no match is found.
 *
 * @returns Detected locale or default
 *
 * @example
 * const userLocale = detectLocale(); // Returns 'en' if navigator.language is 'en-US'
 */
export function detectLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const browserLang = navigator.language.split('-')[0];
  const matchedLocale = LOCALES.find((locale) => locale === browserLang);
  return matchedLocale || DEFAULT_LOCALE;
}

/**
 * Check if a locale is RTL (Right-to-Left).
 *
 * Useful for determining text direction for CSS and layout.
 * Currently only English is supported (LTR).
 * When Arabic, Hebrew, etc. are added, they should return true.
 *
 * @param locale - Locale to check (default: DEFAULT_LOCALE)
 * @returns True if locale is RTL, false otherwise
 *
 * @example
 * isRTL('en'); // Returns false
 * isRTL('ar'); // Would return true when Arabic is supported
 */
export function isRTL(locale: Locale = DEFAULT_LOCALE): boolean {
  // Map of RTL locales
  // Extend this when adding Arabic, Hebrew, Persian, Urdu, etc.
  const rtlLocales: Locale[] = [];
  return rtlLocales.includes(locale);
}
