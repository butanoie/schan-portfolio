/**
 * Projects page data - introduction and header content for the projects portfolio.
 *
 * This data is used by the home/projects page to display:
 * - Portfolio creator name
 * - Logo/mascot image
 * - Introductory paragraphs about the projects and experience
 *
 * All user-facing strings are localized via i18n from en/home.json and fr/home.json.
 * Use getLocalizedPortfolioData(t) to retrieve translated content.
 */

import type { ProjectsPageData } from '../types/porfolio';
import type { TranslationFunction } from '../hooks/useI18n';
import type { Locale } from '../lib/i18n-constants';
import { getLocalizedImageUrl } from '../utils/imageLocalization';

/**
 * Builds localized portfolio data by retrieving translated strings from i18n.
 *
 * This function should be called within a component using the useI18n hook
 * to provide translated content for the portfolio page. It also loads the
 * correct localized image based on the current language.
 *
 * @param t - i18n translation function from useI18n()
 * @param locale - Current locale to select correct language-specific images
 * @returns Localized portfolio data with translated strings and localized images
 *
 * @example
 * const { t, locale } = useI18n();
 * const localizedData = getLocalizedPortfolioData(t, locale);
 */
export function getLocalizedPortfolioData(
  t: TranslationFunction,
  locale: Locale
): ProjectsPageData {
  return {
    pageTitle: t('home.pageTitle', { ns: 'pages' }),
    pageDescription: t('home.pageDescription', { ns: 'pages' }),

    pageDeck: {
      imageUrl: getLocalizedImageUrl('pork_cuts@2x', locale),
      imageAlt: t('home.pageDeck.imageAlt', { ns: 'pages' }),
      headingId: 'portfolio-heading',
      heading: t('home.pageDeck.heading', { ns: 'pages' }),
      paragraphs: [
        t('home.pageDeck.paragraphs.0', { ns: 'pages' }),
        t('home.pageDeck.paragraphs.1', { ns: 'pages' }),
      ],
    },
  };
}
