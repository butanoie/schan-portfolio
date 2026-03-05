/**
 * Type definitions for the Writing Samples page.
 *
 * Defines the data structures used to render artifact sections,
 * individual artifact items, and their available download formats.
 *
 * @module types/samples
 */

/**
 * A downloadable format for an artifact document.
 *
 * Each artifact can have multiple formats (e.g., PDF and Markdown).
 */
export interface ArtifactFormat {
  /** Display label for the format (e.g., "PDF", "Markdown") */
  label: string;
  /** URL path to the downloadable file */
  href: string;
}

/**
 * A single artifact item within a section.
 *
 * Represents one document or writing sample with its metadata
 * and available download formats.
 */
export interface ArtifactItem {
  /** Translation key for the artifact title */
  titleKey: string;
  /** Translation key for the artifact description */
  descriptionKey: string;
  /** Available download formats for this artifact */
  formats: ArtifactFormat[];
  /** Whether the artifact document is available for download */
  available: boolean;
}

/**
 * A themed section grouping related artifacts.
 *
 * Each section has a heading, introductory paragraph, and a list
 * of artifact items that belong to that category.
 */
export interface ArtifactSection {
  /** Translation key for the section heading */
  headingKey: string;
  /** Translation key for the section introduction paragraph */
  introKey: string;
  /** Artifact items belonging to this section */
  items: ArtifactItem[];
}
