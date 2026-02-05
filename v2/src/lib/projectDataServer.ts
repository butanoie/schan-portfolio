'use server';

/**
 * Server-side data fetching utilities for Next.js.
 * These functions run on the server and can be used in Server Components.
 *
 * @module projectDataServer
 */

import { getProjects, getProjectById, getAllTags } from './projectData';
import type { Project, ProjectsResponse, ProjectQueryOptions } from '../types';

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

/**
 * Server action to fetch a single project by ID.
 *
 * @param id - Project identifier
 * @param locale - Locale for localizing content (default: 'en')
 * @returns Promise resolving to localized project or null
 *
 * @example
 * const project = await fetchProjectById('collabspace');
 *
 * @example
 * const frenchProject = await fetchProjectById('collabspace', 'fr');
 */
export async function fetchProjectById(id: string, locale: string = 'en'): Promise<Project | null> {
  return await getProjectById(id, locale);
}

/**
 * Server action to fetch all tags.
 *
 * @returns Promise resolving to array of unique tags
 *
 * @example
 * const tags = await fetchAllTags();
 */
export async function fetchAllTags(): Promise<string[]> {
  return getAllTags();
}
