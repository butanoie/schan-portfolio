'use client';

import { useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import type { ProjectImage as ProjectImageType } from '../../types';
import { ProjectImage } from './ProjectImage';
import { useLightbox, usePalette } from '../../hooks';

/**
 * Lazily-loaded lightbox modal component.
 *
 * Uses `next/dynamic` with `ssr: false` because the lightbox is a client-only
 * overlay triggered by user click — it is never part of the initial render.
 * This defers the lightbox chunk (including keyboard/swipe handlers) until needed.
 *
 * @returns The dynamically-loaded ProjectLightbox component
 */
const ProjectLightbox = dynamic(
  /**
   * Loads the ProjectLightbox module, mapping the named export to default.
   *
   * @returns The module with ProjectLightbox as the default export
   */
  () =>
    import('./ProjectLightbox').then((m) => ({ default: m.ProjectLightbox })),
  {
    ssr: false,
    /**
     * No visible fallback needed — lightbox is invisible until opened.
     *
     * @returns Null placeholder
     */
    loading: () => null,
  }
);

/**
 * Props for the ProjectGallery component.
 */
interface ProjectGalleryProps {
  /** Array of project images */
  images: ProjectImageType[];

  /** Enable alternate grid layout */
  altGrid?: boolean;

  /** Render in narrow container (reduces column count) */
  narrow?: boolean;

  /** Display 4 columns at all breakpoints */
  fourColumns?: boolean;

  /** Additional MUI sx styles */
  sx?: SxProps<Theme>;
}

/**
 * Image gallery component for displaying project images.
 * Supports thumbnail grid with lightbox modal on click.
 *
 * **Grid Layout Modes:**
 * - Default: 2 cols (xs), 4 cols (sm+)
 * - `altGrid`: 1 col (xs), 4 cols (md+)
 * - `fourColumns`: 4 cols at all breakpoints
 * - `narrow`: 4 cols (xs), 2 cols (md+) - for constrained containers like right 1/3 column
 *
 * @param props - Component props
 * @param props.images - Array of project images
 * @param props.altGrid - Enable alternate grid layout (1 col mobile, 4 cols desktop)
 * @param props.fourColumns - Display 4 columns at all breakpoints
 * @param props.narrow - Render in narrow container (4 cols mobile, 2 cols desktop)
 * @param props.sx - Additional MUI sx styles
 * @returns Image gallery with lightbox functionality
 *
 * @example
 * // Standard layout: 2 cols mobile, 4 cols tablet+
 * <ProjectGallery images={project.images} />
 *
 * @example
 * // Alternate layout: 1 col mobile, 4 cols desktop
 * <ProjectGallery images={project.images} altGrid />
 *
 * @example
 * // Four columns at all sizes
 * <ProjectGallery images={project.images} fourColumns />
 *
 * @example
 * // In a narrow container (1/3 width)
 * <ProjectGallery images={project.images} narrow />
 */

/**
 * Determines the responsive grid column layout based on gallery display mode.
 *
 * @param narrow - Constrained container mode (2 columns at md)
 * @param fourColumns - Force 4 columns from xs breakpoint
 * @param altGrid - Alternate progression (1-4 columns)
 * @returns Responsive gridTemplateColumns value
 */
function getGridColumns(
  narrow: boolean,
  fourColumns: boolean,
  altGrid: boolean
): Record<string, string> {
  if (narrow) {
    return { xs: 'repeat(4, 1fr)', md: 'repeat(2, 1fr)' };
  }
  if (fourColumns) {
    return { xs: 'repeat(4, 1fr)' };
  }
  if (altGrid) {
    return { xs: '1fr', md: 'repeat(4, 1fr)' };
  }
  return { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' };
}

/**
 * Renders a responsive grid of project images with lightbox functionality.
 *
 * @param props - Component props
 * @param props.images - Array of project images to display
 * @param props.altGrid - Whether to use the alternate grid layout (default: false)
 * @param props.narrow - Whether to use narrow column layout (default: false)
 * @param props.fourColumns - Whether to force 4-column layout (default: false)
 * @param props.sx - Additional MUI sx styles to apply to the grid container
 * @returns A responsive image grid with click-to-open lightbox
 */
export function ProjectGallery({
  images,
  altGrid = false,
  narrow = false,
  fourColumns = false,
  sx,
}: ProjectGalleryProps) {
  const { isHighContrast } = usePalette();

  /**
   * Manage lightbox state and image navigation.
   * The hook provides:
   * - selectedIndex: currently displayed image index (null when closed)
   * - openLightbox: function to open lightbox at specific index
   * - closeLightbox: function to close lightbox
   * - handlePreviousImage: navigate to previous image with wrap-around
   * - handleNextImage: navigate to next image with wrap-around
   */
  const {
    selectedIndex,
    openLightbox,
    closeLightbox,
    handlePreviousImage,
    handleNextImage,
  } = useLightbox(images.length);

  /**
   * Refs for each thumbnail button, used to restore focus when the lightbox closes.
   * Stored as a mutable ref object mapping image index to button element.
   * The ref map persists across renders without causing re-renders.
   * Cleanup is automatic: React calls the ref callback with `null` on unmount
   * (e.g., when the images array shrinks), which deletes the stale entry.
   */
  const thumbnailRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  /**
   * Tracks which thumbnail opened the lightbox, so focus can return to it on close.
   * Stored as a ref to avoid re-renders when the lightbox opens.
   */
  const openerIndexRef = useRef<number | null>(null);

  /**
   * Opens the lightbox at the given index and records the opener for focus return.
   *
   * @param index - Zero-based index of the image to display
   */
  const handleOpenLightbox = useCallback(
    (index: number) => {
      openerIndexRef.current = index;
      openLightbox(index);
    },
    [openLightbox]
  );

  /**
   * Closes the lightbox and restores focus to the thumbnail that opened it.
   * This satisfies WCAG 2.4.3 (Focus Order) — after a modal closes, focus
   * should return to the triggering element.
   */
  const handleCloseLightbox = useCallback(() => {
    const openerIndex = openerIndexRef.current;
    closeLightbox();

    // Restore focus to the thumbnail that triggered the lightbox
    if (openerIndex !== null) {
      const button = thumbnailRefs.current.get(openerIndex);
      // rAF ensures the Dialog unmount completes before focusing.
      // This relies on ProjectLightbox being conditionally mounted
      // ({selectedIndex !== null && ...}), making unmount synchronous.
      // If this ever changes to always-mounted with open={...},
      // replace rAF with a transitionend listener.
      requestAnimationFrame(() => {
        button?.focus();
      });
    }
    openerIndexRef.current = null;
  }, [closeLightbox]);

  return (
    <Box
      sx={sx}
      data-testid="project-gallery"
      data-narrow={narrow ? 'true' : undefined}
    >
      {/* Thumbnail Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: getGridColumns(narrow, fourColumns, altGrid),
          gap: 2,
        }}
      >
        {images.map((image, index) => (
          <ProjectImage
            key={index}
            image={image}
            size="thumbnail"
            onClick={() => handleOpenLightbox(index)}
            buttonRef={(el: HTMLButtonElement | null) => {
              if (el) {
                thumbnailRefs.current.set(index, el);
              } else {
                thumbnailRefs.current.delete(index);
              }
            }}
            sx={{
              borderRadius: isHighContrast ? 0 : 2,
              boxShadow: isHighContrast ? 'none' : 2,
              border: isHighContrast ? '2px solid #FFFFFF' : 'none',
              opacity: isHighContrast ? 1 : 0.85,
              transition: isHighContrast
                ? 'none'
                : 'box-shadow 0.2s ease-in-out, opacity 0.2s ease-in-out',
              '&:hover': {
                boxShadow: isHighContrast ? 'none' : 4,
                outline: isHighContrast ? '3px solid #FFFF00' : 'none',
                outlineOffset: isHighContrast ? '3px' : undefined,
                opacity: 1,
              },
            }}
          />
        ))}
      </Box>

      {/* Lightbox Modal — only mount when a thumbnail is clicked to avoid
           loading the dynamic chunk until the user actually needs it */}
      {selectedIndex !== null && (
        <ProjectLightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={handleCloseLightbox}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </Box>
  );
}
