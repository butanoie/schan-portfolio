/**
 * Sitemap Generation
 *
 * Generates a dynamic XML sitemap for search engines using Next.js MetadataRoute.
 *
 * The sitemap includes all static routes with appropriate metadata:
 * - changeFrequency: How often content is expected to change
 * - priority: Relative priority of pages (1.0 = highest, 0.0 = lowest)
 * - lastModified: Date when the page was last updated
 *
 * Search engines use this to efficiently crawl and index the site.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/sitemap} for Sitemap API
 * @see {@link https://www.sitemaps.org/protocol.html} for XML Sitemap Protocol
 */

import { MetadataRoute } from "next";
import { SITE_URL } from "@/src/constants/seo";

/**
 * Generates the sitemap for the application.
 *
 * Includes all main routes:
 * - `/` (home/portfolio) - Priority 1.0, most important page, updated weekly
 * - `/resume` - Priority 0.8, moderately important, updated monthly
 * - `/colophon` - Priority 0.5, informational page, updated yearly
 *
 * Future Enhancement: When project detail pages are implemented (`/projects/[id]`),
 * they can be added here dynamically by fetching the project list.
 *
 * @returns Array of sitemap entries for all pages
 *
 * @example
 * // Generates sitemap entries like:
 * // {
 * //   url: 'https://portfolio.singchan.com/',
 * //   lastModified: '2026-02-07',
 * //   changeFrequency: 'weekly',
 * //   priority: 1.0
 * // }
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Use today's date for lastModified
  const today = new Date().toISOString().split("T")[0];

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/resume`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/colophon`,
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
