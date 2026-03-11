# Sentry Error Tracking Setup

## Overview

Sentry provides automatic error tracking with stack traces and source maps for the portfolio site. When an unhandled error occurs in production, Sentry captures the error, resolves the stack trace using uploaded source maps, and sends an alert.

**Added in:** Phase 7.3
**Package:** `@sentry/nextjs` ^10.43.0

## Quick Start

1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new Next.js project
3. Copy the DSN from **Settings → Projects → [your project] → Client Keys (DSN)**
4. Set environment variables (see below)

## Environment Variables

Add these to your deployment platform (Railway) and optionally to `.env.local` for local testing:

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | Client + Server | Public DSN for sending errors to Sentry |
| `SENTRY_AUTH_TOKEN` | Build-time only | Auth token for uploading source maps and creating releases |
| `SENTRY_ORG` | Build-time only | Your Sentry organization slug |
| `SENTRY_PROJECT` | Build-time only | Your Sentry project slug |
| `SENTRY_RELEASE` | Build-time + Runtime | Git commit SHA used to tag releases; set by GitHub Actions deploy workflows |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Client + Server | Optional override for the Sentry environment tag (defaults to `NODE_ENV`) |

### Getting Your Auth Token

1. Go to [sentry.io/settings/auth-tokens/](https://sentry.io/settings/auth-tokens/)
2. Create a new token with scopes: `project:releases`, `org:read`
3. Add it as `SENTRY_AUTH_TOKEN` in your deployment environment (Railway)

> **Note:** The auth token is only needed where `next build` runs (Railway). It is not needed for local development.

## Architecture

### Config Files

| File | Runtime | Purpose |
|------|---------|---------|
| `instrumentation-client.ts` | Browser | Client-side error tracking; respects DNT; traces router navigations |
| `sentry.server.config.ts` | Node.js | Server-side error tracking; always active |
| `sentry.edge.config.ts` | Edge | Edge runtime error tracking; always active |
| `instrumentation.ts` | Server startup | Loads the correct config based on `NEXT_RUNTIME`; captures unhandled request errors |

### Next.js Config Integration

`withSentryConfig` wraps the Next.js config as the outermost wrapper in `next.config.ts`. This ensures Sentry's webpack plugin runs last and can process the final source maps.

```
withSentryConfig(analyzer(nextConfig), sentryOptions)
```

Key options:
- **`release.name`**: Set from `SENTRY_RELEASE` (git SHA), correlating errors to specific commits
- **`release.create` / `release.finalize`**: Automatically manages the release lifecycle in Sentry
- **`widenClientFileUpload`**: Uploads a larger set of source maps for better stack traces
- **`silent`**: Only logs Sentry build output in CI (`!process.env.CI`)
- **`sourcemaps.filesToDeleteAfterUpload`**: Removes `.map` files from the build after Sentry upload
- **Post-build script**: `scripts/strip-source-map-urls.mjs` strips `sourceMappingURL` references from JS/CSS (required because Turbopack bypasses webpack plugins)

### Release Tagging via GitHub Actions

Railway's `railway up` command strips the `.git` directory from the build context, so the Sentry webpack plugin cannot read the git SHA at build time. To work around this, the GitHub Actions deploy workflows (`deploy-production.yml` and `deploy-dev.yml`) set the `SENTRY_RELEASE` environment variable on the Railway service **before** deploying:

```bash
railway variable set SENTRY_RELEASE=$DEPLOY_SHA \
  --service=<service> --environment=production --skip-deploys
```

This ensures:
- Source maps are tagged with the correct commit SHA during `next build`
- Runtime errors are associated with the same release
- Sentry can correlate errors to specific commits in the dashboard

### Source Map Flow

1. GitHub Actions sets `SENTRY_RELEASE` on the Railway service (commit SHA)
2. During `next build` (on Railway), Turbopack generates source maps
3. Sentry's `runAfterProductionCompile` hook uploads the maps (if `SENTRY_AUTH_TOKEN` is set)
4. `filesToDeleteAfterUpload` deletes `.map` files from the build output
5. The post-build script (`scripts/strip-source-map-urls.mjs`) strips dangling `sourceMappingURL` references from JS and CSS files to prevent browser 404 errors
6. In production, Sentry resolves stack traces using the uploaded maps
7. Without the auth token, the build still succeeds — source map upload is silently skipped

> **Why the post-build script?** Next.js 16 defaults to Turbopack, which bypasses webpack entirely. Sentry's `filesToDeleteAfterUpload` deletes the `.map` files but leaves the `//# sourceMappingURL=` (JS) and `/*# sourceMappingURL= */` (CSS) references in the output bundles. Browsers then attempt to fetch the deleted maps and log 404 errors. The post-build script strips these dangling references after both Turbopack and Sentry have finished.

### Error Boundary

`app/global-error.tsx` catches errors in the root layout itself — errors that no other `error.tsx` can catch. It:
- Reports the error to Sentry via `captureException`
- Renders a minimal recovery page with a "Try again" button
- Uses hardcoded English (LocaleProvider is unavailable at this level)

### Custom Error Hierarchy

`src/utils/errors.ts` provides a typed error hierarchy for categorized error handling:

| Class | Category | Code Prefix | Use Case |
|-------|----------|-------------|----------|
| `AppError` | generic | `APP_` | Base class for all custom errors |
| `ValidationError` | validation | `VAL_` | User input / data format failures |
| `SecurityError` | security | `SEC_` | XSS, injection, protocol violations |
| `DataError` | data | `DATA_` | Fetch, parse, database failures |
| `NetworkError` | network | `NET_` | HTTP request failures (includes `statusCode`) |

Helper functions:
- `getUserFriendlyMessage(error)` — converts error categories to user-facing messages
- `isAppError(error)` — type guard for `instanceof` checks

These custom errors provide better context when captured by Sentry, including error codes and categories.

## Privacy

The shared `src/lib/privacy.ts` module provides `isDoNotTrackEnabled()` used by both Sentry and PostHog for consistent DNT behavior.

| Behavior | Setting |
|----------|---------|
| Do Not Track (client) | Respected — Sentry skips initialization if DNT is enabled |
| Do Not Track (server/edge) | Ignored — server errors are always captured (no `navigator` available) |
| PII collection | Disabled (`sendDefaultPii: false`) |
| Session replay | Disabled (`replaysSessionSampleRate: 0`) |
| Error sample rate | 100% — every error is captured |
| Performance sample rate | 10% — sampled to reduce overhead |

## Troubleshooting

### Build succeeds but no source maps in Sentry

- Verify `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` are set in Railway's build environment
- Check Railway build logs for Sentry upload output (set `CI=true` to enable verbose logging)
- Ensure `SENTRY_RELEASE` is set — without it, source maps may not be associated with the correct release

### Errors not appearing in Sentry

- Verify `NEXT_PUBLIC_SENTRY_DSN` is set in production
- Check browser console for Sentry initialization errors
- Confirm the user doesn't have Do Not Track enabled (client-side only)
- Check that `NODE_ENV` is `"production"` in your deployment

### Release not showing in Sentry dashboard

- Verify GitHub Actions deploy workflow ran successfully
- Check that `SENTRY_RELEASE` was set on the Railway service before the build started
- Confirm `release.create` is `true` in the `withSentryConfig` options

### Source map 404 errors in browser console

If you see errors like `Failed to load resource: 404 (xxxxx.js.map)` or `(xxxxx.css.map)` in production:

1. Verify the build command includes the post-build script: `next build && node scripts/strip-source-map-urls.mjs`
2. Check that `scripts/strip-source-map-urls.mjs` exists and is executable
3. Run `npm run build` locally and verify the output shows `Stripped sourceMappingURL from N/M assets`
4. After deploying, hard-refresh the page (Cmd+Shift+R) to clear cached assets

### Local development

Sentry does not initialize in development (`NODE_ENV !== "production"`). To test Sentry locally:
1. Set `NEXT_PUBLIC_SENTRY_DSN` in `.env.local`
2. Run `NODE_ENV=production npm run build && npm start`

## Related Documentation

- [PostHog Setup](./POSTHOG_SETUP.md) — Analytics (Phase 7.1)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Custom Error Hierarchy](../../v2/src/utils/errors.ts) — Application error classes
