/**
 * Robots.txt Configuration
 *
 * Instructs search engine crawlers on which pages they can and cannot crawl.
 *
 * This robots.txt file:
 * - Allows all crawlers to index the entire site
 * - Points crawlers to the sitemap for efficient crawling
 * - Uses permissive rules suitable for a public portfolio site
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/robots} for Robots API
 * @see {@link https://www.robotstxt.org/} for Robots.txt Standard
 */

import { MetadataRoute } from "next";
import { SITE_URL } from "@/src/constants/seo";

/**
 * Generates the robots.txt configuration for search engine crawlers.
 *
 * Configuration:
 * - Allow all crawlers (User-agent: *)
 * - Allow crawling of all paths (Disallow: empty)
 * - Provide sitemap location for efficient indexing
 *
 * This permissive approach is suitable for a public portfolio where all content
 * should be indexed. For sites with private content, specific disallow rules
 * can be added to block sensitive paths.
 *
 * @returns Robots configuration object
 *
 * @example
 * // Generates robots.txt like:
 * // User-agent: *
 * // Allow: /
 * // Sitemap: https://portfolio.singchan.com/sitemap.xml
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
