'use client';

import {
  Box,
  Skeleton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useReducedMotion } from '../../hooks';

/**
 * Props for the ProjectSkeleton component.
 *
 * @interface ProjectSkeletonProps
 * @property {('narrow' | 'wide-regular' | 'wide-video')} [variant='narrow'] - Layout variant to match ProjectDetail
 * @property {SxProps<Theme>} [sx] - Additional MUI sx styles
 */
interface ProjectSkeletonProps {
  /**
   * Layout variant matching ProjectDetail responsive behavior:
   * - 'narrow': Mobile layout, stacked vertically
   * - 'wide-regular': Desktop without video, 2fr-1fr grid
   * - 'wide-video': Desktop with video, 1fr-2fr grid with video placeholder
   *
   * @default 'wide-regular'
   */
  variant?: 'narrow' | 'wide-regular' | 'wide-video';

  /** Additional MUI sx styles to apply */
  sx?: SxProps<Theme>;
}

/**
 * Loading skeleton placeholder that matches ProjectDetail layout structure.
 *
 * This component displays a shimmer animation while project content is loading.
 * It intelligently selects the appropriate layout variant to match the viewport
 * and project configuration, just like ProjectDetail does.
 *
 * **Layout Variants:**
 *
 * 1. **narrow** (Mobile, default) - Stacked vertically: Title → Tags → Description → Image Grid. Used on mobile devices and small viewports.
 *
 * 2. **wide-regular** (Desktop, no video) - Left 2/3: Description with tags. Right 1/3: Narrow image grid (2 columns). Used on desktop when project has no video.
 *
 * 3. **wide-video** (Desktop with video) - Left 1/3: Tags + Description. Right 2/3: Video placeholder + 4-column image grid. Used on desktop when project has video.
 *
 * **Animation Behavior:**
 * - Shows wave animation by default (shimmer effect)
 * - Respects user's reduced motion preference (WCAG 2.2)
 * - Smooth 0.2s transitions matching project patterns
 * - Animation disabled when prefers-reduced-motion is enabled
 *
 * **Accessibility:**
 * - Marked with aria-busy="true" to inform screen readers content is loading
 * - Uses role="progressbar" to convey loading state
 * - High contrast skeletons visible to all users
 * - Motion respects WCAG 2.2 accessibility standards
 *
 * **Performance:**
 * - Lightweight component, no heavy calculations
 * - Renders quickly to show loading state immediately
 * - No images or media, pure CSS-based
 *
 * **Usage Example:**
 * ```typescript
 * // Show during project loading
 * {loading && <ProjectSkeleton variant="wide-video" />}
 *
 * // Match viewport-specific layout
 * <ProjectSkeleton variant={isMobile ? 'narrow' : 'wide-regular'} />
 *
 * // Multiple skeletons for batch loading
 * {Array.from({ length: 5 }).map((_, i) => (
 *   <ProjectSkeleton key={i} variant={layoutVariant} />
 * ))}
 * ```
 *
 * @param props - Component props
 * @param props.variant - Layout variant: 'narrow' for mobile, 'wide-regular' for desktop without video, 'wide-video' for desktop with video (default: 'narrow')
 * @param props.sx - Optional MUI sx styles to apply to the root container
 * @returns A skeleton placeholder matching ProjectDetail structure
 *
 * @example
 * <ProjectSkeleton variant="wide-video" />
 *
 * @example
 * <ProjectSkeleton variant="narrow" />
 *
 * @example
 * // Responsive skeleton with auto-variant selection
 * <ProjectSkeleton variant="wide-regular" />
 */
export function ProjectSkeleton({
  variant = 'narrow',
  sx,
}: ProjectSkeletonProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const prefersReducedMotion = useReducedMotion();

  // Determine animation based on reduced motion preference
  // When reduced motion is preferred, disable the wave animation
  const animationMode = prefersReducedMotion ? false : ('wave' as const);

  // Build responsive variant based on viewport if not explicitly set
  const responsiveVariant =
    variant === 'narrow'
      ? 'narrow'
      : isMobile
        ? 'narrow'
        : variant;

  return (
    <Box
      component="section"
      role="progressbar"
      aria-busy="true"
      aria-label="Loading project details"
      sx={{
        transition: prefersReducedMotion
          ? 'none'
          : 'opacity 0.2s ease-in-out',
        ...sx,
      }}
    >
      {/* Divider between projects */}
      <Divider sx={{ mt: 6, mb: 4, mx: 8 }} />

      {/* Project title skeleton - always full width */}
      <Skeleton
        animation={animationMode}
        variant="text"
        width="60%"
        height={48}
        sx={{ mb: 2, mx: 'auto' }}
      />

      {/* Layout-specific skeletons */}
      {responsiveVariant === 'narrow' && (
        <NarrowLayoutSkeleton
          animationMode={animationMode}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

      {responsiveVariant === 'wide-regular' && (
        <WideRegularLayoutSkeleton
          animationMode={animationMode}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

      {responsiveVariant === 'wide-video' && (
        <WideVideoLayoutSkeleton
          animationMode={animationMode}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
    </Box>
  );
}

/**
 * Skeleton for mobile narrow layout.
 *
 * Displays a stacked vertical layout skeleton that matches the mobile view of ProjectDetail.
 * Shows placeholder skeletons for tags, description paragraphs, and a 4-column image grid.
 *
 * **Structure:**
 * 1. Tags row (3 placeholder tags)
 * 2. Description paragraphs (3 skeleton lines)
 * 3. Image grid (4 images in 2 columns on xs, 4 columns on sm+)
 *
 * @param props - Component props
 * @param props.animationMode - Animation type: 'wave' for shimmer effect or false to disable
 * @param props.prefersReducedMotion - Whether user prefers reduced motion
 * @returns A skeleton container with narrow layout structure
 */
function NarrowLayoutSkeleton({
  animationMode,
  prefersReducedMotion,
}: {
  animationMode: 'wave' | false;
  prefersReducedMotion: boolean;
}) {
  return (
    <Box
      sx={{
        transition: prefersReducedMotion
          ? 'none'
          : 'opacity 0.2s ease-in-out',
      }}
    >
      {/* Tags row */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={`tag-${i}`}
            animation={animationMode}
            variant="rounded"
            width={80}
            height={24}
          />
        ))}
      </Box>

      {/* Description paragraphs */}
      <Box sx={{ mb: 3 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={`desc-${i}`}
            animation={animationMode}
            variant="text"
            width="100%"
            height={20}
            sx={{ mb: i < 2 ? 1 : 0 }}
          />
        ))}
      </Box>

      {/* Image grid - 2 columns on xs, 4 columns on sm and wider */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={`img-${i}`}
            animation={animationMode}
            variant="rectangular"
            width="100%"
            sx={{ paddingBottom: '75%', position: 'relative', borderRadius: 2, }}
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Skeleton for desktop wide-regular layout (no video).
 *
 * Displays a two-column grid layout skeleton that matches the desktop view of ProjectDetail
 * when no video is present. Features a left column with description and right-floated tags,
 * and a right column with a 2-column image grid.
 *
 * **Structure:**
 * - Left 2/3: Description with 3 placeholder tags floating to the right
 * - Right 1/3: 2-column image grid with 4 placeholder images
 * - Description: 4 skeleton lines with the last one at 80% width
 *
 * @param props - Component props
 * @param props.animationMode - Animation type: 'wave' for shimmer effect or false to disable
 * @param props.prefersReducedMotion - Whether user prefers reduced motion
 * @returns A skeleton container with wide-regular layout structure
 */
function WideRegularLayoutSkeleton({
  animationMode,
  prefersReducedMotion,
}: {
  animationMode: 'wave' | false;
  prefersReducedMotion: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '2fr 1fr' },
        gap: { xs: 2, sm: 3, md: 4 },
        transition: prefersReducedMotion
          ? 'none'
          : 'opacity 0.2s ease-in-out',
      }}
    >
      {/* Left column: Description with floated tags */}
      <Box>
        {/* Floated tags row */}
        <Box
          sx={{
            float: 'right',
            ml: { xs: 1, sm: 2, md: 2 },
            mb: 1,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            maxWidth: { md: '50%' },
            justifyContent: 'flex-end',
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`tag-${i}`}
              animation={animationMode}
              variant="rounded"
              width={80}
              height={24}
            />
          ))}
        </Box>

        {/* Description paragraphs */}
        <Box>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={`desc-${i}`}
              animation={animationMode}
              variant="text"
              width={i === 3 ? '80%' : '100%'}
              height={20}
              sx={{ mb: i < 3 ? 1 : 0 }}
            />
          ))}
        </Box>

        {/* Clear float after content */}
        <Box sx={{ clear: 'both' }} />
      </Box>

      {/* Right column: Image grid (2 columns for narrow) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={`img-${i}`}
            animation={animationMode}
            variant="rectangular"
            width="100%"
            sx={{ paddingBottom: '75%', position: 'relative', borderRadius: 2, }}
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Skeleton for desktop wide-video layout.
 *
 * Displays a two-column grid layout skeleton that matches the desktop view of ProjectDetail
 * when a video is present. Features a left column with tags and description, and a right
 * column with a video placeholder and 4-column image grid.
 *
 * **Structure:**
 * - Left 1/3: 3 placeholder tags + 3 description skeleton lines
 * - Right 2/3: Video placeholder (16:9 aspect ratio) + 8 images in 4-column grid
 * - All images use 4:3 aspect ratio (75% padding-bottom)
 *
 * @param props - Component props
 * @param props.animationMode - Animation type: 'wave' for shimmer effect or false to disable
 * @param props.prefersReducedMotion - Whether user prefers reduced motion
 * @returns A skeleton container with wide-video layout structure
 */
function WideVideoLayoutSkeleton({
  animationMode,
  prefersReducedMotion,
}: {
  animationMode: 'wave' | false;
  prefersReducedMotion: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '1fr 2fr' },
        gap: { xs: 2, sm: 3, md: 4 },
        transition: prefersReducedMotion
          ? 'none'
          : 'opacity 0.2s ease-in-out',
      }}
    >
      {/* Left column: Tags + Description */}
      <Box>
        {/* Tags row */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`tag-${i}`}
              animation={animationMode}
              variant="rounded"
              width={80}
              height={24}
            />
          ))}
        </Box>

        {/* Description paragraphs */}
        <Box>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`desc-${i}`}
              animation={animationMode}
              variant="text"
              width="100%"
              height={20}
              sx={{ mb: i < 2 ? 1 : 0 }}
            />
          ))}
        </Box>
      </Box>

      {/* Right column: Video + Image grid (4 columns) */}
      <Box>
        {/* Video placeholder - aspect ratio 16:9 */}
        <Skeleton
          animation={animationMode}
          variant="rectangular"
          width="100%"
          sx={{ paddingBottom: '56.25%', position: 'relative', mb: 3 }}
        />

        {/* Image grid - 4 columns for wide */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={`img-${i}`}
              animation={animationMode}
              variant="rectangular"
              width="100%"
              sx={{ paddingBottom: '75%', position: 'relative', borderRadius: 2, }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
