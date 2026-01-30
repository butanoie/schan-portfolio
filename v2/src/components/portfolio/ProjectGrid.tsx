'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { ProjectCard } from './ProjectCard';
import { BRAND_COLORS } from '@/src/constants/colors';
import type { Project } from '@/src/types/project';

/**
 * Props for the ProjectGrid component.
 */
interface ProjectGridProps {
  /** Array of projects to display */
  projects: Project[];

  /** Whether the grid is in a loading state */
  loading?: boolean;

  /** Click handler called when a project card is clicked */
  onProjectClick: (projectId: string) => void;

  /** Additional MUI sx styles */
  sx?: SxProps<Theme>;
}

/**
 * A responsive grid layout for displaying project cards.
 *
 * Features:
 * - CSS Grid with responsive columns (1 on mobile, 2 on tablet, 3 on desktop)
 * - Loading state with skeleton cards
 * - Empty state with helpful message
 * - Accessible with role="list" and proper ARIA attributes
 * - Priority loading for first 3 cards (above the fold)
 *
 * Layout:
 * - Mobile (xs): 1 column
 * - Tablet (md): 2 columns
 * - Desktop (lg): 3 columns
 * - Gap: 24px (3 MUI spacing units)
 *
 * @param props - Component props
 * @param props.projects - Array of projects to display
 * @param props.loading - Whether the grid is in a loading state
 * @param props.onProjectClick - Click handler called when a project card is clicked
 * @param props.sx - Additional MUI sx styles
 * @returns A grid container with project cards or loading/empty state
 *
 * @example
 * Basic usage
 * ```tsx
 * <ProjectGrid
 *   projects={projects}
 *   loading={false}
 *   onProjectClick={(id) => router.push(`/projects/${id}`)}
 * />
 * ```
 *
 * @example
 * Loading state
 * ```tsx
 * <ProjectGrid
 *   projects={[]}
 *   loading={true}
 *   onProjectClick={() => {}}
 * />
 * ```
 *
 * @example
 * Empty state
 * ```tsx
 * <ProjectGrid
 *   projects={[]}
 *   loading={false}
 *   onProjectClick={() => {}}
 * />
 * ```
 */
export function ProjectGrid({
  projects,
  loading = false,
  onProjectClick,
  sx,
}: ProjectGridProps) {
  // Loading state: show skeleton cards
  if (loading) {
    return (
      <Box
        role="list"
        aria-busy="true"
        aria-label="Loading projects"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 3,
          ...sx,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Box key={index} role="listitem">
            <Skeleton
              variant="rectangular"
              sx={{
                width: '100%',
                paddingTop: '75%',
                borderRadius: 1,
              }}
            />
            <Box sx={{ pt: 2 }}>
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%', mb: 1 }} />
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Skeleton variant="rectangular" sx={{ width: 60, height: 24, borderRadius: 3 }} />
                <Skeleton variant="rectangular" sx={{ width: 60, height: 24, borderRadius: 3 }} />
                <Skeleton variant="rectangular" sx={{ width: 60, height: 24, borderRadius: 3 }} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  // Empty state: show helpful message
  if (projects.length === 0) {
    return (
      <Box
        role="status"
        aria-live="polite"
        sx={{
          textAlign: 'center',
          py: 8,
          ...sx,
        }}
      >
        <Typography
          variant="h5"
          component="p"
          sx={{
            color: BRAND_COLORS.graphite,
            mb: 2,
            fontFamily: '"Oswald", sans-serif',
          }}
        >
          No projects found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: BRAND_COLORS.graphite,
            opacity: 0.7,
          }}
        >
          Try adjusting your filters or search query to see more results.
        </Typography>
      </Box>
    );
  }

  // Loaded state: render project cards
  return (
    <Box
      role="list"
      aria-label="Projects"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
        gap: 3,
        ...sx,
      }}
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          priority={index < 3}
          onClick={onProjectClick}
        />
      ))}
    </Box>
  );
}
