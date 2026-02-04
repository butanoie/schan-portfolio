/**
 * Hook to access the current application locale.
 *
 * Returns the current locale from LocaleContext.
 * Must be used inside a LocaleProvider.
 *
 * @module hooks/useLocale
 */

'use client';

import { useContext } from 'react';
import { LocaleContext } from '@/src/contexts/LocaleContext';
import { type Locale } from '@/src/lib/i18n';

/**
 * Hook to get the current application locale.
 *
 * Returns the locale string ('en', 'fr', etc.) from context.
 * Useful when you just need the locale without other i18n utilities.
 *
 * @returns Current locale
 * @throws Error if used outside LocaleProvider
 *
 * @example
 * const locale = useLocale(); // Returns 'en'
 * // Use for html lang attribute or conditional rendering
 */
export function useLocale(): Locale {
  const locale = useContext(LocaleContext);

  if (!locale) {
    throw new Error(
      'useLocale must be used inside a LocaleProvider. ' +
        'Wrap your component tree with <LocaleProvider> in your layout.'
    );
  }

  return locale;
}
