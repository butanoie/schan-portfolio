'use client';

import { Box } from '@mui/material';
import { useMemo, useEffect, useContext } from 'react';
import type { Project } from '../../types';
import { ProjectsList } from './ProjectsList';
import { ProjectSkeleton } from './ProjectSkeleton';
import ErrorBoundary from '../common/ErrorBoundary';
import { ProjectLoadingProvider } from '../../contexts/ProjectLoadingContext';
import { useProjectLoader } from '../../hooks/useProjectLoader';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../hooks';
import { ProjectLoadingStateBridgeContext } from '../common/MainLayout';

/**
 * Props for the AsyncProjectsList component.
 *
 * @interface AsyncProjectsListProps
 * @property {Project[]} initialProjects - Projects to display initially (typically from server)
 * @property {number} [pageSize=5] - Number of projects to load per batch
 * @property {boolean} [isHomePage=false] - Whether this is the home page
 */
interface AsyncProjectsListProps {
  /** Initial projects already loaded (typically from server, first batch) */
  initialProjects: Project[];

  /** Number of projects to load per batch (default: 5) */
  pageSize?: number;

  /** Whether this is the home page (enables Load More in footer) */
  isHomePage?: boolean;
}

/**
 * Client component managing asynchronous project loading with progressive batches.
 *
 * This component orchestrates the entire async loading experience:
 * - Displays initial projects immediately (from server)
 * - Shows loading skeletons while fetching next batch
 * - Provides Load More button via ProjectLoadingContext
 * - Handles errors gracefully with ErrorBoundary
 * - Coordinates with Footer via context
 *
 * **Architecture:**
 * The component uses a hybrid approach:
 * - Server Component (parent) provides initial 5 projects
 * - Client Component (this) manages additional loads
 * - Context bridges state to Footer component
 * - Skeletons show loading progress
 * - ErrorBoundary protects against rendering errors
 *
 * **Loading Flow:**
 * 1. Page loads, component displays 5 projects from server immediately
 * 2. User clicks "Load More" in footer
 * 3. Component shows 5 skeleton placeholders
 * 4. Fetches next 5 projects in background
 * 5. Replaces skeletons with actual projects
 * 6. Updates button state (more to load or completion)
 * 7. User can click again or sees "All loaded" message
 *
 * **State Management:**
 * Uses `useProjectLoader` hook which provides:
 * - `projects`: Array of all loaded projects
 * - `loading`: Whether currently fetching
 * - `hasMore`: Whether more projects available
 * - `remainingCount`: Number not yet loaded
 * - `allLoaded`: Whether all 18 projects loaded
 * - `loadMore()`: Function to fetch next batch
 *
 * **Context Provision:**
 * Provides `ProjectLoadingContext` to child components (Footer) with:
 * - Loading state and callbacks
 * - Page identification
 * - Remaining count for UI
 * - onLoadMore callback
 *
 * **Accessibility:**
 * - Skeletons marked with aria-busy="true"
 * - Loading announcements via ARIA live regions (in parent)
 * - Focus management after load (in parent)
 * - Keyboard accessible Load More button
 *
 * **Error Handling:**
 * - ErrorBoundary catches rendering errors
 * - Gracefully handles load failures
 * - Preserves loaded projects on error
 *
 * **Performance:**
 * - Renders initial projects immediately (no artificial delay)
 * - Only shows skeletons for loadMore operations (better Core Web Vitals)
 * - Batch size of 5 balances UX and performance
 * - No unnecessary re-renders
 * - Minimal CLS (Cumulative Layout Shift)
 *
 * **Usage Example:**
 * ```typescript
 * // In home page (server component)
 * const { items } = await fetchProjects({ page: 1, pageSize: 5 });
 *
 * return (
 *   <Container>
 *     <PageDeck {...} />
 *     <AsyncProjectsList
 *       initialProjects={items}
 *       pageSize={5}
 *       isHomePage={true}
 *     />
 *   </Container>
 * );
 * ```
 *
 * @param props - Component props
 * @param props.initialProjects - The initial projects to display (typically from server)
 * @param props.pageSize - Number of projects to load per batch (default: 5)
 * @param props.isHomePage - Whether this is the home page variant (default: false)
 * @returns A JSX element rendering the async projects list with progressive loading
 *
 * @example
 * <AsyncProjectsList initialProjects={serverProjects} pageSize={5} isHomePage={true} />
 */
export function AsyncProjectsList({
  initialProjects,
  pageSize = 5,
  isHomePage = false,
}: AsyncProjectsListProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const isActuallyOnHomePage = pathname === '/';

  // Use isHomePage prop if provided, otherwise detect from pathname
  const shouldShowLoadMore = isHomePage || isActuallyOnHomePage;

  // Hook for managing progressive loading
  const {
    projects,
    loading,
    error,
    loadMore,
    hasMore,
    remainingCount,
    allLoaded,
  } = useProjectLoader(initialProjects, pageSize);

  // Get the bridge context to report loading state to MainLayout
  const bridge = useContext(ProjectLoadingStateBridgeContext);

  /**
   * Memoize context value to prevent unnecessary re-renders.
   * Only updates when loading state or remaining count changes.
   */
  const contextValue = useMemo(
    () => ({
      isHomePage: shouldShowLoadMore,
      loading,
      hasMore,
      allLoaded,
      remainingCount,
      onLoadMore: loadMore,
    }),
    [shouldShowLoadMore, loading, hasMore, allLoaded, remainingCount, loadMore]
  );

  /**
   * Report loading state to parent MainLayout when on home page.
   * This allows Footer (rendered in MainLayout) to access the loading state
   * through ProjectLoadingContext without requiring it to be nested within
   * this component.
   *
   * When navigating away from the home page, clear the state so Footer shows
   * the normal thought bubble instead of retaining the last home page state.
   */
  useEffect(() => {
    if (bridge) {
      bridge.onStateChange(shouldShowLoadMore ? contextValue : null);
    }
  }, [bridge, shouldShowLoadMore, contextValue]);

  /**
   * Render layout depends on whether we should show Load More button.
   * Home page gets wrapped in context provider for footer integration.
   * Other pages just show projects without context.
   */
  const content = (
    <ErrorBoundary>
      {/* Display all loaded projects */}
      <ProjectsList projects={projects} />

      {/* Show loading skeletons while fetching next batch */}
      {loading && (
        <Box
          role="region"
          aria-live="polite"
          aria-label="Loading more projects"
          sx={{ mt: 4 }}
        >
          {Array.from({ length: pageSize }).map((_, i) => (
            <ProjectSkeleton key={`skeleton-${i}`} variant="wide-regular" />
          ))}
        </Box>
      )}

      {/* Display error if loading fails */}
      {error && (
        <Box
          role="alert"
          aria-live="assertive"
          sx={{
            mt: 4,
            p: 2,
            backgroundColor: '#ffebee',
            borderLeft: '4px solid #c62828',
            borderRadius: 1,
          }}
        >
          {t('asyncProjectsList.loadingError', { ns: 'components' })}: {error.message}
        </Box>
      )}
    </ErrorBoundary>
  );

  /**
   * If on home page, wrap with context provider to enable Load More in footer.
   * The context allows the Footer component to access loading state and trigger loads.
   */
  if (shouldShowLoadMore) {
    return (
      <ProjectLoadingProvider value={contextValue}>{content}</ProjectLoadingProvider>
    );
  }

  /**
   * On non-home pages, just render projects without Load More context.
   * This allows AsyncProjectsList to be used anywhere while only
   * showing Load More functionality on the home page.
   */
  return content;
}
