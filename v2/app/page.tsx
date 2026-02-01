import { fetchProjects } from '../src/lib/projectDataServer';
import { ProjectsList } from '../src/components/portfolio/ProjectsList';
import { Container, Typography } from '@mui/material';
import { BRAND_COLORS } from '../src/constants';

/**
 * Projects page displaying all portfolio projects inline.
 *
 * This is the main portfolio page that displays all 18 projects in a single,
 * scrollable view. Each project is rendered with the appropriate responsive
 * layout variant based on viewport size, video presence, and configuration.
 *
 * **Page Structure:**
 * 1. Container with "Projects" heading
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
 * - Page title as h1 for screen readers
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
export default async function ProjectsPage() {
  /**
   * Fetch all projects server-side.
   * Using pageSize: 100 ensures all projects are retrieved without pagination.
   */
  const { items } = await fetchProjects({ pageSize: 100 });

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 3 },
      }}
    >
      {/* Page heading */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          mb: { xs: 4, sm: 5, md: 6 },
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontFamily: 'Oswald, sans-serif',
          color: BRAND_COLORS.maroon,
          fontWeight: 600,
        }}
      >
        Projects
      </Typography>

      {/* Projects list */}
      <ProjectsList projects={items} />
    </Container>
  );
}
