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
 * Uses i18next under the hood for translation management.
 *
 * @module hooks/useI18n
 */

'use client';

import { useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatNumber, formatCurrency, type Locale } from '@/src/lib/i18n';
import { LocaleContext } from '@/src/contexts/LocaleContext';

/**
 * Options for the translation function.
 */
export interface TranslationOptions {
  /**
   * Variables to substitute in the translation
   */
  variables?: Record<string, string | number>;

  /**
   * Namespace to use for the translation
   */
  ns?: string;
}

/**
 * Interface for the i18n utilities returned by useI18n.
 */
export interface I18nUtils {
  /**
   * Get translated string for a key.
   *
   * @param key - Translation key (supports nested keys with dot notation)
   * @param options - Optional configuration (variables to substitute, namespace)
   * @returns Translated string
   */
  t: (key: string, options?: TranslationOptions | Record<string, string | number>) => string;

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
 * bound to the current locale context, powered by i18next.
 *
 * @returns i18n utilities object
 * @throws Error if used outside LocaleProvider
 *
 * @example
 * const { t, formatDate, locale } = useI18n();
 * const translated = t('nav.home'); // "Home"
 */
export function useI18n(): I18nUtils {
  const context = useContext(LocaleContext);
  const { t: i18nT } = useTranslation();

  if (!context) {
    throw new Error(
      'useI18n must be used inside a LocaleProvider. ' +
        'Wrap your component tree with <LocaleProvider> in your layout.'
    );
  }

  /**
   * Translate a key using i18next.
   * Wraps i18next's t() function with variable substitution support and namespace handling.
   */
  const t = useCallback(
    (key: string, options?: TranslationOptions | Record<string, string | number>): string => {
      // Determine if options is TranslationOptions or a variables Record
      let variables: Record<string, string | number> | undefined;
      let namespace: string | undefined;

      if (options && typeof options === 'object') {
        if ('variables' in options || 'ns' in options) {
          // It's a TranslationOptions object
          variables = (options as TranslationOptions).variables;
          namespace = (options as TranslationOptions).ns;
        } else {
          // It's a variables Record (backwards compatibility)
          variables = options as Record<string, string | number>;
        }
      }

      // Call i18nT with namespace if provided
      let translation = namespace ? i18nT(key, { ns: namespace }) : i18nT(key);

      // Replace variables in translation with sanitized values to prevent XSS
      if (variables) {
        Object.entries(variables).forEach(([varName, varValue]) => {
          // Sanitize variable values by escaping HTML entities
          const sanitizedValue = String(varValue)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
          translation = translation.replace(`{${varName}}`, sanitizedValue);
        });
      }

      return translation;
    },
    [i18nT]
  );

  /**
   * Memoized format functions to prevent unnecessary re-renders of consumer components.
   * These are wrapped in useCallback to maintain referential equality across renders.
   */
  const formatDateMemo = useCallback(
    (date: Date) => formatDate(date, context.locale),
    [context.locale]
  );

  const formatNumberMemo = useCallback(
    (number: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(number, context.locale, options),
    [context.locale]
  );

  const formatCurrencyMemo = useCallback(
    (amount: number, currency: string = 'USD') =>
      formatCurrency(amount, currency, context.locale),
    [context.locale]
  );

  /**
   * Memoized return object to prevent unnecessary re-renders of consumer components.
   * The object only changes when t function, locale, or format functions change.
   */
  const result = useMemo<I18nUtils>(
    () => ({
      t,
      formatDate: formatDateMemo,
      formatNumber: formatNumberMemo,
      formatCurrency: formatCurrencyMemo,
      locale: context.locale,
    }),
    [t, formatDateMemo, formatNumberMemo, formatCurrencyMemo, context.locale]
  );

  return result;
}
