'use client';

import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { PROJECTS, getProjectById } from '@/src/data/projects';
import { ProjectCard } from '@/src/components/portfolio/ProjectCard';
import type { Project } from '@/src/types/project';
import { BRAND_COLORS } from '@/src/constants/colors';

/**
 * Props for the RelatedProjects component.
 */
export interface RelatedProjectsProps {
  /** ID of the current project to find related projects for */
  projectId: string;

  /** Maximum number of related projects to display */
  limit?: number;

  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * Displays a grid of related projects based on shared technology tags.
 *
 * ## Features
 * - **Tag-Based Matching:** Finds projects with shared technology tags
 * - **Smart Sorting:** Projects with more shared tags appear first
 * - **Responsive Layout:** 3-column grid on desktop, horizontal scroll on mobile
 * - **Navigation:** Click to navigate to project detail page
 * - **Empty State:** Gracefully handles case when no related projects exist
 *
 * ## Related Project Algorithm
 * 1. Filters out the current project
 * 2. Calculates number of shared tags for each remaining project
 * 3. Sorts by number of shared tags (descending)
 * 4. Returns top N projects based on limit
 *
 * ## Layout
 * - **Desktop (lg+):** 3-column grid with gaps
 * - **Tablet (md):** 2-column grid
 * - **Mobile (xs):** Horizontal scroll with snap points
 *
 * @param props - Component props
 * @param props.projectId - Current project ID to exclude and base matching on
 * @param props.limit - Maximum number of related projects (default: 3)
 * @param props.sx - Optional styling overrides
 * @returns A section with related project cards or null if none found
 *
 * @example
 * ```tsx
 * <RelatedProjects
 *   projectId="collabspace"
 *   limit={3}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Show up to 6 related projects
 * <RelatedProjects
 *   projectId="collabwareCLM"
 *   limit={6}
 * />
 * ```
 */
export function RelatedProjects({
  projectId,
  limit = 3,
  sx,
}: RelatedProjectsProps) {
  const router = useRouter();

  /**
   * Finds related projects based on shared technology tags.
   *
   * @param currentProjectId - ID of current project
   * @param maxResults - Maximum number of results to return
   * @returns Array of related projects sorted by relevance
   */
  const getRelatedProjects = (
    currentProjectId: string,
    maxResults: number
  ): Project[] => {
    const currentProject = getProjectById(currentProjectId);

    if (!currentProject) {
      return [];
    }

    // Calculate shared tag count for each project
    const projectsWithScores = PROJECTS.filter(
      (project) => project.id !== currentProjectId
    ).map((project) => {
      // Count how many tags are shared
      const sharedTags = project.tags.filter((tag) =>
        currentProject.tags.includes(tag)
      );

      return {
        project,
        score: sharedTags.length,
      };
    });

    // Sort by score (highest first), then filter out projects with 0 shared tags
    return projectsWithScores
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map((item) => item.project);
  };

  const relatedProjects = getRelatedProjects(projectId, limit);

  // Don't render anything if no related projects found
  if (relatedProjects.length === 0) {
    return null;
  }

  /**
   * Handles navigation to a project detail page.
   *
   * @param id - Project ID to navigate to
   */
  const handleProjectClick = (id: string) => {
    router.push(`/projects/${id}`);
  };

  return (
    <Box
      component="section"
      aria-label="Related projects"
      sx={{
        marginTop: 6,
        marginBottom: 4,
        ...sx,
      }}
    >
      {/* Section Heading */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          color: BRAND_COLORS.graphite,
          marginBottom: 3,
        }}
      >
        Related Projects
      </Typography>

      {/* Related Projects Grid */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'grid' },

          // Mobile: Horizontal scroll
          overflowX: { xs: 'auto', md: 'visible' },
          scrollSnapType: { xs: 'x mandatory', md: 'none' },
          gap: 3,
          paddingBottom: { xs: 2, md: 0 },

          // Desktop: Grid layout
          gridTemplateColumns: {
            xs: undefined,
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },

          // Hide scrollbar on mobile
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
        role="list"
      >
        {relatedProjects.map((project) => (
          <Box
            key={project.id}
            sx={{
              // Mobile: Fixed width for horizontal scroll
              minWidth: { xs: '280px', sm: '320px', md: 'auto' },
              scrollSnapAlign: { xs: 'start', md: 'none' },
            }}
            role="listitem"
          >
            <ProjectCard
              project={project}
              priority={false}
              onClick={handleProjectClick}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
