import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

/** CSS sourceMappingURL pattern: `/*# sourceMappingURL=… *​/` */
const CSS_SOURCE_MAP_PATTERN = /\/\*#\s*sourceMappingURL=[^*]*\*\//g;

/** JS sourceMappingURL pattern: `//# sourceMappingURL=…` */
const JS_SOURCE_MAP_PATTERN = /\/\/# sourceMappingURL=.+$/gm;

/**
 * Webpack plugin that strips `sourceMappingURL` references from emitted
 * JS and CSS assets.
 *
 * Sentry's `filesToDeleteAfterUpload` removes `.map` files after uploading
 * them but leaves the `sourceMappingURL` references in the output bundles.
 * Browsers then attempt to fetch the deleted maps and log 404 errors.
 *
 * JS: Sentry sets `devtool: 'hidden-source-map'` which should omit
 * `//# sourceMappingURL` comments, but other plugins (e.g. Sentry's own
 * webpack plugin) can re-add them.
 *
 * CSS: Next.js's CSS minimizer returns `SourceMapSource` objects that
 * cause webpack to append `/*#​ sourceMappingURL *​/` regardless of the
 * PostCSS `annotation: false` setting.
 *
 * Runs at `PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER` — after source maps
 * have been generated for Sentry upload but before final emission.
 */
const stripSourceMapUrls: { apply: (c: import("webpack").Compiler) => void } =
  {
    /**
     * Registers the `processAssets` hook on the given webpack compiler.
     *
     * @param compiler - The webpack compiler instance provided by Next.js
     */
    apply(compiler) {
      compiler.hooks.compilation.tap(
        "StripSourceMapUrls",
        (compilation: import("webpack").Compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: "StripSourceMapUrls",
              stage:
                compiler.webpack.Compilation
                  .PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER,
            },
            () => {
              for (const { name, source } of compilation.getAssets()) {
                let pattern: RegExp | undefined;
                if (name.endsWith(".css")) {
                  pattern = CSS_SOURCE_MAP_PATTERN;
                } else if (name.endsWith(".js")) {
                  pattern = JS_SOURCE_MAP_PATTERN;
                }
                if (!pattern) continue;

                const src = source.source().toString();
                if (!src.includes("sourceMappingURL")) continue;

                pattern.lastIndex = 0;
                const stripped = src.replace(pattern, "");
                if (stripped !== src) {
                  compilation.updateAsset(
                    name,
                    new compiler.webpack.sources.RawSource(stripped),
                  );
                }
              }
            },
          );
        },
      );
    },
  };

const nextConfig: NextConfig = {
  /**
   * Adds the {@link stripSourceMapUrls} plugin to client builds so that
   * browsers don't attempt to load source maps deleted by Sentry.
   *
   * @param config - The webpack configuration object provided by Next.js
   * @param root0 - Next.js webpack context options
   * @param root0.isServer - Whether this build is for the server bundle
   * @returns The modified webpack configuration
   */
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(stripSourceMapUrls);
    }
    return config;
  },
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
  // can correlate them. SENTRY_RELEASE is set by the GitHub Actions
  // deploy workflows (Railway's `railway up` strips .git and doesn't
  // expose RAILWAY_GIT_COMMIT_SHA like GitHub-triggered deploys do).
  release: {
    name: process.env.SENTRY_RELEASE,
    create: true,
    finalize: true,
    // setCommits requires a .git directory which Railway's `railway up` strips.
    // Commit association can be done via GitHub integration or sentry-cli in CI.
  },

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Only log Sentry build output in CI to keep local dev output clean
  silent: !process.env.CI,

  sourcemaps: {
    // Delete .map files after Sentry upload so they're not served to browsers.
    // Both static (client) and server maps are removed to prevent 404 errors.
    filesToDeleteAfterUpload: [
      ".next/static/**/*.map",
      ".next/server/**/*.map",
    ],
  },

});
