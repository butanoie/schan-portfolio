"use client";

import Image from "next/image";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ProjectImage as ProjectImageType } from "../../types";
import { useReducedMotion } from "../../hooks";

/**
 * Props for the ProjectImage component.
 */
interface ProjectImageProps {
  /** Image data from project */
  image: ProjectImageType;

  /** Display size variant */
  size?: "thumbnail" | "full";

  /** Priority loading for above-the-fold images */
  priority?: boolean;

  /** Click handler for image interactions */
  onClick?: () => void;

  /** Additional MUI sx styles */
  sx?: SxProps<Theme>;
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
  size = "thumbnail",
  priority = false,
  onClick,
  sx,
}: ProjectImageProps) {
  const [imageError, setImageError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const imageSrc = size === "thumbnail" ? image.tnUrl : image.url;

  /**
   * Handles image load errors by setting error state.
   */
  const handleError = () => {
    setImageError(true);
  };

  if (imageError) {
    // Fallback UI for broken images, maintains aspect ratio
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "grey.200",
          width: "100%",
          aspectRatio: "4 / 3",
          ...sx,
        }}
        role="img"
        aria-label={image.caption}
      >
        <Typography sx={{ color: "grey.500" }}>Image unavailable</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        overflow: "hidden",
        transition: prefersReducedMotion ? "none" : "all 200ms ease-out",
        "&:hover": {
          boxShadow: onClick ? 8 : "none",
          transform: onClick && !prefersReducedMotion ? "translateY(-4px)" : "none",
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
        onClick={onClick}
        onError={handleError}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
        style={{
          cursor: onClick ? "pointer" : "default",
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
