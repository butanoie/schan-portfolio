# Testing Roadmap: Integration & E2E Tests

Phased implementation plan for integration tests (Vitest) and E2E/UI tests (Playwright).

**Architecture reference:** [TESTING_ARCHITECTURE.md](../guides/TESTING_ARCHITECTURE.md)
**Test scenarios:** [test-scenarios/](../test-scenarios/) (Gherkin-syntax scenarios)

**Status:** Planning complete. Phase 5 (Playwright infrastructure) implementation in progress.

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
| 13 | CI Integration (future) | CI/CD | Low | 0 (infra) | — |

**Total estimated new tests: ~187**

---

## Phase 1: Integration — Localization Pipeline

**File:** `v2/src/__tests__/integration/localizationPipeline.test.ts`
**Scenarios:** [INT_LOCALIZATION_PIPELINE.md](../test-scenarios/INT_LOCALIZATION_PIPELINE.md)

**Goal:** Verify the JSON merge pipeline produces correct localized data for both locales end-to-end, using real data (no mocks).

### Checklist

- [ ] Create `localizationPipeline.test.ts`
- [ ] Implement `getLocalizedProjects` cross-locale tests
- [ ] Implement `getLocalizedProject` merge correctness tests
- [ ] Implement caption index tests
- [ ] Implement unknown locale fallback test (requires `vi.resetModules()`)
- [ ] Implement consistency tests (count, structure)
- [ ] Verify all tests pass: `npm test -- localizationPipeline`

---

## Phase 2: Integration — Server Data Fetching

**File:** `v2/src/__tests__/integration/serverDataFetching.test.ts`
**Scenarios:** [INT_SERVER_DATA_FETCHING.md](../test-scenarios/INT_SERVER_DATA_FETCHING.md)

**Goal:** Verify the `fetchProjects` server action traverses the full data stack correctly, simulating what `app/page.tsx` does at build time.

### Checklist

- [ ] Create `serverDataFetching.test.ts`
- [ ] Implement SSG simulation tests (page 1, DEFAULT_LOCALE)
- [ ] Implement locale variant tests (EN vs FR comparison)
- [ ] Implement combined filter + locale tests
- [ ] Implement pagination coverage test
- [ ] Verify all tests pass: `npm test -- serverDataFetching`

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

- [ ] Create `useProjectLoaderIntegration.test.tsx`
- [ ] Build `ControlledLocaleWrapper` test helper
- [ ] Implement EN → FR locale switch test
- [ ] Implement loadMore after locale switch
- [ ] Implement pagination reset test
- [ ] Implement concurrent locale switch test
- [ ] Implement allLoaded boundary test
- [ ] Verify all tests pass: `npm test -- useProjectLoaderIntegration`

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

- [ ] Create `asyncProjectsList.test.tsx`
- [ ] Set up mocks (navigation, image, useMediaQuery)
- [ ] Implement initial render test
- [ ] Implement context provision tests
- [ ] Implement locale-driven re-render test
- [ ] Implement error handling test
- [ ] Verify all tests pass: `npm test -- asyncProjectsList`

---

## Phase 5: E2E — Playwright Setup & Infrastructure

**Goal:** Install Playwright, create configuration, build full POM infrastructure. No test specs yet.

### Checklist

#### Dependencies & Config
- [ ] Install dependencies: `npm install --save-dev @playwright/test @axe-core/playwright`
- [ ] Install browsers: `npm run test:e2e:install` (runs `playwright install chromium webkit`)
- [ ] Create `v2/playwright.config.ts` (Chromium + WebKit, webServer on port 3000, `outputDir`, `reporter`, `baseURL`, `trace`)
- [ ] Create `v2/e2e/global-setup.ts` (validates `.next/BUILD_ID` exists — build check only, not browser check)
- [ ] Create `v2/tsconfig.e2e.json` (extends main tsconfig with `@playwright/test` types)

#### Type & Runner Isolation
- [ ] Add `"e2e"` to `v2/tsconfig.json` `exclude` array (prevents type conflicts between Vitest and Playwright globals)
- [ ] Add `'e2e'` to `v2/vitest.config.ts` `exclude` array (prevents Vitest from discovering `.spec.ts` files in `e2e/`)

#### Helpers
- [ ] Create `v2/e2e/helpers/axe.ts` (axe-core wrapper with WCAG 2.2 AA rules, excludes PostHog/Sentry iframes)
- [ ] Create `v2/e2e/helpers/storage.ts` (localStorage seed helpers: `seedTheme`, `seedLocale` via `page.addInitScript`)

#### Fixtures
- [ ] Create `v2/e2e/fixtures/base.fixture.ts` (page object fixtures with typed `AppFixtures`)
- [ ] Create `v2/e2e/fixtures/viewport.fixture.ts` (mobile 375x812, desktop 1280x800)

#### Component Objects (sub-POMs)
- [ ] Create `v2/e2e/components/Navigation.ts` (desktop nav + hamburger, context-aware `navigateTo()`, `openDrawer`/`closeDrawer`)
- [ ] Create `v2/e2e/components/SettingsPanel.ts` (gear button with hydration wait, popover, theme/language/animations controls, mobile context note)
- [ ] Create `v2/e2e/components/ProjectLightbox.ts` (dialog, keyboard/button/swipe navigation, live region, counter, `waitForOpen`/`waitForClose`)

#### Page Objects (full POMs, not stubs)
- [ ] Create `v2/e2e/pages/BasePage.ts` (abstract base: skip link, main content, settings + navigation sub-POMs, `activateSkipLink()`)
- [ ] Create `v2/e2e/pages/HomePage.ts` (project sections, gallery images, load more, lightbox sub-POM, `openLightboxForImage()`)
- [ ] Create `v2/e2e/pages/ResumePage.ts` (7 sections via `aria-labelledby` IDs, contact buttons, PDF download link)
- [ ] Create `v2/e2e/pages/ColophonPage.ts` (technologies/design/buta sections, V1 accordion expand/collapse)
- [ ] Create `v2/e2e/pages/SamplesPage.ts` (5 artifact sections via `aria-label`, download buttons, `allArtifactSections()`)

#### Integration
- [ ] Add npm scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:debug`, `test:e2e:report`, `test:e2e:install`
- [ ] Add `e2e/reports/` and `e2e/test-results/` to `.gitignore`
- [ ] Verify `npm run build && npm run test:e2e` runs without errors (zero tests, no failures)

---

## Phase 6: E2E — Accessibility (Highest Priority)

**File:** `v2/e2e/specs/accessibility.spec.ts`
**Scenarios:** [E2E_ACCESSIBILITY.md](../test-scenarios/E2E_ACCESSIBILITY.md)

**Goal:** Full-page axe scans across all routes, themes, locales, and interactive states. This is the **top priority** E2E phase per requirements.

### Checklist

- [ ] Create `accessibility.spec.ts`
- [ ] Implement baseline axe scans (4 pages, light theme, English)
- [ ] Implement theme matrix scans (4 pages x 2 additional themes)
- [ ] Implement locale matrix scans (4 pages in French)
- [ ] Implement interactive state scans (lightbox, settings popover, hamburger)
- [ ] Implement skip link test
- [ ] Implement keyboard navigation test
- [ ] Verify all pass on Chromium and WebKit

---

## Phase 7: E2E — Navigation & Smoke Tests

**File:** `v2/e2e/specs/navigation.spec.ts`
**Scenarios:** [E2E_NAVIGATION.md](../test-scenarios/E2E_NAVIGATION.md)

**Goal:** Verify all routes load, navigation works correctly, and `aria-current` updates.

### Checklist

- [ ] Create `navigation.spec.ts`
- [ ] Implement route loading tests (all 4 pages)
- [ ] Implement `aria-current` tests
- [ ] Implement preference persistence across navigation
- [ ] Implement direct URL access tests
- [ ] Implement footer nav link tests

---

## Phase 8: E2E — Settings (Theme / Language / Animations)

**File:** `v2/e2e/specs/settings.spec.ts`
**Scenarios:** [E2E_SETTINGS.md](../test-scenarios/E2E_SETTINGS.md)

**Goal:** Verify all three settings controls work correctly and persist across navigation.

### Checklist

- [ ] Create `settings.spec.ts`
- [ ] Implement theme switching tests (3 themes)
- [ ] Implement theme persistence tests (reload + navigation)
- [ ] Implement language switching tests (UI text, projects, disclaimer)
- [ ] Implement language persistence tests
- [ ] Implement animations toggle tests
- [ ] Implement popover open/close tests
- [ ] Implement mobile settings tests (settings controls inline within drawer, no popover)

---

## Phase 9: E2E — Home Page & Progressive Loading

**File:** `v2/e2e/specs/home.spec.ts`
**Scenarios:** [E2E_HOME_PAGE.md](../test-scenarios/E2E_HOME_PAGE.md)

**Goal:** Verify the progressive loading flow, skeleton display, and project rendering on the home page.

### Checklist

- [ ] Create `home.spec.ts`
- [ ] Implement initial load tests (5 projects, Load More visible)
- [ ] Implement Load More tests (skeleton → 10 projects)
- [ ] Implement all-loaded completion state test
- [ ] Implement project structure tests
- [ ] Implement video embed test
- [ ] Implement French Load More test

---

## Phase 10: E2E — Project Lightbox

**File:** `v2/e2e/specs/lightbox.spec.ts`
**Scenarios:** [E2E_LIGHTBOX.md](../test-scenarios/E2E_LIGHTBOX.md)

**Goal:** Test all lightbox interaction modes — keyboard, button, touch, and accessibility.

### Checklist

- [ ] Create `lightbox.spec.ts`
- [ ] Implement open/close tests (button, Escape)
- [ ] Implement keyboard navigation tests (ArrowRight, ArrowLeft, wrap)
- [ ] Implement button navigation tests
- [ ] Implement touch gesture tests (with WebKit skip annotation if needed)
- [ ] Implement ARIA live region assertions
- [ ] Implement single-image edge case

---

## Phase 11: E2E — Resume, Colophon, Samples Pages

**Files:** `v2/e2e/specs/resume.spec.ts`, `v2/e2e/specs/colophon.spec.ts`, `v2/e2e/specs/samples.spec.ts`
**Scenarios:** [E2E_CONTENT_PAGES.md](../test-scenarios/E2E_CONTENT_PAGES.md)

**Goal:** Content verification and interaction tests for each content page. Full POMs are already built in Phase 5 — this phase writes the specs.

### Checklist

- [ ] Create `resume.spec.ts`
  - [ ] Section presence tests (all 7 sections via `aria-labelledby`)
  - [ ] Contact button tests (LinkedIn, GitHub, email, phone links)
  - [ ] PDF download link test (`aria-label` containing "opens in new tab")
  - [ ] French locale content test
- [ ] Create `colophon.spec.ts`
  - [ ] Section presence tests (technologies, design philosophy, buta story)
  - [ ] V1 accordion expand/collapse test
  - [ ] Technology card external link tests
  - [ ] French locale content test
- [ ] Create `samples.spec.ts`
  - [ ] All 5 artifact sections present
  - [ ] Download button tests (PDF and Markdown formats)
  - [ ] Artifact without download button (Cost Savings Roadmap) renders correctly
  - [ ] French locale content test

---

## Phase 12: E2E — Responsive Layouts

**File:** `v2/e2e/specs/responsive.spec.ts`
**Scenarios:** [E2E_RESPONSIVE.md](../test-scenarios/E2E_RESPONSIVE.md)

**Goal:** Verify mobile vs desktop layout differences at the 600px MUI `sm` breakpoint.

### Checklist

- [ ] Create `responsive.spec.ts`
- [ ] Implement mobile hamburger visibility tests
- [ ] Implement hamburger drawer interaction tests (open/close, `aria-expanded` state)
- [ ] Implement drawer navigation tests (nav links + inline settings controls)
- [ ] Implement desktop nav visibility tests
- [ ] Implement footer responsive tests

---

## Phase 13: CI Integration (Future)

**Goal:** Add Playwright E2E tests to the GitHub Actions CI pipeline.

### Checklist

- [ ] Add `test:e2e` step to `test-deploy-dev.yml` (after unit tests, before deploy)
- [ ] Add `npm run build` step before E2E tests
- [ ] Cache Playwright browsers with `actions/cache` keyed on `npx playwright --version`
- [ ] Upload `e2e/reports/html` as GitHub Actions artifact on failure
- [ ] Upload `e2e/test-results/` (screenshots, traces) as artifact on failure
- [ ] Verify CI pipeline passes end-to-end

---

## Cleanup Tasks (Pre-requisites)

These should be addressed before or during Phase 1:

- [ ] Delete duplicate `v2/src/__tests__/hooks/useProjectLoader.test.ts` (keep the `.tsx` version)
- [ ] Extend `v2/src/__tests__/integration/dataLayer.test.ts` with locale consistency `describe` block

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
