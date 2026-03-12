/**
 * Post-build script that strips `sourceMappingURL` references from emitted
 * JS and CSS files in the `.next/static` directory.
 *
 * Next.js 16 uses Turbopack by default, which bypasses webpack entirely.
 * Webpack plugins (including custom `processAssets` hooks) never run during
 * a Turbopack build. Meanwhile, Sentry's `filesToDeleteAfterUpload` deletes
 * the `.map` files after uploading them but leaves the `sourceMappingURL`
 * references in the output bundles, causing browsers to log 404 errors.
 *
 * This script runs after `next build` and Sentry's post-build hook to
 * strip the now-dangling references from all JS and CSS assets on disk.
 *
 * @example
 * // In package.json:
 * // "build": "next build && node scripts/strip-source-map-urls.mjs"
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Directory containing Turbopack/webpack-emitted static chunks */
const STATIC_DIR = join(import.meta.dirname, '..', '.next', 'static');

/** JS sourceMappingURL pattern: `//# sourceMappingURL=…` */
const JS_PATTERN = /\/\/# sourceMappingURL=.+$/gm;

/** CSS sourceMappingURL pattern: `/*# sourceMappingURL=… *​/` */
const CSS_PATTERN = /\/\*#\s*sourceMappingURL=[^*]*\*\//g;

/**
 * Recursively finds all `.js` and `.css` files under the given directory.
 *
 * @param dir - Absolute path to the directory to scan
 * @returns Array of absolute file paths matching `.js` or `.css`
 */
async function findAssets(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findAssets(fullPath)));
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.css')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Strips sourceMappingURL references from a single file if present.
 *
 * @param filePath - Absolute path to the JS or CSS file
 * @returns `true` if the file was modified, `false` otherwise
 */
async function stripFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  if (!content.includes('sourceMappingURL')) return false;

  const pattern = filePath.endsWith('.css') ? CSS_PATTERN : JS_PATTERN;
  pattern.lastIndex = 0;
  const stripped = content.replace(pattern, '');

  if (stripped !== content) {
    await writeFile(filePath, stripped, 'utf-8');
    return true;
  }
  return false;
}

const files = await findAssets(STATIC_DIR);
let count = 0;

await Promise.all(
  files.map(async (file) => {
    if (await stripFile(file)) count++;
  })
);

console.log(
  `[strip-source-map-urls] Stripped sourceMappingURL from ${count}/${files.length} assets`
);
