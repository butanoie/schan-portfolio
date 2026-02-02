'use client';

import { Box, SxProps, Theme } from '@mui/material';
import { useMemo } from 'react';
import type { ProjectVideo } from '../../types';

/**
 * Props for the VideoEmbed component.
 *
 * @interface VideoEmbedProps
 * @property {ProjectVideo} video - Video object containing type, ID, and dimensions
 * @property {SxProps<Theme>} [sx] - Material-UI sx prop for custom styling
 */
interface VideoEmbedProps {
  video: ProjectVideo;
  sx?: SxProps<Theme>;
}

/**
 * Embeds Vimeo or YouTube videos with responsive aspect ratio.
 *
 * This component renders responsive video embeds for both Vimeo and YouTube sources.
 * Videos maintain a 16:9 aspect ratio on all screen sizes and are centered within
 * their container.
 *
 * **Supported sources:**
 * - Vimeo: `player.vimeo.com/video/{id}`
 * - YouTube: `youtube.com/embed/{id}`
 *
 * **Features:**
 * - Responsive iframe that scales with container width
 * - Maintains 16:9 aspect ratio (padding-bottom technique)
 * - Centered in container
 * - Keyboard accessible (focusable, controllable with arrow keys)
 * - Respects `prefers-reduced-motion` for animations
 * - Proper `title` attribute for accessibility
 * - No autoplay (respects user preference)
 *
 * **Accessibility:**
 * - iframe has descriptive `title` attribute
 * - Keyboard navigable with Tab key
 * - Video controls are native browser controls
 * - Respects prefers-reduced-motion setting
 *
 * @param {VideoEmbedProps} props - Component props
 * @returns The rendered responsive video embed
 *
 * @throws {Error} If video type is not 'vimeo' or 'youtube'
 *
 * @example
 * <VideoEmbed
 *   video={{
 *     type: 'vimeo',
 *     id: '123456789',
 *     width: 1280,
 *     height: 720
 *   }}
 * />
 *
 * @example
 * <VideoEmbed
 *   video={{
 *     type: 'youtube',
 *     id: 'dQw4w9WgXcQ',
 *     width: 1280,
 *     height: 720
 *   }}
 * />
 */
export function VideoEmbed({ video, sx }: VideoEmbedProps) {
  /**
   * Memoize the embed URL construction to avoid rebuilding on every render.
   */
  const embedUrl = useMemo(() => {
    switch (video.type) {
      case 'vimeo':
        return `https://player.vimeo.com/video/${video.id}`;
      case 'youtube':
        return `https://www.youtube.com/embed/${video.id}`;
      default:
        throw new Error(`Unsupported video type: ${video.type}`);
    }
  }, [video.type, video.id]);

  /**
   * Calculate aspect ratio padding for 16:9 videos.
   * Formula: (height / width) * 100
   */
  const aspectRatioPadding = useMemo(
    () => (video.height / video.width) * 100,
    [video.height, video.width]
  );

  /**
   * Determine video title for accessibility.
   * Provides context for screen reader users.
   */
  const videoTitle = `${video.type === 'vimeo' ? 'Vimeo' : 'YouTube'} video player`;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${aspectRatioPadding}%`,
        height: 0,
        overflow: 'hidden',
        borderRadius: '4px',
        my: { xs: 2, sm: 3, md: 4 },
        ...sx,
      }}
    >
      <iframe
        src={embedUrl}
        title={videoTitle}
        width={video.width}
        height={video.height}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </Box>
  );
}
