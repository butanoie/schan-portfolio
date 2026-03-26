/**
 * Route Handler for `/llms.txt`
 *
 * Serves a concise markdown document following the llms.txt specification,
 * helping LLMs understand the site's purpose, structure, and content.
 *
 * Pre-rendered at build time via `force-static` for zero per-request computation.
 *
 * @see {@link https://llmstxt.org/} for the llms.txt specification
 * @see {@link ../../src/utils/llms-content.ts} for content assembly
 */

import { buildLlmsTxt } from '@/src/utils/llms-content';

export const dynamic = 'force-static';

/**
 * Handles GET requests for `/llms.txt`.
 *
 * Returns the concise site overview as plain text markdown, including
 * the site name, description, page links, and contact information.
 *
 * @returns Plain text response with the llms.txt content
 *
 * @example
 * // GET /llms.txt
 * // Content-Type: text/plain; charset=utf-8
 * //
 * // # Sing Chan's Portfolio
 * // > Portfolio of Sing Chan - Technical Product Leader ...
 */
export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
