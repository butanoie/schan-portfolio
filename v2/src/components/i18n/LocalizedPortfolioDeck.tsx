'use client';

/**
 * Client component that displays localized portfolio page deck content.
 *
 * This component:
 * - Retrieves portfolio content from i18n translations
 * - Updates when user changes language
 * - Displays the portfolio intro section with localized text
 *
 * Must be used inside a component that has i18n context (via useI18n hook).
 *
 * @module components/i18n/LocalizedPortfolioDeck
 */

import PageDeck from '../common/PageDeck';
import { getLocalizedPortfolioData } from '@/src/data/portfolio';
import { useI18n } from '@/src/hooks/useI18n';

/**
 * Displays portfolio page deck with localized content.
 *
 * Retrieves and displays the portfolio intro section (heading and paragraphs)
 * in the current user's selected language via i18n translations from pages.json.
 *
 * **Features:**
 * - Uses i18n to automatically get translated content
 * - Responsive to language changes through i18n context
 * - Clean synchronous rendering with no async state management
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
 * @returns PageDeck component with localized content
 */
export function LocalizedPortfolioDeck() {
  const { t, locale } = useI18n();
  const data = getLocalizedPortfolioData(t, locale);

  return <PageDeck content={data.pageDeck} />;
}
