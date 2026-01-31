import { Metadata } from 'next';
import { getProjects, getTagCounts } from '../src/lib/projectData';
import { PortfolioPageClient } from '../src/components/portfolio/PortfolioPageClient';

/**
 * Metadata for the portfolio homepage.
 *
 * Optimized for SEO and social sharing with OpenGraph tags.
 */
export const metadata: Metadata = {
  title: 'Portfolio - Sing Chan',
  description:
    'Full-stack developer and UX designer with 20+ years of experience building enterprise web applications, SharePoint solutions, and cloud-based records management systems.',
  openGraph: {
    title: 'Portfolio - Sing Chan',
    description:
      'Full-stack developer and UX designer with 20+ years of experience.',
    type: 'website',
  },
};

/**
 * Homepage server component for the portfolio.
 *
 * This component fetches initial data server-side for fast first paint,
 * then hands off interactivity to the client component.
 *
 * **Server Component Benefits:**
 * - Initial data fetched at build time (static generation)
 * - No client-side JavaScript needed for initial render
 * - SEO-friendly with pre-rendered HTML
 *
 * **Client Component Hydration:**
 * - Filters, search, and pagination handled client-side
 * - URL state management for shareable links
 * - Progressive enhancement approach
 *
 * @returns Portfolio homepage with server-rendered initial state
 *
 * @example
 * // Navigating to / renders the homepage
 * // Navigating to /?tags=React,TypeScript&search=dashboard
 * // loads with those filters applied client-side
 */
export default async function HomePage() {
  // Fetch initial data server-side (first page, no filters)
  const initialData = getProjects({
    page: 1,
    pageSize: 6,
  });

  // Fetch tag counts for filter UI
  const tagCounts = getTagCounts();

  return (
    <PortfolioPageClient initialData={initialData} tagCounts={tagCounts} />
  );
}
