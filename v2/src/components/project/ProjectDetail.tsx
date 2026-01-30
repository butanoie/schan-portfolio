'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { ProjectHeader } from './ProjectHeader';
import { ProjectDescription } from './ProjectDescription';
import { VideoEmbed } from './VideoEmbed';
import { RelatedProjects } from './RelatedProjects';
import { ProjectGallery } from '@/src/components/ProjectGallery';
import type { Project } from '@/src/types/project';

/**
 * Layout variant types for ProjectDetail component.
 */
export type ProjectDetailLayout =
  | 'wide-video'
  | 'wide-regular'
  | 'wide-alternate'
  | 'narrow'
  | 'narrow-video';

/**
 * Props for the ProjectDetail component.
 */
export interface ProjectDetailProps {
  /** Project data to display */
  project: Project;

  /** Optional layout hint to override automatic layout selection */
  layoutHint?: ProjectDetailLayout;

  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * Complete project detail page layout with all components.
 *
 * ## Features
 * - **Adaptive Layouts:** Automatically selects optimal layout based on content
 * - **Video Integration:** Embeds videos when present
 * - **Image Gallery:** Full project gallery with lightbox
 * - **Related Projects:** Suggests similar projects based on tags
 * - **Responsive Design:** Optimized layouts for mobile and desktop
 *
 * ## Layout Variants
 * - **wide-video:** Desktop layout with video at top (projects with videos)
 * - **wide-regular:** Standard desktop layout (projects without videos)
 * - **wide-alternate:** Alternate grid layout for complex image arrangements
 * - **narrow:** Mobile-friendly single column layout
 * - **narrow-video:** Mobile layout with video at top
 *
 * ## Layout Selection Logic
 * If layoutHint is provided, it's used directly. Otherwise:
 * 1. Mobile + videos → narrow-video
 * 2. Desktop + videos → wide-video
 * 3. altGrid flag → wide-alternate
 * 4. Mobile → narrow
 * 5. Default → wide-regular
 *
 * ## Component Composition
 * - ProjectHeader: Title, circa badge, and tags
 * - VideoEmbed: Embedded video player (if videos exist)
 * - ProjectDescription: Sanitized HTML description
 * - ProjectGallery: Image grid with lightbox
 * - RelatedProjects: Related projects based on tags
 *
 * @param props - Component props
 * @param props.project - Complete project data object
 * @param props.layoutHint - Optional layout override
 * @param props.sx - Optional styling overrides
 * @returns A complete project detail page layout
 *
 * @example
 * ```tsx
 * // Automatic layout selection
 * <ProjectDetail project={project} />
 * ```
 *
 * @example
 * ```tsx
 * // Force specific layout
 * <ProjectDetail
 *   project={project}
 *   layoutHint="wide-video"
 * />
 * ```
 */
export function ProjectDetail({
  project,
  layoutHint,
  sx,
}: ProjectDetailProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Determines the optimal layout based on project content and device.
   *
   * @param proj - Project data
   * @param mobile - Whether viewing on mobile device
   * @param hint - Optional layout hint to override auto-selection
   * @returns Selected layout variant
   */
  const selectLayout = (
    proj: Project,
    mobile: boolean,
    hint?: ProjectDetailLayout
  ): ProjectDetailLayout => {
    // Use hint if provided
    if (hint) {
      return hint;
    }

    // Mobile with videos
    if (proj.videos.length > 0 && mobile) {
      return 'narrow-video';
    }

    // Desktop with videos
    if (proj.videos.length > 0) {
      return 'wide-video';
    }

    // Alternate grid layout
    if (proj.altGrid) {
      return 'wide-alternate';
    }

    // Mobile default
    if (mobile) {
      return 'narrow';
    }

    // Desktop default
    return 'wide-regular';
  };

  const layout = selectLayout(project, isMobile, layoutHint);

  /**
   * Gets container styles based on selected layout.
   *
   * @param selectedLayout - The layout variant
   * @returns SxProps for the main container
   */
  const getContainerStyles = (selectedLayout: ProjectDetailLayout): SxProps<Theme> => {
    const baseStyles: SxProps<Theme> = {
      width: '100%',
      paddingX: { xs: 2, sm: 3, md: 4 },
      paddingY: { xs: 3, md: 4 },
    };

    switch (selectedLayout) {
      case 'wide-video':
      case 'wide-alternate':
        return {
          ...baseStyles,
          maxWidth: { xs: '100%', lg: '1400px' },
          marginX: 'auto',
        };

      case 'wide-regular':
        return {
          ...baseStyles,
          maxWidth: { xs: '100%', lg: '1200px' },
          marginX: 'auto',
        };

      case 'narrow':
      case 'narrow-video':
        return {
          ...baseStyles,
          maxWidth: { xs: '100%', md: '800px' },
          marginX: 'auto',
        };

      default:
        return baseStyles;
    }
  };

  /**
   * Determines header layout based on overall layout.
   *
   * @param selectedLayout - The layout variant
   * @returns Header layout variant
   */
  const getHeaderLayout = (
    selectedLayout: ProjectDetailLayout
  ): 'inline' | 'stacked' | 'floating' => {
    if (selectedLayout.startsWith('narrow')) {
      return 'stacked';
    }
    return 'inline';
  };

  return (
    <Box
      component="article"
      sx={[
        getContainerStyles(layout),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Project Header */}
      <ProjectHeader
        title={project.title}
        circa={project.circa}
        tags={project.tags}
        layout={getHeaderLayout(layout)}
      />

      {/* Video Embed (if videos exist) */}
      {project.videos.length > 0 && (
        <VideoEmbed
          video={project.videos[0]}
          lazy={true}
        />
      )}

      {/* Project Description */}
      <ProjectDescription html={project.desc} />

      {/* Project Gallery */}
      <ProjectGallery
        images={project.images}
        altGrid={project.altGrid}
        sx={{ marginBottom: 4 }}
      />

      {/* Related Projects */}
      <RelatedProjects
        projectId={project.id}
        limit={3}
      />
    </Box>
  );
}
