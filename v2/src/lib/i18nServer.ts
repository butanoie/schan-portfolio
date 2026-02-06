/**
 * Server-side i18n utilities.
 *
 * This module is safe to use in server components and server actions.
 * It does not import any client-side dependencies like i18next or React hooks.
 * Imports only from i18n-constants to avoid pulling in client-side i18next config.
 *
 * @module lib/i18nServer
 */

import { LOCALES, DEFAULT_LOCALE, type Locale } from './i18n-constants';

/**
 * Get the user's preferred locale from cookies (server-side).
 *
 * This function should only be called in server components.
 * It reads the locale from the 'locale' cookie set by LocaleProvider.
 * Falls back to DEFAULT_LOCALE if no cookie is found.
 *
 * @param cookieString - The cookie header string from the request
 * @returns The user's preferred locale or default
 *
 * @example
 * // In a server component
 * import { cookies } from 'next/headers';
 * import { getLocaleFromCookie } from '@/src/lib/i18nServer';
 *
 * const cookieStore = await cookies();
 * const locale = getLocaleFromCookie(cookieStore.toString());
 *
 * @example
 * // Parse from request headers
 * const locale = getLocaleFromCookie(req.headers.cookie || '');
 */
export function getLocaleFromCookie(cookieString: string): Locale {
  try {
    // Parse cookies from header string
    const cookies = cookieString.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=').map(c => c.trim());
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);

    const locale = cookies['locale'];
    // Validate that the locale is a supported locale
    if (locale && LOCALES.includes(locale as Locale)) {
      return locale as Locale;
    }
  } catch {
    // If parsing fails, just return default
  }

  return DEFAULT_LOCALE;
}
