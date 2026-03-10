# Phase 7: Monitoring & Analytics — Detailed Implementation Plan

**Document Version:** 1.0
**Created:** 2026-03-06
**Author:** Sing Chan (with Claude Code)
**Status:** In Progress
**Target Branch:** `sc/phase7-monitoring`

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prerequisites & Current State](#prerequisites--current-state)
3. [Implementation Overview](#implementation-overview)
4. [Task 7.1: Web Analytics (PostHog)](#task-71-web-analytics-posthog)
5. [Task 7.2: Core Web Vitals Reporting](#task-72-core-web-vitals-reporting)
6. [Task 7.3: Error Tracking (Sentry)](#task-73-error-tracking-sentry)
7. [Task 7.4: Uptime Monitoring](#task-74-uptime-monitoring)
8. [Task 7.5: Dependency Management (Dependabot)](#task-75-dependency-management-dependabot)
9. [Task 7.6: Content & Maintenance Workflow](#task-76-content--maintenance-workflow)
10. [Testing Strategy](#testing-strategy)
11. [Dependencies](#dependencies)
12. [Success Criteria](#success-criteria)
13. [Risk Mitigation](#risk-mitigation)
14. [Implementation Order](#implementation-order)

---

## Executive Summary

Phase 7 transitions the project from active development to ongoing operations. The site is deployed on Railway with CI/CD via GitHub Actions (Phase 6 complete). This phase adds observability, analytics, and maintenance processes to ensure the portfolio remains healthy, performant, and up-to-date over time.

Unlike Phases 1–6, Phase 7 is ongoing — tasks represent capabilities to set up once and operate continuously.

### Goals

- Instrument the site with privacy-friendly web analytics (PostHog)
- Report real-user Core Web Vitals to track performance regressions
- Set up error tracking to catch and diagnose production issues
- Monitor uptime and receive alerts for outages
- Automate dependency update tracking with Dependabot
- Document the content update workflow for adding projects and resume updates

### Scope

| Area | Description |
|------|-------------|
| Analytics | PostHog integration for pageviews, events, and user behavior |
| Web Vitals | Real-user CWV reporting via `web-vitals` library + PostHog events |
| Error Tracking | Sentry free tier for error capture and source map support |
| Uptime | UptimeRobot free tier for availability monitoring and alerting |
| Dependencies | Dependabot configuration for automated security and version updates |
| Content | Documented workflow for adding projects, updating resume |
| Cost | All tools on free tiers — zero ongoing cost |

### Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Analytics platform | PostHog (free tier) | 1M events/month free, PostHog MCP already configured in project, privacy-friendly, no cookie banner required |
| Error tracking | Sentry (free tier) | 5K errors/month free, first-class Next.js SDK, source maps, performance traces |
| Uptime monitoring | UptimeRobot (free tier) | 50 monitors, 5-minute intervals, email/webhook alerts, zero config overhead |
| Dependency updates | Dependabot | Built into GitHub, zero cost, auto-creates PRs for outdated/vulnerable deps |
| CWV reporting | web-vitals + PostHog | No additional service needed, reports LCP/FID/CLS/INP/TTFB as custom events |
| Hosting (context) | Railway | Vercel skipped due to cost; Railway already configured in Phase 6 |

---

## Prerequisites & Current State

### Completed (Phase 6)

- Railway hosting configured (development + production environments)
- CI/CD via GitHub Actions (`test-deploy-dev.yml`, `deploy-production.yml`)
- Manual deployment approval gates for both environments
- SSL and domain configuration
- Deployment documentation (`docs/setup/RAILWAY_DEPLOYMENT.md`)

### Current Metrics (Phase 5 Complete)

- Lighthouse Desktop: 97–100
- Lighthouse Mobile: 90–92
- SEO Score: 100
- Tests: 1,123 passing across 57 files
- Coverage: 87%+
- WCAG 2.2 Level AA: 0 violations
- TypeScript: 0 errors
- ESLint: 0 errors

---

## Implementation Overview

```
Phase 7 Tasks
├── Task 7.1: Web Analytics (PostHog)         — Analytics SDK integration
├── Task 7.2: Core Web Vitals Reporting        — Real-user performance data
├── Task 7.3: Error Tracking (Sentry)          — Production error capture
├── Task 7.4: Uptime Monitoring                — Availability alerting
├── Task 7.5: Dependency Management            — Dependabot configuration
└── Task 7.6: Content & Maintenance Workflow   — Operational documentation
```

---

## Task 7.1: Web Analytics (PostHog)

**Goal:** Instrument the site with privacy-friendly analytics to track pageviews, user behavior, and engagement patterns.

**Why PostHog:** The project already has a PostHog MCP server configured for Claude Code. PostHog's free tier provides 1M events/month, session replay (limited), feature flags, and funnels — far more than a simple analytics tool. It's also privacy-friendly (no cookie banner required when configured for cookieless mode).

### Implementation Steps

1. **Create PostHog account and project** (if not already done)
   - Sign up at [posthog.com](https://posthog.com)
   - Create a project for portfolio.singchan.com
   - Note the project API key (public, safe to include in client code)

2. **Install PostHog React SDK**
   ```bash
   cd v2
   npm install posthog-js
   ```

3. **Create PostHog provider component**
   - File: `v2/src/components/PostHogProvider.tsx`
   - Initialize PostHog with cookieless mode (privacy-first)
   - Wrap in `"use client"` directive (requires browser APIs)
   - Configure to respect `Do Not Track` browser setting

4. **Integrate into app layout**
   - File: `v2/app/layout.tsx`
   - Add PostHogProvider as a wrapper around the app
   - Ensure it only initializes in production (skip in dev/test)

5. **Add environment variable**
   - `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project API key
   - `NEXT_PUBLIC_POSTHOG_HOST` — PostHog instance URL
   - Add to `.env.example` and Railway environment variables

6. **Track page views automatically**
   - PostHog auto-captures pageviews with the React SDK
   - Configure `capture_pageview: true` in initialization

7. **Add custom events (optional, future)**
   - Project card clicks
   - Tag filter usage
   - Theme/language switches
   - Resume download clicks

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `v2/src/components/PostHogProvider.tsx` | Create | PostHog React provider with cookieless config |
| `v2/app/layout.tsx` | Modify | Add PostHogProvider wrapper |
| `v2/.env.example` | Modify | Add PostHog environment variables |

### Acceptance Criteria

- [x] PostHog SDK installed and initialized
- [x] Pageviews tracked automatically on navigation
- [x] Cookieless mode enabled (no cookie banner needed)
- [x] `Do Not Track` browser setting respected
- [x] SDK only initializes in production environment
- [x] Environment variables documented

---

## Task 7.2: Core Web Vitals Reporting

**Goal:** Report real-user Core Web Vitals (LCP, FID, CLS, INP, TTFB) to PostHog so performance can be monitored over time from actual user sessions.

**Why:** Lighthouse gives lab data (synthetic). Real-user monitoring (RUM) captures actual field performance, which varies by device, network, and geography. Regressions may not show in Lighthouse but will appear in RUM data.

### Implementation Steps

1. **Install web-vitals library**
   ```bash
   cd v2
   npm install web-vitals
   ```

2. **Create Web Vitals reporter**
   - File: `v2/src/lib/webVitals.ts`
   - Use `web-vitals` library to capture LCP, FID, CLS, INP, TTFB
   - Send each metric as a PostHog custom event (`$web_vitals`)
   - Include metric name, value, rating (good/needs-improvement/poor), and page path

3. **Initialize in app layout**
   - Call the reporter from `PostHogProvider` or a separate `useEffect`
   - Runs once per page load

4. **Create PostHog dashboard (optional)**
   - Use PostHog MCP to create a "Core Web Vitals" dashboard
   - Track p75 values for each metric over time
   - Set up alerts if metrics degrade

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `v2/src/lib/webVitals.ts` | Create | Web Vitals capture and reporting utility |
| `v2/src/components/PostHogProvider.tsx` | Modify | Initialize web vitals reporting |

### Acceptance Criteria

- [ ] `web-vitals` library installed
- [ ] LCP, FID, CLS, INP, TTFB captured from real users
- [ ] Metrics sent to PostHog as custom events
- [ ] Metric rating (good/needs-improvement/poor) included
- [ ] Page path included for per-page analysis

---

## Task 7.3: Error Tracking (Sentry)

**Goal:** Capture and diagnose production errors with stack traces, source maps, and contextual data.

**Why:** Without error tracking, bugs in production go unnoticed until a user reports them (if they ever do). Sentry provides automatic error capture, source map deobfuscation, and performance traces.

### Implementation Steps

1. **Create Sentry account and project**
   - Sign up at [sentry.io](https://sentry.io)
   - Create a Next.js project
   - Note the DSN (Data Source Name)

2. **Install Sentry Next.js SDK**
   ```bash
   cd v2
   npx @sentry/wizard@latest -i nextjs
   ```
   This auto-creates:
   - `sentry.client.config.ts`
   - `sentry.server.config.ts`
   - `sentry.edge.config.ts`
   - Updates `next.config.ts` with Sentry webpack plugin

3. **Configure Sentry**
   - Set DSN via environment variable: `SENTRY_DSN`
   - Enable source maps upload (build-time)
   - Configure sampling rate (100% for errors, 10–20% for performance traces)
   - Set environment tag (`development` / `production`)

4. **Add environment variables**
   - `SENTRY_DSN` — Sentry project DSN
   - `SENTRY_AUTH_TOKEN` — For source map uploads (build-time secret, NOT public)
   - `SENTRY_ORG` — Sentry organization slug
   - `SENTRY_PROJECT` — Sentry project slug
   - Add `SENTRY_DSN` to Railway environment variables
   - Add `SENTRY_AUTH_TOKEN` to GitHub Actions secrets (for build-time source map upload)

5. **Add error boundary (optional)**
   - Wrap critical components with Sentry error boundaries
   - Show user-friendly fallback UI on unhandled errors

6. **Test error capture**
   - Add a temporary test button that throws an error
   - Verify it appears in Sentry dashboard
   - Verify source maps resolve correctly
   - Remove test button before merging

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `v2/sentry.client.config.ts` | Create | Client-side Sentry initialization |
| `v2/sentry.server.config.ts` | Create | Server-side Sentry initialization |
| `v2/sentry.edge.config.ts` | Create | Edge runtime Sentry initialization |
| `v2/next.config.ts` | Modify | Add Sentry webpack plugin for source maps |
| `v2/.env.example` | Modify | Add Sentry environment variables |
| `.github/workflows/test-deploy-dev.yml` | Modify | Add SENTRY_AUTH_TOKEN for source map uploads |

### Acceptance Criteria

- [ ] Sentry SDK installed and initialized
- [ ] Unhandled errors captured automatically
- [ ] Source maps uploaded and resolving correctly
- [ ] Environment tags set (development/production)
- [ ] Error sampling at 100%, performance sampling at 10–20%
- [ ] DSN stored as environment variable (not hardcoded)

---

## Task 7.4: Uptime Monitoring

**Goal:** Monitor site availability and receive alerts when the site goes down.

**Why:** Railway doesn't include uptime monitoring. Without it, outages could go unnoticed for hours. UptimeRobot provides free monitoring with 5-minute check intervals.

### Implementation Steps

1. **Create UptimeRobot account**
   - Sign up at [uptimerobot.com](https://uptimerobot.com)
   - Free tier: 50 monitors, 5-minute intervals

2. **Create monitors**
   - **HTTPS monitor:** `https://portfolio.singchan.com` — checks HTTP 200
   - **Keyword monitor (optional):** Verify page contains expected content (e.g., "Sing Chan")

3. **Configure alerts**
   - Email notification on down/up events
   - Optional: Webhook to Slack or other notification channel

4. **Set up status page (optional)**
   - UptimeRobot provides a free public status page
   - Can be linked from the portfolio footer or colophon

### Files to Create/Modify

No code changes required — UptimeRobot is an external service configured via its web UI.

### Acceptance Criteria

- [ ] HTTPS monitor configured for production URL
- [ ] Email alerts configured for down/up events
- [ ] Monitor verified working (check UptimeRobot dashboard)

---

## Task 7.5: Dependency Management (Dependabot)

**Goal:** Automate dependency update tracking to catch security vulnerabilities and stay current with package updates.

**Why:** The project has 30+ dependencies. Manual tracking is error-prone. Dependabot auto-creates PRs for outdated or vulnerable packages, and the existing CI pipeline tests them automatically.

### Implementation Steps

1. **Create Dependabot configuration**
   - File: `.github/dependabot.yml`
   - Monitor `npm` ecosystem for `v2/` directory
   - Monitor GitHub Actions for `.github/workflows/`
   - Schedule weekly checks
   - Limit open PRs to 5 (prevent PR flood)

2. **Configure update groups (optional)**
   - Group minor/patch updates together to reduce PR noise
   - Keep major updates as individual PRs for review

### Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  # npm dependencies for v2 application
  - package-ecosystem: "npm"
    directory: "/v2"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
    commit-message:
      prefix: "chore(deps):"
    groups:
      minor-and-patch:
        update-types:
          - "minor"
          - "patch"

  # GitHub Actions workflows
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"
      - "ci"
    commit-message:
      prefix: "chore(ci):"
```

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `.github/dependabot.yml` | Create | Dependabot configuration for npm and GitHub Actions |

### Acceptance Criteria

- [ ] Dependabot configuration created
- [ ] npm dependencies monitored weekly for `v2/`
- [ ] GitHub Actions monitored weekly
- [ ] PR limits set to prevent flooding
- [ ] Conventional commit prefixes configured

---

## Task 7.6: Content & Maintenance Workflow

**Goal:** Document the operational workflow for ongoing content updates and maintenance tasks.

**Why:** As the project moves from development to operations, having documented procedures ensures consistency and reduces the effort needed for routine updates.

### Documentation Deliverables

1. **Adding a new project**
   - Update `v2/src/data/projects.ts` with new project entry
   - Add images to `v2/public/images/gallery/<project-id>/`
   - Add i18n translations for project description (en + fr)
   - Run tests to verify data layer integrity
   - Create PR with changelog entry

2. **Updating resume**
   - Update `v2/src/data/resume.ts` with new entries
   - Add i18n translations for any new text
   - Run tests to verify resume component rendering
   - Create PR with changelog entry

3. **Quarterly dependency update review**
   - Review open Dependabot PRs
   - Merge patch/minor updates after CI passes
   - Evaluate major updates for breaking changes
   - Run full test suite after merging updates
   - Update `package-lock.json` and verify build

4. **Monthly performance review**
   - Check PostHog analytics for traffic patterns
   - Review Core Web Vitals trends (p75 values)
   - Check Sentry for unresolved errors
   - Verify UptimeRobot shows acceptable uptime (target: 99.9%)
   - Run Lighthouse audit and compare with baseline

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `docs/guides/MAINTENANCE_WORKFLOW.md` | Create | Operational procedures for content and maintenance |

### Acceptance Criteria

- [ ] Maintenance workflow documentation created
- [ ] Procedures for adding projects documented
- [ ] Procedures for updating resume documented
- [ ] Quarterly dependency review process documented
- [ ] Monthly performance review checklist documented

---

## Testing Strategy

### Analytics & Monitoring Testing

Most Phase 7 additions are external service integrations. Testing focuses on:

1. **PostHog Provider** — Unit test that component renders without crashing, does not initialize in test environment
2. **Web Vitals Reporter** — Unit test that the reporter function calls PostHog capture with expected event shape
3. **Sentry Integration** — Manual verification that errors appear in Sentry dashboard with correct source maps
4. **Uptime Monitor** — Manual verification via UptimeRobot dashboard
5. **Dependabot** — Verified by first automated PR creation

### Test Requirements

- All new components must have unit tests
- Existing test suite must continue passing (1,123+ tests)
- No regressions in Lighthouse scores
- Coverage must remain above 80%

---

## Dependencies

### New npm Packages

| Package | Version | Purpose | Size Impact |
|---------|---------|---------|-------------|
| `posthog-js` | latest | PostHog analytics SDK | ~30 KB gzipped |
| `web-vitals` | latest | Core Web Vitals measurement | ~1.5 KB gzipped |
| `@sentry/nextjs` | latest | Error tracking SDK | ~30 KB gzipped |

### External Services (Free Tier)

| Service | Free Tier Limits | Purpose |
|---------|-----------------|---------|
| PostHog | 1M events/month | Web analytics |
| Sentry | 5K errors/month | Error tracking |
| UptimeRobot | 50 monitors, 5-min intervals | Uptime monitoring |
| Dependabot | Unlimited (GitHub built-in) | Dependency updates |
| Google Search Console | Unlimited | Real-user CWV data |

### Environment Variables (New)

| Variable | Where | Sensitive | Description |
|----------|-------|-----------|-------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Railway, `.env.local` | No (public) | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | Railway, `.env.local` | No (public) | PostHog instance URL |
| `SENTRY_DSN` | Railway, `.env.local` | No (public) | Sentry project DSN |
| `SENTRY_AUTH_TOKEN` | GitHub Secrets | Yes | Sentry source map upload token |
| `SENTRY_ORG` | GitHub Variables | No | Sentry organization slug |
| `SENTRY_PROJECT` | GitHub Variables | No | Sentry project slug |

---

## Success Criteria

### Technical Criteria

- [ ] PostHog tracking pageviews in production
- [ ] Core Web Vitals reported to PostHog as custom events
- [ ] Sentry capturing errors with resolved source maps
- [ ] UptimeRobot monitoring production URL
- [ ] Dependabot creating automated dependency PRs
- [ ] All existing tests passing (1,123+)
- [ ] No Lighthouse score regression
- [ ] Bundle size increase < 70 KB gzipped (PostHog + Sentry + web-vitals)

### Operational Criteria

- [ ] Maintenance workflow documented
- [ ] Monthly performance review checklist available
- [ ] Content update procedures documented
- [ ] All environment variables documented in `.env.example`

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Analytics SDK increases bundle size | Performance regression | Lazy-load PostHog SDK, measure before/after bundle size |
| Sentry SDK increases bundle size | Performance regression | Use tree-shaking, monitor bundle analyzer output |
| PostHog free tier exceeded | Loss of analytics | Monitor usage; portfolio traffic unlikely to exceed 1M events/month |
| Sentry free tier exceeded | Loss of error tracking | 5K errors/month is generous for a portfolio; configure sampling |
| Dependabot PR flood | Noisy notifications | Limit open PRs to 5, group minor/patch updates |
| Privacy concerns | Legal compliance | Use PostHog cookieless mode, respect Do Not Track |

---

## Implementation Order

Tasks are ordered by value and dependency:

```
Task 7.1: PostHog Analytics          [✅ COMPLETE]
    ↓
Task 7.2: Core Web Vitals            [Depends on 7.1 — uses PostHog for reporting]
    ↓
Task 7.3: Sentry Error Tracking      [Independent — can parallelize with 7.1/7.2]
    ↓
Task 7.4: Uptime Monitoring          [Independent — external service, no code]
    ↓
Task 7.5: Dependabot                 [Independent — GitHub config only]
    ↓
Task 7.6: Maintenance Workflow       [Last — documents everything set up above]
```

**Recommended approach:**
1. Implement Tasks 7.1 + 7.2 together (PostHog + Web Vitals) — single PR
2. Implement Task 7.3 (Sentry) — separate PR
3. Implement Tasks 7.4 + 7.5 (UptimeRobot + Dependabot) — can be done in parallel
4. Write Task 7.6 documentation last — captures final state of all monitoring tools

---

**Last Updated:** 2026-03-10
**Next Step:** Begin Task 7.2 (Core Web Vitals Reporting)
