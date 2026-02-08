/**
 * SEO Schema Generators
 *
 * Utility functions for generating JSON-LD structured data (schema.org schemas).
 * These schemas help search engines understand the content and context of pages,
 * enabling rich results, better indexing, and improved SERP display.
 *
 * Schemas generated:
 * - Person: Author/creator information
 * - Organization: Site ownership and company info
 * - BreadcrumbList: Navigation hierarchy
 * - CreativeWork: Portfolio project metadata
 */

import { Person, Organization, BreadcrumbList, CreativeWork } from "schema-dts";
import { AUTHOR, SITE_URL, SOCIAL_LINKS } from "@/src/constants/seo";
import type { Project } from "@/src/types/project";

/**
 * Removes HTML tags from a string while preserving text content.
 *
 * This is necessary because project descriptions contain HTML markup
 * (paragraphs, lists, emphasis), but schema.org requires plain text values.
 *
 * @param html - HTML string to strip tags from (e.g., "<p>Hello <strong>world</strong></p>")
 * @returns Plain text with all HTML tags removed (e.g., "Hello world")
 *
 * @example
 * stripHtml("<p>Hello <strong>world</strong></p>") // Returns "Hello world"
 * stripHtml("<ul><li>Item 1</li><li>Item 2</li></ul>") // Returns "Item 1Item 2"
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Truncates text to a maximum length, adding ellipsis if truncated.
 *
 * Used for meta descriptions and schema descriptions that need to be
 * concise (typically 160 characters for meta descriptions, 200 for schemas).
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length in characters (default: 160)
 * @returns Truncated text with "..." appended if it exceeds maxLength
 *
 * @example
 * truncate("This is a long description", 10) // Returns "This is a..."
 * truncate("Short text", 50) // Returns "Short text" (no truncation needed)
 */
export function truncate(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Generates a Person schema for the author/creator.
 *
 * This schema establishes site ownership and author information for search engines,
 * supporting rich results that display author information in SERPs.
 *
 * @returns Person schema object following schema.org Person type
 *
 * @example
 * const schema = getPersonSchema();
 * // Returns:
 * // {
 * //   "@type": "Person",
 * //   "name": "Sing Chan",
 * //   "jobTitle": "Product Designer, Developer, and Accessibility Advocate",
 * //   "url": "https://portfolio.singchan.com",
 * //   "sameAs": [
 * //     "https://github.com/butanoie",
 * //     "https://linkedin.com/in/singchandesign"
 * //   ]
 * // }
 */
export function getPersonSchema(): Person {
  return {
    "@type": "Person",
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    url: SITE_URL,
    sameAs: Object.values(SOCIAL_LINKS),
  };
}

/**
 * Generates an Organization schema for the site.
 *
 * Establishes site ownership and provides organization-level metadata.
 * Used when site needs to be recognized as a business or branded entity.
 *
 * @returns Organization schema object following schema.org Organization type
 *
 * @example
 * const schema = getOrganizationSchema();
 * // Returns:
 * // {
 * //   "@type": "Organization",
 * //   "name": "Sing Chan Portfolio",
 * //   "url": "https://portfolio.singchan.com",
 * //   "founder": {
 * //     "@type": "Person",
 * //     "name": "Sing Chan"
 * //   },
 * //   "sameAs": [...]
 * // }
 */
export function getOrganizationSchema(): Organization {
  return {
    "@type": "Organization",
    name: `${AUTHOR.name} Portfolio`,
    url: SITE_URL,
    founder: {
      "@type": "Person",
      name: AUTHOR.name,
    },
    sameAs: Object.values(SOCIAL_LINKS),
  };
}

/**
 * Generates a BreadcrumbList schema for navigation hierarchy.
 *
 * Helps search engines understand site structure and creates breadcrumb
 * navigation in Google's rich results. Each breadcrumb shows the path
 * to the current page.
 *
 * @param items - Array of breadcrumb items, each with name and URL
 * - name: Display text for the breadcrumb
 * - url: Full URL for the breadcrumb (or current page URL if last item)
 * @returns BreadcrumbList schema object with all provided items
 *
 * @example
 * const breadcrumbs = getBreadcrumbSchema([
 * { name: "Home", url: "https://portfolio.singchan.com/" },
 * { name: "Resume", url: "https://portfolio.singchan.com/resume" }
 * ]);
 * // Returns breadcrumb list showing: Home > Resume
 *
 * @example
 * // For a project detail page (future)
 * const projectBreadcrumbs = getBreadcrumbSchema([
 * { name: "Home", url: "https://portfolio.singchan.com/" },
 * { name: "Projects", url: "https://portfolio.singchan.com/projects" },
 * { name: "My Amazing Project", url: "https://portfolio.singchan.com/projects/my-amazing-project" }
 * ]);
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates a CreativeWork schema for a portfolio project.
 *
 * Describes a project with metadata that helps search engines understand
 * project scope, timeline, technologies used, and visual content.
 * Supports rich cards in search results for portfolio projects.
 *
 * @param project - Project object containing id, title, desc, circa, tags, and images
 * @returns CreativeWork schema object with project metadata
 *
 * @example
 * const project: Project = {
 * id: "website-redesign",
 * title: "Website Redesign",
 * desc: "<p>Complete redesign of company website</p>",
 * circa: "Fall 2023 - Winter 2024",
 * tags: ["React", "TypeScript", "UX Design"],
 * images: [{
 * url: "/projects/website/hero.jpg",
 * tnUrl: "/projects/website/hero-thumb.jpg",
 * caption: "Hero section"
 * }],
 * videos: [],
 * altGrid: false
 * };
 *
 * const schema = getProjectSchema(project);
 * // Returns schema with:
 * // - @type: CreativeWork
 * // - name: "Website Redesign"
 * // - description: Plain text description (HTML stripped)
 * // - datePublished: Based on circa date
 * // - image: First project image URL
 * // - creator: Sing Chan (Person)
 * // - keywords: [React, TypeScript, UX Design]
 */
export function getProjectSchema(project: Project): CreativeWork {
  // Extract plain text from HTML description
  const plainDesc = stripHtml(project.desc);
  const truncatedDesc = truncate(plainDesc, 200);

  // Get the first image for the schema (used in rich results)
  const imageUrl = project.images[0]
    ? `${SITE_URL}${project.images[0].url}`
    : undefined;

  return {
    "@type": "CreativeWork",
    name: stripHtml(project.title),
    description: truncatedDesc,
    datePublished: project.circa,
    image: imageUrl,
    creator: {
      "@type": "Person",
      name: AUTHOR.name,
    },
    keywords: project.tags.join(", "),
  };
}
