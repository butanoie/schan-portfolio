/**
 * SEO Constants
 *
 * Centralized configuration for all SEO-related values including:
 * - Site metadata (title, description, keywords)
 * - Author information
 * - Social media links
 * - Page-specific metadata
 *
 * This file serves as the single source of truth for all SEO values
 * used throughout the application to ensure consistency.
 */

/**
 * Base URL for the site - used for canonical URLs and absolute URLs in metadata
 */
export const SITE_URL = "https://portfolio.singchan.com";

/**
 * Author information used in Person schema and throughout metadata
 */
export const AUTHOR = {
  name: "Sing Chan",
  jobTitle: "Product Designer, Developer, and Accessibility Advocate",
  tagline: "Creating accessible, inclusive digital experiences",
} as const;

/**
 * Social media links for the author
 */
export const SOCIAL_LINKS = {
  github: "https://github.com/butanoie",
  linkedin: "https://linkedin.com/in/singchandesign",
} as const;

/**
 * Default site metadata used as fallback for all pages
 */
export const SITE_METADATA = {
  title: "Sing Chan - Portfolio",
  description:
    "Portfolio of Sing Chan - Product Designer, Developer, and Accessibility Advocate",
  keywords: [
    "product designer",
    "developer",
    "accessibility",
    "inclusive design",
    "web design",
    "react",
    "typescript",
    "portfolio",
  ],
};

/**
 * Page-specific metadata for each main page
 * Used in page-level metadata exports
 */
export const PAGE_METADATA = {
  home: {
    title: "Sing Chan - Product Designer & Developer",
    description:
      "Portfolio of Sing Chan - creating accessible, inclusive digital experiences with design and development",
    keywords: [
      ...SITE_METADATA.keywords,
      "portfolio",
      "projects",
      "design portfolio",
    ],
  },
  resume: {
    title: "Resume - Sing Chan",
    description:
      "Professional resume and experience of Sing Chan, Product Designer and Developer",
    keywords: [
      ...SITE_METADATA.keywords,
      "resume",
      "experience",
      "skills",
      "work experience",
    ],
  },
  colophon: {
    title: "Colophon - Sing Chan's Portfolio",
    description:
      "Technical details about how this portfolio website was built, including technologies, tools, and design decisions",
    keywords: [
      ...SITE_METADATA.keywords,
      "colophon",
      "technology",
      "tools",
      "next.js",
      "react",
      "web technologies",
    ],
  },
};

/**
 * Open Graph image metadata
 * Points to the OG preview image for social media sharing
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Sing Chan - Portfolio",
} as const;
