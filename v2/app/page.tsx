import { fetchProjects } from '../src/lib/projectDataServer';
import { ProjectsList } from '../src/components/project/ProjectsList';
import PageDeck from '../src/components/PageDeck';
import { Container } from '@mui/material';
import { portfolioData } from '../src/data/portfolio';

/**
 * Projects page displaying all portfolio projects inline.
 *
 * This is the main portfolio page that displays all projects in a single,
 * scrollable view. Each project is rendered with the appropriate responsive
 * layout variant based on viewport size, video presence, and configuration.
 *
 * **Page Structure:**
 * 1. PageDeck with logo, name, and intro deck paragraphs
 * 2. ProjectsList component mapping all projects to ProjectDetail
 * 3. Each project displays full details (title, tags, description, images, videos)
 * 4. Responsive layouts from mobile to desktop
 *
 * **Rendering:**
 * - Server Component (async)
 * - Fetches all projects server-side with pageSize: 100 (no pagination)
 * - Passes projects to ProjectsList Client Component
 *
 * **Performance:**
 * - Data fetching happens at build time for static generation
 * - Images are optimized by Next.js Image component
 * - No client-side data loading delay
 *
 * **Accessibility:**
 * - Semantic HTML structure with proper heading hierarchy
 * - Page title as h1 for screen readers via PageDeck
 * - Proper heading levels throughout (h2 for project titles)
 * - ARIA labels where necessary
 * - Keyboard navigation fully supported
 *
 * @returns The rendered projects page
 *
 * @example
 * // This is the main home page route at /
 * // Displays all 18 projects on a single scrollable page
 */
export default async function PortfolioPage() {
  /**
   * Fetch all projects server-side.
   * Using pageSize: 100 ensures all projects are retrieved without pagination.
   */
  const { items } = await fetchProjects({ pageSize: 100 });

  return (
    <Container
      component="main"
      role="article"
      maxWidth="lg"
    >
      {/* Projects header with logo, name, and intro */}
      <PageDeck content={portfolioData.pageDeck} />

      {/* Projects list */}
      <ProjectsList projects={items} />
    </Container>
  );
}
