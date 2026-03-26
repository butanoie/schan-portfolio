/**
 * Route Handler for `/llms-full.txt`
 *
 * Serves an expanded markdown document with detailed site content,
 * including the professional summary, all portfolio projects with
 * descriptions and technology tags, and writing samples with download links.
 *
 * Pre-rendered at build time via `force-static` for zero per-request computation.
 *
 * @see {@link https://llmstxt.org/} for the llms.txt specification
 * @see {@link ../../src/utils/llms-content.ts} for content assembly
 */

import { buildLlmsFullTxt } from '@/src/utils/llms-content';

export const dynamic = 'force-static';

/**
 * Handles GET requests for `/llms-full.txt`.
 *
 * Returns the expanded site overview as plain text markdown, including
 * the professional summary, all 18 portfolio projects, writing samples,
 * and contact information.
 *
 * @returns Plain text response with the llms-full.txt content
 *
 * @example
 * // GET /llms-full.txt
 * // Content-Type: text/plain; charset=utf-8
 * //
 * // # Sing Chan's Portfolio
 * // > Portfolio of Sing Chan - Technical Product Leader ...
 * // ## Portfolio Projects
 * // ### Collabware - Collabspace Export Downloader (Winter 2025)
 * // ...
 */
export function GET(): Response {
  return new Response(buildLlmsFullTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
