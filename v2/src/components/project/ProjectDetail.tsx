'use client';

import type { Project } from '../../types';
import { useMediaQuery, useTheme, Box, Divider, Typography } from '@mui/material';
import { ProjectDescription } from './ProjectDescription';
import { VideoEmbed } from './VideoEmbed';
import { ProjectGallery } from './ProjectGallery';
import { useThemeContext } from "../../contexts/ThemeContext";
import { getPaletteByMode } from "../../lib/themes";

/**
 * Props for the ProjectDetail component.
 *
 * @interface ProjectDetailProps
 * @property {Project} project - Complete project object with all details
 */
interface ProjectDetailProps {
  project: Project;
}

/**
 * Type definition for the layout variant used in ProjectDetail.
 */
type LayoutVariant =
  | 'wide-video'
  | 'wide-regular'
  | 'wide-alternate'
  | 'narrow';

/**
 * Determines which layout variant to use for a project.
 *
 * The layout is determined by:
 *
 * 1. Viewport size (mobile vs desktop)
 * 2. Presence of video content
 * 3. The `altGrid` flag on the project (for desktop without video)
 *
 * **Layout Decision Tree:**
 * Mobile (xs/sm breakpoint):
 * - Always → `narrow` (video rendered conditionally within narrow layout)
 * Desktop (md+ breakpoint):
 * - Has video → `wide-video`
 * - No video + altGrid=true → `wide-alternate`
 * - No video + altGrid=false → `wide-regular`
 *
 * @param {Project} project - Project object to evaluate
 * @param {boolean} isMobile - Whether viewport is mobile-sized
 * @returns {LayoutVariant} The layout variant identifier
 *
 * @example
 * // Desktop project with video
 * getLayoutVariant({ videos: [{ type: 'vimeo', ... }], altGrid: false }, false)
 * // Returns: 'wide-video'
 *
 * @example
 * // Mobile project without video
 * getLayoutVariant({ videos: [], altGrid: true }, true)
 * // Returns: 'narrow'
 */
function getLayoutVariant(
  project: Project,
  isMobile: boolean
): LayoutVariant {
  const hasVideo = project.videos && project.videos.length > 0;

  if (isMobile) {
    return 'narrow';
  }

  // Desktop/tablet
  if (hasVideo) {
    return 'wide-video';
  }

  // No video - check altGrid flag
  return project.altGrid ? 'wide-alternate' : 'wide-regular';
}

/**
 * Main project component that displays a complete project inline.
 *
 * This component composes all project sub-components and implements responsive
 * layout variations. It intelligently selects the appropriate layout based on
 * viewport size, video presence, and project configuration.
 *
 * **Layout Variants:**
 *
 * wide-video (Desktop + Video):
 * - Left 1/3: Tags + Description
 * - Right 2/3: Video player + 4-column thumbnail grid
 *
 * wide-regular (Desktop, No video, altGrid=false):
 * - Left 2/3: Description with tags floating to the right
 * - Right 1/3: 2-column thumbnail grid
 *
 * wide-alternate (Desktop, No video, altGrid=true):
 * - Left 1/3: Tags + Description
 * - Right 2/3: 4-column thumbnail grid
 *
 * narrow (Mobile):
 * - Stacked vertically: Title, Tags, Description, Video (if present), 4-column grid
 *
 * **Features:**
 * - Responsive layout selection based on viewport
 * - Proper semantic HTML with section elements
 * - Heading hierarchy (h2 for project title)
 * - Divider between projects
 * - Consistent spacing and alignment
 * - Accessibility-first approach
 * - Proper color usage from constants
 *
 * @param {ProjectDetailProps} props - Component props
 * @returns The rendered project with appropriate layout
 *
 * @example
 * <ProjectDetail project={projectData} />
 */
export function ProjectDetail({ project }: ProjectDetailProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const layoutVariant = getLayoutVariant(project, isMobile);
  const { mode } = useThemeContext();
  const palette = getPaletteByMode(mode);

  return (
    <Box component="section" className="project-detail">
      {/* Divider between projects */}
      <Divider sx={{ mt: 6, mb: 4, mx: {xs:0, sm: 4, md: 8} }} />

      {/* Project title always full width */}
    <Typography
      component="h2"
      sx={{
        fontFamily: 'Oswald, sans-serif',
        textAlign: 'center',
        color: palette.text.primary,
        fontSize: "2rem",
        mt: 0,
        mb: 2,
      }}
    >
      {project.title}
    </Typography>

      {/* Layout-specific content */}
      <LayoutContent variant={layoutVariant} project={project} />
    </Box>
  );
}

/**
 * Maps a layout variant to the corresponding layout component.
 *
 * This component replaces a chain of conditional renders with a single
 * switch statement for cleaner, more maintainable layout selection.
 *
 * @param props - Component props
 * @param props.variant - The layout variant to render
 * @param props.project - The project data to pass to the layout
 * @returns The rendered layout component for the given variant
 */
function LayoutContent({ variant, project }: { variant: LayoutVariant; project: Project }): React.ReactNode {
  switch (variant) {
    case 'wide-video':
      return <WideVideoLayout project={project} />;
    case 'wide-regular':
      return <WideRegularLayout project={project} />;
    case 'wide-alternate':
      return <WideAlternateLayout project={project} />;
    case 'narrow':
      return <NarrowLayout project={project} />;
  }
}

/**
 * Desktop layout with video.
 *
 * Structure:
 * - Left 1/3: Tags + Description
 * - Right 2/3: Video player + 4-column thumbnail grid
 *
 * @param {ProjectDetailProps} props - Component props
 * @returns The rendered wide-video layout
 */
function WideVideoLayout({ project }: ProjectDetailProps) {
  return (
    <Box
      className="project-layout-grid"
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '1fr 2fr' },
        gap: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Left column: Tags + Date + Description */}
      <ProjectDescription
        paragraphs={project.desc}
        tags={project.tags}
        circa={project.circa}
      />

      {/* Right column: Video + Gallery */}
      <Box>
        <VideoEmbed video={project.videos[0]} />
        <ProjectGallery images={project.images} fourColumns />
      </Box>
    </Box>
  );
}

/**
 * Desktop layout without video (default grid layout).
 *
 * Structure:
 * - Left 2/3: Description with tags floating to the right
 * - Right 1/3: 2-column thumbnail grid
 *
 * @param {ProjectDetailProps} props - Component props
 * @returns The rendered wide-regular layout
 */
function WideRegularLayout({ project }: ProjectDetailProps) {
  return (
    <Box
      className="project-layout-grid"
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '2fr 1fr' },
        gap: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Left column: Description with floating tags and date */}
      <ProjectDescription
        paragraphs={project.desc}
        tags={project.tags}
        circa={project.circa}
        floatTags
        floatedTagsMaxWidth={{ maxWidth: { md: '50%' } }}
      />

      {/* Right column: Gallery */}
      <ProjectGallery images={project.images} narrow />
    </Box>
  );
}

/**
 * Desktop layout without video (alternate grid layout).
 *
 * Structure:
 * - Left 1/3: Tags + Description
 * - Right 2/3: 4-column thumbnail grid
 *
 * @param {ProjectDetailProps} props - Component props
 * @returns The rendered wide-alternate layout
 */
function WideAlternateLayout({ project }: ProjectDetailProps) {
  return (
    <Box
      className="project-layout-grid"
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '1fr 2fr' },
        gap: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Left column: Tags + Date + Description */}
      <ProjectDescription
        paragraphs={project.desc}
        tags={project.tags}
        circa={project.circa}
      />

      {/* Right column: Gallery (4-column grid) */}
      <ProjectGallery images={project.images} fourColumns />
    </Box>
  );
}

/**
 * Mobile layout for all projects (with or without video).
 *
 * Structure: Stacked vertically
 * 1. Tags + Description
 * 2. Video player (if project has video)
 * 3. 4-column thumbnail grid
 *
 * @param {ProjectDetailProps} props - Component props
 * @returns The rendered narrow layout
 */
function NarrowLayout({ project }: ProjectDetailProps) {
  const hasVideo = project.videos && project.videos.length > 0;

  return (
    <Box className="project-layout">
      <ProjectDescription
        paragraphs={project.desc}
        tags={project.tags}
        circa={project.circa}
        sx={{ mb: 3 }}
      />
      {hasVideo && (
        <VideoEmbed video={project.videos[0]} sx={{ mb: 3 }} />
      )}
      <ProjectGallery images={project.images} />
    </Box>
  );
}
