/**
 * Page deck intro section content - reusable for multiple pages.
 * Displays a header image with heading and introductory paragraphs.
 */
export interface PageDeckData {
  /** Path to the deck header image (relative to public directory) */
  imageUrl: string;

  /** Alt text for the header image */
  imageAlt: string;

  /** HTML ID for the heading (for accessibility/linking) */
  headingId: string;

  /** The page section heading text */
  heading: string;

  /** V1-style deck paragraphs for the intro section */
  deck: string[];
}