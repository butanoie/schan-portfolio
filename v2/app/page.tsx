import type { Metadata } from "next";
import { cookies } from "next/headers";
import { fetchProjects } from "../src/lib/projectDataServer";
import { AsyncProjectsList } from "../src/components/project/AsyncProjectsList";
import { LocalizedPortfolioDeck } from "../src/components/i18n/LocalizedPortfolioDeck";
import { Container } from "@mui/material";
import { getLocaleFromCookie } from "../src/lib/i18nServer";
import { PAGE_METADATA, SITE_URL, OG_IMAGE } from "@/src/constants/seo";

/**
 * Metadata for the home page.
 *
 * Includes page-specific title, description, keywords, OpenGraph tags,
 * and canonical URL for the home route.
 */
export const metadata: Metadata = {
  title: PAGE_METADATA.home.title,
  description: PAGE_METADATA.home.description,
  keywords: PAGE_METADATA.home.keywords,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: PAGE_METADATA.home.title,
    description: PAGE_METADATA.home.description,
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },
};

/**
 * Projects page displaying portfolio projects with asynchronous loading.
 *
 * This is the main portfolio page that displays projects progressively:
 * - Initial 5 projects load immediately from server
 * - User can click "Load More" to fetch additional batches
 * - All 18 projects can be loaded on demand
 *
 * **Page Structure:**
 * 1. PageDeck with logo, name, and intro deck paragraphs
 * 2. AsyncProjectsList managing progressive loading
 * 3. Initially shows 5 projects with Load More button
 * 4. Each project displays full details (title, tags, description, images, videos)
 * 5. Responsive layouts from mobile to desktop
 *
 * **Rendering:**
 * - Server Component (async)
 * - Fetches initial 5 projects server-side (fast initial load)
 * - Passes projects to AsyncProjectsList Client Component
 * - Client component manages additional loads on demand
 *
 * **Performance:**
 * - Fast initial page load (only 5 projects)
 * - Server-side data fetching for excellent LCP
 * - On-demand client-side loading for remaining projects
 * - Images optimized by Next.js Image component
 *
 * **User Experience:**
 * - Immediate content display (no skeleton on first load)
 * - Clear "Load 13 more" button in footer thought bubble
 * - Batch loading of 5 projects at a time
 * - Visual feedback with skeleton loaders during load
 *
 * **Accessibility:**
 * - Semantic HTML structure with proper heading hierarchy
 * - Page title as h1 for screen readers via PageDeck
 * - Proper heading levels throughout (h2 for project titles)
 * - ARIA labels and live regions for loading state
 * - Keyboard navigation fully supported
 * - Respects user's reduced motion preferences
 *
 * @returns The rendered projects page with async loading
 *
 * @example
 * // This is the main home page route at /
 * // Displays 5 projects initially, rest load on demand
 */
export default async function PortfolioPage() {
  /**
   * Fetch initial batch of projects server-side.
   * Fetching only 5 projects ensures fast initial page load.
   * User can load more projects on demand via AsyncProjectsList component.
   *
   * Get locale from user's cookie preference to serve localized content.
   * Defaults to English if no preference is set.
   */
  const cookieStore = await cookies();
  const locale = getLocaleFromCookie(cookieStore.toString());
  const { items } = await fetchProjects({ page: 1, pageSize: 5, locale });

  return (
    <Container component="main" role="article" maxWidth="lg">
      {/* Projects header with logo, name, and intro - uses localized content */}
      <LocalizedPortfolioDeck />

      {/* Async projects list with progressive loading */}
      <AsyncProjectsList
        initialProjects={items}
        pageSize={5}
        isHomePage={true}
      />
    </Container>
  );
}
