'use client';

/**
 * Client component that displays localized portfolio page deck content.
 *
 * This component:
 * - Fetches portfolio content based on current locale
 * - Re-fetches when user changes language
 * - Handles loading and error states
 * - Falls back to English if localization fails
 *
 * Must be used inside LocaleProvider to access locale context.
 *
 * @module components/i18n/LocalizedPortfolioDeck
 */

import { useEffect, useState } from 'react';
import PageDeck from '../common/PageDeck';
import { getLocalizedPortfolio } from '@/src/data/localization';
import { useLocale } from '@/src/hooks/useLocale';
import { portfolioData } from '@/src/data/portfolio';
import type { ProjectsPageData } from '@/src/types/porfolio';

/**
 * Props for LocalizedPortfolioDeck component.
 */
interface LocalizedPortfolioDeckProps {
  /**
   * Initial portfolio data (server-rendered fallback)
   * Used if localization fails or during hydration
   */
  initialData?: ProjectsPageData;
}

/**
 * Displays portfolio page deck with localized content.
 *
 * Fetches and displays the portfolio intro section (heading and paragraphs)
 * in the current user's selected language. Re-fetches when the user changes
 * their language preference.
 *
 * **Features:**
 * - Fetches localized portfolio data on mount and when locale changes
 * - Handles loading state gracefully
 * - Falls back to English content if localization unavailable
 * - Uses initial data during server hydration
 *
 * **Usage:**
 * ```
 * import { LocalizedPortfolioDeck } from '@/src/components/i18n/LocalizedPortfolioDeck';
 *
 * export default function HomePage() {
 *   return (
 *     <Container>
 *       <LocalizedPortfolioDeck />
 *       {rest of page}
 *     </Container>
 *   );
 * }
 * ```
 *
 * @param props - Component props
 * @param props.initialData - Initial portfolio data (optional fallback)
 * @returns PageDeck component with localized content
 */
export function LocalizedPortfolioDeck({
  initialData = portfolioData,
}: LocalizedPortfolioDeckProps) {
  const { locale } = useLocale();
  const [data, setData] = useState<ProjectsPageData>(initialData);

  /**
   * Fetch localized portfolio data when locale changes.
   * Updates the displayed content to match the user's language preference.
   */
  useEffect(() => {
    let cancelled = false;

    /**
     * Asynchronously loads localized portfolio data and updates component state.
     *
     * Fetches the portfolio content for the current locale and updates the data state
     * if the component is still mounted. Falls back to initial data if the fetch fails.
     */
    const loadLocalizedData = async () => {
      try {
        const localizedData = await getLocalizedPortfolio(locale);
        if (!cancelled) {
          setData(localizedData);
        }
      } catch (error) {
        // Silently fall back to initial data if fetch fails
        if (!cancelled) {
          console.error('Failed to load localized portfolio data:', error);
          setData(initialData);
        }
      }
    };

    loadLocalizedData();

    // Cleanup to prevent state updates after unmount
    return () => {
      cancelled = true;
    };
  }, [locale, initialData]);

  // Don't render PageDeck until we have data
  if (!data) {
    return null;
  }

  return <PageDeck content={data.pageDeck} />;
}
