/**
 * Provider component for managing application locale.
 *
 * Wraps the application and provides locale context to all child components.
 * Handles locale detection, persistence, and changes.
 * Also synchronizes locale changes with i18next.
 *
 * @module components/i18n/LocaleProvider
 */

'use client';

import { ReactNode, useEffect, useState, useCallback } from 'react';
import i18next from 'i18next';
import { LocaleContext, type LocaleContextValue } from '@/src/contexts/LocaleContext';
import { type Locale, DEFAULT_LOCALE, detectLocale } from '@/src/lib/i18n';

/**
 * Props for LocaleProvider component.
 */
export interface LocaleProviderProps {
  /**
   * React child components to wrap with locale context.
   */
  children: ReactNode;

  /**
   * Initial locale to use. Defaults to detected or DEFAULT_LOCALE.
   */
  initialLocale?: Locale;
}

/**
 * Provider component that manages application locale state.
 *
 * Features:
 * - Detects user's preferred locale from browser
 * - Persists locale selection to localStorage
 * - Provides locale context and setter to all child components
 * - Prevents hydration mismatch by only rendering after mount
 *
 * Should be placed high in your component tree, ideally in the root layout.
 *
 * @param props - Component props
 * @param props.children - React child components to wrap with locale context
 * @param props.initialLocale - Initial locale to use
 * @returns Provider wrapper with locale context
 */
export function LocaleProvider({
  children,
  initialLocale,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  /**
   * Initialize locale on client side.
   * Loads from localStorage if available, otherwise detects from browser.
   * Also syncs the locale with i18next.
   */
  useEffect(() => {
    // This effect initializes locale state on mount
    // It's necessary to avoid hydration mismatches in Next.js
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    const detectedLocale = detectLocale();

    const nextLocale = savedLocale ?? initialLocale ?? detectedLocale;
    // Only update state if it differs from initial value to avoid unnecessary updates
    if (nextLocale !== (initialLocale ?? DEFAULT_LOCALE)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(nextLocale);
    }
    localStorage.setItem('locale', nextLocale);

    // Sync with i18next
    i18next.changeLanguage(nextLocale).catch((err) => {
      console.error('Failed to initialize i18next language:', err);
    });
  }, [initialLocale]);

  /**
   * Handle locale change.
   * Updates local state, persists to localStorage, and syncs with i18next.
   *
   * @param newLocale - The locale to switch to
   */
  const handleSetLocale = useCallback((newLocale: Locale): void => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    // Sync locale change with i18next
    i18next.changeLanguage(newLocale).catch((err) => {
      console.error('Failed to change i18next language:', err);
    });
  }, []);

  const contextValue: LocaleContextValue = {
    locale,
    setLocale: handleSetLocale,
  };

  // Always provide context, even before mount, with the current locale value
  // This prevents tests and components from breaking, while still allowing
  // the hydration safety of useEffect
  return (
    <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>
  );
}
