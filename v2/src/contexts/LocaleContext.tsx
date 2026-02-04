/**
 * React Context for managing application locale/language.
 *
 * Provides current locale and setter function to all components via useLocale hook.
 * Should be wrapped around the application in a provider component.
 *
 * @module contexts/LocaleContext
 */

'use client';

import { createContext } from 'react';
import { type Locale } from '@/src/lib/i18n';

/**
 * Interface for locale context value.
 * Includes both the current locale and a function to change it.
 */
export interface LocaleContextValue {
  /**
   * Current locale (e.g., 'en', 'fr')
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
 * Context providing the current locale and setter function.
 * Value is a LocaleContextValue object or null if outside provider.
 */
export const LocaleContext = createContext<LocaleContextValue | null>(null);
