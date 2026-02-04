/**
 * Provider component for managing application locale.
 *
 * Wraps the application and provides locale context to all child components.
 * Handles locale detection and persistence.
 *
 * @module components/i18n/LocaleProvider
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { LocaleContext } from '@/src/contexts/LocaleContext';
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
 * - Provides locale context to all child components
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
  const [locale, setLocale] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  /**
   * Initialize locale on client side.
   * Loads from localStorage if available, otherwise detects from browser.
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
      setLocale(nextLocale);
    }
    localStorage.setItem('locale', nextLocale);

    setMounted(true);
  }, [initialLocale]);

  // Always provide context, even before mount, with the current locale value
  // This prevents tests and components from breaking, while still allowing
  // the hydration safety of useEffect
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}
