import { PROJECTS } from '../data/projects';
import { getLocalizedProjects, getLocalizedProject } from '../data/localization';
import type { Project, ProjectsResponse, ProjectQueryOptions } from '../types';
import type { Locale } from './i18n-constants';

/**
 * Default page size for project pagination.
 */
const DEFAULT_PAGE_SIZE = 6;

/**
 * Fetches projects with optional filtering and pagination.
 *
 * Merges base project structure with localized translations from locale JSON files.
 * This ensures all user-facing strings (title, description, captions) are populated.
 * Supports filtering by tags and searching by title/description.
 * Mimics the v1 PHP API response structure.
 *
 * @param options - Query options for filtering, pagination, and localization
 * @returns Promise resolving to paginated response with localized projects
 *
 * @example
 * // Get first page of all projects with English translations
 * const response = await getProjects({ page: 1, pageSize: 6 });
 *
 * @example
 * // Filter by tags
 * const response = await getProjects({ tags: ['React', 'TypeScript'] });
 *
 * @example
 * // Search by keyword (searches localized title and description)
 * const response = await getProjects({ search: 'dashboard' });
 *
 * @example
 * // Get French translations
 * const response = await getProjects({ locale: 'fr', page: 1 });
 */
export async function getProjects(
  options: ProjectQueryOptions = {}
): Promise<ProjectsResponse> {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    tags = [],
    search = '',
    locale = 'en',
  } = options;

  // Get localized projects with specified locale
  const localizedProjects = await getLocalizedProjects(locale as Locale);

  // Filter projects
  let filtered = [...localizedProjects];

  // Filter by tags (AND logic - project must have all specified tags)
  if (tags.length > 0) {
    filtered = filtered.filter((project) =>
      tags.every((tag) => project.tags.includes(tag))
    );
  }

  // Filter by search query (case-insensitive, searches title and description)
  if (search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.desc.join(' ').toLowerCase().includes(query)
    );
  }

  // Calculate pagination
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  // Slice for current page
  const items = filtered.slice(start, end);

  return {
    total,
    start,
    end: end - 1, // Make end inclusive (matches v1 API)
    items,
  };
}

/**
 * Fetches a single project by its ID with localized content.
 *
 * Merges base project structure with localized translations from locale JSON files.
 * Returns the complete project with title, description, captions, and all other data.
 *
 * @param id - Unique project identifier
 * @param locale - Locale for localizing content (default: 'en')
 * @returns Promise resolving to localized project object or null if not found
 *
 * @example
 * const project = await getProjectById('collabspace');
 *
 * @example
 * const frenchProject = await getProjectById('collabspace', 'fr');
 */
export async function getProjectById(id: string, locale: string = 'en'): Promise<Project | null> {
  const project = await getLocalizedProject(id, locale as Locale);
  return project ?? null;
}

/**
 * Fetches all unique technology tags used across all projects.
 * Results are sorted alphabetically.
 *
 * @returns Promise resolving to array of unique tag strings
 *
 * @example
 * const tags = await getAllTags();
 * // Returns: ['.NET 8', '.NET 9', 'ASP.Net', 'C#', ...]
 */
export async function getAllTags(): Promise<string[]> {
  const tagSet = new Set<string>();

  for (const project of PROJECTS) {
    for (const tag of project.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

/**
 * Counts how many projects use each technology tag.
 * Useful for tag cloud displays with weighted sizes.
 *
 * @returns Promise resolving to map of tag names to usage counts
 *
 * @example
 * const tagCounts = await getTagCounts();
 * // Returns: Map { 'C#' => 12, 'React' => 3, ... }
 */
export async function getTagCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  for (const project of PROJECTS) {
    for (const tag of project.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return counts;
}

/**
 * Fetches related projects based on shared tags.
 *
 * Finds projects that share technology tags with the source project,
 * excluding the source project itself. Results are sorted by relevance
 * (number of shared tags) and limited to the specified count.
 * Uses localized project data for consistency.
 *
 * @param projectId - ID of the source project
 * @param limit - Maximum number of related projects to return (default: 3)
 * @param locale - Locale for localizing content (default: 'en')
 * @returns Promise resolving to array of related projects sorted by relevance
 *
 * @example
 * const related = await getRelatedProjects('collabspace', 3);
 *
 * @example
 * const frenchRelated = await getRelatedProjects('collabspace', 3, 'fr');
 */
export async function getRelatedProjects(
  projectId: string,
  limit: number = 3,
  locale: string = 'en'
): Promise<Project[]> {
  const sourceProject = await getProjectById(projectId, locale);
  if (!sourceProject) {
    return [];
  }

  // Get all localized projects
  const allProjects = await getLocalizedProjects(locale as Locale);

  // Calculate relevance score for each project (number of shared tags)
  const scored = allProjects
    .filter((project) => project.id !== projectId)
    .map((project) => {
      const sharedTags = project.tags.filter((tag) =>
        sourceProject.tags.includes(tag)
      );
      return {
        project,
        score: sharedTags.length,
      };
    });

  // Sort by score descending, then by project order (most recent first)
  scored.sort((a, b) => b.score - a.score);

  // Take top N results
  return scored.slice(0, limit).map((item) => item.project);
}

/**
 * Gets the total number of projects in the portfolio.
 * Dynamically computed from the actual project data, so it automatically
 * updates when new projects are added to the PROJECTS array.
 *
 * **Design Note:** This is a function (not a constant) to ensure the count
 * always reflects the current project data. If this were a hardcoded constant,
 * it would become stale whenever projects are added, leading to bugs where
 * pagination limits don't match actual data.
 *
 * @returns Total count of all projects in the portfolio
 *
 * @example
 * const totalProjects = getTotalProjectCount();
 * // Returns: 18 (or more if new projects are added)
 */
export function getTotalProjectCount(): number {
  return PROJECTS.length;
}

/**
 * Calculates pagination metadata for UI display.
 *
 * @param total - Total number of items
 * @param page - Current page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Pagination metadata
 *
 * @example
 * const pagination = getPaginationInfo(18, 2, 6);
 * // Returns: { totalPages: 3, hasNext: true, hasPrev: true, ... }
 */
export function getPaginationInfo(total: number, page: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize);

  return {
    totalPages,
    currentPage: page,
    pageSize,
    totalItems: total,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    startIndex: (page - 1) * pageSize,
    endIndex: Math.min(page * pageSize, total),
  };
}
