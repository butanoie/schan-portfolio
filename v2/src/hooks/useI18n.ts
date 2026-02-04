/**
 * Hook for accessing localized strings and formatting utilities.
 *
 * Provides convenient access to:
 * - t(): Get translated string
 * - formatDate(): Locale-aware date formatting
 * - formatNumber(): Locale-aware number formatting
 * - formatCurrency(): Currency formatting
 * - locale: Current locale
 *
 * @module hooks/useI18n
 */

'use client';

import { useContext } from 'react';
import {
  t,
  formatDate,
  formatNumber,
  formatCurrency,
  type Locale,
  type TranslationKey,
} from '@/src/lib/i18n';
import { LocaleContext } from '@/src/contexts/LocaleContext';

/**
 * Interface for the i18n utilities returned by useI18n.
 */
export interface I18nUtils {
  /**
   * Get translated string for a key.
   *
   * @param key - Translation key
   * @returns Translated string
   */
  t: (key: TranslationKey) => string;

  /**
   * Format date according to current locale.
   *
   * @param date - Date to format
   * @returns Formatted date string
   */
  formatDate: (date: Date) => string;

  /**
   * Format number according to current locale.
   *
   * @param number - Number to format
   * @param options - Intl.NumberFormat options
   * @returns Formatted number string
   */
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;

  /**
   * Format currency according to current locale.
   *
   * @param amount - Amount to format
   * @param currency - Currency code (e.g., 'USD')
   * @returns Formatted currency string
   */
  formatCurrency: (amount: number, currency?: string) => string;

  /**
   * Current locale.
   */
  locale: Locale;
}

/**
 * Hook for accessing localized strings and formatting utilities.
 *
 * Must be used inside a LocaleProvider. Provides all i18n utilities
 * bound to the current locale context.
 *
 * @returns i18n utilities object
 * @throws Error if used outside LocaleProvider
 *
 * @example
 * const { t, formatDate, locale } = useI18n();
 * const translated = t('common.home'); // "Home"
 */
export function useI18n(): I18nUtils {
  const locale = useContext(LocaleContext);

  if (!locale) {
    throw new Error(
      'useI18n must be used inside a LocaleProvider. ' +
        'Wrap your component tree with <LocaleProvider> in your layout.'
    );
  }

  // Return object with all i18n utilities bound to current locale
  /* eslint-disable jsdoc/require-jsdoc */
  const result: I18nUtils = {
    t: (key: TranslationKey) => t(key, locale),
    formatDate: (date: Date) => formatDate(date, locale),
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(number, locale, options),
    formatCurrency: (amount: number, currency: string = 'USD') =>
      formatCurrency(amount, currency, locale),
    locale,
  };
  /* eslint-enable jsdoc/require-jsdoc */

  return result;
}
