/**
 * TypeScript types for the Colophon/About page data.
 * Defines the structure for technologies, design philosophy, and Buta story.
 */

import { PageDeckData } from "./pageDeck";

/**
 * Individual technology entry with details.
 */
export interface Technology {
  /** Technology name */
  name: string;

  /** Brief description of how it's used */
  description: string;

  /** Optional URL to technology's website */
  url?: string;
}

/**
 * Category grouping for technologies.
 */
export interface TechnologyCategory {
  /** Category label (e.g., "Framework & Runtime", "UI & Styling") */
  label: string;

  /** Technologies in this category */
  technologies: Technology[];
}

/**
 * Technologies showcase content - V1 and V2 tech stacks.
 */
export interface TechnologiesContent {
  /** Introduction paragraph */
  intro: string;

  /** V2 (current) technology categories */
  v2Categories: TechnologyCategory[];

  /** V1 (original) technology list for historical context */
  v1Technologies: Technology[];
}

/**
 * Color swatch entry for design palette.
 */
export interface ColorSwatch {
  /** Color name (e.g., "Sakura", "Duck Egg") */
  name: string;

  /** Hex color code */
  hex: string;

  /** Description of how/where the color is used */
  description: string;
}

/**
 * Typography entry for font showcase.
 */
export interface TypographyEntry {
  /** Font family name */
  name: string;

  /** Where the font is used */
  usage: string;

  /** Sample text to display in this font */
  sample: string;

  /** CSS font-family value */
  fontFamily: string;

  /** Font weight for the sample */
  fontWeight?: number | string;

  /** Font size for the sample display (e.g., "1rem", "1.5rem") */
  sampleFontSize?: string;

  /** Optional URL to font specimen page */
  url?: string;
}

/**
 * Design philosophy content - colors and typography.
 */
export interface DesignPhilosophyContent {
  /** Introduction paragraph about design inspiration */
  intro: string;

  /** Color palette swatches */
  colors: ColorSwatch[];

  /** Color palette description */
  colorDescription: string;

  /** Typography entries */
  typography: TypographyEntry[];

  /** Typography introduction */
  typographyIntro: string;
}

/**
 * Buta story content - mascot origin and meaning.
 */
export interface ButaStoryContent {
  /** Story paragraphs (HTML allowed for links) */
  paragraphs: string[];

  /** Path to main Buta image */
  mainImage: string;

  /** Alt text for main image */
  mainImageAlt: string;

  /** Path to Boo vs Bu comparison image */
  versusImage: string;

  /** Alt text for versus image */
  versusImageAlt: string;
}

/**
 * Complete colophon page data structure.
 */
export interface ColophonData {
  /** Page title for metadata */
  pageTitle: string;

  /** Page description for metadata */
  pageDescription: string;

  /** About section content */
  pageDeck: PageDeckData;

  /** Technologies section content */
  technologies: TechnologiesContent;

  /** Design philosophy section content */
  designPhilosophy: DesignPhilosophyContent;

  /** Buta story section content */
  butaStory: ButaStoryContent;
}
