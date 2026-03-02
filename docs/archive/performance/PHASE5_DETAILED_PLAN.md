# Phase 5: Performance & Optimization — Detailed Implementation Plan

**Document Version:** 1.0
**Created:** 2026-03-01
**Author:** Sing Chan (with Claude Code)
**Status:** ✅ Complete
**Target Branch:** `sc/client-server-boundary`

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prerequisites & Current State](#prerequisites--current-state)
3. [Implementation Overview](#implementation-overview)
4. [Task 5.1: Bundle Analysis & Optimization](#task-51-bundle-analysis--optimization)
5. [Task 5.2: Font Loading Optimization](#task-52-font-loading-optimization)
6. [Task 5.3: Component Lazy Loading & Code Splitting](#task-53-component-lazy-loading--code-splitting)
7. [Task 5.4: Client/Server Component Boundary Audit](#task-54-clientserver-component-boundary-audit)
8. [Task 5.5: Static Site Generation (SSG)](#task-55-static-site-generation-ssg)
9. [Task 5.6: Performance Audits & Core Web Vitals](#task-56-performance-audits--core-web-vitals)
10. [File Structure](#file-structure)
11. [Testing Strategy](#testing-strategy)
12. [Dependencies](#dependencies)
13. [Success Criteria](#success-criteria)
14. [Risk Mitigation](#risk-mitigation)
15. [Implementation Order](#implementation-order)

---

## Executive Summary

Phase 5 focuses on optimizing the portfolio site for production-grade performance on Vercel. The site is functionally complete (Phases 1–4) with 1,123 passing tests, full WCAG 2.2 AA compliance, and a comprehensive feature set. This phase reduces bundle size, improves loading speed, and ensures excellent Lighthouse scores before deployment in Phase 6.

### Goals

- Establish performance measurement baseline with bundle analyzer
- Optimize font loading (eliminate render-blocking Google Fonts import)
- Lazy-load heavy components (Lightbox, Settings panel) to reduce initial bundle
- Audit and optimize client/server component boundaries to minimize client JS
- Configure Static Site Generation where feasible for Vercel deployment
- Achieve Lighthouse Performance score >90 and Core Web Vitals within "Good" thresholds

### Scope

| Area | Description |
|------|-------------|
| Bundle | Install analyzer, measure baseline, reduce initial JS payload |
| Fonts | Migrate from CSS @import to `next/font` for zero-CLS font loading |
| Code Splitting | Dynamic imports for heavy below-the-fold components |
| Server Components | Move components that don't need interactivity to server-side |
| SSG | Configure static generation for applicable routes |
| Auditing | Lighthouse, Core Web Vitals measurement and optimization |
| CDN | Deferred to Phase 6 (deployment) |
| Service Worker | Not in scope (unnecessary for portfolio site) |
| Duration | 1–2 weeks estimated |

### Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Deployment Target | Vercel | Full Next.js feature support (SSR, ISR, image optimization API) |
| CDN for Images | Deferred to Phase 6 | Naturally pairs with hosting/deployment decisions |
| Service Worker / PWA | Skipped | Portfolio site doesn't need offline support |
| Optimization Depth | Thorough | Audit all client/server boundaries, not just obvious wins |

---

## Prerequisites & Current State

### Phase 4 Complete ✅

All enhanced features are implemented and stable:
- Theme switching (Light, Dark, High Contrast)
- Internationalization (English + French)
- Animations with `prefers-reduced-motion` support
- WCAG 2.2 Level AA compliance
- SEO optimization (meta tags, JSON-LD, sitemap, robots.txt)

### Current Performance Baseline

| Metric | Current State | Notes |
|--------|--------------|-------|
| Bundle Analyzer | ❌ Not installed | No visibility into bundle composition |
| SSG | ❌ None | All 3 pages are server-rendered |
| Dynamic Imports | ❌ None | All components statically imported |
| Client Components | 40/48 (~83%) | Most components have `"use client"` directive |
| Font Loading | ❌ CSS @import | Render-blocking Google Fonts `@import url(...)` in globals.css |
| Image Optimization | ✅ Good | Next.js Image with AVIF/WebP, blur placeholders, 1-year cache |
| Compression | ✅ Built-in | Next.js/Vercel handles gzip/brotli automatically |
| Tree Shaking | ✅ Built-in | Next.js webpack handles this automatically |

### Current Architecture (3 Routes)

| Route | Type | Notes |
|-------|------|-------|
| `/` (Home) | Server Component (async) | Reads cookies for locale, fetches 5 projects server-side |
| `/resume` | Client Component | `"use client"` — uses `useI18n()` hook |
| `/colophon` | Server Component | Renders `ColophonContent` (client component) |

### Key Observation

There are no dynamic `projects/[id]` routes — project detail is rendered inline on the homepage. This means `generateStaticParams` is not needed for individual project pages. SSG efforts focus on the 3 existing routes.

---

## Implementation Overview

### Phase 5 Architecture Changes

```
v2/
├── next.config.ts              # MODIFIED: Add bundle analyzer config
├── app/
│   ├── layout.tsx              # MODIFIED: Use next/font instead of CSS @import
│   ├── globals.css             # MODIFIED: Remove Google Fonts @import
│   ├── page.tsx                # MODIFIED: SSG considerations
│   ├── resume/page.tsx         # MODIFIED: Server/client boundary optimization
│   └── colophon/page.tsx       # UNCHANGED (already server component)
├── src/
│   ├── components/
│   │   ├── project/
│   │   │   └── ProjectLightbox.tsx  # LAZY LOADED via dynamic import
│   │   ├── settings/
│   │   │   └── SettingsList.tsx      # LAZY LOADED via dynamic import
│   │   └── [others]                  # AUDIT for server component candidates
│   └── lib/
│       └── fonts.ts                  # NEW: next/font configuration
└── package.json                # MODIFIED: Add @next/bundle-analyzer
```

---

## Task 5.1: Bundle Analysis & Optimization

### Status: ✅ Complete

### Overview

Install `@next/bundle-analyzer` to establish a performance baseline, identify large dependencies, and track bundle size improvements across subsequent tasks.

### Requirements

#### 5.1.1 Install Bundle Analyzer

```bash
cd v2
npm install --save-dev @next/bundle-analyzer
```

#### 5.1.2 Configure next.config.ts

Add bundle analyzer support with an environment variable toggle:

```typescript
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    // ... existing image config
  },
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);
```

#### 5.1.3 Add Analysis Script

Add to `package.json` scripts:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

#### 5.1.4 Establish Baseline

Run the analyzer and document:
- Total client-side JS bundle size (initial load)
- Largest dependencies by size
- Number of chunks and their sizes
- Server-side vs client-side split

Record these metrics in a `docs/active/PERFORMANCE_BASELINE.md` file for comparison after optimizations.

#### 5.1.5 Identify Optimization Targets

From the baseline analysis, flag:
- Dependencies contributing >50KB to client bundle
- Duplicate code across chunks
- Dependencies that could be tree-shaken or replaced
- MUI imports that could be more targeted

### Acceptance Criteria

- [ ] `@next/bundle-analyzer` installed and configured
- [ ] `npm run analyze` script works and generates report
- [ ] Baseline bundle sizes documented
- [ ] Optimization targets identified and prioritized

### Estimated Effort: 0.5 days

---

## Task 5.2: Font Loading Optimization

### Status: ✅ Complete

### Overview

Replace the render-blocking Google Fonts CSS `@import` in `globals.css` with Next.js's built-in `next/font` system. This eliminates the external network request, prevents Cumulative Layout Shift (CLS) from font swapping, and enables automatic font file optimization.

### Current Problem

```css
/* globals.css — LINE 1 (render-blocking) */
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Oswald:wght@400;700&family=Gochi+Hand&display=swap");
```

**Issues:**
1. **Render-blocking** — Browser must fetch the CSS file from Google before rendering
2. **Extra network request** — Adds latency, especially on slow connections
3. **CLS risk** — `display=swap` causes visible text reflow when fonts load
4. **Privacy** — Sends user data to Google's servers on every page load

### Requirements

#### 5.2.1 Create Font Configuration

Create `v2/src/lib/fonts.ts` using `next/font/google`:

```typescript
import { Open_Sans, Oswald, Gochi_Hand } from "next/font/google";

/** Body text font — Open Sans with 4 weight variants */
export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  variable: "--font-open-sans",
});

/** Heading font — Oswald with 2 weight variants */
export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-oswald",
});

/** Decorative font for Buta's thought bubble */
export const gochiHand = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-gochi-hand",
});
```

#### 5.2.2 Update Root Layout

In `v2/app/layout.tsx`, apply font CSS variables to the `<html>` element:

```tsx
import { openSans, oswald, gochiHand } from "@/src/lib/fonts";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${oswald.variable} ${gochiHand.variable}`}
    >
      <body>{/* ... */}</body>
    </html>
  );
}
```

#### 5.2.3 Remove CSS @import

Remove line 1 from `globals.css`:

```diff
- @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Oswald:wght@400;700&family=Gochi+Hand&display=swap");
```

#### 5.2.4 Update Theme Typography

Update `v2/src/lib/themes.ts` to reference CSS variables instead of hardcoded font names:

```typescript
typography: {
  fontFamily: 'var(--font-open-sans), "Helvetica", "Arial", sans-serif',
  h1: { fontFamily: 'var(--font-oswald), "Helvetica", "Arial", sans-serif' },
  // ... same for h2-h6
}
```

Alternatively, keep the font-family strings as-is (since `next/font` injects the actual font family names) — both approaches work. The CSS variable approach is more explicit and easier to debug.

#### 5.2.5 Update Gochi Hand References

Search for any direct references to `"Gochi Hand"` in component styles (e.g., Buta's thought bubble in Footer) and ensure they use the CSS variable or the `gochiHand.style.fontFamily` value.

### Acceptance Criteria

- [ ] Google Fonts `@import` removed from globals.css
- [ ] All 3 fonts loaded via `next/font/google`
- [ ] Font CSS variables applied to `<html>` element
- [ ] Theme typography references updated
- [ ] No visible font reflow (CLS = 0 for fonts)
- [ ] All existing tests pass (font rendering is visual, not tested directly)
- [ ] Fonts render correctly in all 3 themes

### Estimated Effort: 0.5–1 day

---

## Task 5.3: Component Lazy Loading & Code Splitting

### Status: ✅ Complete

### Overview

Use Next.js `dynamic()` imports to lazy-load heavy components that aren't needed on initial render. This reduces the initial JavaScript bundle size, improving Time to Interactive (TTI) and First Input Delay (FID).

### Lazy Loading Candidates

Based on the codebase analysis, the following components are candidates for dynamic import:

| Component | Lines | Reason for Lazy Loading |
|-----------|-------|------------------------|
| **ProjectLightbox** | 514 | Only needed when user clicks an image. Heavy: gesture handling, animations, ARIA |
| **SettingsList** | ~200 | Only visible when settings button is clicked |
| **HamburgerMenu** | ~150 | Only visible on mobile when menu is opened |
| **ProjectSkeleton** | 439 | Only shown during loading states, not initial render |

### Requirements

#### 5.3.1 Dynamic Import for ProjectLightbox

The lightbox is the largest component (514 lines) with touch gesture handling, keyboard navigation, and complex animations. It's only rendered when a user clicks a gallery image.

```typescript
// In ProjectGallery.tsx or wherever Lightbox is imported
import dynamic from "next/dynamic";

const ProjectLightbox = dynamic(
  () => import("./ProjectLightbox"),
  { ssr: false } // Lightbox is purely client-side interactive
);
```

**Important:** Ensure the lightbox still receives all necessary props and that keyboard/touch accessibility is preserved after dynamic loading.

#### 5.3.2 Dynamic Import for SettingsList

The settings panel (theme switcher, language switcher, animations toggle) is hidden behind a settings button. It doesn't need to be in the initial bundle.

```typescript
// In SettingsButton.tsx or wherever SettingsList is imported
import dynamic from "next/dynamic";

const SettingsList = dynamic(
  () => import("./SettingsList"),
  { ssr: false }
);
```

#### 5.3.3 Dynamic Import for HamburgerMenu

The mobile hamburger menu is only visible on small screens when toggled open.

```typescript
import dynamic from "next/dynamic";

const HamburgerMenu = dynamic(
  () => import("./HamburgerMenu"),
  { ssr: false }
);
```

#### 5.3.4 Evaluate ProjectSkeleton

The skeleton component (439 lines) is only used during loading transitions. Evaluate if it's worth lazy-loading vs. the cost of showing a blank space during chunk load. If the skeleton is small enough after tree-shaking, it may not be worth the complexity.

#### 5.3.5 Loading Fallbacks

For components that are dynamically imported, provide lightweight loading fallbacks where appropriate:

```typescript
const ProjectLightbox = dynamic(
  () => import("./ProjectLightbox"),
  {
    ssr: false,
    loading: () => null, // Lightbox starts hidden anyway
  }
);
```

### Acceptance Criteria

- [ ] ProjectLightbox dynamically imported with `ssr: false`
- [ ] SettingsList dynamically imported
- [ ] HamburgerMenu dynamically imported
- [ ] ProjectSkeleton evaluated (lazy-load or keep static)
- [ ] All functionality preserved (keyboard nav, touch gestures, ARIA)
- [ ] No visual regression — components load seamlessly when triggered
- [ ] Bundle size reduced (measurable via analyzer from Task 5.1)
- [ ] All existing tests pass (may need test updates for dynamic imports)

### Testing Considerations

Dynamic imports require special handling in tests:
- Mock `next/dynamic` or use `await waitFor()` to wait for lazy-loaded components
- Ensure accessibility tests still cover lightbox keyboard navigation
- Test that loading fallbacks render correctly

### Estimated Effort: 1–1.5 days

---

## Task 5.4: Client/Server Component Boundary Audit

### Status: ✅ Complete

### Overview

Currently 40 out of 48 components have `"use client"` directives. Many of these may not actually need client-side JavaScript — they might use `"use client"` simply because they import from a client component, or because they were added during development for convenience.

This task audits every component to determine if it genuinely needs client-side interactivity (hooks, event handlers, browser APIs) or if it can be a server component (static rendering, zero client JS).

### Current Client/Server Split

**Client Components (40):** Every component under `common/`, `project/`, `resume/`, `colophon/`, `settings/`, `i18n/`, and the root `ThemeProvider`.

**Server Components (8):** Primarily index/barrel files and page-level components.

### Audit Criteria

A component **requires** `"use client"` if it uses:
- React hooks (`useState`, `useEffect`, `useRef`, `useContext`, etc.)
- Event handlers (`onClick`, `onKeyDown`, `onChange`, etc.)
- Browser-only APIs (`window`, `document`, `localStorage`, etc.)
- Third-party client-only libraries

A component **can be a server component** if it:
- Only renders JSX with props
- Doesn't use any hooks or event handlers
- Can receive data as props from a parent server component

### Requirements

#### 5.4.1 Audit All Components

Create a spreadsheet/table of every component with:
- Current directive (`"use client"` or server)
- Hooks used
- Event handlers used
- Browser APIs used
- **Verdict:** Keep client / Convert to server / Refactor (split)

#### 5.4.2 Convert Pure Presentational Components

Components that only render JSX from props (no hooks, no events) should have their `"use client"` directive removed. Likely candidates:

- **Resume components** — If `ResumeHeader`, `Education`, `CoreCompetencies`, `ClientList`, `ConferenceSpeaker` just receive data as props and render JSX, they can be server components. The parent `ResumePage` would pass localized data down.
- **Colophon components** — Similar pattern; check if `DesignPhilosophy`, `TechnologiesShowcase`, `ButaStory` need interactivity.

#### 5.4.3 Split Mixed Components

Some components may have a small interactive piece (e.g., a hover effect) combined with a large static render tree. These can be split:

1. **Server component** — Renders the static structure
2. **Client component** — Small interactive wrapper or island

Example pattern:
```tsx
// ProjectTags.server.tsx (server component)
export function ProjectTags({ tags }: { tags: string[] }) {
  return (
    <Box>
      {tags.map(tag => <Chip key={tag} label={tag} />)}
    </Box>
  );
}
```

#### 5.4.4 Consider the i18n Boundary

Many components use `"use client"` because they call `useI18n()`. Consider whether localized strings can be passed as props from a server component instead, allowing the child to remain a server component.

**Pattern:**
```tsx
// Server component (page-level)
export default async function Page() {
  return <SomeComponent title={t("key")} description={t("desc")} />;
}

// SomeComponent can now be a server component
function SomeComponent({ title, description }: Props) {
  return <Typography>{title}</Typography>;
}
```

**Caveat:** This only works if the parent is also a server component. Since `useI18n()` is a client hook, the localization boundary must be at a component that's already a client component. Evaluate case-by-case.

#### 5.4.5 MUI Import Optimization

Material UI is the largest dependency. Audit MUI imports for:
- **Barrel imports** — `import { Box, Typography, Chip } from "@mui/material"` is fine (MUI v7 supports tree-shaking). Verify this in the bundle analyzer output.
- **Icons** — `@mui/icons-material` can be large. Check if individual icon imports (`@mui/icons-material/Close`) produce smaller bundles than barrel imports.

### Acceptance Criteria

- [ ] Complete audit table of all 48 components
- [ ] Presentational components converted to server components where possible
- [ ] Mixed components split into server + client parts where beneficial
- [ ] i18n boundary strategy documented
- [ ] MUI import patterns verified in bundle analyzer
- [ ] No functionality regressions
- [ ] All tests pass
- [ ] Bundle size measurably reduced

### Risk

Changing `"use client"` boundaries can cause runtime errors if a server component accidentally uses a client-only feature. Run the full test suite and do manual smoke testing after each change.

### Estimated Effort: 2–3 days

---

## Task 5.5: Static Site Generation (SSG)

### Status: ✅ Complete

### Overview

Configure Next.js to statically generate pages at build time where possible, enabling instant loads from Vercel's CDN edge network. This is the most impactful optimization for a portfolio site where content changes infrequently.

### Current Routing Architecture

| Route | Current Behavior | SSG Feasibility |
|-------|-----------------|-----------------|
| `/` (Home) | Server-renders with cookie-based locale | Medium — cookie dependency complicates SSG |
| `/resume` | Client-rendered (`"use client"`) | Low — i18n hooks require client rendering |
| `/colophon` | Server component wrapping client component | Medium — same i18n challenge |
| `/sitemap.xml` | Dynamic route handler | Already optimal |
| `/robots.txt` | Dynamic route handler | Already optimal |

### The i18n Challenge

The primary obstacle to SSG is the i18n system. Currently:
1. User selects language → stored in `localStorage` + cookie
2. Pages read locale from cookie (server) or `useI18n()` hook (client)
3. All text is rendered in the user's preferred language at runtime

For SSG, pages must be pre-rendered at build time with a **single language**. Options:

**Option A: Default-language SSG + Client Hydration (Recommended)**
- Pre-render all pages in English (default language)
- Client-side hydration swaps to user's preferred language via `useI18n()`
- Pros: Fast initial load, SEO indexes English content, language switch happens quickly
- Cons: Brief flash of English before switching to French (if user prefers French)

**Option B: Multi-language Static Routes**
- Generate `/en/`, `/fr/` route variants with `generateStaticParams`
- Requires restructuring to `app/[locale]/` routing pattern
- Pros: Perfect SEO for both languages, no flash
- Cons: Major routing refactor, doubles the number of pages, adds complexity
- **Not recommended for Phase 5** — this is a Phase 7 (post-launch) improvement

**Option C: Keep Server-Side Rendering**
- Don't use SSG; let Vercel's serverless functions handle rendering
- Pros: Zero changes needed, locale works perfectly
- Cons: Slower than static (serverless cold starts), no CDN edge caching

### Requirements

#### 5.5.1 Evaluate SSG Impact (Recommended: Option A)

Since the site has only 3 pages and all content is static (no database, no API), the SSG benefit is primarily:
- **Edge caching** — Pages served from Vercel's CDN, not serverless functions
- **Faster TTFB** — No server-side execution on each request
- **Cost** — Static pages are free/cheaper on Vercel

#### 5.5.2 Configure Static Generation

For Option A, make pages static by removing dynamic dependencies:

**Homepage (`/`):**
- Currently uses `cookies()` to read locale — this forces dynamic rendering
- Remove cookie reading from the page component
- Let client-side `useI18n()` handle locale after hydration
- The initial 5 projects can be fetched at build time (they're static data)

```typescript
// BEFORE (dynamic — reads cookies)
export default async function PortfolioPage() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookie(cookieStore.toString());
  const { items } = await fetchProjects({ page: 1, pageSize: 5, locale });
  // ...
}

// AFTER (static — uses default locale at build time)
export default async function PortfolioPage() {
  const { items } = await fetchProjects({ page: 1, pageSize: 5, locale: "en" });
  // Client-side useI18n() handles locale switching after hydration
  // ...
}
```

**Colophon (`/colophon`):**
- Already a simple server component wrapping a client component
- Should be automatically static if it doesn't use dynamic functions

**Resume (`/resume`):**
- Currently a full `"use client"` page
- Already renders client-side — SSG benefit is limited here
- Could be kept as-is (client-rendered) or refactored in Task 5.4

#### 5.5.3 Verify Static Generation

After changes, verify pages are actually being statically generated:

```bash
npm run build
```

Next.js build output shows each route's rendering strategy:
- `○` = Static (pre-rendered as static HTML)
- `ƒ` = Dynamic (server-rendered on each request)
- `λ` = Server-side rendered

Target:
- `/` → `○` Static
- `/colophon` → `○` Static
- `/resume` → `○` Static (or acceptable as client-rendered)

#### 5.5.4 Cache Headers (Vercel)

Vercel automatically configures optimal cache headers for static pages. Verify in deployment that:
- Static pages are served with `Cache-Control: public, max-age=0, must-revalidate` (Vercel's default for ISR/static)
- Images have long-lived cache headers (already configured: 1 year TTL)
- JS/CSS chunks have content-hash filenames (Next.js default)

### Acceptance Criteria

- [ ] Homepage statically generated at build time
- [ ] Colophon page statically generated
- [ ] Resume page either statically generated or documented as client-rendered (acceptable)
- [ ] `next build` output confirms static generation (`○` indicator)
- [ ] Cookie-based locale reading removed from page-level server components
- [ ] i18n still works correctly after hydration (client-side language switch)
- [ ] All tests pass
- [ ] No visible regression in page behavior

### Estimated Effort: 1–1.5 days

---

## Task 5.6: Performance Audits & Core Web Vitals

### Status: ✅ Complete

### Overview

Run comprehensive performance audits after all optimizations are applied. Measure against Lighthouse and Core Web Vitals thresholds. Document results and address any remaining issues.

### Requirements

#### 5.6.1 Build and Measure

Run a production build and start the local server:

```bash
cd v2
npm run build
npm start
```

#### 5.6.2 Lighthouse Audits

Run Lighthouse on all 3 pages (Desktop and Mobile):
- `/` (Homepage)
- `/resume`
- `/colophon`

Measure all 4 Lighthouse categories:
- **Performance** (target: >90)
- **Accessibility** (target: 100 — already achieved)
- **Best Practices** (target: >90)
- **SEO** (target: >90 — already optimized in Phase 4)

#### 5.6.3 Core Web Vitals

Measure and optimize for Google's Core Web Vitals:

| Metric | Good Threshold | What It Measures |
|--------|---------------|------------------|
| **LCP** (Largest Contentful Paint) | <2.5s | Time to render largest visible element |
| **FID** (First Input Delay) | <100ms | Time from first interaction to response |
| **CLS** (Cumulative Layout Shift) | <0.1 | Visual stability during load |
| **INP** (Interaction to Next Paint) | <200ms | Responsiveness to user interactions |
| **TTFB** (Time to First Byte) | <800ms | Server response time |

#### 5.6.4 Network Throttling Tests

Test under constrained conditions:
- **Slow 3G** (1.6 Mbps down, 750ms RTT)
- **Fast 3G** (1.6 Mbps down, 150ms RTT)
- **CPU 4x slowdown** (simulates low-end mobile)

Verify the site is usable and loads within reasonable timeframes even on slow connections.

#### 5.6.5 Bundle Size Verification

Compare bundle sizes before and after all Phase 5 optimizations:

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Initial JS (client) | TBD | TBD | TBD |
| First Load JS | TBD | TBD | TBD |
| Largest chunk | TBD | TBD | TBD |
| Total client JS | TBD | TBD | TBD |

#### 5.6.6 Create Performance Report

Document all findings in `docs/active/PERFORMANCE_REPORT.md`:
- Lighthouse scores (all pages, desktop + mobile)
- Core Web Vitals measurements
- Bundle size before/after comparison
- Remaining optimization opportunities (if any)
- Recommendations for Phase 7 (post-launch)

#### 5.6.7 Address Remaining Issues

If any Lighthouse score is below target:
1. Identify the specific failing audits
2. Prioritize by impact
3. Fix the highest-impact issues
4. Re-measure to confirm improvement

### Acceptance Criteria

- [ ] Lighthouse Performance >90 on all pages (desktop)
- [ ] Lighthouse Performance >80 on all pages (mobile — more lenient due to image-heavy content)
- [ ] Lighthouse Accessibility = 100 (maintained from Phase 4)
- [ ] Lighthouse Best Practices >90
- [ ] Lighthouse SEO >90 (maintained from Phase 4)
- [ ] CLS < 0.1 (especially after font optimization)
- [ ] LCP < 2.5s on desktop
- [ ] Performance report documented
- [ ] Bundle size comparison documented

### Estimated Effort: 1–1.5 days

---

## File Structure

### New Files

```
v2/
├── src/
│   └── lib/
│       └── fonts.ts                    # NEW: next/font configuration
├── docs/
│   └── active/
│       ├── PHASE5_DETAILED_PLAN.md     # This document
│       ├── PERFORMANCE_BASELINE.md     # NEW: Pre-optimization metrics
│       └── PERFORMANCE_REPORT.md       # NEW: Post-optimization metrics
└── package.json                        # MODIFIED: Add analyze script + bundle-analyzer
```

### Modified Files

```
v2/
├── next.config.ts                      # Add bundle analyzer wrapper
├── app/
│   ├── layout.tsx                      # Use next/font, apply CSS variables
│   ├── globals.css                     # Remove Google Fonts @import
│   └── page.tsx                        # Remove cookie dependency for SSG
├── src/
│   ├── components/
│   │   ├── project/
│   │   │   └── ProjectGallery.tsx      # Dynamic import for Lightbox
│   │   ├── settings/
│   │   │   └── SettingsButton.tsx      # Dynamic import for SettingsList
│   │   ├── common/
│   │   │   └── Header.tsx              # Dynamic import for HamburgerMenu
│   │   └── [various]                   # Remove "use client" where not needed
│   └── lib/
│       └── themes.ts                   # Update font-family references
```

---

## Testing Strategy

### Automated Tests

- **All existing 1,123 tests must pass** after every task
- Dynamic imports may require test adjustments (mocking `next/dynamic` or using `waitFor`)
- Font changes are visual — verified by existing render tests not breaking
- Server component conversions may require test harness changes (server components can't use testing-library's `render` directly for unit tests)

### Manual Testing

| Test | What to Verify |
|------|---------------|
| Font rendering | All 3 fonts display correctly across themes |
| Lightbox | Opens, navigates, keyboard/touch works after dynamic import |
| Settings panel | Opens, theme/language/animation switches work |
| Hamburger menu | Opens on mobile, navigation works |
| Language switch | Switching to French still works after SSG changes |
| Print view | Resume print layout unaffected |
| Accessibility | NVDA/VoiceOver still works correctly |

### Performance Testing

- Lighthouse audits (Task 5.6)
- Bundle analyzer comparisons (Task 5.1 baseline vs final)
- Core Web Vitals measurement

---

## Dependencies

### New Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@next/bundle-analyzer` | latest | Bundle size analysis and visualization |

### No Other New Dependencies

- `next/font` is built into Next.js (no install needed)
- `next/dynamic` is built into Next.js (no install needed)
- No new runtime dependencies

---

## Success Criteria

### Performance Targets

| Metric | Target | Priority |
|--------|--------|----------|
| Lighthouse Performance (Desktop) | >90 | P0 |
| Lighthouse Performance (Mobile) | >80 | P1 |
| Lighthouse Accessibility | 100 | P0 (maintain) |
| Lighthouse Best Practices | >90 | P1 |
| Lighthouse SEO | >90 | P0 (maintain) |
| LCP | <2.5s | P0 |
| CLS | <0.1 | P0 |
| FID/INP | <200ms | P1 |
| Initial JS Bundle | <200KB | P1 |

### Quality Targets

| Metric | Target |
|--------|--------|
| TypeScript errors | 0 |
| ESLint errors | 0 |
| Test pass rate | 100% |
| Accessibility violations | 0 |
| Test coverage | ≥80% |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dynamic imports break tests | Medium | Update test setup to handle async component loading; mock `next/dynamic` if needed |
| Server component conversion causes runtime errors | High | Convert one component at a time; run full test suite after each change; test manually |
| SSG breaks i18n language switching | High | Verify client-side hydration handles language switch; test French locale specifically |
| `next/font` doesn't match current font rendering | Low | `next/font` uses the same Google Fonts files; visual differences should be minimal |
| Bundle analyzer shows MUI is the dominant cost | Medium | MUI v7 tree-shakes well; verify in analyzer. If not, consider `@mui/material/Box` direct imports |
| Removing `"use client"` from components used by client components | High | A server component can be a child of a client component — but it must not use hooks. Audit carefully |

---

## Implementation Order

### Recommended Sequence

```
Task 5.1: Bundle Analysis          ─── Day 1 (baseline)
    │
    ▼
Task 5.2: Font Optimization        ─── Day 1-2 (quick win, big CLS improvement)
    │
    ▼
Task 5.3: Lazy Loading             ─── Day 2-3 (reduces initial bundle)
    │
    ▼
Task 5.4: Client/Server Audit      ─── Day 3-5 (thorough, most complex)
    │
    ▼
Task 5.5: SSG Configuration        ─── Day 5-6 (depends on 5.4 for optimal boundaries)
    │
    ▼
Task 5.6: Performance Audits       ─── Day 6-7 (final measurement and tuning)
```

### Dependencies

- **5.1 must be first** — Establishes baseline for measuring improvements
- **5.2 and 5.3 are independent** — Can be done in parallel if needed
- **5.4 before 5.5** — Server component boundaries affect SSG feasibility
- **5.6 must be last** — Final measurement after all optimizations

### Total Estimated Duration: 7–10 working days

---

**Last Updated:** 2026-03-01
**Status:** ✅ All tasks complete. See `docs/active/PERFORMANCE_REPORT.md` for final results.
