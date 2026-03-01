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
    return { xs: "repeat(4, 1fr)", md: "repeat(2, 1fr)" };
  }
  if (fourColumns) {
    return { xs: "repeat(4, 1fr)" };
  }
  if (altGrid) {
    return { xs: "1fr", md: "repeat(4, 1fr)" };
  }
  return { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" };
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
          gridTemplateColumns: getGridColumns(narrow, fourColumns, altGrid),
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
              opacity: 0.85,
              transition: "box-shadow 0.2s ease-in-out, opacity 0.2s ease-in-out",
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
