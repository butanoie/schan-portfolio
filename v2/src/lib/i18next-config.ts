/**
 * i18next configuration for the application.
 *
 * Sets up i18next with static resources loaded from JSON files.
 * Uses inline resources for both production and test environments to avoid
 * dynamic import issues with Next.js/Turbopack bundler.
 *
 * Namespaces: common, pages, components, meta
 * Languages: en, fr
 *
 * @module lib/i18next-config
 */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all locale resources statically to ensure Next.js/Turbopack compatibility
// TypeScript's resolveJsonModule compiler option enables JSON imports
import enCommon from '../locales/en/common.json';
import enPages from '../locales/en/pages.json';
import enComponents from '../locales/en/components.json';
import enMeta from '../locales/en/meta.json';

import frCommon from '../locales/fr/common.json';
import frPages from '../locales/fr/pages.json';
import frComponents from '../locales/fr/components.json';
import frMeta from '../locales/fr/meta.json';

/**
 * Static translation resources for all supported languages and namespaces.
 * All resources are loaded at build time to ensure Turbopack compatibility
 * and avoid dynamic import resolution issues.
 */
const resources = {
  en: {
    common: enCommon,
    pages: enPages,
    components: enComponents,
    meta: enMeta,
  },
  fr: {
    common: frCommon,
    pages: frPages,
    components: frComponents,
    meta: frMeta,
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
      ns: ['common', 'pages', 'components', 'meta'],
      interpolation: {
        escapeValue: false, // React already protects against XSS
      },
      resources,
      saveMissing: false,
    });
}

export default i18next;
