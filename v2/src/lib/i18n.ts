/**
 * i18n (Internationalization) configuration and utilities.
 *
 * Centralizes internationalization setup including:
 * - Locale list and defaults
 * - String translation lookup
 * - Locale-aware formatting (dates, numbers, currency)
 * - RTL support foundation
 *
 * Current support: English (en)
 * Future: Add additional locales by extending LOCALES array
 *
 * @module lib/i18n
 */

/**
 * Supported locales in the application.
 * Add new locales here when implementing additional languages.
 */
export const LOCALES = ['en'] as const;

/**
 * Default locale when no preference is specified.
 */
export const DEFAULT_LOCALE = 'en' as const;

/**
 * Type representing a supported locale.
 */
export type Locale = (typeof LOCALES)[number];

/**
 * Type-safe translation keys to prevent runtime errors.
 * Enables IDE autocomplete for translation strings.
 * Extend this as new translation keys are added.
 */
export type TranslationKey =
  // Common UI strings
  | 'common.home'
  | 'common.portfolio'
  | 'common.resume'
  | 'common.colophon'
  | 'common.about'
  // Navigation
  | 'nav.home'
  | 'nav.portfolio'
  | 'nav.resume'
  | 'nav.colophon'
  | 'nav.skipToMain'
  | 'nav.social.linkedin'
  | 'nav.social.github'
  // Buttons
  | 'buttons.loadMore'
  | 'buttons.loadingProjects'
  | 'buttons.allLoaded'
  | 'buttons.close'
  | 'buttons.previous'
  | 'buttons.next'
  | 'buttons.downloadPDF'
  // Page titles
  | 'pages.home.title'
  | 'pages.home.subtitle'
  | 'pages.resume.title'
  | 'pages.resume.downloadPDF'
  | 'pages.colophon.title'
  | 'pages.colophon.subtitle'
  | 'pages.project.relatedProjects'
  | 'pages.project.viewAllProjects'
  // Footer
  | 'footer.copyright'
  | 'footer.madeWith'
  | 'footer.designedAndBuilt'
  // Resume sections
  | 'resume.workExperience'
  | 'resume.coreCompetencies'
  | 'resume.clients'
  | 'resume.speakingEngagements'
  | 'resume.contactLabel'
  | 'resume.emailLabel'
  | 'resume.phoneLabel'
  // Settings
  | 'settings.theme'
  | 'settings.lightTheme'
  | 'settings.darkTheme'
  | 'settings.highContrastTheme';

/**
 * Translations for all supported locales.
 * Structure: { locale: { key: value } }
 */
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Common UI strings
    'common.home': 'Home',
    'common.portfolio': 'Portfolio',
    'common.resume': 'Résumé',
    'common.colophon': 'Colophon',
    'common.about': 'About',
    // Navigation
    'nav.home': 'Home',
    'nav.portfolio': 'Portfolio',
    'nav.resume': 'Résumé',
    'nav.colophon': 'Colophon',
    'nav.skipToMain': 'Skip to main content',
    'nav.social.linkedin': 'LinkedIn',
    'nav.social.github': 'GitHub',
    // Buttons
    'buttons.loadMore': 'Load more projects',
    'buttons.loadingProjects': 'Loading projects...',
    'buttons.allLoaded': 'All projects loaded',
    'buttons.close': 'Close',
    'buttons.previous': 'Previous',
    'buttons.next': 'Next',
    'buttons.downloadPDF': 'Download as PDF',
    // Page titles
    'pages.home.title': 'Portfolio',
    'pages.home.subtitle': 'A selection of my work',
    'pages.resume.title': 'Résumé',
    'pages.resume.downloadPDF': 'Download as PDF',
    'pages.colophon.title': 'About',
    'pages.colophon.subtitle': 'About this site and Sing',
    'pages.project.relatedProjects': 'Related Projects',
    'pages.project.viewAllProjects': 'View All Projects',
    // Footer
    'footer.copyright': '© 2013-2026 Sing Chan. All rights reserved.',
    'footer.madeWith': 'Made with Next.js, React, and TypeScript',
    'footer.designedAndBuilt': 'Designed and built by Sing Chan',
    // Resume sections
    'resume.workExperience': 'Work Experience',
    'resume.coreCompetencies': 'Core Competencies',
    'resume.clients': 'Notable Clients',
    'resume.speakingEngagements': 'Speaking Engagements',
    'resume.contactLabel': 'Contact',
    'resume.emailLabel': 'Email',
    'resume.phoneLabel': 'Phone',
    // Settings
    'settings.theme': 'Theme',
    'settings.lightTheme': 'Light theme',
    'settings.darkTheme': 'Dark theme',
    'settings.highContrastTheme': 'High contrast theme',
  },
};

/**
 * Get translated string for a given key and locale.
 *
 * Returns the translation for the specified key, or the key itself if not found.
 * This allows graceful degradation if a translation is missing.
 *
 * @param key - Translation key (e.g., 'common.home')
 * @param locale - Locale to translate into (default: en)
 * @returns Translated string or key if translation not found
 *
 * @example
 * const text = t('common.home'); // Returns "Home"
 * const text = t('common.home', 'en'); // Returns "Home"
 *
 * @throws Nothing - returns key if translation not found
 */
export function t(key: TranslationKey, locale: Locale = DEFAULT_LOCALE): string {
  return translations[locale]?.[key] ?? key;
}

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
