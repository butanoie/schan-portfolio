'use client';

import Link from 'next/link';
import { Card, CardContent, Chip, Typography, Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { ProjectImage } from '../ProjectImage';
import { useInView } from '@/src/hooks/useInView';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { BRAND_COLORS } from '@/src/constants/colors';
import type { Project } from '@/src/types/project';

/**
 * Props for the ProjectCard component.
 */
interface ProjectCardProps {
  /** Project data to display */
  project: Project;

  /** Whether this card is above the fold (enables priority image loading) */
  priority?: boolean;

  /** Optional click handler called with project ID */
  onClick?: (projectId: string) => void;

  /** Additional MUI sx styles */
  sx?: SxProps<Theme>;
}

/**
 * A card component displaying a project preview with lazy loading and animations.
 *
 * Features:
 * - Lazy loading with fade-in animation using Intersection Observer
 * - Respects user's reduced motion preferences (WCAG 2.2 AA)
 * - Hover effects: scale and elevation changes
 * - Links to project detail page
 * - Shows project thumbnail, title, date, and tags (first 3)
 * - Fully accessible with keyboard navigation and ARIA labels
 *
 * @param props - Component props
 * @param props.project - Project data to display
 * @param props.priority - Whether this card is above the fold (enables priority image loading)
 * @param props.onClick - Optional click handler called with project ID
 * @param props.sx - Additional MUI sx styles
 * @returns A card element with project preview
 *
 * @example
 * Basic usage in a grid
 * ```tsx
 * <ProjectCard
 *   project={project}
 *   priority={index < 3}
 *   onClick={(id) => router.push(`/projects/${id}`)}
 * />
 * ```
 *
 * @example
 * With custom styling
 * ```tsx
 * <ProjectCard
 *   project={project}
 *   sx={{ maxWidth: 400 }}
 * />
 * ```
 */
export function ProjectCard({
  project,
  priority = false,
  onClick,
  sx,
}: ProjectCardProps) {
  const [ref, , hasBeenInView] = useInView<HTMLElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  const prefersReducedMotion = useReducedMotion();

  // Strip HTML tags from title for aria-label
  const cleanTitle = project.title.replace(/<[^>]*>/g, '');

  /**
   * Handles card click events.
   */
  const handleClick = () => {
    if (onClick) {
      onClick(project.id);
    }
  };

  /**
   * Handles keyboard events for accessibility.
   *
   * @param event - Keyboard event
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Determine opacity for lazy loading fade-in
  const opacity = prefersReducedMotion
    ? 1 // Instant visibility if reduced motion
    : hasBeenInView
      ? 1
      : 0;

  // Determine transition style
  const transition = prefersReducedMotion
    ? 'none'
    : 'opacity 200ms ease-in-out, transform 150ms ease-in-out, box-shadow 150ms ease-in-out';

  // Calculate how many tags to show
  const visibleTags = project.tags.slice(0, 3);
  const remainingTagCount = project.tags.length - 3;

  return (
    <Link
      href={`/projects/${project.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(project.id);
        }
      }}
    >
      <Card
        ref={ref}
        component="article"
        aria-label={cleanTitle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="listitem"
        sx={{
          opacity,
          transition,
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 4,
          },
          '&:focus-visible': {
            outline: `2px solid ${BRAND_COLORS.maroon}`,
            outlineOffset: '2px',
          },
          ...sx,
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
          {project.images.length > 0 && (
            <ProjectImage
              image={project.images[0]}
              size="thumbnail"
              priority={priority}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          )}
        </Box>

        <CardContent>
          {/* Project Title */}
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              color: BRAND_COLORS.graphite,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '3em',
              mb: 1,
            }}
            dangerouslySetInnerHTML={{ __html: project.title }}
          />

          {/* Circa Badge */}
          <Box sx={{ mb: 1.5 }}>
            <Chip
              label={project.circa}
              size="small"
              sx={{
                backgroundColor: BRAND_COLORS.skyBlue,
                color: BRAND_COLORS.graphite,
                fontWeight: 500,
              }}
            />
          </Box>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {visibleTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: BRAND_COLORS.duckEgg,
                  color: BRAND_COLORS.graphite,
                  fontSize: '0.75rem',
                }}
              />
            ))}
            {remainingTagCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: BRAND_COLORS.graphite,
                  alignSelf: 'center',
                  ml: 0.5,
                }}
              >
                +{remainingTagCount} more
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
