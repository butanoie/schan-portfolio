'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProjectImage as ProjectImageType } from '../types';

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

  /** Additional CSS classes */
  className?: string;
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
 * @param props.className - Additional CSS classes
 * @returns Optimized image element
 *
 * @example
 * <ProjectImage
 * image={project.images[0]}
 * size="thumbnail"
 * priority={false}
 * onClick={() => openLightbox(0)}
 * />
 */
export function ProjectImage({
  image,
  size = 'thumbnail',
  priority = false,
  onClick,
  className = '',
}: ProjectImageProps) {
  const [imageError, setImageError] = useState(false);

  const imageSrc = size === 'thumbnail' ? image.tnUrl : image.url;

  /**
   * Handles image load errors by setting error state.
   */
  const handleError = () => {
    setImageError(true);
  };

  if (imageError) {
    // Fallback UI for broken images
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        role="img"
        aria-label={image.caption}
      >
        <span className="text-gray-500">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={image.caption}
      width={size === 'thumbnail' ? 400 : 1200}
      height={size === 'thumbnail' ? 300 : 900}
      className={className}
      priority={priority}
      onClick={onClick}
      onError={handleError}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
}
