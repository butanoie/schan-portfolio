'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@mui/material';
import { SearchBar } from './SearchBar';
import { ProjectFilters } from './ProjectFilters';
import { ProjectGrid } from './ProjectGrid';
import { ButaNavigation } from './ButaNavigation';
import { useProjects } from '../../hooks/useProjects';
import type { ProjectsResponse } from '../../types';

/**
 * Props for the PortfolioPageClient component.
 */
interface PortfolioPageClientProps {
  /** Initial server-rendered project data */
  initialData: ProjectsResponse;

  /** Map of all available tags to their usage counts */
  tagCounts: Map<string, number>;
}

/**
 * Client-side interactive portfolio page component.
 *
 * Manages filtering, search, and pagination state with URL synchronization.
 * URL params allow for shareable filter states (e.g., /?tags=React,TypeScript&search=dashboard&page=2).
 *
 * @param props - Component props
 * @param props.initialData - Server-rendered initial project data for fast first paint
 * @param props.tagCounts - Map of technology tags to project counts for filter UI
 * @returns Portfolio page with search, filters, grid, and pagination
 *
 * @example
 * ```tsx
 * <PortfolioPageClient
 *   initialData={serverData}
 *   tagCounts={tagCountsMap}
 * />
 * ```
 */
export function PortfolioPageClient({
  initialData,
  tagCounts,
}: PortfolioPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse initial state from URL params
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page')) || 1
  );

  // Client-side data fetching with filter state
  const { data, loading, setOptions } = useProjects({
    page,
    pageSize: 6,
    tags: selectedTags,
    search: searchQuery,
  });

  // Use server data on first render, then switch to client data
  const displayData = data || initialData;

  // Sync state to URL (without scroll) whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','));
    }

    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    }

    if (page > 1) {
      params.set('page', String(page));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';

    router.push(newUrl, { scroll: false });
  }, [selectedTags, searchQuery, page, router]);

  // Update hook options when state changes
  useEffect(() => {
    setOptions({
      page,
      pageSize: 6,
      tags: selectedTags,
      search: searchQuery,
    });
  }, [page, selectedTags, searchQuery, setOptions]);

  // Calculate Buta navigation state
  const butaState = loading
    ? 'loading'
    : displayData.end >= displayData.total - 1
    ? 'end'
    : 'load-more';

  /**
   * Handles project card click navigation.
   * Navigates to the project detail page.
   *
   * @param projectId - The unique identifier of the clicked project
   */
  const handleProjectClick = useCallback(
    (projectId: string) => {
      router.push(`/projects/${projectId}`);
    },
    [router]
  );

  /**
   * Handles load more button click.
   * Increments the page number to load the next set of projects.
   */
  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  /**
   * Handles tag filter changes.
   * Resets pagination to page 1 when filters change.
   *
   * @param tags - Array of selected tag names
   */
  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags);
    setPage(1);
  }, []);

  /**
   * Handles search query changes.
   * Resets pagination to page 1 when search changes.
   *
   * @param query - The search query string
   */
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        resultsCount={displayData.total}
        placeholder="Search projects..."
        sx={{ mb: 3 }}
      />

      <ProjectFilters
        tags={tagCounts}
        selectedTags={selectedTags}
        onTagsChange={handleTagsChange}
        sx={{ mb: 4 }}
      />

      <ProjectGrid
        projects={displayData.items}
        loading={loading}
        onProjectClick={handleProjectClick}
        sx={{ mb: 4 }}
      />

      <ButaNavigation
        state={butaState}
        currentCount={displayData.end + 1}
        totalCount={displayData.total}
        onLoadMore={handleLoadMore}
      />
    </Container>
  );
}
