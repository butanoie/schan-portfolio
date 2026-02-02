/**
 * TypeScript types for the Projects page header data.
 * Defines the structure for the projects page intro section with name, logo, and description.
 */

import { PageDeckData } from "./pageDeck";

/**
 * Complete projects page data structure.
 */
export interface ProjectsPageData {
  /** Page title for metadata */
  pageTitle: string;

  /** Page description for metadata */
  pageDescription: string;

  /** Header/intro section content */
  pageDeck: PageDeckData;
}
