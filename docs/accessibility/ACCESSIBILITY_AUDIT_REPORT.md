# Accessibility Audit Report

**Date:** March 13, 2026
**Auditor:** Automated (axe-core + vitest-axe + @axe-core/playwright + eslint-plugin-jsx-a11y)
**Standard:** WCAG 2.2 Level AA
**Scope:** All components and pages in `v2/src/` (unit) + all rendered pages (E2E)

---

## Executive Summary

| Metric                      | Result              | Status |
| --------------------------- | ------------------- | ------ |
| **axe-core violations**     | 0                   | PASS   |
| **ESLint jsx-a11y errors**  | 0                   | PASS   |
| **TypeScript errors**       | 0                   | PASS   |
| **Unit tests**              | 1,203               | PASS   |
| **Unit test files**         | 68                  | PASS   |
| **E2E tests**               | 208 (42 accessibility) | PASS |
| **Unit a11y test cases**    | 93                  | PASS   |
| **E2E a11y test cases**     | 42 (21 specs × 2 browsers) | PASS |
| **Components with a11y tests** | 30 files         | PASS   |
| **Code coverage (statements)** | 91.85%           | PASS   |
| **Code coverage (branches)**   | 83.96%           | PASS   |
| **Code coverage (functions)**  | 93.28%           | PASS   |
| **Code coverage (lines)**      | 92.38%           | PASS   |

**Overall Result: PASS — Zero accessibility violations detected across unit and E2E tests.**

---

## Test Tools & Methodology

### Automated Testing Stack

| Tool                      | Version   | Purpose                                      |
| ------------------------- | --------- | -------------------------------------------- |
| **axe-core**              | (via vitest-axe) | WCAG 2.2 rule engine for DOM auditing  |
| **vitest-axe**            | ^0.1.0    | Vitest integration for axe accessibility tests |
| **@axe-core/playwright**  | ^4.11.1   | E2E axe scans against real browser engines     |
| **Playwright**            | (latest)  | E2E browser automation (Chromium + WebKit)     |
| **eslint-plugin-jsx-a11y**| ^6.10.2   | Static analysis for JSX accessibility patterns |
| **@testing-library/react**| ^16.3.2   | Accessible component rendering and querying    |
| **Vitest**                | ^4.0.18   | Test runner with jsdom environment              |

### axe-core Rules Enabled

The following WCAG 2.2 Level AA rules are explicitly enabled in `testAccessibility()`:

| Rule                    | WCAG Criterion     | Description                          |
| ----------------------- | ------------------ | ------------------------------------ |
| `color-contrast`        | 1.4.3, 1.4.11     | Text and UI component contrast ratios |
| `image-alt`             | 1.1.1              | Images have descriptive alt text      |
| `landmark-one-main`     | 1.3.1              | Page has exactly one main landmark    |
| `region`                | 1.3.1              | Content is within landmark regions    |
| `link-name`             | 4.1.2              | Links have discernible text           |
| `button-name`           | 4.1.2              | Buttons have discernible text         |
| `label`                 | 3.3.2              | Form inputs have associated labels    |
| `aria-allowed-attr`     | 4.1.2              | ARIA attributes are valid for role    |
| `aria-required-attr`    | 4.1.2              | Required ARIA attributes are present  |
| `aria-valid-attr-value` | 4.1.2              | ARIA attribute values are valid       |
| `target-size`           | 2.5.8              | Touch targets are at least 44×44px    |

---

## E2E Accessibility Test Results

### Overview

The E2E accessibility suite (`v2/e2e/specs/accessibility.spec.ts`) runs 21 axe-core scans across Chromium and WebKit (42 total test runs), validating WCAG 2.2 AA compliance against fully-rendered production pages.

**Result: 42/42 passing — Zero violations detected.**

### Test Matrix

| Category | Tests | Scope |
|---|---|---|
| Per-page baseline scans | 4 | Home, Resume, Colophon, Samples (default state) |
| Theme matrix | 8 | All 4 pages × dark + high-contrast themes |
| Locale matrix | 4 | All 4 pages in French locale |
| Interactive states | 3 | Lightbox dialog, settings popover, mobile hamburger |
| Keyboard navigation | 2 | Skip link focus transfer, tab order with visible focus |

### Implementation Details

- **axe-core rules:** Same 11 WCAG 2.2 AA rules as unit tests (shared configuration)
- **CSS transition settling:** `waitForTransitionsToSettle()` polls the Web Animations API before scanning, preventing false-positive contrast violations during theme transitions
- **Third-party exclusions:** PostHog and Sentry iframes excluded from scans
- **Browser coverage:** Chromium and WebKit (Safari) — each spec runs in both browsers
- **WebKit keyboard handling:** Uses `Alt+Tab` for keyboard tests since macOS WebKit excludes links from the default Tab cycle

### Defects Discovered and Fixed (March 2026)

The E2E test suite surfaced 5 real accessibility defects during implementation that were all fixed before merge:

| Issue | WCAG Criterion | Root Cause | Fix |
|---|---|---|---|
| Skip link doesn't transfer focus | 2.4.1 Bypass Blocks | `#main-content` missing `tabindex="-1"` | Added `tabindex="-1"` to MainLayout |
| False-positive contrast violations | 1.4.3 Contrast | axe scans during CSS background transition | Added Web Animations API polling |
| Lightbox dialog not discoverable | 4.1.2 Name, Role, Value | MUI v7 `aria-label` on wrong element | Moved to `slotProps.paper` |
| Sage green fails contrast with white | 1.4.3 Contrast (Minimum) | `#85B09C` only 3.2:1 ratio | Darkened to `#587A68` (4.5:1) |
| Settings popover outside landmark | 1.3.1 Info and Relationships | MUI Portal renders outside ARIA landmarks | Added `role="region"` to Paper slot |

### Color Palette Changes

| Token | Before | After | Contrast (white) |
|---|---|---|---|
| `BRAND_COLORS.sage` | `#85B09C` | `#587A68` | 3.2:1 → 4.5:1 |
| `NAV_COLORS.activeBackground` | `#85B09C` | `#587A68` | Matched |
| `NAV_COLORS.inactiveHover` | `#9FC5B1` | `#6E9A82` | Proportional shift |
| `NAV_COLORS.activeHover` | `#6E9A82` | `#476B57` | Proportional shift |

---

## Component-Level Results

### Full axe Audit (0 violations)

Components tested with full `runAxe()` / `testAccessibility()`:

| Component           | axe Result | Keyboard Tests | ARIA Tests |
| ------------------- | ---------- | -------------- | ---------- |
| Header              | PASS       | 7 tests        | Yes        |
| Footer              | PASS       | 6 tests        | Yes        |
| MainLayout          | PASS       | 3 tests        | Yes        |
| SettingsButton      | PASS       | 7 tests        | Yes        |
| ThemeSwitcher       | PASS       | 2 tests        | Yes        |
| LanguageSwitcher    | PASS       | 3 tests        | Yes        |
| AnimationsSwitcher  | PASS       | 3 tests        | Yes        |
| ProjectGallery      | PASS       | 2 tests        | Yes        |
| ProjectLightbox     | —          | 11 tests       | Yes        |
| ProjectImage        | —          | —              | 2 tests    |
| ProjectSkeleton     | —          | —              | 16 tests   |
| ProjectsList        | —          | —              | 1 test     |
| LoadMoreButton      | —          | 1 test         | 7 tests    |
| VideoEmbed          | —          | 1 test         | 1 test     |
| HamburgerMenu       | —          | —              | 3 tests    |
| ErrorBoundary       | —          | —              | 3 tests    |
| FrenchTranslationAlert | —       | —              | 2 tests    |
| VisuallyHidden      | —          | —              | 1 test     |
| PageDeck            | —          | —              | 1 test     |

### Resume Components (attribute-level a11y checks)

| Component            | Semantic HTML | ARIA Attributes | Heading Hierarchy |
| -------------------- | ------------- | --------------- | ----------------- |
| WorkExperience       | PASS          | PASS            | PASS              |
| ClientList           | PASS          | PASS            | PASS              |
| ResumeHeader         | PASS          | PASS            | PASS              |
| ProfessionalSummary  | PASS          | PASS            | PASS              |
| ConferenceSpeaker    | PASS          | PASS            | PASS              |
| CoreCompetencies     | PASS          | PASS            | PASS              |

### Colophon Components (attribute-level a11y checks)

| Component              | Semantic HTML | ARIA Attributes |
| ---------------------- | ------------- | --------------- |
| TechnologiesShowcase   | PASS          | PASS            |
| DesignPhilosophy       | PASS          | PASS            |
| ButaStory              | PASS          | PASS            |

---

## WCAG 2.2 Level AA Criteria Coverage

### Perceivable

| Criterion | Name                | Test Method            | Status |
| --------- | ------------------- | ---------------------- | ------ |
| 1.1.1     | Non-text Content    | axe `image-alt`        | PASS   |
| 1.4.3     | Contrast (Minimum)  | axe `color-contrast`   | PASS   |
| 1.4.11    | Non-text Contrast   | axe `color-contrast`   | PASS   |

### Operable

| Criterion | Name             | Test Method                      | Status |
| --------- | ---------------- | -------------------------------- | ------ |
| 2.1.1     | Keyboard         | Unit keyboard tests + E2E tab order | PASS   |
| 2.1.2     | No Keyboard Trap | E2E tab cycle (no repeated elements) | PASS   |
| 2.4.1     | Bypass Blocks    | E2E skip link focus transfer     | PASS   |
| 2.4.3     | Focus Order      | E2E tab order verification       | PASS   |
| 2.4.7     | Focus Visible    | E2E visible focus indicator check | PASS   |
| 2.5.8     | Target Size      | axe `target-size`                | PASS   |

### Understandable

| Criterion | Name                   | Test Method        | Status |
| --------- | ---------------------- | ------------------ | ------ |
| 3.2.1     | On Focus               | Behavioral tests   | PASS   |
| 3.3.2     | Labels or Instructions | axe `label`        | PASS   |
| 3.3.4     | Error Prevention       | Form behavior tests| PASS   |

### Robust

| Criterion | Name             | Test Method                            | Status |
| --------- | ---------------- | -------------------------------------- | ------ |
| 4.1.2     | Name, Role, Value| axe `aria-*`, `link-name`, `button-name` | PASS |
| 4.1.3     | Status Messages  | `aria-live` region tests               | PASS   |

---

## Static Analysis (ESLint jsx-a11y)

**Result: 0 errors, 0 warnings**

The `eslint-plugin-jsx-a11y` plugin enforces accessibility rules at compile time, catching issues like:
- Missing `alt` attributes on images
- Invalid ARIA attributes and roles
- Missing form labels
- Non-interactive elements with click handlers missing keyboard support
- Heading hierarchy violations

---

## Code Coverage by Area

| Area                    | Statements | Branches | Functions | Lines   |
| ----------------------- | ---------- | -------- | --------- | ------- |
| **All files**           | 91.85%     | 83.96%   | 93.28%    | 92.38%  |
| components/common       | 93.32%     | 87.22%   | 95.23%    | 93.24%  |
| components/settings     | 100%       | 95.23%   | 100%      | 100%    |
| components/project      | 90.82%     | 84.11%   | 92.18%    | 92.42%  |
| components/resume       | 100%       | 91.42%   | 100%      | 100%    |
| hooks                   | 91.00%     | 83.00%   | 93.47%    | 90.62%  |
| utils                   | 93.50%     | 89.65%   | 100%      | 93.50%  |

All areas exceed the 80% coverage threshold.

---

## Accessibility Test Distribution

**93 unit-level + 21 E2E accessibility test cases (135 total with browser matrix):**

### Unit Tests (93 cases across 30 files)

| Category           | Files | Tests | What's Tested                            |
| ------------------ | ----- | ----- | ---------------------------------------- |
| Common components  | 8     | 24    | Skip links, landmarks, focus, ARIA       |
| Settings components| 4     | 15    | Keyboard nav, ARIA states, toggle a11y   |
| Project components | 8     | 40    | Lightbox a11y, live regions, image alt   |
| Resume components  | 6     | 6     | Semantic HTML, ARIA, heading hierarchy   |
| Colophon components| 3     | 3     | Section a11y, semantic structure         |
| Hooks              | 1     | 1     | Keyboard event handling                  |
| Utilities (helpers)| 1     | 4     | axe runner, focus check, name check      |

### E2E Tests (21 specs × 2 browsers = 42 runs)

| Category              | Specs | What's Tested                                    |
| --------------------- | ----- | ------------------------------------------------ |
| Per-page baseline     | 4     | Full axe scan on every page in default state     |
| Theme matrix          | 8     | All pages in dark and high-contrast themes       |
| Locale matrix         | 4     | All pages in French locale                       |
| Interactive states    | 3     | Lightbox, settings popover, mobile hamburger     |
| Keyboard navigation   | 2     | Skip link focus transfer, tab order with focus   |

---

## Findings & Recommendations

### Resolved Issues (5 defects fixed March 2026)

The E2E accessibility test suite discovered 5 real accessibility defects that unit tests could not catch (they require real browser rendering, portal behavior, or cross-browser keyboard handling). All were fixed before merge:

1. **Skip link focus transfer** — `#main-content` lacked `tabindex="-1"`, so programmatic focus via skip link was silently dropped by the browser
2. **CSS transition false positives** — axe-core computed contrast against mid-transition background colors during theme seeding, producing 32 false violations
3. **Lightbox dialog discoverability** — MUI v7 places `aria-label` on the Dialog root, but Playwright's `getByRole('dialog')` matches the Paper child; moved label to `slotProps.paper`
4. **Brand color contrast** — Sage green (`#85B09C`) only achieved 3.2:1 contrast with white text; darkened to `#587A68` for 4.5:1 AA compliance
5. **Settings popover landmark** — MUI Popover renders via Portal outside any ARIA landmark, failing axe's `region` rule; added `role="region"` to Paper slot

### Current Status: Zero Open Violations

After remediation, both unit and E2E test suites report **zero accessibility violations**. The codebase demonstrates strong accessibility practices including:

1. **Multi-layer axe testing** — Unit tests (vitest-axe) + E2E tests (@axe-core/playwright) for comprehensive coverage
2. **Keyboard operability** — Skip link, tab order, and visible focus verified in real browsers (Chromium + WebKit)
3. **ARIA correctness** — Proper `aria-expanded`, `aria-controls`, `aria-live`, `aria-label` usage verified at both DOM and rendered levels
4. **Cross-browser validation** — All axe scans run in both Chromium and WebKit, catching Safari-specific issues
5. **Theme/locale matrices** — Accessibility verified across all visual configurations (light, dark, high-contrast) and languages (English, French)

### Suggested Improvements (Non-blocking)

| Priority | Suggestion                                                      |
| -------- | --------------------------------------------------------------- |
| Low      | Add `testAccessibility()` axe audits to resume/colophon components (currently attribute-only checks) |
| Low      | Consider adding `prefers-contrast` media query support beyond the existing High Contrast theme |
| Low      | Add automated `tab-index` ordering validation for complex multi-step forms if added in future |
| Low      | Add Firefox to E2E browser matrix (currently Chromium + WebKit only) |

---

## Version History

| Date       | Auditor   | Result | Notes                              |
| ---------- | --------- | ------ | ---------------------------------- |
| 2026-02-06 | Automated | PASS   | Initial WCAG 2.2 Level AA audit    |
| 2026-03-03 | Automated | PASS   | Updated audit — 1,132 tests, 58 files, 93 a11y tests, 89.57% coverage |
| 2026-03-13 | Automated | PASS   | E2E accessibility suite added — 1,203 unit + 208 E2E tests, 42 a11y E2E runs, 5 defects found and fixed, 91.85% coverage |
