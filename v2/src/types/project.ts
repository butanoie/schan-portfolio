/**
 * Represents an image associated with a project.
 * Includes full-size and thumbnail URLs with optional retina variants.
 */
export interface ProjectImage {
  /** Full-size image URL (relative to public directory) */
  url: string;

  /** Standard thumbnail URL (relative to public directory) */
  tnUrl: string;

  /** Retina (2x) thumbnail URL (optional, for high-DPI displays) */
  tnUrl2x?: string;

  /** Image caption/description for accessibility and display */
  caption: string;
}

/**
 * Represents a video embed associated with a project.
 * Currently only supports Vimeo embeds.
 */
export interface ProjectVideo {
  /** Video platform type (currently only "vimeo" is supported) */
  type: 'vimeo' | 'youtube';

  /** Platform-specific video ID */
  id: string;

  /** Video player width in pixels */
  width: number;

  /** Video player height in pixels */
  height: number;
}

/**
 * Represents a portfolio project with all associated metadata.
 * Projects include images, optional videos, descriptions, and technology tags.
 */
export interface Project {
  /** Unique identifier (used as URL slug and image folder name) */
  id: string;

  /** Project title (may contain HTML for styling) */
  title: string;

  /**
   * Project description in HTML format.
   * May include paragraphs, lists, links, and emphasis markup.
   */
  desc: string;

  /**
   * Timeline/date range for the project.
   * Format varies: "Fall 2017 - Present", "Winter 2025", "2006 - 2012"
   */
  circa: string;

  /** Array of technology and skill tags (e.g., "React", "TypeScript") */
  tags: string[];

  /** Array of project images (2-8 images typical) */
  images: ProjectImage[];

  /** Array of embedded videos (0-1 videos typical) */
  videos: ProjectVideo[];

  /**
   * Flag for alternate grid layout (special multi-image display).
   * True for projects with complex image arrangements.
   */
  altGrid: boolean;
}

/**
 * Response envelope for paginated project queries.
 * Matches the v1 PHP API response structure.
 */
export interface ProjectsResponse {
  /** Total number of projects available */
  total: number;

  /** Start index of current page (0-based) */
  start: number;

  /** End index of current page (inclusive) */
  end: number;

  /** Array of projects for the current page */
  items: Project[];
}

/**
 * Options for querying projects.
 */
export interface ProjectQueryOptions {
  /** Page number (1-based, default: 1) */
  page?: number;

  /** Number of projects per page (default: 6) */
  pageSize?: number;

  /** Filter by technology tags (AND logic - project must have all tags) */
  tags?: string[];

  /** Search query for title and description (case-insensitive) */
  search?: string;
}
