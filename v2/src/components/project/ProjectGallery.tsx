"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { ProjectImage } from "./ProjectImage";
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

  /** Display 4 columns starting at md breakpoint instead of md:2, lg:4 */
  fourColumnAtMd?: boolean;

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
 * - `narrow`: 2 cols (xs and md) - for constrained containers like right 1/3 column
 * - `fourColumnAtMd`: 1 col (xs), 4 cols (md and up) - for wide layouts with ample space
 *
 * @param props - Component props
 * @param props.images - Array of project images
 * @param props.altGrid - Enable alternate grid layout (1-2-4 column progression)
 * @param props.narrow - Render in narrow container (reduces to 2 columns)
 * @param props.fourColumnAtMd - Display 4 columns starting at md breakpoint (for spacious layouts)
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
 * // In a narrow container (1/3 width)
 * <ProjectGallery images={project.images} narrow />
 *
 * @example
 * // Wide layout: 1 column mobile, 4 columns desktop
 * <ProjectGallery images={project.images} fourColumnAtMd />
 */
export function ProjectGallery({
  images,
  altGrid = false,
  narrow = false,
  fourColumnAtMd = false,
  sx,
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
    <Box
      sx={sx}
      data-testid="project-gallery"
      data-narrow={narrow ? 'true' : undefined}
      data-four-column-at-md={fourColumnAtMd ? 'true' : undefined}
    >
      {/* Thumbnail Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: narrow
            ? { xs: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }
            : fourColumnAtMd
              ? { xs: "1fr", md: "repeat(4, 1fr)" }
              : altGrid
                ? { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }
                : { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
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
              transition: "box-shadow 0.2s ease-in-out",
              "&:hover": {
                boxShadow: 4,
              },
            }}
          />
        ))}
      </Box>

      {/* Lightbox Modal (to be implemented in Phase 3) */}
      {selectedIndex !== null && (
        <Box
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          }}
        >
          {/* Lightbox content will be implemented in Phase 3 */}
          <Typography sx={{ color: "white" }}>
            Lightbox placeholder - to be implemented
          </Typography>
        </Box>
      )}
    </Box>
  );
}
