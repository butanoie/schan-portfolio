'use server';

/**
 * Server-side data fetching utilities for Next.js.
 * These functions run on the server and can be used in Server Components.
 *
 * @module projectDataServer
 */

import { getProjects } from './projectData';
import type { ProjectsResponse, ProjectQueryOptions } from '../types';

/**
 * Server action to fetch projects.
 * Can be called from Server Components or Client Components.
 *
 * @param options - Query options
 * @returns Promise resolving to projects response
 *
 * @example
 * const projects = await fetchProjects({ page: 1, pageSize: 6 });
 */
export async function fetchProjects(
  options: ProjectQueryOptions = {}
): Promise<ProjectsResponse> {
  // In production, this could fetch from a database or API
  // For now, we use the in-memory data
  return getProjects(options);
}

