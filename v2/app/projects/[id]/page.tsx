import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { getProjectById, getProjects } from '../../../src/lib/projectData';
import { ProjectDetail } from '../../../src/components/project/ProjectDetail';

/**
 * Props for the ProjectPage component.
 * Next.js automatically provides params for dynamic routes.
 */
interface ProjectPageProps {
  params: {
    id: string;
  };
}

/**
 * Generates static paths for all projects at build time.
 *
 * This function is called during `next build` to determine which
 * project IDs should be pre-rendered as static pages.
 *
 * **Benefits:**
 * - All 18 project pages are generated at build time
 * - No server-side rendering needed for project pages
 * - Fast page loads and optimal SEO
 *
 * @returns Array of params objects with project IDs
 *
 * @example
 * // Returns:
 * // [
 * //   { id: 'collabspaceDownloader' },
 * //   { id: 'collabspace' },
 * //   { id: 'collabmail' },
 * //   ...
 * // ]
 */
export async function generateStaticParams() {
  const projects = getProjects({ pageSize: 100 });

  return projects.items.map((project) => ({
    id: project.id,
  }));
}

/**
 * Generates metadata for each project page.
 *
 * Creates SEO-friendly title, description, and OpenGraph tags
 * for social media sharing.
 *
 * @param props - Component props
 * @param props.params - Route params containing project ID (props.params.id)
 * @returns Metadata object for Next.js head tags
 *
 * @example
 * // For project ID "collabspace":
 * // {
 * //   title: "Collabware - Collabspace - Sing Chan Portfolio",
 * //   description: "Collabspace is a FedRAMP certified cloud-based...",
 * //   openGraph: {
 * //     images: ["/images/gallery/collabspace/analytics.jpg"]
 * //   }
 * // }
 */
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  // Strip HTML tags from description for meta tag
  const plainDescription = project.desc
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 160);

  // Get first image for OpenGraph
  const ogImage = project.images[0]?.url || '/images/buta/buta-waving.png';

  return {
    title: `${project.title} - Sing Chan Portfolio`,
    description: plainDescription,
    openGraph: {
      title: `${project.title}`,
      description: plainDescription,
      images: [ogImage],
      type: 'website',
    },
  };
}

/**
 * Project detail page component.
 *
 * Displays comprehensive project information including:
 * - Project header with title, date, and tags
 * - Video embeds (if available)
 * - Project description
 * - Image gallery
 * - Related projects
 *
 * **Static Generation:**
 * - All pages are pre-rendered at build time
 * - Uses `generateStaticParams()` to build all 18 projects
 * - Returns 404 for non-existent project IDs
 *
 * **Navigation:**
 * - Back button returns to portfolio homepage
 * - Related projects link to other project pages
 *
 * @param props - Component props
 * @param props.params - Route params containing project ID (props.params.id)
 * @returns Project detail page or 404 not found
 *
 * @example
 * // URL: /projects/collabspace
 * // Renders: Collabspace project detail page
 *
 * @example
 * // URL: /projects/invalid-id
 * // Renders: Next.js 404 page
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  // Show 404 for non-existent projects
  if (!project) {
    notFound();
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back to portfolio button */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackIcon />}
          variant="text"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'transparent',
            },
          }}
        >
          Back to Portfolio
        </Button>
      </Box>

      {/* Project detail component */}
      <ProjectDetail project={project} />
    </Container>
  );
}
