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
  | 'narrow'
  | 'narrow-video';

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
 * - Has video → `narrow-video`
 * - No video → `narrow`
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
    return hasVideo ? 'narrow-video' : 'narrow';
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
 * narrow (Mobile, No video):
 * - Stacked vertically: Title, Tags, Description, 4-column grid
 *
 * narrow-video (Mobile + Video):
 * - Stacked vertically: Title, Tags, Description, Video, 4-column grid
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
    <Box component="section">
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
      {layoutVariant === 'wide-video' && (
        <WideVideoLayout project={project} />
      )}
      {layoutVariant === 'wide-regular' && (
        <WideRegularLayout project={project} />
      )}
      {layoutVariant === 'wide-alternate' && (
        <WideAlternateLayout project={project} />
      )}
      {layoutVariant === 'narrow' && (
        <NarrowLayout project={project} />
      )}
      {layoutVariant === 'narrow-video' && (
        <NarrowVideoLayout project={project} />
      )}
    </Box>
  );
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
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '1fr 2fr' },
        gap: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Left column: Tags + Date + Description */}
      <ProjectDescription
        html={project.desc}
        tags={project.tags}
        circa={project.circa}
      />

      {/* Right column: Video + Gallery */}
      <Box>
        {project.videos && project.videos.length > 0 && (
          <VideoEmbed video={project.videos[0]} />
        )}
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
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '2fr 1fr' },
        gap: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Left column: Description with floating tags and date */}
      <ProjectDescription
        html={project.desc}
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
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '1fr 2fr' },
        gap: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Left column: Tags + Date + Description */}
      <ProjectDescription
        html={project.desc}
        tags={project.tags}
        circa={project.circa}
      />

      {/* Right column: Gallery (4-column grid) */}
      <ProjectGallery images={project.images} fourColumns />
    </Box>
  );
}

/**
 * Mobile layout without video.
 *
 * Structure: Stacked vertically
 * 1. Tags
 * 2. Description
 * 3. 4-column thumbnail grid
 *
 * @param {ProjectDetailProps} props - Component props
 * @returns The rendered narrow layout
 */
function NarrowLayout({ project }: ProjectDetailProps) {
  return (
    <Box>
      <ProjectDescription
        html={project.desc}
        tags={project.tags}
        circa={project.circa}
        sx={{ mb: 3 }}
      />
      <ProjectGallery images={project.images} />
    </Box>
  );
}

/**
 * Mobile layout with video.
 *
 * Structure: Stacked vertically
 * 1. Tags
 * 2. Description
 * 3. Video player
 * 4. 4-column thumbnail grid
 *
 * @param {ProjectDetailProps} props - Component props
 * @returns The rendered narrow-video layout
 */
function NarrowVideoLayout({ project }: ProjectDetailProps) {
  return (
    <Box>
      <ProjectDescription
        html={project.desc}
        tags={project.tags}
        circa={project.circa}
        sx={{ mb: 3 }}
      />
      {project.videos && project.videos.length > 0 && (
        <VideoEmbed video={project.videos[0]} sx={{ mb: 3 }} />
      )}
      <ProjectGallery images={project.images} />
    </Box>
  );
}
