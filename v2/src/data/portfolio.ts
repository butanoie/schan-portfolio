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

/**
 * Base projects page content with fallback English values.
 * Content based on V1 portfolio intro and updated for V2.
 */
export const portfolioData: ProjectsPageData = {
  pageTitle: "Sing Chan's Body of Work",
  pageDescription:
    "On this page you will find select projects that represent my knowledge and experience in the realms of web application development, design, usability and accessibility.",

  pageDeck: {
    imageUrl: "/images/pork_cuts@2x.png",
    imageAlt: "Sing Chan's Body of Work",
    headingId: "portfolio-heading",
    heading: "Sing Chan",
    paragraphs: [
      "On this page you will find select projects that represent my knowledge and experience in the realms of web application development, design, usability and accessibility. I have over 25 years experience in software development where I work with customers, stakeholders, information architects, interaction designers, developers, and quality assurance to create usable and visually engaging solutions.",
      "I was involved in these projects either as the lead User Experience Developer responsible for implementing custom UI functionality, controls and branding, or as the User Experience Architect, responsible for determining development approaches and assisting other team members with their tasks.",
    ],
  },
};

/**
 * Builds localized portfolio data by retrieving translated strings from i18n.
 *
 * This function should be called within a component using the useI18n hook
 * to provide translated content for the portfolio page.
 *
 * @param t - i18n translation function from useI18n()
 * @returns Localized portfolio data with translated strings
 *
 * @example
 * const { t } = useI18n();
 * const localizedData = getLocalizedPortfolioData(t);
 */
export function getLocalizedPortfolioData(
  t: TranslationFunction
): ProjectsPageData {
  return {
    pageTitle: t('home.pageTitle', { ns: 'pages' }),
    pageDescription: t('home.pageDescription', { ns: 'pages' }),

    pageDeck: {
      imageUrl: '/images/pork_cuts@2x.png',
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
