/**
 * Data localization utilities for projects and portfolio content.
 *
 * Provides functions to merge base project/portfolio data with locale-specific
 * translations from JSON files. This allows the data structure to remain in
 * projects.ts and portfolio.ts while keeping translatable strings in locale
 * JSON files.
 *
 * @module data/localization
 */

import type { Project } from '../types';
import type { Locale } from '../lib/i18n';
import { PROJECTS } from './projects';
import { portfolioData as basePortfolioData } from './portfolio';

/**
 * Imported locale data type for project and portfolio translations.
 *
 * @internal
 */
interface LocaleData {
  projects: Record<
    string,
    {
      title: string;
      desc: string;
      circa: string;
      images: string[];
    }
  >;
  portfolio: {
    pageTitle: string;
    pageDescription: string;
    heading: string;
    paragraphs: string[];
  };
}

/**
 * Cache for loaded locale data to avoid repeated imports.
 *
 * @internal
 */
const localeCache = new Map<Locale, LocaleData | null>();

/**
 * Dynamically import locale data for a given locale.
 *
 * @param locale - The locale to load (e.g., 'en', 'fr')
 * @returns The imported locale data or null if not found
 * @internal
 */
async function loadLocaleData(locale: Locale): Promise<LocaleData | null> {
  try {
    const localeDataModule = await import(`@/src/locales/${locale}/data.json`);
    return localeDataModule.default || localeDataModule;
  } catch {
    return null;
  }
}

/**
 * Get locale data from cache or load it dynamically.
 *
 * @param locale - The locale to get data for
 * @returns The locale data or null if not found
 * @internal
 */
async function getLocaleData(locale: Locale): Promise<LocaleData | null> {
  if (localeCache.has(locale)) {
    return localeCache.get(locale) || null;
  }

  const data = await loadLocaleData(locale);
  localeCache.set(locale, data);
  return data;
}

/**
 * Get a localized project with translated title, description, and image captions.
 *
 * Merges the base project structure from PROJECTS with translated strings from
 * the locale JSON files. Falls back to the base English version if translation
 * is not available.
 *
 * @param projectId - The project ID to localize
 * @param locale - The target locale
 * @returns Localized project object, or undefined if project not found
 *
 * @example
 * const project = await getLocalizedProject('collabspace', 'fr');
 * // Returns project with French title, description, and image captions
 *
 * @throws May throw if there are issues loading locale data dynamically
 */
export async function getLocalizedProject(
  projectId: string,
  locale: Locale
): Promise<Project | undefined> {
  const baseProject = PROJECTS.find((p) => p.id === projectId);
  if (!baseProject) {
    return undefined;
  }

  const localeData = await getLocaleData(locale);
  if (!localeData?.projects[projectId]) {
    return baseProject;
  }

  const translations = localeData.projects[projectId];

  return {
    ...baseProject,
    title: translations.title,
    desc: translations.desc,
    circa: translations.circa,
    images: baseProject.images.map((image, index) => ({
      ...image,
      caption: translations.images[index] || image.caption,
    })),
  };
}

/**
 * Get all localized projects for a given locale.
 *
 * Returns the complete project list with all translations applied. Falls back
 * to English versions if translations are not available.
 *
 * @param locale - The target locale
 * @returns Array of localized projects
 *
 * @example
 * const projects = await getLocalizedProjects('fr');
 * // Returns all 18 projects with French translations
 */
export async function getLocalizedProjects(locale: Locale): Promise<Project[]> {
  const localeData = await getLocaleData(locale);
  if (!localeData) {
    return [...PROJECTS];
  }

  return Promise.all(
    PROJECTS.map(async (project) => {
      const localized = await getLocalizedProject(project.id, locale);
      return localized || project;
    })
  );
}

/**
 * Localized portfolio page data including title, description, and introduction paragraphs.
 *
 * @param locale - The target locale
 * @returns Portfolio data with translations applied
 *
 * @example
 * const portfolio = await getLocalizedPortfolio('fr');
 * // Returns portfolio with French page title and introduction text
 */
export async function getLocalizedPortfolio(locale: Locale) {
  const localeData = await getLocaleData(locale);
  if (!localeData?.portfolio) {
    return {
      pageTitle: basePortfolioData.pageTitle,
      pageDescription: basePortfolioData.pageDescription,
      pageDeck: basePortfolioData.pageDeck,
    };
  }

  const translations = localeData.portfolio;

  return {
    pageTitle: translations.pageTitle,
    pageDescription: translations.pageDescription,
    pageDeck: {
      ...basePortfolioData.pageDeck,
      heading: translations.heading,
      deck: translations.paragraphs,
    },
  };
}

/**
 * Get a single project's image caption in a specific locale.
 *
 * Useful for components that need to update image captions based on locale
 * without re-fetching the entire project.
 *
 * @param projectId - The project ID
 * @param imageIndex - The index of the image in the project's images array
 * @param locale - The target locale
 * @returns The localized caption string, or the base caption if not found
 *
 * @example
 * const caption = await getLocalizedImageCaption('collabspace', 0, 'fr');
 * // Returns French caption for first image of Collabspace project
 */
export async function getLocalizedImageCaption(
  projectId: string,
  imageIndex: number,
  locale: Locale
): Promise<string> {
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project || imageIndex >= project.images.length) {
    return '';
  }

  if (locale === 'en') {
    return project.images[imageIndex].caption;
  }

  const localeData = await getLocaleData(locale);
  if (!localeData?.projects[projectId]?.images[imageIndex]) {
    return project.images[imageIndex].caption;
  }

  return localeData.projects[projectId].images[imageIndex];
}
