'use client';

/**
 * i18next configuration for the application.
 *
 * Sets up i18next with static resources loaded from JSON files.
 * Uses inline resources for both production and test environments to avoid
 * dynamic import issues with Next.js/Turbopack bundler.
 *
 * Namespaces: common (includes openGraph and app meta), pages (merged from home/resume/colophon), components
 * Languages: en, fr
 *
 * MUST BE CLIENT COMPONENT: Uses React Context via initReactI18next
 *
 * @module lib/i18next-config
 */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all locale resources statically to ensure Next.js/Turbopack compatibility
// TypeScript's resolveJsonModule compiler option enables JSON imports
import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enResume from '../locales/en/resume.json';
import enColophon from '../locales/en/colophon.json';
import enComponents from '../locales/en/components.json';

import frCommon from '../locales/fr/common.json';
import frHome from '../locales/fr/home.json';
import frResume from '../locales/fr/resume.json';
import frColophon from '../locales/fr/colophon.json';
import frComponents from '../locales/fr/components.json';

/**
 * Merges page-specific translation files into a single pages namespace.
 *
 * This allows the localization structure to remain organized in separate files while
 * maintaining backward compatibility with the existing 'pages' namespace used in components.
 *
 * @param home - Home page translations
 * @param resume - Resume page translations
 * @param colophon - Colophon page translations
 * @returns Merged pages namespace object
 */
function mergePageTranslations(
  home: Record<string, unknown>,
  resume: Record<string, unknown>,
  colophon: Record<string, unknown>
): Record<string, unknown> {
  return {
    ...home,
    ...resume,
    ...colophon,
  };
}

/**
 * Static translation resources for all supported languages and namespaces.
 * All resources are loaded at build time to ensure Turbopack compatibility
 * and avoid dynamic import resolution issues.
 *
 * Page-specific files (home.json, resume.json, colophon.json) are merged into
 * the 'pages' namespace to maintain backward compatibility.
 */
const resources = {
  en: {
    common: enCommon,
    pages: mergePageTranslations(enHome, enResume, enColophon),
    components: enComponents,
  },
  fr: {
    common: frCommon,
    pages: mergePageTranslations(frHome, frResume, frColophon),
    components: frComponents,
  },
};

/**
 * Initialize i18next with configuration.
 * Uses static resources loaded at build time for optimal Turbopack compatibility.
 */
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      defaultNS: 'common',
      ns: ['common', 'pages', 'components'],
      interpolation: {
        escapeValue: false, // React already protects against XSS
      },
      resources,
      saveMissing: false,
    });
}

export default i18next;
