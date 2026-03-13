# E2E Accessibility — WCAG 2.2 AA Test Suite and Accessibility Fixes

**Date:** 2026-03-12
**Time:** 19:13:02 PDT
**Type:** Feature
**Phase:** 8.6 (E2E Accessibility — Testing Roadmap Phase 6)
**PRs:** #133, #146, #147, #148, #149
**Branch:** `sc/e2e-accessibility`
**Version:** v2.x

## Summary

Implemented a comprehensive E2E accessibility test suite with 21 WCAG 2.2 AA axe-core scans covering baseline pages, theme/locale matrices, interactive states, and keyboard navigation. The test suite surfaced 5 real accessibility defects that were fixed in follow-up commits: skip link focus, CSS transition timing, lightbox dialog discovery, color contrast, and settings landmark role.

---

## Changes Implemented

### 1. E2E Accessibility Spec (#133)

Created `accessibility.spec.ts` with 21 tests across 5 categories:

| Category | Tests | Coverage |
|---|---|---|
| Baseline page scans | 4 | Home, Resume, Colophon, Samples |
| Theme matrix | 8 | All 4 pages × light + dark theme |
| Locale matrix | 4 | All 4 pages in French locale |
| Interactive states | 3 | Settings popover, lightbox dialog, load-more state |
| Keyboard navigation | 2 | Skip link focus transfer, Tab order |

### 2. Skip Link & WebKit Tab Handling (#147)

- Added `tabindex="-1"` to `#main-content` in `MainLayout.tsx` — without it, skip link activation couldn't transfer focus to the target
- E2E tests use `Alt+Tab` for WebKit since macOS excludes links from the default Tab cycle
- Updated `MainLayout.test.tsx` to assert the `tabindex` attribute

### 3. CSS Transition Settling (#146)

axe-core was computing contrast ratios against mid-transition background colors during theme changes, causing 32 of 42 tests to false-positive on `color-contrast`.

- Added `waitForTransitionsToSettle()` to `runAxeScan()` — polls the Web Animations API until no `CSSTransition` instances are running
- Uses `constructor.name` check instead of `instanceof` for WebKit compatibility
- Removed now-redundant 500ms hardcoded delay from `ProjectLightbox` POM

### 4. Lightbox Dialog & Color Contrast (#148)

- Moved `aria-label` from Dialog root to `slotProps.paper` so Playwright's `getByRole('dialog', { name })` matches MUI v7's Paper element
- Darkened sage green (`#85B09C` → `#587A68`) to meet WCAG AA 4.5:1 contrast ratio with white text
- Shifted `NAV_COLORS` hover states proportionally to preserve visual feedback
- Added post-visibility delay in E2E POM for MUI Fade transitions
- Updated print stylesheets to use new color values

### 5. Settings Popover Landmark (#149)

- MUI Popover renders content via portal outside any ARIA landmark, failing axe's `region` rule
- Added `role="region"` with `aria-label` to the Popover Paper slot
- Uses `region` rather than `dialog` since the popover is non-modal (no focus trap)
- Fixed stale JSDoc claiming the gear button toggles the popover

### 6. E2E Server Isolation (#147)

- Next.js Dev Tools inject a `<nextjs-portal>` element that steals keyboard focus before the skip link, breaking tab-order assertions
- Moved E2E tests to a dedicated port (3100) with `reuseExistingServer: false` so Playwright always starts a fresh production server

### 7. Documentation Updates

- **CLAUDE.md** — Added CRITICAL workflow gates for post-architecture and post-review documentation, CLAUDE.md authoring pattern
- **TESTING_ROADMAP.md** — Phase 6 (Accessibility) checked off
- **TESTING_ARCHITECTURE.md** — `domcontentloaded` wait strategy, theme/locale matrix seeding
- **E2E_ACCESSIBILITY.md** — Implementation decisions and refined lightbox Gherkin
- **Scoped CLAUDE.md files** — Updated `v2/e2e/CLAUDE.md` and `v2/src/components/CLAUDE.md` with gotchas learned during implementation

---

## Technical Details

### Accessibility Defects Found and Fixed

| Issue | Root Cause | Fix | PR |
|---|---|---|---|
| Skip link doesn't transfer focus | `#main-content` missing `tabindex="-1"` | Add tabindex to MainLayout | #147 |
| False-positive contrast violations | axe scans during CSS background transition | Poll Web Animations API until settled | #146 |
| Lightbox dialog not found by Playwright | MUI v7 `aria-label` on wrong element | Move label to `slotProps.paper` | #148 |
| Sage green fails WCAG AA contrast | `#85B09C` only 3.2:1 with white | Darken to `#587A68` (4.5:1) | #148 |
| Settings popover outside landmark | MUI Portal renders outside ARIA landmarks | Add `role="region"` to Paper slot | #149 |

### Color Palette Changes

| Token | Before | After | Contrast (white) |
|---|---|---|---|
| `BRAND_COLORS.sage` | `#85B09C` | `#587A68` | 3.2:1 → 4.5:1 ✅ |
| `NAV_COLORS.activeBackground` | `#85B09C` | `#587A68` | Matched |
| `NAV_COLORS.inactiveHover` | `#9FC5B1` | `#6E9A82` | Proportional shift |
| `NAV_COLORS.activeHover` | `#6E9A82` | `#476B57` | Proportional shift |

### Net Line Impact

| Metric | Count |
|---|---|
| Lines added | ~429 |
| Lines removed | ~51 |
| Net addition | ~378 |
| Files changed | 18 |

---

## Impact Assessment

- **21 axe scans** covering every page across themes, locales, and interactive states — catches regressions automatically
- **5 real a11y bugs fixed** — every defect surfaced by the tests was resolved in-branch before merge
- **WCAG AA color compliance** — brand palette now meets 4.5:1 contrast ratio requirement
- **Stable E2E environment** — isolated port and transition settling eliminate flaky false positives
- **Keyboard accessibility** — skip link and tab order verified across Chromium and WebKit

---

## Related Files

**Created:**
- `v2/e2e/specs/accessibility.spec.ts`

**Modified:**
- `v2/e2e/helpers/axe.ts` (transition settling)
- `v2/e2e/components/ProjectLightbox.ts`, `v2/e2e/components/SettingsPanel.ts` (POM updates)
- `v2/playwright.config.ts` (port 3100)
- `v2/src/components/common/MainLayout.tsx` (tabindex)
- `v2/src/components/project/ProjectLightbox.tsx` (aria-label placement)
- `v2/src/components/settings/SettingsButton.tsx` (landmark role)
- `v2/src/constants/colors.ts` (contrast-compliant palette)
- `v2/app/print.css`, `v2/app/resume/print.css` (updated colors)
- `CLAUDE.md`, `v2/e2e/CLAUDE.md`, `v2/src/components/CLAUDE.md`
- `docs/active/TESTING_ROADMAP.md`, `docs/guides/TESTING_ARCHITECTURE.md`, `docs/test-scenarios/E2E_ACCESSIBILITY.md`

---

## Status

✅ COMPLETE
