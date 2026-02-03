"use client";

import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { ProjectImage } from "./ProjectImage";
import { ProjectLightbox } from "./ProjectLightbox";
import { useLightbox } from "../../hooks";
import type { ProjectImage as ProjectImageType } from "../../types";

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

  /** Display 4 columns starting at md breakpoint */
  fourColumns?: boolean;

  /** Additional MUI sx styles */
  sx?: SxProps<Theme>;
}

/**
 * Image gallery component for displaying project images.
 * Supports thumbnail grid with lightbox modal on click.
 *
 * **Grid Layout Modes:**
 * - Default: 2 cols (xs), 3 cols (md), 4 cols (lg)
 * - `altGrid`: 1 col (xs), 2 cols (md), 4 cols (lg)
 * - `fourColumns`: 2 cols (xs), 4 cols (sm and up)
 * - `narrow`: 2 cols (xs and md) - for constrained containers like right 1/3 column
 *
 * @param props - Component props
 * @param props.images - Array of project images
 * @param props.altGrid - Enable alternate grid layout (1-2-4 column progression)
 * @param props.fourColumns - Display 4 columns starting at sm breakpoint
 * @param props.narrow - Render in narrow container (reduces to 2 columns)
 * @param props.sx - Additional MUI sx styles
 * @returns Image gallery with lightbox functionality
 *
 * @example
 * // Standard layout: 2-3-4 columns
 * <ProjectGallery images={project.images} />
 *
 * @example
 * // Alternate layout: 1-2-4 columns
 * <ProjectGallery images={project.images} altGrid />
 *
 * @example
 * // Four columns from sm breakpoint: 2 cols mobile, 4 cols tablet+
 * <ProjectGallery images={project.images} fourColumns />
 *
 * @example
 * // In a narrow container (1/3 width)
 * <ProjectGallery images={project.images} narrow />
 */
export function ProjectGallery({
  images,
  altGrid = false,
  narrow = false,
  fourColumns = false,
  sx,
}: ProjectGalleryProps) {
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

  return (
    <Box
      sx={sx}
      data-testid="project-gallery"
      data-narrow={narrow ? 'true' : undefined}
    >
      {/* Thumbnail Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: narrow
            ? { xs: "repeat(4, 1fr)", md: "repeat(2, 1fr)" }
            : fourColumns
              ? { xs: "repeat(4, 1fr)" }
              : altGrid
                ? { xs: "1fr", md: "repeat(4, 1fr)" }
                : { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        {images.map((image, index) => (
          <ProjectImage
            key={index}
            image={image}
            size="thumbnail"
            onClick={() => openLightbox(index)}
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              opacity: 0.4,
              transition: "box-shadow 0.2s ease-in-out",
              "&:hover": {
                boxShadow: 4,
                opacity: 1,
              },
            }}
          />
        ))}
      </Box>

      {/* Lightbox Modal */}
      <ProjectLightbox
        images={images}
        selectedIndex={selectedIndex}
        onClose={closeLightbox}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />
    </Box>
  );
}
