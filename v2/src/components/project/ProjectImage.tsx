'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ProjectImage as ProjectImageType } from '../../types';
import { useI18n, useAnimations, usePalette } from '../../hooks';

/**
 * Props for the ProjectImage component.
 */
interface ProjectImageProps {
  /** Image data from project */
  image: ProjectImageType;

  /** Display size variant */
  size?: 'thumbnail' | 'full';

  /** Priority loading for above-the-fold images */
  priority?: boolean;

  /** Click handler for image interactions */
  onClick?: () => void;

  /** Additional MUI sx styles */
  sx?: SxProps<Theme>;

  /** Ref forwarded to the interactive button wrapper (used for focus return) */
  buttonRef?: React.Ref<HTMLButtonElement>;
}

/**
 * Optimized image component for project images.
 * Wraps Next.js Image with project-specific configurations.
 *
 * Features:
 * - Automatic format conversion (WebP/AVIF)
 * - Responsive sizing with srcset
 * - Lazy loading by default
 * - Blur placeholder while loading
 * - Error fallback handling
 *
 * @param props - Component props
 * @param props.image - Image data from project
 * @param props.size - Display size variant
 * @param props.priority - Priority loading for above-the-fold images
 * @param props.onClick - Click handler for image interactions
 * @param props.sx - Additional MUI sx styles
 * @param props.buttonRef - Ref forwarded to the interactive button wrapper (used for focus return)
 * @returns Optimized image element
 *
 * @example
 * ```tsx
 * <ProjectImage
 *   image={project.images[0]}
 *   size="thumbnail"
 *   priority={false}
 *   onClick={() => openLightbox(0)}
 * />
 * ```
 */
export function ProjectImage({
  image,
  size = 'thumbnail',
  priority = false,
  onClick,
  sx,
  buttonRef,
}: ProjectImageProps) {
  const [imageError, setImageError] = useState(false);
  const { shouldAnimate } = useAnimations();
  const { t } = useI18n();
  const { mode } = usePalette();
  const isHighContrast = mode === 'highContrast';

  const imageSrc = size === 'thumbnail' ? image.tnUrl : image.url;

  /**
   * Handles image load errors by setting error state.
   */
  const handleError = () => {
    setImageError(true);
  };

  // Determine visual content: error fallback or optimized image
  const content = imageError ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.200',
        width: '100%',
        aspectRatio: '4 / 3',
        ...sx,
      }}
      role="img"
      aria-label={image.caption}
    >
      <Typography sx={{ color: 'grey.500' }}>
        {t('projectImage.unavailable', { ns: 'components' })}
      </Typography>
    </Box>
  ) : (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 3',
        overflow: 'hidden',
        transition: shouldAnimate ? 'all 200ms ease-out' : 'none',
        '&:hover': {
          boxShadow: onClick ? 8 : 'none',
          transform: onClick && shouldAnimate ? 'translateY(-4px)' : 'none',
        },
        ...sx,
      }}
    >
      <Image
        src={imageSrc}
        alt={image.caption}
        fill
        sizes="100vw"
        priority={priority}
        onError={handleError}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
        style={{
          objectFit: 'cover',
        }}
      />
    </Box>
  );

  // Wrap in interactive button when clickable (keyboard-accessible).
  // Uses a native <button> for built-in Tab focus, Enter/Space activation,
  // and implicit role="button" — no manual onKeyDown needed.
  if (onClick) {
    return (
      <Box
        component="button"
        ref={buttonRef}
        onClick={onClick}
        aria-label={t('projectImage.viewInLightbox', {
          ns: 'components',
          caption: image.caption,
        })}
        sx={{
          border: 'none',
          padding: 0,
          background: 'none',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          '&:focus-visible': isHighContrast
            ? {
                outline: '3px solid #FFFF00',
                outlineOffset: '3px',
              }
            : undefined,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}
