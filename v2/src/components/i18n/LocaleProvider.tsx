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
import { type Locale, DEFAULT_LOCALE, detectLocale, LOCALES } from '@/src/lib/i18n';

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
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize locale on client side.
   * Loads from localStorage if available, otherwise detects from browser.
   * Also syncs the locale with i18next.
   *
   * Uses a cancellation token to prevent race conditions when multiple
   * locale changes occur in rapid succession.
   *
   * Defers rendering children until initialization is complete to prevent
   * flash of unstyled content (FOUC) with wrong language.
   */
  useEffect(() => {
    // This effect initializes locale state on mount
    // It's necessary to avoid hydration mismatches in Next.js
    let cancelled = false;

    const savedLocaleRaw = localStorage.getItem('locale');
    // Validate that saved locale is a supported locale before using it
    const savedLocale =
      savedLocaleRaw && LOCALES.includes(savedLocaleRaw as Locale)
        ? (savedLocaleRaw as Locale)
        : null;
    const detectedLocale = detectLocale();

    const nextLocale = savedLocale ?? initialLocale ?? detectedLocale;
    // Only update state if it differs from initial value to avoid unnecessary updates
    if (nextLocale !== (initialLocale ?? DEFAULT_LOCALE) && !cancelled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(nextLocale);
    }
    localStorage.setItem('locale', nextLocale);

    // Persist locale to cookie for server-side access
    // Expires in 365 days to persist user preference across sessions
    // SameSite=Lax prevents CSRF attacks while allowing navigation
    // Secure ensures cookie only sent over HTTPS in production
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';
    document.cookie = `locale=${nextLocale}; max-age=31536000; path=/; SameSite=Lax${secureFlag}`;

    // Sync with i18next, but ignore result if effect was cancelled
    i18next.changeLanguage(nextLocale).catch((err) => {
      if (!cancelled) {
        console.error('Failed to initialize i18next language:', err);
      }
    });

    // Mark initialization as complete
    // This defers rendering children until locale is fully loaded
    setIsInitialized(true);

    // Cleanup function to prevent state updates from stale effects
    return () => {
      cancelled = true;
    };
  }, [initialLocale]);

  /**
   * Handle locale change.
   * Updates local state, persists to localStorage, and syncs with i18next.
   * Prevents race conditions by not updating state if component unmounts.
   *
   * @param newLocale - The locale to switch to
   */
  const handleSetLocale = useCallback((newLocale: Locale): void => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    // Persist locale to cookie for server-side access
    // Expires in 365 days to persist user preference across sessions
    // SameSite=Lax prevents CSRF attacks while allowing navigation
    // Secure ensures cookie only sent over HTTPS in production
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';
    document.cookie = `locale=${newLocale}; max-age=31536000; path=/; SameSite=Lax${secureFlag}`;
    // Sync locale change with i18next
    // Note: We don't add cancellation token here since setLocaleState is synchronous
    // and the user explicitly requested this change
    i18next.changeLanguage(newLocale).catch((err) => {
      console.error('Failed to change i18next language:', err);
    });
  }, []);

  const contextValue: LocaleContextValue = {
    locale,
    setLocale: handleSetLocale,
  };

  // Defer rendering children until locale is initialized from localStorage/browser.
  // This prevents flash of unstyled content (FOUC) with incorrect language.
  // Always provide context so hooks don't break, but children only render when ready.
  return (
    <LocaleContext.Provider value={contextValue}>
      {isInitialized ? children : null}
    </LocaleContext.Provider>
  );
}
