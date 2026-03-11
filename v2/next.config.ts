import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Resolves the current git commit SHA for Sentry release tagging.
 *
 * Railway's Nixpacks build container does not include the `git` binary
 * or expose `RAILWAY_GIT_COMMIT_SHA`. This helper reads the SHA directly
 * from the `.git` directory using the filesystem:
 *
 * 1. Reads `.git/HEAD` to get the current ref (e.g., `ref: refs/heads/main`)
 * 2. If HEAD is a symbolic ref, reads the SHA from the referenced file
 * 3. If HEAD is a detached SHA (common in CI), uses it directly
 *
 * Falls back to `undefined` if `.git` is not present (e.g., Docker builds
 * without repo context). The build still succeeds — Sentry just won't
 * create a named release.
 *
 * @returns The full 40-character git SHA, or undefined
 */
function getGitSha(): string | undefined {
  try {
    // Walk up from v2/ to the repo root where .git lives
    const gitDir = resolve(__dirname, "..", ".git");
    const head = readFileSync(resolve(gitDir, "HEAD"), "utf-8").trim();

    // Detached HEAD — already a SHA
    if (!head.startsWith("ref:")) {
      return head;
    }

    // Symbolic ref — read the SHA from refs/
    const ref = head.replace("ref: ", "");
    return readFileSync(resolve(gitDir, ref), "utf-8").trim();
  } catch {
    return undefined;
  }
}

const nextConfig: NextConfig = {
  /**
   * Proxies PostHog ingestion and asset requests through the app's own domain.
   *
   * Safari's Intelligent Tracking Prevention (ITP) blocks cross-origin fetch
   * requests to known analytics domains like `us.i.posthog.com`. By rewriting
   * `/ingest/*` to PostHog's servers, the browser treats these as same-origin
   * requests, avoiding CORS and ITP blocks. This also bypasses most ad blockers.
   *
   * @returns Array of rewrite rules for PostHog ingestion and static assets
   */
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  images: {
    // Allow Next.js to optimize all local images
    // No external image domains needed for v2 (all images are local)

    // Image formats to support (Next.js will automatically convert to WebP/AVIF)
    formats: ["image/avif", "image/webp"],

    // Device sizes for responsive images (aligned with Material-UI breakpoints)
    // xs: 640, sm: 768, md: 900, lg: 1024, xl: 1200, 2xl: 1536, 3xl: 1920, 4xl: 2560
    deviceSizes: [640, 768, 900, 1024, 1200, 1536, 1920, 2560],

    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache TTL for optimized images (1 year)
    minimumCacheTTL: 31536000,

    // Enable image optimization even for static export (if applicable)
    unoptimized: false,
  },
};

/**
 * Wraps the Next.js config with bundle analyzer support.
 * Run `npm run analyze` (sets ANALYZE=true) to generate interactive
 * treemap visualizations of client and server bundle composition.
 */
const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Wraps the config with Sentry for automatic source map upload and
 * error tracking instrumentation. Sentry must be the outermost wrapper
 * so its webpack plugin runs last and can process the final source maps.
 *
 * Source maps are uploaded during `next build` (on Railway) when
 * `SENTRY_AUTH_TOKEN` is set. Local builds without the token still
 * succeed — Sentry silently skips the upload.
 */
export default withSentryConfig(analyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Route Sentry requests through your server (avoids ad-blockers)
  //tunnelRoute: "/monitoring",

  // Tag source maps and runtime errors with the git SHA so Sentry
  // can correlate them. Uses our explicit getGitSha() because Railway
  // does not expose RAILWAY_GIT_COMMIT_SHA for Sentry's auto-detection.
  release: {
    name: (() => {
      const sha = getGitSha();
      console.log(`[Sentry] Release: ${sha ?? "undefined (no .git found)"}`);
      return sha;
    })(),
    create: true,
    finalize: true,
    setCommits: { auto: true },
  },

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // TODO: revert to `silent: !process.env.CI` after confirming release works
  silent: false,

  // Delete .map files after upload so they're not served to browsers
  sourcemaps: {
    filesToDeleteAfterUpload: [".next/static/**/*.map"],
  },
});
