'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../lib/projectData';
import { useLocale } from './useLocale';
import type { ProjectsResponse, ProjectQueryOptions } from '../types';

/**
 * React hook for fetching and managing project data.
 * Provides loading states and error handling.
 *
 * @param initialOptions - Initial query options
 * @returns Project data, loading state, error state, and refetch function
 *
 * @example
 * function ProjectList() {
 * const { data, loading, error, refetch } = useProjects({ page: 1 });
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return <div>{data.items.map(project => ...)}</div>;
 * }
 */
export function useProjects(initialOptions: ProjectQueryOptions = {}) {
  const [data, setData] = useState<ProjectsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [options, setOptions] = useState<ProjectQueryOptions>(initialOptions);
  const { locale } = useLocale();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects({ ...options, locale });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options, locale]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback((newOptions?: ProjectQueryOptions) => {
    if (newOptions) {
      setOptions(newOptions);
    } else {
      fetchData();
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setOptions,
  };
}
