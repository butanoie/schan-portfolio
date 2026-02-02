"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Dialog,
  IconButton,
  Typography,
  Box,
  Fade,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  Close as CloseIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from "@mui/icons-material";
import type { ProjectImage as ProjectImageType } from "../../types";

/**
 * Props for the ProjectLightbox component.
 */
interface ProjectLightboxProps {
  /** Array of project images to display in lightbox */
  images: ProjectImageType[];

  /** Index of currently selected image (null when lightbox is closed) */
  selectedIndex: number | null;

  /** Callback function invoked when lightbox closes */
  onClose: () => void;

  /** Callback function to navigate to previous image */
  onPrevious: () => void;

  /** Callback function to navigate to next image */
  onNext: () => void;
}

/**
 * Full-screen image lightbox with navigation and touch gestures.
 * Displays project images in a modal overlay with Previous/Next controls.
 *
 * Features:
 * - Keyboard navigation (arrow keys, Escape)
 * - Touch swipe gestures for mobile
 * - Image counter display (e.g., "3 of 8")
 * - Responsive image sizing
 * - Circular navigation (wraps around at boundaries)
 * - Accessibility (ARIA labels, focus management)
 * - Prevents body scroll when open
 *
 * This is a controlled component that relies on the parent to manage navigation state.
 * When navigation is triggered (via buttons, keyboard, or touch), it calls the
 * appropriate callback (`onPrevious` or `onNext`) to let the parent update the index.
 *
 * @param props - Component props
 * @param props.images - Array of project images to display
 * @param props.selectedIndex - Index of currently selected image (null = closed)
 * @param props.onClose - Callback function when lightbox closes
 * @param props.onPrevious - Callback function to navigate to previous image
 * @param props.onNext - Callback function to navigate to next image
 * @returns Full-screen lightbox modal with image display and controls, or null if not open
 *
 * @example
 * ```tsx
 * const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
 *
 * const handlePrevious = () => {
 *   setSelectedIndex(prev =>
 *     prev === null || prev === 0 ? images.length - 1 : prev - 1
 *   );
 * };
 *
 * const handleNext = () => {
 *   setSelectedIndex(prev =>
 *     prev === null || prev === images.length - 1 ? 0 : prev + 1
 *   );
 * };
 *
 * <ProjectLightbox
 *   images={project.images}
 *   selectedIndex={selectedIndex}
 *   onClose={() => setSelectedIndex(null)}
 *   onPrevious={handlePrevious}
 *   onNext={handleNext}
 * />
 * ```
 */
export function ProjectLightbox({
  images,
  selectedIndex,
  onClose,
  onPrevious,
  onNext,
}: ProjectLightboxProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Validate that selectedIndex is within bounds
  const validIndex =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < images.length
      ? selectedIndex
      : null;

  /**
   * Navigates to the previous image in the gallery.
   * Delegates navigation to parent via onPrevious callback.
   * The parent is responsible for implementing circular navigation logic.
   */
  const handlePrevious = useCallback(() => {
    if (validIndex === null || images.length <= 1) return;
    setIsLoading(true);
    onPrevious();
  }, [validIndex, images.length, onPrevious]);

  /**
   * Navigates to the next image in the gallery.
   * Delegates navigation to parent via onNext callback.
   * The parent is responsible for implementing circular navigation logic.
   */
  const handleNext = useCallback(() => {
    if (validIndex === null || images.length <= 1) return;
    setIsLoading(true);
    onNext();
  }, [validIndex, images.length, onNext]);

  /**
   * Handles touch start event to capture initial touch position.
   * Used for detecting swipe gestures (horizontal and vertical).
   *
   * @param e - Touch event from the dialog
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  /**
   * Handles touch end event to detect swipe direction and trigger navigation or close.
   * Supports:
   * - Horizontal swipes: left (next image), right (previous image)
   * - Vertical swipes: down (close lightbox)
   * Requires minimum 50px swipe distance to prevent accidental triggers.
   *
   * @param e - Touch event from the dialog
   */
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) {
      setTouchStart(null);
      return;
    }

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const horizontalDistance = touchStart.x - touchEnd.x;
    const verticalDistance = touchEnd.y - touchStart.y; // Positive = downward
    const threshold = 50; // Minimum swipe distance in pixels

    // Check for downward swipe to close (works regardless of image count)
    if (verticalDistance > threshold && Math.abs(horizontalDistance) < threshold) {
      // Downward swipe with minimal horizontal movement: close lightbox
      onClose();
      setTouchStart(null);
      return;
    }

    // Only trigger horizontal navigation if image count > 1
    if (images.length <= 1) {
      setTouchStart(null);
      return;
    }

    // Check for horizontal swipes to navigate
    if (Math.abs(horizontalDistance) > threshold && Math.abs(verticalDistance) < threshold) {
      if (horizontalDistance > 0) {
        // Swipe left: go to next image
        handleNext();
      } else {
        // Swipe right: go to previous image
        handlePrevious();
      }
    }

    setTouchStart(null);
  };

  /**
   * Handles keyboard navigation for arrow keys and Escape.
   * Memoized with useCallback to maintain stable reference across renders.
   * - ArrowLeft: Navigate to previous image
   * - ArrowRight: Navigate to next image
   * - Escape: Close lightbox
   *
   * @param event - Keyboard event
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent keyboard navigation if it would interfere with other controls
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    },
    [handlePrevious, handleNext, onClose]
  );

  useEffect(() => {
    if (validIndex === null) return;

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on unmount or when lightbox closes
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [validIndex, images.length, handleKeyDown]);

  // Don't render if no valid index
  if (validIndex === null || images.length === 0) {
    return null;
  }

  const currentImage = images[validIndex];
  const showNavigation = images.length > 1;

  /**
   * Container styling for the lightbox image display.
   * Uses flexbox to center the image within the viewport.
   */
  const imageContainerSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    padding: { xs: 2, md: 3 },
  };

  /**
   * Image wrapper styling with responsive constraints.
   * Limits maximum dimensions to prevent overflow on different screen sizes.
   */
  const imageWrapperSx: SxProps<Theme> = {
    position: "relative",
    width: { xs: "90vw", sm: "85vw", md: "80vw" },
    maxWidth: "1200px",
    height: { xs: "60vh", sm: "70vh", md: "75vh" },
    maxHeight: "800px",
  };

  /**
   * Navigation button styling with fixed positioning.
   * Buttons are semi-transparent white for visibility on dark background.
   * Hidden on mobile (xs breakpoint) to avoid interference with swipe gestures.
   */
  const navButtonSx: SxProps<Theme> = {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 51,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.35)",
    },
    display: { xs: "none", sm: "flex" },
  };

  return (
    <Dialog
      open={validIndex !== null}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      slots={{
        transition: Fade,
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            boxShadow: "none",
            margin: 0,
          },
        },
        transition: {
          timeout: 300,
        },
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Image lightbox"
    >
      {/* Close Button - Top Right */}
      <IconButton
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close lightbox"
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 52,
          color: "#FFFFFF",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.35)",
          },
        }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      {/* Main Image Container */}
      <Box
        sx={{
          ...imageContainerSx,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Image Wrapper */}
        <Box sx={imageWrapperSx}>
          <Image
            src={currentImage.url}
            alt={currentImage.caption}
            fill
            sizes="80vw"
            priority={true}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            style={{
              objectFit: "contain",
              opacity: isLoading ? 0.5 : 1,
              transition: "opacity 0.2s ease-in-out",
            }}
          />
        </Box>

        {/* Caption - Below Image */}
        <Typography
          variant="body1"
          sx={{
            color: "#FFFFFF",
            textAlign: "center",
            maxWidth: { xs: "90vw", md: "80vw" },
            px: 1,
          }}
        >
          {currentImage.caption}
        </Typography>
      </Box>

      {/* Previous Button - Left Side */}
      {showNavigation && (
        <IconButton
          onClick={handlePrevious}
          aria-label="Previous image"
          sx={{
            ...navButtonSx,
            left: 16,
          }}
        >
          <ArrowBackIcon fontSize="large" sx={{pl:1}} />
        </IconButton>
      )}

      {/* Next Button - Right Side */}
      {showNavigation && (
        <IconButton
          onClick={handleNext}
          aria-label="Next image"
          sx={{
            ...navButtonSx,
            right: 16,
          }}
        >
          <ArrowForwardIcon fontSize="large" sx={{pl:.5}}  />
        </IconButton>
      )}

      {/* Image Counter - Bottom Center */}
      {showNavigation && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 51,
          }}
          aria-live="polite"
          aria-atomic="true"
          role="status"
        >
          <Typography
            variant="body2"
            sx={{
              color: "#FFFFFF",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 1,
              px: 2,
              py: 0.5,
              mb: 2,
              fontSize: "0.875rem",
            }}
          >
            {validIndex + 1} of {images.length}
          </Typography>
        </Box>
      )}
    </Dialog>
  );
}
