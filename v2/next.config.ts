import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

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

  // Auto-detect release from git SHA; create and finalize in Sentry
  // This replaces the need for manual `sentry-cli releases` commands
  release: {
    create: true,
    finalize: true,
    setCommits: { auto: true },
  },

    // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Only log Sentry build output in CI to keep local dev output clean
  silent: !process.env.CI,

  // Delete .map files after upload so they're not served to browsers
  sourcemaps: {
    filesToDeleteAfterUpload: [".next/static/**/*.map"],
  },
});
