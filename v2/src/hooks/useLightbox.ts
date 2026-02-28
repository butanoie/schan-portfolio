import { useState, useCallback } from 'react';

/**
 * Result object returned by the useLightbox hook containing state and action functions.
 */
interface UseLightboxResult {
  /** Current index of the selected image, or null if lightbox is closed */
  selectedIndex: number | null;

  /**
   * Opens the lightbox and displays the image at the specified index.
   * If the index is out of bounds, it will be clamped to valid range.
   *
   * @param index - Index of the image to display (will be clamped to valid range)
   */
  openLightbox: (index: number) => void;

  /**
   * Closes the lightbox by clearing the selected index.
   * Safe to call even when already closed.
   */
  closeLightbox: () => void;

  /**
   * Navigates to the previous image with circular wrap-around.
   * - If at the first image (index 0), wraps to the last image
   * - If lightbox is closed, selects the last image
   * - If no images exist, does nothing
   */
  handlePreviousImage: () => void;

  /**
   * Navigates to the next image with circular wrap-around.
   * - If at the last image, wraps to the first image
   * - If lightbox is closed, selects the first image
   * - If no images exist, does nothing
   */
  handleNextImage: () => void;
}

/**
 * Custom hook to manage lightbox state and navigation.
 *
 * Provides state management for a modal image gallery (lightbox), including:
 * - Opening/closing the lightbox
 * - Navigating between images with circular wrap-around
 * - Tracking which image is currently displayed
 *
 * The hook handles edge cases such as:
 * - Single image galleries (navigation is still supported)
 * - Empty galleries (actions are safe no-ops)
 * - Navigation wrap-around (going next on last image goes to first, etc.)
 *
 * This hook is designed to be used with a controlled lightbox component that
 * displays the currently selected image based on the `selectedIndex`.
 *
 * @param imagesCount - Total number of images in the gallery
 * @returns Object with lightbox state and action functions
 *
 * @example
 * ```tsx
 * function ImageGallery({ images }) {
 *   const {
 *     selectedIndex,
 *     openLightbox,
 *     closeLightbox,
 *     handlePreviousImage,
 *     handleNextImage,
 *   } = useLightbox(images.length);
 *
 *   return (
 *     <>
 *       <div>
 *         {images.map((image, index) => (
 *           <img
 *             key={index}
 *             src={image.url}
 *             onClick={() => openLightbox(index)}
 *             style={{ cursor: 'pointer' }}
 *           />
 *         ))}
 *       </div>
 *
 *       {selectedIndex !== null && (
 *         <Lightbox
 *           image={images[selectedIndex]}
 *           onClose={closeLightbox}
 *           onPrevious={handlePreviousImage}
 *           onNext={handleNextImage}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With single image
 * const { selectedIndex, openLightbox, closeLightbox } = useLightbox(1);
 * // Navigation still works (previous/next both navigate in circular fashion)
 * ```
 *
 * @example
 * ```tsx
 * // With no images
 * const { selectedIndex, openLightbox } = useLightbox(0);
 * // openLightbox will safely clamp index, selectedIndex starts as null
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement} MDN: HTMLDialogElement
 */
export function useLightbox(imagesCount: number): UseLightboxResult {
  /**
   * Stores the index of the currently displayed image.
   * - null = lightbox is closed (no image selected)
   * - 0...imagesCount-1 = lightbox is open at that image
   */
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  /**
   * Opens the lightbox and displays the image at the specified index.
   * Safely clamps the index to the valid range [0, imagesCount - 1].
   *
   * @param index - Desired index to display (will be clamped if out of bounds)
   */
  const openLightbox = useCallback(
    (index: number) => {
      // Clamp index to valid range: if empty gallery, keep it null
      if (imagesCount <= 0) {
        setSelectedIndex(null);
        return;
      }

      // Ensure index is within valid bounds
      const clampedIndex = Math.max(0, Math.min(index, imagesCount - 1));
      setSelectedIndex(clampedIndex);
    },
    [imagesCount]
  );

  /**
   * Closes the lightbox by clearing the selected index.
   * Safe to call regardless of current state.
   */
  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  /**
   * Navigates to the previous image with circular wrap-around.
   *
   * Behavior:
   * - If at first image (index 0): wraps to last image (index imagesCount - 1)
   * - If lightbox is closed (selectedIndex is null): selects last image
   * - If no images exist: does nothing
   *
   * Uses modular arithmetic for circular navigation:
   * (current - 1 + total) % total handles both wrap-around and normal cases.
   */
  const handlePreviousImage = useCallback(() => {
    if (imagesCount <= 0) return;

    setSelectedIndex((prev) => {
      const current = prev ?? 0;
      return (current - 1 + imagesCount) % imagesCount;
    });
  }, [imagesCount]);

  /**
   * Navigates to the next image with circular wrap-around.
   *
   * Behavior:
   * - If at last image (index imagesCount - 1): wraps to first image (index 0)
   * - If lightbox is closed (selectedIndex is null): selects first image
   * - If no images exist: does nothing
   *
   * Uses modular arithmetic for circular navigation:
   * (current + 1) % total handles both wrap-around and normal cases.
   */
  const handleNextImage = useCallback(() => {
    if (imagesCount <= 0) return;

    setSelectedIndex((prev) => {
      const current = prev ?? -1;
      return (current + 1) % imagesCount;
    });
  }, [imagesCount]);

  return {
    selectedIndex,
    openLightbox,
    closeLightbox,
    handlePreviousImage,
    handleNextImage,
  };
}
