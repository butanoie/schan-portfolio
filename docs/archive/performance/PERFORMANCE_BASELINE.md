# Performance Baseline — Pre-Phase 5 Optimization

**Date:** 2026-03-01
**Build Tool:** Next.js 16.1.6 (Turbopack)
**Branch:** `sc/phase5`
**Purpose:** Establish baseline metrics before Phase 5 optimizations

---

## Build Output Summary

### Route Rendering Strategy

| Route | Strategy | Reason |
|-------|----------|--------|
| `/` (Home) | ƒ Dynamic | Uses `cookies()` for locale detection |
| `/colophon` | ○ Static | Pre-rendered at build time |
| `/resume` | ○ Static | Pre-rendered at build time |
| `/sitemap.xml` | ○ Static | Pre-rendered at build time |
| `/robots.txt` | ○ Static | Pre-rendered at build time |

**Note:** Only the homepage is dynamic — due to server-side cookie reading for i18n. This will be addressed in Task 5.5 (SSG).

---

## Client-Side Bundle Sizes

### Totals

| Metric | Raw | Gzipped |
|--------|-----|---------|
| **Total Client JS** | 1,119.5 KB | 343.8 KB |
| **Total Client CSS** | 12.8 KB | ~4 KB |
| **Total Client Assets** | ~1,132 KB | ~348 KB |

### Largest Chunks (Top 6)

| Chunk | Raw | Gzipped | Contents |
|-------|-----|---------|----------|
| `5ccff...` | 220 KB | 68.5 KB | **Next.js runtime** — Turbopack runtime, hydration, router |
| `1ac8b...` | 168 KB | 55.4 KB | **App code** — ThemeContext, i18n, usePalette, components |
| `dd634...` | 152 KB | 37.9 KB | **React/Next core** — React internals, reconciler |
| `b31a0...` | 128 KB | 38.9 KB | **Material UI** — Button, AppBar, Modal, styled, Icon, Typography |
| `a6dad...` | 112 KB | 38.6 KB | **React DOM** — createElement, rendering pipeline |
| `41ca5...` | 68 KB | 22.1 KB | **Shared utilities** — Emotion, smaller libraries |

### Remaining Chunks

| Chunk | Raw | Contents (estimated) |
|-------|-----|---------------------|
| `264d3...` | 40 KB | MUI icons / additional MUI components |
| `42933...` | 32 KB | Next.js client-side navigation |
| `b6aef...` | 32 KB | Additional framework code |
| `7a0d6...` | 32 KB | Additional framework code |
| `107900...` | 28 KB | Additional framework code |
| Other chunks | ~107 KB | Smaller utility chunks |

---

## Key Observations

### 1. Framework Overhead is Dominant

The Next.js runtime (220 KB) + React core (152 KB) + React DOM (112 KB) = **484 KB raw / 145 KB gzipped**. This is framework overhead that cannot be reduced — it's the cost of using React + Next.js.

### 2. Material UI is Significant but Reasonable

MUI accounts for ~128 KB raw (38.9 KB gzipped) in its main chunk, plus possibly ~40 KB in the icons chunk. MUI v7 tree-shakes well, so this is likely close to optimal for the components used.

### 3. App Code is the Main Optimization Target

The 168 KB app code chunk contains all application components, contexts, hooks, and data. This is where lazy loading and server component conversion will have the most impact.

### 4. CSS is Minimal

Only 12.8 KB of CSS — MUI's `sx` prop generates styles at runtime via Emotion, so CSS overhead is embedded in the JS bundle.

### 5. Font Loading is External (Not in Bundle)

Fonts are loaded via a render-blocking `@import url(...)` in CSS, so they don't appear in the JS bundle but still impact page load performance. This will be fixed in Task 5.2.

---

## Optimization Targets (Prioritized)

| Target | Estimated Savings | Task |
|--------|------------------|------|
| **Font loading** — Eliminate render-blocking CSS @import | Faster FCP, CLS = 0 | 5.2 |
| **Lazy load Lightbox** (~514 lines, gestures, animations) | ~20-40 KB from initial load | 5.3 |
| **Lazy load Settings/Hamburger** | ~10-20 KB from initial load | 5.3 |
| **Server component conversion** — Move presentational components server-side | Reduce app chunk (~168 KB) | 5.4 |
| **SSG for homepage** — Remove cookie dependency | ƒ → ○, faster TTFB | 5.5 |
| **MUI icon imports** — Verify tree-shaking | Potentially ~10-20 KB | 5.4 |

### What We Cannot Optimize

- Next.js runtime (220 KB raw) — Required framework code
- React core + DOM (264 KB raw) — Required for any React app
- Emotion runtime — Required by MUI's `sx` prop system

---

## Lighthouse Scores (Pre-Optimization)

> **TODO:** Run Lighthouse audits in Task 5.6 against both baseline and optimized builds for before/after comparison.

---

**This document will be updated with post-optimization metrics after Phase 5 tasks are complete.**
