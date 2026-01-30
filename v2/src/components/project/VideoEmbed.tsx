'use client';

import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useInView } from '@/src/hooks/useInView';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import type { ProjectVideo } from '@/src/types/project';

/**
 * Props for the VideoEmbed component.
 */
export interface VideoEmbedProps {
  /** Video configuration (type, id, dimensions) */
  video: ProjectVideo;

  /** Enable lazy loading (load iframe only when visible) */
  lazy?: boolean;

  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * Embeds Vimeo or YouTube videos with lazy loading support.
 *
 * ## Features
 * - **Multi-Platform:** Supports Vimeo and YouTube embeds
 * - **Lazy Loading:** Defers iframe loading until video is visible
 * - **Responsive:** Maintains aspect ratio across screen sizes
 * - **Accessibility:** Includes descriptive titles for screen readers
 * - **Performance:** Respects prefers-reduced-motion setting
 *
 * ## Lazy Loading
 * When `lazy={true}`, the iframe is only loaded when the video container
 * becomes visible in the viewport (using Intersection Observer). This
 * improves initial page load performance.
 *
 * ## Supported Platforms
 * - **Vimeo:** Uses player.vimeo.com/video/{id}
 * - **YouTube:** Uses youtube.com/embed/{id}
 *
 * ## Accessibility
 * - Each iframe has a descriptive title attribute
 * - Respects user's prefers-reduced-motion setting
 * - Semantic HTML structure
 *
 * @param props - Component props
 * @param props.video - Video configuration object
 * @param props.lazy - Enable lazy loading (default: true)
 * @param props.sx - Optional styling overrides
 * @returns A responsive video embed container
 *
 * @example
 * ```tsx
 * <VideoEmbed
 *   video={{
 *     type: 'vimeo',
 *     id: '123456789',
 *     width: 640,
 *     height: 360
 *   }}
 *   lazy={true}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // YouTube embed
 * <VideoEmbed
 *   video={{
 *     type: 'youtube',
 *     id: 'dQw4w9WgXcQ',
 *     width: 1920,
 *     height: 1080
 *   }}
 * />
 * ```
 */
export function VideoEmbed({ video, lazy = true, sx }: VideoEmbedProps) {
  const [ref, isInView, hasBeenInView] = useInView<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  const prefersReducedMotion = useReducedMotion();

  /**
   * Generates the embed URL based on the video platform.
   *
   * @param videoConfig - Video configuration
   * @returns Complete iframe src URL
   */
  const getEmbedUrl = (videoConfig: ProjectVideo): string => {
    switch (videoConfig.type) {
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoConfig.id}?title=0&byline=0&portrait=0`;

      case 'youtube':
        return `https://www.youtube.com/embed/${videoConfig.id}?rel=0&modestbranding=1`;

      default:
        return '';
    }
  };

  /**
   * Generates an accessible title for the iframe.
   *
   * @param videoConfig - Video configuration
   * @returns Descriptive title string
   */
  const getIframeTitle = (videoConfig: ProjectVideo): string => {
    const platform = videoConfig.type === 'vimeo' ? 'Vimeo' : 'YouTube';
    return `${platform} video player`;
  };

  /**
   * Calculates the aspect ratio percentage for the container.
   *
   * @param videoConfig - Video configuration
   * @returns Padding percentage for aspect ratio
   */
  const getAspectRatio = (videoConfig: ProjectVideo): number => {
    return (videoConfig.height / videoConfig.width) * 100;
  };

  // Determine if iframe should be loaded
  const shouldLoadIframe = !lazy || hasBeenInView;

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${getAspectRatio(video)}%`,
        backgroundColor: '#000',
        borderRadius: 1,
        overflow: 'hidden',
        marginBottom: 4,
        ...sx,
      }}
      role="region"
      aria-label={`Video: ${getIframeTitle(video)}`}
    >
      {shouldLoadIframe ? (
        <Box
          component="iframe"
          src={getEmbedUrl(video)}
          title={getIframeTitle(video)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: prefersReducedMotion ? 1 : 0,
            animation: prefersReducedMotion
              ? 'none'
              : isInView
              ? 'fadeIn 0.3s ease-in forwards'
              : 'none',

            '@keyframes fadeIn': {
              from: {
                opacity: 0,
              },
              to: {
                opacity: 1,
              },
            },
          }}
        />
      ) : (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: '0.875rem',
            opacity: 0.7,
          }}
        >
          Loading video...
        </Box>
      )}
    </Box>
  );
}
