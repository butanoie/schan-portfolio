'use client';

import { createContext, useContext, ReactNode } from 'react';

/**
 * Context value type for project loading state.
 *
 * This context provides loading state and callbacks for managing
 * asynchronous project loading across multiple components.
 *
 * @interface ProjectLoadingContextValue
 * @property {boolean} isHomePage - Whether the current page is the home page
 * @property {boolean} loading - Whether currently loading next batch of projects
 * @property {boolean} hasMore - Whether more projects are available to load
 * @property {boolean} allLoaded - Whether all projects have been loaded
 * @property {number} remainingCount - Number of projects not yet loaded
 * @property {() => void} onLoadMore - Callback function to load next batch
 */
export interface ProjectLoadingContextValue {
  /** True if currently on the home page (/) */
  isHomePage: boolean;

  /** True while fetching the next batch of projects */
  loading: boolean;

  /** True if there are more projects available to load */
  hasMore: boolean;

  /** True if all projects have been loaded */
  allLoaded: boolean;

  /** Number of projects not yet loaded (0 if all loaded) */
  remainingCount: number;

  /** Function to trigger loading the next batch of projects */
  onLoadMore: () => void;
}

/**
 * React Context for managing project loading state.
 *
 * This context is created but may not have a value initially.
 * Components should use the `useProjectLoading` hook to access the context,
 * which provides proper error handling if the context is not available.
 *
 * @internal Use `useProjectLoading` hook instead of accessing directly
 */
const ProjectLoadingContext = createContext<
  ProjectLoadingContextValue | undefined
>(undefined);

/**
 * Props for the ProjectLoadingProvider component.
 *
 * @interface ProjectLoadingProviderProps
 * @property {ProjectLoadingContextValue} value - The context value to provide
 * @property {ReactNode} children - Child components that can access the context
 */
interface ProjectLoadingProviderProps {
  /** The loading state and callbacks to provide to children */
  value: ProjectLoadingContextValue;

  /** React components that can access this context */
  children: ReactNode;
}

/**
 * Provider component for project loading context.
 *
 * Wraps child components to provide project loading state via React Context.
 * This should typically wrap the AsyncProjectsList component and any
 * components that need access to loading state (like the Footer).
 *
 * **Usage Example:**
 * ```typescript
 * <ProjectLoadingProvider value={loadingState}>
 *   <AsyncProjectsList initialProjects={projects} />
 *   <Footer />
 * </ProjectLoadingProvider>
 * ```
 *
 * **Context Value:**
 * The `value` prop should contain:
 * - `isHomePage`: Boolean indicating if on home page
 * - `loading`: Current loading state
 * - `hasMore`: Whether more projects available
 * - `allLoaded`: Whether all projects loaded
 * - `remainingCount`: Number remaining to load
 * - `onLoadMore`: Function to trigger next batch load
 *
 * @param {ProjectLoadingProviderProps} props - Provider props with value and children
 * @param {ProjectLoadingContextValue} props.value - The loading state and callbacks to provide to children
 * @param {ReactNode} props.children - React components that can access this context
 * @returns {JSX.Element} A provider component wrapping children
 *
 * @example
 * ```typescript
 * const [projects, setProjects] = useState(initialProjects);
 *
 * <ProjectLoadingProvider value={{
 *   isHomePage: true,
 *   loading: false,
 *   hasMore: true,
 *   allLoaded: false,
 *   remainingCount: 13,
 *   onLoadMore: handleLoadMore
 * }}>
 *   {children}
 * </ProjectLoadingProvider>
 * ```
 */
export function ProjectLoadingProvider({
  value,
  children,
}: ProjectLoadingProviderProps) {
  return (
    <ProjectLoadingContext.Provider value={value}>
      {children}
    </ProjectLoadingContext.Provider>
  );
}

/**
 * Hook to consume the project loading context.
 *
 * This hook provides safe access to the project loading context state.
 * It can be called from any component within a ProjectLoadingProvider.
 *
 * **When to use:**
 * - In components that need to react to loading state (Footer, LoadMoreButton)
 * - To trigger loading more projects
 * - To determine what UI to display based on loading progress
 *
 * **When NOT needed:**
 * - In server components (use server-side data instead)
 * - In components outside ProjectLoadingProvider (will return undefined)
 * - In AsyncProjectsList itself (use useProjectLoader instead)
 *
 * **Example - Footer component:**
 * ```typescript
 * function Footer() {
 *   const loadingContext = useProjectLoading();
 *
 *   if (!loadingContext) {
 *     // Not in a loading context (e.g., on non-home pages)
 *     return <NormalFooter />;
 *   }
 *
 *   return (
 *     <>
 *       {loadingContext.hasMore ? (
 *         <LoadMoreButton onClick={loadingContext.onLoadMore} />
 *       ) : (
 *         <CompletionMessage />
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * **Example - conditional rendering:**
 * ```typescript
 * function ComponentNeedingLoadingState() {
 *   const loadingContext = useProjectLoading();
 *
 *   if (!loadingContext) {
 *     // Provide default behavior when context unavailable
 *     return null;
 *   }
 *
 *   return (
 *     <div>
 *       {loadingContext.loading && <Spinner />}
 *       {loadingContext.allLoaded && <CompletionMessage />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns The project loading context value, or undefined if not in provider
 *
 * @throws No exceptions; returns undefined if context not available
 */
export function useProjectLoading(): ProjectLoadingContextValue | undefined {
  const context = useContext(ProjectLoadingContext);
  return context;
}

/**
 * Hook to consume the project loading context with required provider check.
 *
 * This is a stricter version of `useProjectLoading` that throws an error
 * if called outside a ProjectLoadingProvider. Use this when the context
 * is required and missing it indicates a configuration error.
 *
 * **When to use:**
 * - In components that MUST have loading context (LoadMoreButton)
 * - When missing context indicates a bug, not just missing functionality
 * - In sub-components that depend on parent providing context
 *
 * **When NOT to use:**
 * - In optional loading state consumers (use `useProjectLoading` instead)
 * - In components that gracefully handle missing context
 *
 * **Example - LoadMoreButton component:**
 * ```typescript
 * function LoadMoreButton() {
 *   const { loading, onLoadMore, remainingCount } =
 *     useProjectLoadingRequired();
 *
 *   return (
 *     <button onClick={onLoadMore} disabled={loading}>
 *       Load {remainingCount} more
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns The project loading context value (never undefined)
 * @throws {Error} If called outside ProjectLoadingProvider
 */
export function useProjectLoadingRequired(): ProjectLoadingContextValue {
  const context = useProjectLoading();

  if (!context) {
    throw new Error(
      'useProjectLoadingRequired must be called within a ProjectLoadingProvider'
    );
  }

  return context;
}
