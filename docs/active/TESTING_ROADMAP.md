# Testing Roadmap: Integration & E2E Tests

Phased implementation plan for integration tests (Vitest) and E2E/UI tests (Playwright).

**Architecture reference:** [TESTING_ARCHITECTURE.md](../guides/TESTING_ARCHITECTURE.md)
**Test scenarios:** [test-scenarios/](../test-scenarios/) (Gherkin-syntax scenarios)

**Status:** Phases 5–12 complete. All E2E spec phases done. Next: Phase 13 (CI Integration).

---

## Phase Overview

| Phase | Scope | Type | Priority | Est. Tests | Scenarios |
|-------|-------|------|----------|-----------|-----------|
| 1 | Integration: Localization Pipeline | Vitest | High | ~20 | [INT_LOCALIZATION_PIPELINE](../test-scenarios/INT_LOCALIZATION_PIPELINE.md) |
| 2 | Integration: Server Data Fetching | Vitest | High | ~15 | [INT_SERVER_DATA_FETCHING](../test-scenarios/INT_SERVER_DATA_FETCHING.md) |
| 3 | Integration: useProjectLoader Lifecycle | Vitest | High | ~18 | [INT_USE_PROJECT_LOADER](../test-scenarios/INT_USE_PROJECT_LOADER.md) |
| 4 | Integration: AsyncProjectsList Rendering | Vitest | Medium | ~12 | [INT_ASYNC_PROJECTS_LIST](../test-scenarios/INT_ASYNC_PROJECTS_LIST.md) |
| 5 | E2E: Playwright Setup & Infrastructure (full POMs) | Playwright | High | 0 (infra) | — |
| 6 | E2E: Accessibility (all pages) | Playwright | **Highest** | ~30 | [E2E_ACCESSIBILITY](../test-scenarios/E2E_ACCESSIBILITY.md) |
| 7 | E2E: Navigation & Smoke Tests | Playwright | High | ~15 | [E2E_NAVIGATION](../test-scenarios/E2E_NAVIGATION.md) |
| 8 | E2E: Settings (Theme/Language/Animations) | Playwright | High | ~20 | [E2E_SETTINGS](../test-scenarios/E2E_SETTINGS.md) |
| 9 | E2E: Home Page & Progressive Loading | Playwright | Medium | ~12 | [E2E_HOME_PAGE](../test-scenarios/E2E_HOME_PAGE.md) |
| 10 | E2E: Project Lightbox | Playwright | Medium | ~18 | [E2E_LIGHTBOX](../test-scenarios/E2E_LIGHTBOX.md) |
| 11 | E2E: Resume, Colophon, Samples Pages | Playwright | Medium | ~15 | [E2E_CONTENT_PAGES](../test-scenarios/E2E_CONTENT_PAGES.md) |
| 12 | E2E: Responsive Layouts | Playwright | Medium | ~12 | [E2E_RESPONSIVE](../test-scenarios/E2E_RESPONSIVE.md) |
| 13 | CI Integration | CI/CD | Low | 0 (infra) | — |

**Total estimated new tests: ~187**

---

## Phase 1: Integration — Localization Pipeline

**File:** `v2/src/__tests__/integration/localizationPipeline.test.ts`
**Scenarios:** [INT_LOCALIZATION_PIPELINE.md](../test-scenarios/INT_LOCALIZATION_PIPELINE.md)

**Goal:** Verify the JSON merge pipeline produces correct localized data for both locales end-to-end, using real data (no mocks).

### Checklist

- [x] Create `localizationPipeline.test.ts`
- [x] Implement `getLocalizedProjects` cross-locale tests
- [x] Implement `getLocalizedProject` merge correctness tests
- [x] Implement caption index tests
- [x] Implement unknown locale fallback test (requires `vi.resetModules()`)
- [x] Implement consistency tests (count, structure)
- [x] Verify all tests pass: `npm test -- localizationPipeline` (16 tests)

---

## Phase 2: Integration — Server Data Fetching

**File:** `v2/src/__tests__/integration/serverDataFetching.test.ts`
**Scenarios:** [INT_SERVER_DATA_FETCHING.md](../test-scenarios/INT_SERVER_DATA_FETCHING.md)

**Goal:** Verify the `fetchProjects` server action traverses the full data stack correctly, simulating what `app/page.tsx` does at build time.

### Checklist

- [x] Create `serverDataFetching.test.ts`
- [x] Implement SSG simulation tests (page 1, DEFAULT_LOCALE)
- [x] Implement locale variant tests (EN vs FR comparison)
- [x] Implement combined filter + locale tests
- [x] Implement pagination coverage test
- [x] Verify all tests pass: `npm test -- serverDataFetching` (7 tests)

---

## Phase 3: Integration — useProjectLoader Lifecycle

**File:** `v2/src/__tests__/integration/useProjectLoaderIntegration.test.tsx`
**Scenarios:** [INT_USE_PROJECT_LOADER.md](../test-scenarios/INT_USE_PROJECT_LOADER.md)

**Goal:** Test the complete hook lifecycle with real locale switching — the **highest-value gap** in the current test suite. The existing unit tests never trigger the locale-switch `useEffect`.

### Technical Notes

- Requires a `ControlledLocaleWrapper` component that allows changing locale mid-test via `rerender`
- The locale-switch `useEffect` uses a local `let cancelled` variable (not a `useRef`) scoped to the effect callback. This cancels only locale-switch re-fetches, **not** in-flight `loadMore` calls. The "concurrent locale switch" scenario should test and document the actual behavior, which may include a race condition.
- `SIMULATED_LOAD_DELAY` is already 0 in test environment
- `useProjectLoader` defaults `pageSize` to 5, while `getProjects` defaults `DEFAULT_PAGE_SIZE` to 6. Tests should use explicit `pageSize: 5` to match the home page behavior.

### Checklist

- [x] Create `useProjectLoaderIntegration.test.tsx`
- [x] Build `ControlledLocaleWrapper` test helper
- [x] Implement EN → FR locale switch test
- [x] Implement loadMore after locale switch
- [x] Implement pagination reset test
- [x] Implement concurrent locale switch test
- [x] Implement allLoaded boundary test
- [x] Verify all tests pass: `npm test -- useProjectLoaderIntegration` (18 tests)

---

## Phase 4: Integration — AsyncProjectsList Rendering

**File:** `v2/src/__tests__/integration/asyncProjectsList.test.tsx`
**Scenarios:** [INT_ASYNC_PROJECTS_LIST.md](../test-scenarios/INT_ASYNC_PROJECTS_LIST.md)

**Goal:** Component-level integration testing `AsyncProjectsList` with real hook + real data in DOM.

### Mocks Required

- `next/navigation`: `usePathname → '/'`
- `next/image`: plain `<img>` passthrough
- `@mui/material useMediaQuery`: `() => false`

### Checklist

- [x] Create `asyncProjectsList.test.tsx`
- [x] Set up mocks (navigation, image, useMediaQuery)
- [x] Implement initial render test
- [x] Implement context provision tests
- [x] Implement locale-driven re-render test
- [x] Implement error handling test
- [x] Verify all tests pass: `npm test -- asyncProjectsList` (10 tests)

---

## Phase 5: E2E — Playwright Setup & Infrastructure

**Goal:** Install Playwright, create configuration, build full POM infrastructure. No test specs yet.

### Checklist

#### Dependencies & Config
- [x] Install dependencies: `npm install --save-dev @playwright/test @axe-core/playwright`
- [x] Install browsers: `npm run test:e2e:install` (runs `playwright install chromium webkit`)
- [x] Create `v2/playwright.config.ts` (Chromium + WebKit, webServer on port 3000, `outputDir`, `reporter`, `baseURL`, `trace`)
- [x] Create `v2/e2e/global-setup.ts` (validates `.next/BUILD_ID` exists — build check only, not browser check)
- [x] Create `v2/tsconfig.e2e.json` (extends main tsconfig with `@playwright/test` and `node` types)

#### Type & Runner Isolation
- [x] Add `"e2e"` to `v2/tsconfig.json` `exclude` array (prevents type conflicts between Vitest and Playwright globals)
- [x] Add `'e2e'` to `v2/vitest.config.ts` `exclude` array (prevents Vitest from discovering `.spec.ts` files in `e2e/`)

#### Helpers
- [x] Create `v2/e2e/helpers/axe.ts` (axe-core wrapper with WCAG 2.2 AA rules, excludes PostHog/Sentry iframes)
- [x] Create `v2/e2e/helpers/storage.ts` (localStorage seed helpers: `seedTheme`, `seedLocale` via `page.addInitScript`)

#### Fixtures
- [x] Create `v2/e2e/fixtures/base.fixture.ts` (page object fixtures with typed `AppFixtures`)
- [x] Create `v2/e2e/fixtures/viewport.fixture.ts` (mobile 375x812, desktop 1280x800)

#### Component Objects (sub-POMs)
- [x] Create `v2/e2e/components/Navigation.ts` (desktop nav + hamburger, context-aware `navigateTo()`, `openDrawer`/`closeDrawer`)
- [x] Create `v2/e2e/components/SettingsPanel.ts` (gear button with hydration wait, popover, theme/language/animations controls, mobile context note)
- [x] Create `v2/e2e/components/ProjectLightbox.ts` (dialog, keyboard/button/swipe navigation, live region, counter, `waitForOpen`/`waitForClose`)

#### Page Objects (full POMs, not stubs)
- [x] Create `v2/e2e/pages/BasePage.ts` (abstract base: skip link, main content, settings + navigation sub-POMs, `activateSkipLink()`)
- [x] Create `v2/e2e/pages/HomePage.ts` (project sections, gallery images, load more, lightbox sub-POM, `openLightboxForImage()`)
- [x] Create `v2/e2e/pages/ResumePage.ts` (7 sections via `aria-labelledby` IDs, contact buttons, PDF download link)
- [x] Create `v2/e2e/pages/ColophonPage.ts` (technologies/design/buta sections, V1 accordion expand/collapse)
- [x] Create `v2/e2e/pages/SamplesPage.ts` (5 artifact sections via `aria-label`, download buttons, `allArtifactSections()`)

#### Integration
- [x] Add npm scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:debug`, `test:e2e:report`, `test:e2e:install`
- [x] Add `e2e/reports/` and `e2e/test-results/` to `.gitignore`
- [x] Verify `npm run build && npm run test:e2e` runs without errors (smoke test passes on Chromium + WebKit)

---

## Phase 6: E2E — Accessibility (Highest Priority)

**File:** `v2/e2e/specs/accessibility.spec.ts`
**Scenarios:** [E2E_ACCESSIBILITY.md](../test-scenarios/E2E_ACCESSIBILITY.md)

**Goal:** Full-page axe scans across all routes, themes, locales, and interactive states. This is the **top priority** E2E phase per requirements.

### Checklist

- [x] Create `accessibility.spec.ts`
- [x] Implement baseline axe scans (4 pages, light theme, English)
- [x] Implement theme matrix scans (4 pages x 2 additional themes)
- [x] Implement locale matrix scans (4 pages in French)
- [x] Implement interactive state scans (lightbox, settings popover, hamburger)
- [x] Implement skip link test
- [x] Implement keyboard navigation test
- [x] Verify all pass on Chromium and WebKit

---

## Phase 7: E2E — Navigation & Smoke Tests

**File:** `v2/e2e/specs/navigation.spec.ts`
**Scenarios:** [E2E_NAVIGATION.md](../test-scenarios/E2E_NAVIGATION.md)

**Goal:** Verify all routes load, navigation works correctly, and `aria-current` updates.

### Checklist

- [x] Create `navigation.spec.ts`
- [x] Implement route loading tests (all 4 pages)
- [x] Implement `aria-current` tests
- [x] Implement preference persistence across navigation
- [x] Implement direct URL access tests
- [x] Implement footer nav link tests

---

## Phase 8: E2E — Settings (Theme / Language / Animations)

**File:** `v2/e2e/specs/settings.spec.ts`
**Scenarios:** [E2E_SETTINGS.md](../test-scenarios/E2E_SETTINGS.md)

**Goal:** Verify all three settings controls work correctly and persist across navigation.

### Checklist

- [x] Create `settings.spec.ts`
- [x] Implement theme switching tests (3 themes)
- [x] Implement theme persistence tests (reload + navigation)
- [x] Implement language switching tests (UI text, projects, disclaimer)
- [x] Implement language persistence tests
- [x] Implement animations toggle tests
- [x] Implement popover open/close tests
- [x] Implement mobile settings tests (settings controls inline within drawer, no popover)

---

## Phase 9: E2E — Home Page & Progressive Loading

**File:** `v2/e2e/specs/home.spec.ts`
**Scenarios:** [E2E_HOME_PAGE.md](../test-scenarios/E2E_HOME_PAGE.md)

**Goal:** Verify the progressive loading flow, skeleton display, and project rendering on the home page.

### Checklist

- [x] Create `home.spec.ts`
- [x] Implement initial load tests (5 projects, Load More visible)
- [x] Implement Load More tests (skeleton → 10 projects)
- [x] Implement all-loaded completion state test
- [x] Implement project structure tests
- [x] Implement video embed test
- [x] Implement French Load More test

---

## Phase 10: E2E — Project Lightbox

**File:** `v2/e2e/specs/lightbox.spec.ts`
**Scenarios:** [E2E_LIGHTBOX.md](../test-scenarios/E2E_LIGHTBOX.md)

**Goal:** Test all lightbox interaction modes — keyboard, button, touch, and accessibility.

### Checklist

- [x] Create `lightbox.spec.ts`
- [x] Implement open/close tests (button, Escape, focus return)
- [x] Implement keyboard navigation tests (ArrowRight, ArrowLeft, wrap)
- [x] Implement button navigation tests
- [x] Implement touch gesture tests
- [x] Implement ARIA live region assertions

---

## Phase 11: E2E — Resume, Colophon, Samples Pages

**Files:** `v2/e2e/specs/resume.spec.ts`, `v2/e2e/specs/colophon.spec.ts`, `v2/e2e/specs/samples.spec.ts`
**Scenarios:** [E2E_CONTENT_PAGES.md](../test-scenarios/E2E_CONTENT_PAGES.md)

**Goal:** Content verification and interaction tests for each content page. Full POMs are already built in Phase 5 — this phase writes the specs.

### Checklist

- [x] Create `resume.spec.ts`
  - [x] Section presence tests (all 7 sections via `aria-labelledby`)
  - [x] Contact button tests (LinkedIn, GitHub, email, phone links)
  - [x] PDF download link test (`aria-label` containing "opens in new tab")
  - [x] French locale content test
- [x] Create `colophon.spec.ts`
  - [x] Section presence tests (technologies, design philosophy, buta story)
  - [x] V1 accordion expand/collapse test
  - [x] Technology card external link tests
  - [x] French locale content test
- [x] Create `samples.spec.ts`
  - [x] All 5 artifact sections present
  - [x] Download button tests (PDF and Markdown formats)
  - [x] Artifact without download button (Cost Savings Roadmap) renders correctly
  - [x] French locale content test

---

## Phase 12: E2E — Responsive Layouts

**File:** `v2/e2e/specs/responsive.spec.ts`
**Scenarios:** [E2E_RESPONSIVE.md](../test-scenarios/E2E_RESPONSIVE.md)

**Goal:** Verify mobile vs desktop layout differences at the 600px MUI `sm` breakpoint.

### Checklist

- [x] Create `responsive.spec.ts`
- [x] Implement mobile hamburger visibility tests (hamburger visible, desktop nav links absent)
- [x] Implement hamburger drawer interaction tests (nav links + inline settings controls visible)
- [x] Implement drawer navigation tests (Resume link closes drawer, loads page)
- [x] Implement desktop nav visibility tests (nav visible, hamburger absent, gear button visible)
- [x] Implement footer responsive tests (hidden on mobile, visible on desktop)

---

## Phase 13: CI Integration

**Goal:** Add Playwright E2E tests to the GitHub Actions CI pipeline.
**Issue:** [#140](https://github.com/butanoie/schan-portfolio/issues/140)

### Architecture

- Separate `e2e` job in `test-deploy-dev.yml` (runs after `tests`, parallel with `deploy`)
- Single job with sequential browser steps: Chromium (blocking) → WebKit (soft-fail via `continue-on-error`)
- E2E does not gate deployment; only the `gate` job requires it for merge
- Playwright browsers cached with `actions/cache` keyed on version
- Artifacts (HTML report, screenshots, traces) uploaded on failure only

### Checklist

- [ ] Add `e2e` job to `test-deploy-dev.yml` with build + Chromium + WebKit steps
- [ ] Cache Playwright browsers with `actions/cache` keyed on `playwright-{os}-{version}`
- [ ] Upload `e2e/reports/html` and `e2e/test-results/` as artifacts on failure
- [ ] Update `gate` job to check `e2e` result
- [ ] Rename workflow to "Test and Deploy"
- [ ] Verify CI pipeline passes end-to-end

---

## Cleanup Tasks (Pre-requisites)

These should be addressed before or during Phase 1:

- [x] Delete duplicate `v2/src/__tests__/hooks/useProjectLoader.test.ts` (keep the `.tsx` version)
- [x] Extend `v2/src/__tests__/integration/dataLayer.test.ts` with locale consistency `describe` block

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Integration test coverage | Localization pipeline, server fetching, hook lifecycle, and component rendering all tested |
| E2E page coverage | All 4 routes have dedicated spec files |
| Accessibility coverage | axe scans pass on all pages across themes (light, dark, highContrast), locales (EN, FR), and interactive states |
| Browser coverage | All E2E tests pass on Chromium and WebKit |
| Responsive coverage | Mobile and desktop layouts verified |
| Existing tests | All 1,199 existing tests continue to pass |
| Coverage thresholds | 80% lines/functions/branches/statements maintained |
