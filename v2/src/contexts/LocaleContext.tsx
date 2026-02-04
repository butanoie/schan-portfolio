/**
 * React Context for managing application locale/language.
 *
 * Provides current locale to all components via useLocale hook.
 * Should be wrapped around the application in a provider component.
 *
 * @module contexts/LocaleContext
 */

'use client';

import { createContext } from 'react';
import { type Locale } from '@/src/lib/i18n';

/**
 * Context providing the current locale.
 * Value is a Locale string ('en', 'fr', etc.)
 */
export const LocaleContext = createContext<Locale | null>(null);
