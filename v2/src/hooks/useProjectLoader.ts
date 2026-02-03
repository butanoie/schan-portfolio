'use client';

import { useState, useCallback, useRef } from 'react';
import { getProjects, getTotalProjectCount } from '../lib/projectData';
import { LOADING_DELAY } from '../constants/app';
import type { Project } from '../types';

/**
 * Return type for the useProjectLoader hook.
 *
 * @interface UseProjectLoaderReturn
 * @property {Project[]} projects - All loaded projects so far
 * @property {boolean} loading - Whether currently loading next batch
 * @property {Error | null} error - Any error encountered during loading
 * @property {() => void} loadMore - Function to load next batch of projects
 * @property {boolean} hasMore - Whether more projects are available to load
 * @property {number} remainingCount - Number of projects not yet loaded
 * @property {boolean} allLoaded - Whether all projects have been loaded
 */
interface UseProjectLoaderReturn {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasMore: boolean;
  remainingCount: number;
  allLoaded: boolean;
}

/**
 * React hook for asynchronously loading projects in batches.
 *
 * This hook manages progressive loading of projects, allowing you to:
 * - Start with an initial batch of projects (typically from server)
 * - Load additional projects on demand via the `loadMore` function
 * - Track loading state, errors, and remaining count
 * - Automatically calculate if more projects are available
 *
 * The hook uses a static dataset of 18 total projects and loads them in
 * configurable batch sizes (default 5 projects per batch).
 *
 * **State Management:**
 * - Maintains cumulative list of all loaded projects
 * - Tracks current page for pagination
 * - Updates `hasMore` based on total count vs loaded count
 * - Calculates `remainingCount` for UI feedback
 * - Handles errors gracefully without losing loaded projects
 *
 * **Design Note - Async Wrapper for Synchronous Function:**
 * The `loadMore` function is async, but the underlying `getProjects()` is synchronous.
 * This design provides several benefits:
 *
 * 1. **Future API Migration Path:** When transitioning from static data to a real API,
 * no hook interface changes are needed. The async structure is already in place.
 *
 * 2. **Simulated Network Delay:** The SIMULATED_LOAD_DELAY allows testing loading states
 * and skeleton UI animations without making real network requests. Set the delay to 0
 * in production for instant loading.
 *
 * 3. **Consistent Async Pattern:** Users of this hook expect async operations. Even though
 * the data is currently synchronous, wrapping it in async/await maintains consistency
 * with real async operations they may implement later.
 *
 * 4. **Loading State Management:** The async wrapper naturally allows `setLoading(true)`
 * at the start and `setLoading(false)` after the delay, enabling proper skeleton
 * placeholder display.
 *
 * **Implementation Detail:**
 * - `getProjects()` is called after `await Promise.resolve(SIMULATED_LOAD_DELAY)`
 * - No actual async work happens in the Promise (it's just a delay)
 * - Function returns synchronously retrieved data
 * - This pattern prepares the code for real async operations (real API calls)
 *
 * **Usage Example:**
 * ```typescript
 * function ProjectsList({ initialProjects }: { initialProjects: Project[] }) {
 * const { projects, loading, error, loadMore, hasMore, remainingCount } =
 * useProjectLoader(initialProjects, 5);
 *
 * return (
 * <>
 * <div>
 * {projects.map(project => (
 * <ProjectCard key={project.id} project={project} />
 * ))}
 * </div>
 * {loading && <div>Loading...</div>}
 * {error && <div>Error: {error.message}</div>}
 * {hasMore && (
 * <button onClick={loadMore}>
 * Load {remainingCount} more
 * </button>
 * )}
 * </>
 * );
 * }
 * ```
 *
 * **Error Handling:**
 * If an error occurs during loading, the error state is set but previously
 * loaded projects are preserved. The `loadMore` function can be called again
 * to retry after an error.
 *
 * **Hydration Safety:**
 * This hook is safe to use in server components that hydrate to client
 * components. The initial projects from the server are passed directly
 * without refetching.
 *
 * **Future Migration to Real API:**
 * To migrate to a real API, simply replace the `getProjects()` call with
 * an actual API fetch:
 * ```typescript
 * // Current code (stays the same)
 * await new Promise((resolve) => setTimeout(resolve, SIMULATED_LOAD_DELAY));
 * const response = getProjects({ page: nextPage, pageSize });
 *
 * // Future API version (same structure)
 * const response = await fetch(`/api/projects?page=${nextPage}&pageSize=${pageSize}`)
 *   .then(res => res.json());
 * ```
 *
 * @param initialProjects - Projects already loaded (typically from server)
 * @param pageSize - Number of projects to load per batch (default: 5)
 * @returns Hook return value with projects, loading state, and load function
 *
 * @throws No exceptions are thrown; errors are captured in the error state
 */
export function useProjectLoader(
  initialProjects: Project[] = [],
  pageSize: number = 5
): UseProjectLoaderReturn {
  // State for all loaded projects (cumulative)
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // State for loading next batch
  const [loading, setLoading] = useState<boolean>(false);

  // State for any errors during loading
  const [error, setError] = useState<Error | null>(null);

  // Track current page - start from page 2 since page 1 is already loaded (initial 5)
  const currentPageRef = useRef<number>(1);

  // Simulated loading delay (in milliseconds) for debugging skeleton visibility
  // Set to 0 for production performance, increase for testing skeleton animations
  // In tests, the delay is automatically set to 0 for speed
  const SIMULATED_LOAD_DELAY =
    typeof window === 'undefined' || process.env.NODE_ENV === 'test'
      ? 0 // Instant loading in tests and SSR
      : parseInt(process.env.NEXT_PUBLIC_LOAD_DELAY || LOADING_DELAY.toString(), 10);

  // Get total project count from actual data (dynamic, not hardcoded)
  const totalProjects = getTotalProjectCount();

  // Calculate if more projects are available
  const hasMore = projects.length < totalProjects;

  // Calculate remaining projects not yet loaded
  const remainingCount = totalProjects - projects.length;

  // Check if all projects have been loaded
  const allLoaded = projects.length >= totalProjects;

  /**
   * Load the next batch of projects.
   *
   * This function:
   * 1. Sets loading state to true
   * 2. Waits for SIMULATED_LOAD_DELAY (for debugging skeleton visibility)
   * 3. Increments the page counter
   * 4. Fetches the next batch using getProjects
   * 5. Appends new projects to existing list (maintaining order)
   * 6. Clears any previous error
   * 7. Sets loading state to false
   *
   * The simulated delay allows you to see the skeleton loading animation.
   * In production, set SIMULATED_LOAD_DELAY to 0 for instant loading.
   *
   * If an error occurs:
   * - Error state is set
   * - Previously loaded projects are preserved
   * - Loading state is set to false
   * - Function can be called again to retry
   *
   * The function prevents loading beyond the total project count by checking
   * hasMore before actually fetching.
   */
  const loadMore = useCallback(async () => {
    // Don't attempt to load if all projects are already loaded
    if (allLoaded) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulate network delay for debugging skeleton visibility
      // Remove or set to 0 in production for instant loading
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_LOAD_DELAY));

      // Increment to next page and fetch
      const nextPage = currentPageRef.current + 1;
      const response = getProjects({
        page: nextPage,
        pageSize,
      });

      // Append new projects to existing list (maintain cumulative order)
      setProjects((prevProjects) => [...prevProjects, ...response.items]);

      // Update page reference
      currentPageRef.current = nextPage;
    } catch (err) {
      // Capture error but preserve loaded projects
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [allLoaded, pageSize, SIMULATED_LOAD_DELAY]);

  return {
    projects,
    loading,
    error,
    loadMore,
    hasMore,
    remainingCount,
    allLoaded,
  };
}
