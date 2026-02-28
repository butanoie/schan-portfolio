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

