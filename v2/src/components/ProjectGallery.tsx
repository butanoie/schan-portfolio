"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { ProjectImage } from "./ProjectImage";
import type { ProjectImage as ProjectImageType } from "../types";

/**
 * Props for the ProjectGallery component.
 */
interface ProjectGalleryProps {
  /** Array of project images */
  images: ProjectImageType[];

  /** Enable alternate grid layout */
  altGrid?: boolean;

  /** Additional MUI sx styles */
  sx?: SxProps<Theme>;
}

/**
 * Image gallery component for displaying project images.
 * Supports thumbnail grid with lightbox modal on click.
 *
 * @param props - Component props
 * @param props.images - Array of project images
 * @param props.altGrid - Enable alternate grid layout
 * @param props.sx - Additional MUI sx styles
 * @returns Image gallery with lightbox functionality
 *
 * @example
 * <ProjectGallery images={project.images} altGrid={project.altGrid} />
 */
export function ProjectGallery({
  images,
  altGrid = false,
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
    <Box sx={sx}>
      {/* Thumbnail Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: altGrid
            ? { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }
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
