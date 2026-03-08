import { useRef, useCallback } from 'react';

/**
 * Result object returned by the useImagePreloader hook.
 */
interface UseImagePreloaderResult {
  /**
   * Preloads an image URL and resolves when complete.
   * Uses browser-level caching so subsequent renders of the same URL are instant.
   * If the image is already cached, resolves immediately.
   *
   * @param url - The image URL to preload
   * @param timeoutMs - Maximum time to wait before resolving anyway (default: 5000ms)
   * @returns Promise that resolves to true if loaded successfully, false if failed/timed out
   */
  preloadImage: (url: string, timeoutMs?: number) => Promise<boolean>;

  /**
   * Preloads adjacent images (previous and next) relative to the current index.
   * Fires and forgets — does not block or return promises.
   * Useful for proactive preloading so future navigations are instant.
   *
   * @param urls - Array of all image URLs
   * @param currentIndex - The currently displayed image index
   */
  preloadAdjacent: (urls: string[], currentIndex: number) => void;
}

/** Default timeout in ms before giving up on a preload and navigating anyway */
const DEFAULT_PRELOAD_TIMEOUT = 5000;

/**
 * Custom hook for preloading images before they are displayed.
 *
 * Manages a cache of preloaded image URLs to avoid redundant network requests.
 * Uses the browser's native `Image` constructor to trigger preloading, which
 * populates the browser's HTTP cache. Subsequent renders of the same URL
 * (e.g., via Next.js `<Image>`) get an instant cache hit.
 *
 * Features:
 * - URL-level deduplication (won't preload the same URL twice)
 * - Configurable timeout to prevent blocking navigation forever
 * - Adjacent image preloading for proactive cache warming
 * - Graceful degradation on failure (navigation proceeds regardless)
 *
 * @returns Object with preloadImage and preloadAdjacent functions
 *
 * @example
 * ```tsx
 * const { preloadImage, preloadAdjacent } = useImagePreloader();
 *
 * // Preload before navigating
 * const success = await preloadImage('/images/next-photo.jpg');
 * if (success) {
 *   navigateToNext(); // Image will render instantly from cache
 * }
 *
 * // Proactively warm cache for adjacent images
 * preloadAdjacent(imageUrls, currentIndex);
 * ```
 */
export function useImagePreloader(): UseImagePreloaderResult {
  /**
   * Set of URLs that have been successfully preloaded.
   * Persists across renders via ref to avoid re-preloading cached images.
   * Using a Set for O(1) lookup performance.
   */
  const cacheRef = useRef<Set<string>>(new Set());

  /**
   * Preloads a single image URL using the browser's native Image constructor.
   * Returns a promise that resolves when the image loads or the timeout expires.
   *
   * The timeout ensures navigation is never blocked indefinitely by a slow network.
   * On timeout, the promise resolves with `false` (not rejects) so callers can
   * still proceed with navigation rather than getting stuck.
   *
   * @param url - The image URL to preload
   * @param timeoutMs - Maximum wait time in ms (default: 5000)
   * @returns Promise resolving to true on success, false on failure/timeout
   */
  const preloadImage = useCallback(
    (url: string, timeoutMs: number = DEFAULT_PRELOAD_TIMEOUT): Promise<boolean> => {
      // Already cached — resolve immediately
      if (cacheRef.current.has(url)) {
        return Promise.resolve(true);
      }

      return new Promise<boolean>((resolve) => {
        const img = new Image();
        let settled = false;

        /**
         * Timeout guard to prevent infinite blocking on slow/broken images.
         * Resolves the promise with false so navigation can proceed.
         */
        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            resolve(false);
          }
        }, timeoutMs);

        /** Resolves the promise on successful image load and adds URL to cache. */
        img.onload = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            cacheRef.current.add(url);
            resolve(true);
          }
        };

        /** Resolves the promise with false on load failure. */
        img.onerror = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve(false);
          }
        };

        // Setting src triggers the browser to start fetching
        img.src = url;
      });
    },
    []
  );

  /**
   * Proactively preloads images adjacent to the current index.
   * Fires and forgets — errors are silently ignored since this is
   * an optimization, not a requirement for correct behavior.
   *
   * Preloads both (currentIndex - 1) and (currentIndex + 1) with
   * circular wrap-around for gallery-style navigation.
   *
   * @param urls - Array of all image URLs in the gallery
   * @param currentIndex - Index of the currently displayed image
   */
  const preloadAdjacent = useCallback(
    (urls: string[], currentIndex: number) => {
      if (urls.length <= 1) return;

      const prevIndex = (currentIndex - 1 + urls.length) % urls.length;
      const nextIndex = (currentIndex + 1) % urls.length;

      const prevUrl = urls[prevIndex];
      const nextUrl = urls[nextIndex];

      // Fire-and-forget: preload adjacent images without awaiting
      if (prevUrl) void preloadImage(prevUrl);
      if (nextUrl) void preloadImage(nextUrl);
    },
    [preloadImage]
  );

  return { preloadImage, preloadAdjacent };
}
