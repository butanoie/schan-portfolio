# Phase 7.3 — Sentry Error Tracking

**Date:** 2026-03-10
**Time:** 15:33:36 EST
**Type:** Phase Completion
**Phase:** 7.3 (Monitoring & Analytics)
**Version:** v0.1.0

## Summary

Added production error tracking via Sentry to automatically capture bugs with stack traces and source maps. Extracted the shared `isDoNotTrackEnabled()` utility from PostHogProvider into a reusable privacy module for consistent DNT behavior across all third-party integrations. Added a post-build script to strip `sourceMappingURL` references from production bundles, preventing 404 errors caused by Sentry deleting `.map` files after upload.

---

## Changes Implemented

### 1. Shared Privacy Utility

Extracted `isDoNotTrackEnabled()` from `PostHogProvider.tsx` into `src/lib/privacy.ts` so both PostHog and Sentry share a single DNT check.

**Created:**
- `v2/src/lib/privacy.ts` — shared `isDoNotTrackEnabled()` function

**Modified:**
- `v2/src/components/PostHogProvider.tsx` — imports `isDoNotTrackEnabled` from shared module

### 2. Sentry Configuration

Three runtime-specific config files for client, server, and edge environments.

**Created:**
- `v2/instrumentation-client.ts` — browser-side init; respects DNT, production-only; traces router navigations
- `v2/sentry.server.config.ts` — Node.js server init; always active in production
- `v2/sentry.edge.config.ts` — edge runtime init; always active in production

### 3. Instrumentation Hook

**Created:**
- `v2/instrumentation.ts` — Next.js instrumentation hook for server-side Sentry loading and `onRequestError` capture

### 4. Next.js Config Integration

**Modified:**
- `v2/next.config.ts` — wrapped with `withSentryConfig` as outermost wrapper; source maps deleted after upload

### 5. Global Error Boundary

**Created:**
- `v2/app/global-error.tsx` — root-level error boundary; reports to Sentry; hardcoded English (i18n exception documented)

### 6. Environment Variables

**Modified:**
- `v2/.env.example` — added `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`

### 7. Tests

**Created:**
- `v2/src/__tests__/lib/privacy.test.ts` — 5 tests covering SSR, DNT values
- `v2/src/__tests__/app/global-error.test.tsx` — 3 tests covering rendering, Sentry reporting, reset

### 8. Source Map 404 Fix

Next.js 16 defaults to Turbopack, which bypasses webpack entirely. Sentry's `filesToDeleteAfterUpload` deletes `.map` files after upload but leaves the `sourceMappingURL` references in JS and CSS bundles. Browsers then attempt to fetch the deleted maps, logging 404 errors in the console.

A post-build script strips these dangling references from all emitted JS and CSS files.

**Created:**
- `v2/scripts/strip-source-map-urls.mjs` — post-build script that strips `sourceMappingURL` from `.next/static/` assets

**Modified:**
- `v2/package.json` — build command updated to `next build && node scripts/strip-source-map-urls.mjs`
- `v2/next.config.ts` — expanded `filesToDeleteAfterUpload` to also cover `.next/server/**/*.map`

### 9. Documentation

**Created:**
- `docs/setup/SENTRY_SETUP.md` — setup guide, architecture, privacy notes, troubleshooting

---

## Technical Details

### Config Composition

```ts
export default withSentryConfig(analyzer(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: {
    name: process.env.SENTRY_RELEASE,
    create: true,
    finalize: true,
  },
  widenClientFileUpload: true,
  silent: !process.env.CI,
  sourcemaps: {
    filesToDeleteAfterUpload: [
      ".next/static/**/*.map",
      ".next/server/**/*.map",
    ],
  },
});
```

> **Note:** `SENTRY_RELEASE` is set by GitHub Actions deploy workflows to the git commit SHA.
> Railway's `railway up` strips `.git`, so the SHA must be provided externally.

### Post-Build Source Map Cleanup

Next.js 16 uses Turbopack by default, which bypasses webpack entirely. The `webpack()` config callback in `next.config.ts` is silently ignored. Sentry's `filesToDeleteAfterUpload` deletes `.map` files but leaves `sourceMappingURL` references in the output bundles. A post-build script handles the cleanup:

```json
"build": "next build && node scripts/strip-source-map-urls.mjs"
```

The script recursively scans `.next/static/` for `.js` and `.css` files and strips:
- JS: `//# sourceMappingURL=…`
- CSS: `/*# sourceMappingURL=… */`

### Sample Rates

| Metric | Rate | Rationale |
|--------|------|-----------|
| Error capture | 100% | Low-traffic portfolio; every error matters |
| Performance tracing | 10% | Reduces overhead while providing useful data |
| Session replay | 0% | Not needed for portfolio site |

### Privacy Behavior

| Context | DNT Behavior |
|---------|--------------|
| Client (browser) | Respects DNT — skips Sentry init |
| Server (Node.js) | Ignores DNT — no `navigator` available; server errors always captured |
| Edge | Ignores DNT — same as server |

---

## Validation & Testing

- ✅ All 1198 tests pass (65 test files)
- ✅ TypeScript type check passes (`npm run typecheck`)
- ✅ ESLint passes (`npm run lint`)
- ✅ PostHogProvider tests still pass after privacy util extraction
- ✅ 8 new tests added (5 privacy + 3 global-error)

---

## Impact Assessment

- **Error visibility:** Production bugs are now captured automatically with full stack traces and source maps, eliminating reliance on user reports
- **Privacy consistency:** The shared `privacy.ts` module ensures PostHog and Sentry (and future integrations) apply identical Do Not Track behavior, reducing the risk of privacy drift between services
- **Build pipeline:** `withSentryConfig` adds a post-build step for source map upload on Railway; local builds are unaffected (upload silently skips without `SENTRY_AUTH_TOKEN`)
- **Bundle size:** `@sentry/nextjs` adds to the client bundle; should be verified with `npm run analyze` to stay under the 40KB gzipped target
- **Developer workflow:** No changes to local development — Sentry is production-only and requires no local setup

---

## Related Files

**Created (10):**
- `v2/src/lib/privacy.ts`
- `v2/instrumentation-client.ts`
- `v2/sentry.server.config.ts`
- `v2/sentry.edge.config.ts`
- `v2/instrumentation.ts`
- `v2/app/global-error.tsx`
- `v2/src/__tests__/lib/privacy.test.ts`
- `v2/src/__tests__/app/global-error.test.tsx`
- `v2/scripts/strip-source-map-urls.mjs`
- `docs/setup/SENTRY_SETUP.md`

**Modified (4):**
- `v2/src/components/PostHogProvider.tsx`
- `v2/next.config.ts`
- `v2/package.json`
- `v2/.env.example`

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Files created | 10 |
| Files modified | 4 |
| New tests | 8 |
| Total tests | 1198 |
| New npm packages | 1 (`@sentry/nextjs`) |

---

## Status

✅ COMPLETE
