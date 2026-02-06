/**
 * Hook to access and modify the current application locale.
 *
 * Returns the current locale and a function to change it from LocaleContext.
 * Must be used inside a LocaleProvider.
 *
 * @module hooks/useLocale
 */

'use client';

import { useContext } from 'react';
import { LocaleContext } from '@/src/contexts/LocaleContext';
import { type Locale } from '@/src/lib/i18n';

/**
 * Interface for the return value of useLocale hook.
 */
export interface UseLocaleReturn {
  /**
   * Current locale ('en', 'fr', etc.)
   */
  locale: Locale;

  /**
   * Function to change the locale.
   *
   * @param newLocale - The locale to switch to
   */
  setLocale: (newLocale: Locale) => void;
}

/**
 * Hook to get and set the current application locale.
 *
 * Returns an object with:
 * - locale: The current locale string ('en', 'fr', etc.)
 * - setLocale: Function to change the locale
 *
 * @returns Object with locale and setLocale function
 * @throws Error if used outside LocaleProvider
 *
 * @example
 * const { locale, setLocale } = useLocale();
 * // Returns locale 'en' and function to change it
 * // Use for html lang attribute, conditional rendering, or changing language
 */
export function useLocale(): UseLocaleReturn {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error(
      'useLocale must be used inside a LocaleProvider. ' +
        'Wrap your component tree with <LocaleProvider> in your layout.'
    );
  }

  return {
    locale: context.locale,
    setLocale: context.setLocale,
  };
}
