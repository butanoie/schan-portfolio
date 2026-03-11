# Sentry Error Tracking Setup

## Overview

Sentry provides automatic error tracking with stack traces and source maps for the portfolio site. When an unhandled error occurs in production, Sentry captures the error, resolves the stack trace using uploaded source maps, and sends an alert.

**Added in:** Phase 7.3

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
| `SENTRY_AUTH_TOKEN` | Build-time only | Auth token for uploading source maps during `next build` |
| `SENTRY_ORG` | Build-time only | Your Sentry organization slug |
| `SENTRY_PROJECT` | Build-time only | Your Sentry project slug |

### Getting Your Auth Token

1. Go to [sentry.io/settings/auth-tokens/](https://sentry.io/settings/auth-tokens/)
2. Create a new token with scopes: `project:releases`, `org:read`
3. Add it as `SENTRY_AUTH_TOKEN` in your deployment environment

## Architecture

### Config Files

| File | Runtime | Purpose |
|------|---------|---------|
| `instrumentation-client.ts` | Browser | Client-side error tracking; respects DNT; traces router navigations |
| `sentry.server.config.ts` | Node.js | Server-side error tracking; always active |
| `sentry.edge.config.ts` | Edge | Edge runtime error tracking; always active |
| `instrumentation.ts` | Server startup | Loads the correct config based on `NEXT_RUNTIME` |

### Next.js Config Integration

`withSentryConfig` wraps the Next.js config as the outermost wrapper in `next.config.ts`. This ensures Sentry's webpack plugin runs last and can process the final source maps.

```
withSentryConfig(analyzer(nextConfig), sentryOptions)
```

### Source Map Flow

1. During `next build` (on Railway), Sentry's webpack plugin generates source maps
2. If `SENTRY_AUTH_TOKEN` is set, source maps are uploaded to Sentry
3. `.map` files are deleted from the build output (`filesToDeleteAfterUpload`)
4. In production, Sentry resolves stack traces using the uploaded maps
5. Without the auth token, the build still succeeds — source map upload is silently skipped

### Error Boundary

`app/global-error.tsx` catches errors in the root layout itself — errors that no other `error.tsx` can catch. It:
- Reports the error to Sentry via `captureException`
- Renders a minimal recovery page with a "Try again" button
- Uses hardcoded English (LocaleProvider is unavailable at this level)

## Privacy

| Behavior | Setting |
|----------|---------|
| Do Not Track (client) | Respected — Sentry skips initialization if DNT is enabled |
| Do Not Track (server) | Ignored — server errors are always captured (no `navigator` available) |
| PII collection | Disabled (`sendDefaultPii: false`) |
| Session replay | Disabled (`replaysSessionSampleRate: 0`) |
| Error sample rate | 100% — every error is captured |
| Performance sample rate | 10% — sampled to reduce overhead |

## Troubleshooting

### Build succeeds but no source maps in Sentry

- Verify `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` are set in your build environment
- Check Railway build logs for Sentry upload output (set `CI=true` to enable verbose logging)

### Errors not appearing in Sentry

- Verify `NEXT_PUBLIC_SENTRY_DSN` is set in production
- Check browser console for Sentry initialization errors
- Confirm the user doesn't have Do Not Track enabled (client-side only)
- Check that `NODE_ENV` is `"production"` in your deployment

### Local development

Sentry does not initialize in development (`NODE_ENV !== "production"`). To test Sentry locally:
1. Set `NEXT_PUBLIC_SENTRY_DSN` in `.env.local`
2. Run `NODE_ENV=production npm run build && npm start`

## Related Documentation

- [PostHog Setup](./POSTHOG_SETUP.md) — Analytics (Phase 7.1)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
