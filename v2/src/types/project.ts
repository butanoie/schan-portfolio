/**
 * Represents an image associated with a project.
 * Includes full-size and thumbnail URLs with optional retina variants.
 *
 * @example
 * // Standard image with thumbnails
 * const image: ProjectImage = {
 * url: '/projects/my-project/hero.jpg',
 * tnUrl: '/projects/my-project/hero-thumb.jpg',
 * tnUrl2x: '/projects/my-project/hero-thumb@2x.jpg',
 * caption: 'Hero image showing the project design'
 * };
 *
 * @example
 * // Image without retina variant (still valid)
 * const simpleImage: ProjectImage = {
 * url: '/images/photo.jpg',
 * tnUrl: '/images/photo-thumb.jpg',
 * caption: 'A project screenshot'
 * };
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
 * Supports Vimeo and YouTube embeds.
 *
 * @example
 * // Vimeo video (8-11 digit ID)
 * const vimeoVideo: ProjectVideo = {
 * type: 'vimeo',
 * id: '123456789',
 * width: 560,
 * height: 315
 * };
 *
 * @example
 * // YouTube video (11 character ID)
 * const youtubeVideo: ProjectVideo = {
 * type: 'youtube',
 * id: 'dQw4w9WgXcQ',
 * width: 560,
 * height: 315
 * };
 *
 * @example
 * // Wide format video (16:9 aspect ratio)
 * const wideVideo: ProjectVideo = {
 * type: 'youtube',
 * id: 'dQw4w9WgXcQ',
 * width: 1920,
 * height: 1080
 * };
 */
export interface ProjectVideo {
  /** Video platform type ("vimeo" or "youtube") */
  type: 'vimeo' | 'youtube';

  /** Platform-specific video ID (Vimeo: 8-11 digits, YouTube: 11 alphanumeric) */
  id: string;

  /** Video player width in pixels */
  width: number;

  /** Video player height in pixels */
  height: number;
}

/**
 * Represents a portfolio project with all associated metadata.
 * Projects include images, optional videos, descriptions, and technology tags.
 *
 * @example
 * // Complete project with images and video
 * const project: Project = {
 * id: 'amazing-website',
 * title: '<strong>Amazing</strong> Website Redesign',
 * desc: ['A complete redesign...', 'Features: ...'],
 * circa: 'Fall 2023 - Winter 2024',
 * tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
 * images: [{url: '/projects/amazing-website/hero.jpg', tnUrl: '/projects/amazing-website/hero-thumb.jpg', caption: 'Homepage hero section'}],
 * videos: [{type: 'youtube', id: 'dQw4w9WgXcQ', width: 560, height: 315}],
 * altGrid: false
 * };
 *
 * @example
 * // Project without video
 * const simpleProject: Project = {
 * id: 'logo-design',
 * title: 'Company Logo Design',
 * desc: ['Logo design for XYZ company...'],
 * circa: 'Spring 2024',
 * tags: ['Design', 'Branding'],
 * images: [{url: '/projects/logo/final.png', tnUrl: '/projects/logo/final-thumb.png', caption: 'Final logo design'}],
 * videos: [],
 * altGrid: false
 * };
 */

/**
 * Project interface.
 */
export interface Project {
  /** Unique identifier (used as URL slug and image folder name) */
  id: string;

  /** Project title (may contain HTML for styling like <strong>, <em>) */
  title: string;

  /**
   * Project description as an array of paragraphs.
   * Each paragraph may contain HTML markup for links, emphasis, and lists.
   * All HTML is sanitized before rendering for security.
   *
   * @example ["First paragraph", "Second paragraph with <em>emphasis</em>"]
   */
  desc: string[];

  /**
   * Timeline/date range for the project.
   * Format varies: "Fall 2017 - Present", "Winter 2025", "2006 - 2012"
   */
  circa: string;

  /** Array of technology and skill tags (e.g., "React", "TypeScript", "Python") */
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
 *
 * @example
 * // First page of results
 * const response: ProjectsResponse = {
 * total: 18,
 * start: 0,
 * end: 4,
 * items: [
 * { id: 'project-1', title: 'First Project', ... },
 * { id: 'project-2', title: 'Second Project', ... },
 * // ... 3 more projects
 * ]
 * };
 *
 * @example
 * // Second page of results
 * const page2: ProjectsResponse = {
 * total: 18,
 * start: 5,
 * end: 9,
 * items: [
 * { id: 'project-6', title: 'Sixth Project', ... },
 * // ... 4 more projects
 * ]
 * };
 *
 * @example
 * // Last page with fewer items
 * const lastPage: ProjectsResponse = {
 * total: 18,
 * start: 15,
 * end: 17,
 * items: [
 * { id: 'project-16', title: 'Sixteenth Project', ... },
 * { id: 'project-17', title: 'Seventeenth Project', ... },
 * { id: 'project-18', title: 'Eighteenth Project', ... }
 * ]
 * };
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
 *
 * @example
 * // Get first page with default page size
 * const options1: ProjectQueryOptions = {};
 *
 * @example
 * // Get second page with custom page size
 * const options2: ProjectQueryOptions = {
 * page: 2,
 * pageSize: 10
 * };
 *
 * @example
 * // Filter projects by multiple technologies (AND logic)
 * const options3: ProjectQueryOptions = {
 * tags: ['React', 'TypeScript'],  // Projects must have BOTH tags
 * page: 1,
 * pageSize: 5
 * };
 *
 * @example
 * // Search for projects by title or description
 * const options4: ProjectQueryOptions = {
 * search: 'website redesign',  // Case-insensitive search
 * page: 1
 * };
 *
 * @example
 * // Combine search with tag filtering
 * const options5: ProjectQueryOptions = {
 * search: 'e-commerce',
 * tags: ['React', 'Node.js'],
 * pageSize: 20,
 * locale: 'fr'
 * };
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

  /** Locale for localizing project content (e.g., 'en', 'fr', default: 'en') */
  locale?: string;
}
