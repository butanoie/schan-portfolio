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
 * 1. **narrow** (Mobile, default)
 *    - Stacked vertically: Title → Tags → Description → Image Grid
 *    - Used on mobile devices and small viewports
 *
 * 2. **wide-regular** (Desktop, no video)
 *    - Left 2/3: Description with tags
 *    - Right 1/3: Narrow image grid (2 columns)
 *    - Used on desktop when project has no video
 *
 * 3. **wide-video** (Desktop with video)
 *    - Left 1/3: Tags + Description
 *    - Right 2/3: Video placeholder + 4-column image grid
 *    - Used on desktop when project has video
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
 * @returns A skeleton placeholder matching ProjectDetail structure
 *
 * @example
 * <ProjectSkeleton variant="wide-video" />
 *
 * @example
 * <ProjectSkeleton variant="narrow" />
 *
 * @example
 * import { useReducedMotion } from 'hooks';
 *
 * function SkeletonLoader() {
 *   const prefersReducedMotion = useReducedMotion();
 *   return <ProjectSkeleton variant="wide-regular" />;
 * }
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
 * Structure: Stacked vertically
 * 1. Tags row
 * 2. Description paragraphs
 * 3. 4-column Image grid
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
            sx={{ paddingBottom: '75%', position: 'relative' }}
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Skeleton for desktop wide-regular layout (no video).
 *
 * Structure:
 * - Left 2/3: Description with tags floating to the right
 * - Right 1/3: 2-column image grid
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
            sx={{ paddingBottom: '75%', position: 'relative' }}
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * Skeleton for desktop wide-video layout.
 *
 * Structure:
 * - Left 1/3: Tags + Description
 * - Right 2/3: Video placeholder + 4-column image grid
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
              sx={{ paddingBottom: '75%', position: 'relative' }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
