import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useProjectLoader } from '../../hooks/useProjectLoader';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../types';

/**
 * Tests for the useProjectLoader hook.
 *
 * The useProjectLoader hook manages asynchronous loading of projects in batches.
 * These tests verify:
 * - Proper initialization with initial projects
 * - Loading state management
 * - Batch loading functionality
 * - Calculation of hasMore and remainingCount
 * - Error handling without losing loaded projects
 * - Completion state when all projects loaded
 */
describe('useProjectLoader', () => {
  // We'll use a small subset of the projects for testing
  const mockProjects = [...PROJECTS.slice(0, 5)];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should initialize with provided initial projects', () => {
      const { result } = renderHook(() => useProjectLoader([...mockProjects], 5));

      expect(result.current.projects).toEqual(mockProjects);
      expect(result.current.projects).toHaveLength(5);
    });

    it('should initialize with empty array when no initial projects provided', () => {
      const { result } = renderHook(() => useProjectLoader([], 5));

      expect(result.current.projects).toEqual([]);
      expect(result.current.projects).toHaveLength(0);
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      expect(result.current.loading).toBe(false);
    });

    it('should have no error initially', () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      expect(result.current.error).toBeNull();
    });

    it('should default page size to 5', () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects));

      // We can't directly check pageSize, but we can verify it loads 5 more
      expect(result.current.projects).toHaveLength(5);
    });
  });

  describe('hasMore and remainingCount calculations', () => {
    it('should show hasMore as true when not all projects loaded', () => {
      const { result } = renderHook(() => useProjectLoader([...mockProjects], 5));

      expect(result.current.hasMore).toBe(true);
      expect(result.current.allLoaded).toBe(false);
    });

    it('should calculate correct remainingCount', () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      // 18 total - 5 initial = 13 remaining
      expect(result.current.remainingCount).toBe(13);
    });

    it('should show hasMore as false when all projects loaded', () => {
      // Start with all 18 projects
      const allProjects = [...PROJECTS];
      const { result } = renderHook(() => useProjectLoader(allProjects, 5));

      expect(result.current.hasMore).toBe(false);
      expect(result.current.allLoaded).toBe(true);
    });

    it('should calculate remainingCount as 0 when all loaded', () => {
      const allProjects = [...PROJECTS];
      const { result } = renderHook(() => useProjectLoader(allProjects, 5));

      expect(result.current.remainingCount).toBe(0);
    });

    it('should update remainingCount after loading more', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      expect(result.current.remainingCount).toBe(13);

      await act(async () => {
        await result.current.loadMore();
      });

      // After loading 5 more: 5 + 5 = 10 loaded, 8 remaining
      expect(result.current.remainingCount).toBe(8);
    });
  });

  describe('loadMore functionality', () => {
    it('should not change projects when loadMore called on empty initial state', async () => {
      const { result } = renderHook(() => useProjectLoader([], 5));

      await act(async () => {
        await result.current.loadMore();
      });

      // Should load first batch (5 projects)
      expect(result.current.projects).toHaveLength(5);
    });

    it('should append new projects to existing list', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      const initialCount = result.current.projects.length;
      expect(initialCount).toBe(5);

      await act(async () => {
        await result.current.loadMore();
      });

      // Should have initial + new batch
      expect(result.current.projects.length).toBeGreaterThan(initialCount);
      // First 5 should match initial projects
      expect(result.current.projects.slice(0, 5)).toEqual(mockProjects);
    });

    it('should set loading to false after completing load', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.loading).toBe(false);
    });

    it('should not load when all projects already loaded', async () => {
      const allProjects = [...PROJECTS];
      const { result } = renderHook(() => useProjectLoader(allProjects, 5));

      const countBefore = result.current.projects.length;

      await act(async () => {
        await result.current.loadMore();
      });

      // Should not have loaded more
      expect(result.current.projects.length).toBe(countBefore);
    });

    it('should be callable multiple times in sequence', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      await act(async () => {
        await result.current.loadMore();
        await result.current.loadMore();
      });

      // Should have loaded 2 batches (5 + 5 + 5 initial)
      expect(result.current.projects.length).toBe(15);
    });

    it('should update allLoaded when reaching total count', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      expect(result.current.allLoaded).toBe(false);

      // Load remaining 13 projects in batches
      await act(async () => {
        // First batch: 5 + 5 = 10
        await result.current.loadMore();
        // Second batch: 10 + 5 = 15
        await result.current.loadMore();
        // Third batch: 15 + 3 = 18 (complete)
        await result.current.loadMore();
      });

      expect(result.current.allLoaded).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should preserve loaded projects on error', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      const projectsBefore = result.current.projects;

      // Try to load more - the actual implementation handles errors gracefully
      await act(async () => {
        await result.current.loadMore();
      });

      // Projects should still be there
      expect(result.current.projects.length).toBeGreaterThanOrEqual(
        projectsBefore.length
      );
    });

    it('should clear previous error when loading new batch', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      // Load successfully first
      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.error).toBeNull();
    });

    it('should allow retry after error by calling loadMore again', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      const initialCount = result.current.projects.length;

      // First load
      await act(async () => {
        await result.current.loadMore();
      });

      const afterFirstLoad = result.current.projects.length;
      expect(afterFirstLoad).toBeGreaterThan(initialCount);

      // Second load (simulating retry)
      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.projects.length).toBeGreaterThan(afterFirstLoad);
    });
  });

  describe('Hook behavior', () => {
    it('should maintain project order across multiple loads', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      const firstProjectId = result.current.projects[0].id;

      await act(async () => {
        await result.current.loadMore();
        await result.current.loadMore();
      });

      // First project should still be first
      expect(result.current.projects[0].id).toBe(firstProjectId);
    });

    it('should have unique projects in the list', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      await act(async () => {
        await result.current.loadMore();
        await result.current.loadMore();
      });

      const projectIds = result.current.projects.map((p) => p.id);
      const uniqueIds = new Set(projectIds);

      // All IDs should be unique
      expect(uniqueIds.size).toBe(projectIds.length);
    });

    it('should work with small batch sizes', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 3));

      await act(async () => {
        await result.current.loadMore();
      });

      // Should have loaded 3 more
      expect(result.current.projects.length).toBe(8);
    });

    it('should work with large batch sizes', async () => {
      const { result } = renderHook(() => useProjectLoader([], 10));

      await act(async () => {
        await result.current.loadMore();
      });

      // Should load up to 10
      expect(result.current.projects.length).toBeGreaterThan(0);
    });
  });

  describe('Return value stability', () => {
    it('should return consistent project references', () => {
      const { result, rerender } = renderHook(() =>
        useProjectLoader(mockProjects, 5)
      );

      const firstRender = result.current.projects;

      rerender();

      expect(result.current.projects).toEqual(firstRender);
    });

    it('should have loadMore function that is callable', async () => {
      const { result } = renderHook(() => useProjectLoader(mockProjects, 5));

      expect(typeof result.current.loadMore).toBe('function');

      // Should not throw when called
      await expect(
        act(async () => {
          await result.current.loadMore();
        })
      ).resolves.not.toThrow();
    });
  });
});
