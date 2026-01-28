'use client';

import { useState } from 'react';
import { ProjectImage } from './ProjectImage';
import type { ProjectImage as ProjectImageType } from '../types';

/**
 * Props for the ProjectGallery component.
 */
interface ProjectGalleryProps {
  /** Array of project images */
  images: ProjectImageType[];

  /** Enable alternate grid layout */
  altGrid?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Image gallery component for displaying project images.
 * Supports thumbnail grid with lightbox modal on click.
 *
 * @param props - Component props
 * @param props.images - Array of project images
 * @param props.altGrid - Enable alternate grid layout
 * @param props.className - Additional CSS classes
 * @returns Image gallery with lightbox functionality
 *
 * @example
 * <ProjectGallery images={project.images} altGrid={project.altGrid} />
 */
export function ProjectGallery({
  images,
  altGrid = false,
  className = '',
}: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  /**
   * Opens the lightbox at the specified image index.
   *
   * @param index - Index of the image to display
   */
  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  /**
   * Closes the lightbox modal.
   */
  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  return (
    <div className={className}>
      {/* Thumbnail Grid */}
      <div
        className={
          altGrid
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
        }
      >
        {images.map((image, index) => (
          <ProjectImage
            key={index}
            image={image}
            size="thumbnail"
            onClick={() => openLightbox(index)}
            className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
          />
        ))}
      </div>

      {/* Lightbox Modal (to be implemented in Phase 3) */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Lightbox content will be implemented in Phase 3 */}
          <p className="text-white">Lightbox placeholder - to be implemented</p>
        </div>
      )}
    </div>
  );
}
