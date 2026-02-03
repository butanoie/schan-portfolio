import { PROJECTS } from '../data/projects';
import type { Project, ProjectsResponse, ProjectQueryOptions } from '../types';

/**
 * Default page size for project pagination.
 */
const DEFAULT_PAGE_SIZE = 6;

/**
 * Fetches projects with optional filtering and pagination.
 * Mimics the v1 PHP API response structure.
 *
 * @param options - Query options for filtering and pagination
 * @returns Paginated response with projects and metadata
 *
 * @example
 * // Get first page of all projects
 * const response = getProjects({ page: 1, pageSize: 6 });
 *
 * @example
 * // Filter by tags
 * const response = getProjects({ tags: ['React', 'TypeScript'] });
 *
 * @example
 * // Search by keyword
 * const response = getProjects({ search: 'dashboard' });
 */
export function getProjects(options: ProjectQueryOptions = {}): ProjectsResponse {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    tags = [],
    search = '',
  } = options;

  // Filter projects
  let filtered = [...PROJECTS];

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
        project.desc.toLowerCase().includes(query)
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
 * Fetches a single project by its ID.
 *
 * @param id - Unique project identifier
 * @returns Project object or null if not found
 *
 * @example
 * const project = getProjectById('collabspace');
 */
export function getProjectById(id: string): Project | null {
  return PROJECTS.find((project) => project.id === id) ?? null;
}

/**
 * Fetches all unique technology tags used across all projects.
 * Results are sorted alphabetically.
 *
 * @returns Array of unique tag strings
 *
 * @example
 * const tags = getAllTags();
 * // Returns: ['.NET 8', '.NET 9', 'ASP.Net', 'C#', ...]
 */
export function getAllTags(): string[] {
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
 * @returns Map of tag names to usage counts
 *
 * @example
 * const tagCounts = getTagCounts();
 * // Returns: Map { 'C#' => 12, 'React' => 3, ... }
 */
export function getTagCounts(): Map<string, number> {
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
 * Excludes the source project from results.
 * Results are sorted by relevance (most shared tags first).
 *
 * @param projectId - ID of the source project
 * @param limit - Maximum number of related projects to return (default: 3)
 * @returns Array of related projects sorted by relevance
 *
 * @example
 * const related = getRelatedProjects('collabspace', 3);
 */
export function getRelatedProjects(projectId: string, limit: number = 3): Project[] {
  const sourceProject = getProjectById(projectId);
  if (!sourceProject) {
    return [];
  }

  // Calculate relevance score for each project (number of shared tags)
  const scored = PROJECTS.filter((project) => project.id !== projectId).map(
    (project) => {
      const sharedTags = project.tags.filter((tag) =>
        sourceProject.tags.includes(tag)
      );
      return {
        project,
        score: sharedTags.length,
      };
    }
  );

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
