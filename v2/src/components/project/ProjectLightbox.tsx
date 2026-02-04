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
import { useSwipe, useI18n } from "../../hooks";
import { VisuallyHidden } from "../common/VisuallyHidden";
import {
  SWIPE_THRESHOLD,
  DIALOG_FADE_DURATION,
  LIGHTBOX_CONTROL_OFFSET,
} from "../../constants/app";

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
 * - Enhanced accessibility (ARIA announcements, screen reader support)
 * - Prevents body scroll when open
 * - Memory-efficient event listener management
 *
 * **Accessibility Features:**
 * - Assertive ARIA live region announces image changes immediately to screen readers
 * - VisuallyHidden component provides full context (image number, total, and caption)
 * - Visual counter hidden from screen readers (aria-hidden) to prevent duplication
 * - Keyboard navigation fully supported
 * - Proper ARIA labels on all interactive elements
 * - Focus management when lightbox opens
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
  const [isLoading, setIsLoading] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();

  /**
   * Ref to store the keyboard handler function.
   * Using a ref prevents the event listener from being re-attached when callback dependencies change.
   * The ref is updated in a separate useEffect, decoupling handler logic from event listener lifecycle.
   *
   * Pattern: Store mutable handler in ref, attach listener once, update ref when handlers change.
   * This prevents memory leaks that occur when event listeners are constantly removed/re-added.
   */
  const handleKeyDownRef = useRef<(event: KeyboardEvent) => void>(() => {});

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
   * Set up touch swipe gesture detection for the lightbox.
   * - Swipe left: navigate to next image
   * - Swipe right: navigate to previous image
   * - Swipe down: close lightbox
   * Configured with maxImages to prevent horizontal navigation on single-image galleries.
   */
  const { onTouchStart, onTouchEnd } = useSwipe(
    handleNext,    // onSwipeLeft
    handlePrevious, // onSwipeRight
    onClose,       // onSwipeDown
    { maxImages: images.length, threshold: SWIPE_THRESHOLD }
  );

  /**
   * Updates the keyboard handler ref whenever navigation callbacks change.
   * This effect is separate from the event listener attachment to prevent
   * unnecessary cleanup/re-attachment cycles.
   *
   * By storing the handler in a ref and updating it here, we ensure:
   * 1. The event listener is attached only once when lightbox opens
   * 2. The listener stays active even when callbacks change
   * 3. No memory leaks from repeated attachment/detachment
   * 4. Handlers always have access to latest callback functions
   */
  useEffect(() => {
    /**
     * Handles keyboard events for lightbox navigation and closing.
     *
     * @param event - The keyboard event
     */
    handleKeyDownRef.current = (event: KeyboardEvent) => {
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
    };
  }, [handlePrevious, handleNext, onClose]);

  /**
   * Attaches keyboard event listener when lightbox opens.
   * Uses a stable handler reference (from handleKeyDownRef) to prevent
   * unnecessary listener cleanup/re-attachment when callbacks change.
   *
   * Empty dependency array (except validIndex) ensures:
   * 1. Listener attached exactly once when lightbox opens
   * 2. Listener removed exactly once when lightbox closes
   * 3. No repeated attachment cycles causing memory leaks
   * 4. Updates to callbacks don't trigger cleanup/re-attachment
   */
  useEffect(() => {
    if (validIndex === null) return;

    /**
     * Wrapper function that delegates to the ref-stored handler.
     *
     * @param event - The keyboard event
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyDownRef.current(event);
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on unmount or when lightbox closes
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [validIndex]);

  // Don't render if no valid index
  if (validIndex === null || images.length === 0) {
    return null;
  }

  const currentImage = images[validIndex];

  /**
   * Explicit null check after array access for safety.
   * Although validIndex is validated above, this defensive check ensures
   * we don't attempt to render if the image is undefined.
   * This handles edge cases where images array might be modified unexpectedly.
   */
  if (!currentImage) {
    console.error(
      `ProjectLightbox: currentImage is undefined at index ${validIndex}. ` +
      `Images array length: ${images.length}. This should not happen with valid validIndex.`
    );
    return null;
  }

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
          timeout: DIALOG_FADE_DURATION,
        },
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label={t('projectLightbox.ariaLabel', { ns: 'components' })}
    >
      {/* Close Button - Top Right */}
      <IconButton
        ref={closeButtonRef}
        onClick={onClose}
        aria-label={t('projectLightbox.closeButton', { ns: 'components' })}
        sx={{
          position: "fixed",
          top: LIGHTBOX_CONTROL_OFFSET,
          right: LIGHTBOX_CONTROL_OFFSET,
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
          aria-label={t('projectLightbox.previousButton', { ns: 'components' })}
          sx={{
            ...navButtonSx,
            left: LIGHTBOX_CONTROL_OFFSET,
          }}
        >
          <ArrowBackIcon fontSize="large" sx={{pl:1}} />
        </IconButton>
      )}

      {/* Next Button - Right Side */}
      {showNavigation && (
        <IconButton
          onClick={handleNext}
          aria-label={t('projectLightbox.nextButton', { ns: 'components' })}
          sx={{
            ...navButtonSx,
            right: LIGHTBOX_CONTROL_OFFSET,
          }}
        >
          <ArrowForwardIcon fontSize="large" sx={{pl:.5}}  />
        </IconButton>
      )}

      {/* Image Counter and Accessibility Announcements - Bottom Center */}
      {showNavigation && (
        <Box
          sx={{
            position: "fixed",
            bottom: LIGHTBOX_CONTROL_OFFSET,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 51,
          }}
          role="status"
          aria-live="assertive"
          aria-atomic="true"
        >
          {/*
           * Screen reader announcement with full context.
           * Uses assertive live region for immediate announcement when image changes.
           * Includes image position, total count, and caption for comprehensive context.
           * This is hidden visually but announced by screen readers.
           */}
          <VisuallyHidden>
            Viewing image {validIndex + 1} of {images.length}: {currentImage.caption}
          </VisuallyHidden>

          {/*
           * Visual counter display for sighted users.
           * Marked with aria-hidden since screen readers announce via VisuallyHidden above.
           * This prevents duplicate announcements.
           */}
          <Typography
            variant="body2"
            aria-hidden="true"
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
