# Testing Architecture: Integration & E2E Tests

This document defines the technical architecture for integration tests (Vitest) and end-to-end UI tests (Playwright) for the v2 portfolio application.

## Overview

| Layer             | Tool         | Scope                                                   | Runs Against                    |
| ----------------- | ------------ | ------------------------------------------------------- | ------------------------------- |
| Unit tests        | Vitest + RTL | Individual functions, components, hooks                 | jsdom (existing, 1,199 tests)   |
| Integration tests | Vitest + RTL | Multi-module workflows, data pipelines, hook lifecycles | jsdom (new)                     |
| E2E / UI tests    | Playwright   | Full browser, real pages, user journeys                 | `next start` (production build) |

### Guiding Principles

1. **Accessibility first** — axe scans on every page, theme, and locale combination
2. **Semantic selectors only** — `getByRole`, `getByLabel`, ARIA attributes; no `data-testid`
3. **Real data in integration tests** — no mocking of the data/localization layer
4. **Gherkin-syntax scenarios** — Given/When/Then in test descriptions for readability, without a BDD framework
5. **Production-faithful E2E** — tests run against `next start` (optimized, SSG'd pages)

---

## Part 1: Integration Tests (Vitest)

### What Qualifies as Integration vs Unit

| Test                                                                                | Classification  | Reason                                                   |
| ----------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------- |
| `getProjects({ tags, search, page })` in isolation                                  | Unit (exists)   | Single function, single module                           |
| `fetchProjects` through `projectDataServer` → `projectData` → `localization` → JSON | **Integration** | Crosses 3 module boundaries including dynamic `import()` |
| `getProjects('fr')` returning French titles with real JSON merge                    | **Integration** | Tests the full localization pipeline end-to-end          |
| `useProjectLoader` with locale switch from `'en'` to `'fr'`                         | **Integration** | Hook + localization layer + context interacting together |
| `AsyncProjectsList` rendering initial batch + loadMore + skeletons                  | **Integration** | Component + hook + data layer + context in DOM           |

### New Test Files

All new files live under `v2/src/__tests__/integration/`:

```
v2/src/__tests__/integration/
├── dataLayer.test.ts                    # Existing — extend with locale consistency tests
├── localizationPipeline.test.ts         # NEW — JSON merge pipeline end-to-end
├── serverDataFetching.test.ts           # NEW — fetchProjects server action path
├── useProjectLoaderIntegration.test.tsx # NEW — hook lifecycle with locale switching
└── asyncProjectsList.test.tsx           # NEW — component rendering with real data
```

### Mocking Strategy

**Test real (never mock):**

- `PROJECTS` data constant
- `localization.ts` and its JSON imports — the core under test
- `getProjects` / `getProjectById` / `fetchProjects`
- `LocaleProvider` / `useLocale` — provides actual locale context
- Locale JSON files (`src/locales/{en,fr}/projects.json`)

**Mock at framework boundaries:**

- `next/navigation` (`usePathname`, `useRouter`) — jsdom cannot satisfy Next.js router
- `next/image` → plain `<img>` (established codebase pattern)
- `@mui/material useMediaQuery` → `() => false` (established pattern)
- `ProjectLoadingStateBridgeContext` → null bridge or `vi.fn()` spy

**Never directly mutate or spy on:**

- The `localeCache` Map in `localization.ts` — test through observable outputs only. Do not use `vi.spyOn` or direct property access on the cache.
- `SIMULATED_LOAD_DELAY` — already 0 when `NODE_ENV === 'test'` (computed from `LOADING_DELAY` constant in `constants/app.ts`)

### Cache Isolation

The `localeCache` Map in `localization.ts` is module-level and persists across tests in the same Vitest worker. Tests must tolerate cached state. For the "unknown locale fallback" test case, use `vi.resetModules()` followed by a **dynamic import** to get a fresh module instance. The top-level static import still holds the old module reference, so the test must use the dynamically imported function:

```typescript
describe("unknown locale fallback", () => {
  let getLocalizedProjects: typeof import("@/src/data/localization").getLocalizedProjects;

  beforeAll(async () => {
    vi.resetModules();
    const mod = await import("@/src/data/localization");
    getLocalizedProjects = mod.getLocalizedProjects;
  });

  it("should fall back to base data for unsupported locale", async () => {
    const projects = await getLocalizedProjects("de" as Locale);
    // Assert empty translatable fields (base PROJECTS data)
  });
});
```

### Key Technical Notes

- **`'use server'` is inert under Vitest** — the directive in `projectDataServer.ts` is a string literal. Import `fetchProjects` directly as a regular async function.
- **Skeleton visibility** — the hook sets `SIMULATED_LOAD_DELAY = 0` in test env. Skeletons still render during the synchronous React update cycle. Use `waitFor` for settled state.
- **`ProjectLoadingStateBridgeContext`** — `AsyncProjectsList` guards with `if (bridge)`, so a missing provider (null context) is safe without mocking.
- **Controlled locale wrapper** — to test locale switching in hooks, use a wrapper component whose locale is driven by external state, not the static `initialLocale` prop.
- **Page size discrepancy** — `DEFAULT_PAGE_SIZE` in `projectData.ts` is 6, while `useProjectLoader` defaults `pageSize` to 5. The home page uses `useProjectLoader`'s default (5). Integration tests should use explicit `pageSize: 5` to match production behavior; tests calling `getProjects` directly without a `pageSize` will get 6 items.

---

## Part 2: E2E / UI Tests (Playwright)

### Architecture: Full POM (Page Object Model)

The portfolio has 4 pages but each is feature-rich (lightbox, progressive loading, i18n, theme switching, responsive layouts). Without page objects, every test file would duplicate `openSettingsPopover()`, `switchLanguage()`, `switchTheme()`, etc.

Page objects hold **locators and actions only** — never assertions. Tests own assertions.

### Directory Layout

```
v2/
├── playwright.config.ts              # Playwright configuration (project root)
└── e2e/
    ├── global-setup.ts               # Build validation before test run
    ├── fixtures/
    │   ├── base.fixture.ts           # Extended test with page object fixtures
    │   └── viewport.fixture.ts       # Mobile/desktop viewport presets
    ├── pages/                        # Page Object Models
    │   ├── BasePage.ts               # Shared shell: header, footer, settings, skip link
    │   ├── HomePage.ts               # / — project list, load more, lightbox
    │   ├── ResumePage.ts             # /resume — content sections
    │   ├── ColophonPage.ts           # /colophon — static content
    │   └── SamplesPage.ts            # /samples — artifact sections
    ├── components/                   # Reusable component objects (sub-POMs)
    │   ├── SettingsPanel.ts          # Settings gear + popover interactions
    │   ├── ProjectLightbox.ts        # Lightbox open/navigate/close
    │   └── Navigation.ts            # Header nav links, hamburger menu
    ├── helpers/
    │   ├── axe.ts                    # @axe-core/playwright wrapper
    │   └── storage.ts               # localStorage seed/clear helpers
    └── specs/                        # Test files — one per feature area
        ├── accessibility.spec.ts     # Full-page axe scans, all themes, both locales
        ├── navigation.spec.ts        # Cross-page nav, aria-current, skip link
        ├── settings.spec.ts          # Theme/language/animations switching
        ├── home.spec.ts              # Progressive loading, load more
        ├── lightbox.spec.ts          # Keyboard/touch/button navigation
        ├── resume.spec.ts            # Resume page content and a11y
        ├── colophon.spec.ts          # Colophon page content and a11y
        ├── samples.spec.ts           # Samples page content and a11y
        └── responsive.spec.ts        # Mobile hamburger, viewport layouts
```

### Playwright Configuration

```typescript
// v2/playwright.config.ts — placed at project root (standard Playwright convention)
{
  testDir: './e2e/specs',
  fullyParallel: true,           // Static site, no shared mutation
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  outputDir: './e2e/test-results',
  reporter: [['html', { outputFolder: 'e2e/reports/html' }], ['list']],

  use: {
    baseURL: 'http://localhost:3000',   // All page.goto() calls use relative paths
    trace: 'on-first-retry',           // Capture traces only on failure retry
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run start',    // NOT build — build is a prerequisite
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },

  globalSetup: './e2e/global-setup.ts',  // Validates .next/BUILD_ID exists (relative to config at v2/)
}
```

### Global Setup

`global-setup.ts` validates that `.next/BUILD_ID` exists before the test server starts. Without this, failures manifest as "could not connect to server" instead of the actionable "run `npm run build` first".

Browser installation is handled separately via `npx playwright install chromium webkit` (see [Setup](#setup) below). If browsers are not installed, Playwright surfaces its own clear error message — `global-setup.ts` does not duplicate that check.

### TypeScript Configuration

A separate `tsconfig.e2e.json` extends the main config to avoid polluting it with Playwright types:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["@playwright/test", "node"],
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["e2e/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Note:** `"node"` is required in `types` because `global-setup.ts` imports `fs` and `path`. The explicit `"exclude": ["node_modules"]` overrides the parent's `"exclude"` which includes `"e2e"` — without this, the child tsconfig would inherit the parent's exclusion and find no input files.

**Isolation requirement:** The main `tsconfig.json` must add `"e2e"` to its `"exclude"` array. Without this, `tsc --noEmit` will fail with conflicts between `vitest/globals` and `@playwright/test` type declarations (both define `test`, `expect`, and `describe` in the global scope). Similarly, `vitest.config.ts` must add `'e2e'` to its `exclude` array to prevent Vitest from discovering `.spec.ts` files in the `e2e/specs/` directory.

### Page Object Model Design

#### BasePage (abstract)

All page objects extend `BasePage`, which encapsulates the persistent shell:

- `skipLink` → `getByRole('link', { name: /skip to main/i })`
- `mainContent` → `locator('#main-content')`
- `settings` → `SettingsPanel` sub-POM instance
- `navigation` → `Navigation` sub-POM instance
- `goto(path)` → navigates and waits for `domcontentloaded`
- `activateSkipLink()` → Tab + Enter to exercise the skip link

#### SettingsPanel (sub-POM)

The most critical sub-POM — exercised on every page:

- `gearButton` → `getByRole('button', { name: /open settings/i })`
- `popover` → `locator('#settings-popover')`
- `open()` / `close()` — gear button + popover visibility
- `switchTheme(mode: 'light' | 'dark' | 'highContrast')`
- `switchLanguage(locale: 'en' | 'fr')`
- `toggleAnimations()`

Waits for `gearButton` to be visible before clicking (handles `next/dynamic` hydration delay). `SettingsButton` uses `next/dynamic` with `ssr: false`, so the gear button is absent from the initial HTML and appears only after React hydration. `open()` must wait with an extended timeout: `await this.gearButton.waitFor({ state: 'visible', timeout: 10_000 })`.

**Note:** The settings panel uses MUI `Popover` (not `Dialog`), so it does not have `role="dialog"`. Locate it through its trigger button (`getByRole('button', { name: /open settings/i })`) and its child controls (theme toggle buttons, language toggle, animations switch).

**Selector details (confirmed from source):**

- Theme: `ToggleButtonGroup` renders as `role="group"` with `aria-label="Select theme"`. Individual buttons: `"Light theme"`, `"Dark theme"`, `"High contrast theme"` (from `theme.lightAria`, `theme.darkAria`, `theme.highContrastAria`). Selected button gets `aria-pressed="true"`.
- Language: `ToggleButtonGroup` with `aria-label="Language"`. Buttons: `"English"`, `"Français"` (from `settings.english`, `settings.french`).
- Animations: MUI `Switch` renders as `role="switch"` with `aria-label="Toggle animations"`.

**Mobile context:** The mobile drawer renders `SettingsList` inline (not in a popover). The same child controls appear with identical ARIA labels. In mobile tests, callers must call `navigation.openDrawer()` first, then interact with theme/language/animation controls directly — `open()` should not be called since there is no popover to open.

#### ProjectLightbox (sub-POM)

Covers all interaction modes:

- `dialog` → `getByRole('dialog', { name: /image lightbox/i })`
- `closeButton` → `getByRole('button', { name: /close lightbox/i })`
- `prevButton` → `getByRole('button', { name: /previous image/i })`
- `nextButton` → `getByRole('button', { name: /next image/i })`
- `liveRegion` → `locator('[role="status"][aria-live="assertive"]')`
- `closeByButton()` / `closeByKeyboard()` (Escape)
- `nextByKeyboard()` / `prevByKeyboard()` (ArrowRight/Left)
- `swipe(direction: 'left' | 'right')` — mouse-based gesture simulation for cross-browser compatibility
- `getCounterText()` — reads the visual `"N of M"` counter (the `aria-hidden="true"` `Typography`, not the `VisuallyHidden` SR text)
- `waitForOpen()` / `waitForClose()` — dialog visibility assertions

The lightbox uses `next/dynamic` with `ssr: false` — the component chunk loads only after the first thumbnail click. `waitForOpen()` must account for both chunk loading and the dialog mount.

#### Navigation (sub-POM)

- `desktopNav` → `getByRole('navigation', { name: /main navigation/i })`
- `mobileNav` → `getByRole('navigation', { name: /mobile navigation menu/i })`
- `hamburgerButton` → `getByRole('button', { name: /open navigation menu/i })`
- `closeDrawerButton` → `getByRole('button', { name: /close navigation menu/i })`
- `navigateTo('portfolio' | 'resume' | 'colophon' | 'samples')` — context-aware: detects mobile vs desktop via hamburger button visibility
- `activeLink()` → locator for `[aria-current="page"]`
- `openDrawer()` / `closeDrawer()` — hamburger menu interactions

**Note:** The hamburger drawer uses MUI `Drawer` (not `Dialog`). The drawer contains a `<nav aria-label="Mobile navigation menu">` with navigation links and settings controls. Locate drawer contents via `getByRole('navigation', { name: /mobile navigation menu/i })`.

**Desktop nav buttons:** MUI `Button` with `component={Link}` renders as `<a>` elements. `NavButtons` wraps them in `<Box component="nav" aria-label="Main navigation">`. The hamburger `IconButton` has `aria-expanded` reflecting drawer state. Active links carry `aria-current="page"` in both desktop and mobile contexts.

#### HomePage

Extends `BasePage` for `/`:

- `lightbox` → `ProjectLightbox` sub-POM instance
- `loadMoreButton` → `getByRole('button', { name: /load more/i })`
- `projectSections()` → `mainContent.getByRole('heading', { level: 2 })` (each `ProjectDetail` renders an h2)
- `galleryImages(projectIndex)` → images within the nth `ProjectGallery`
- `openLightboxForImage(projectIndex, imageIndex)` → clicks a gallery thumbnail, waits for the lightbox dialog

#### ResumePage

Extends `BasePage` for `/resume`. All sections use `aria-labelledby` with stable IDs:

- `headerSection` → `locator('section[aria-labelledby="resume-name"]')`
- `summarySection` → `locator('section[aria-labelledby="professional-summary-heading"]')`
- `workSection` → `locator('section[aria-labelledby="work-experience-heading"]')`
- `skillsSection` → `locator('section[aria-labelledby="skills-heading"]')`
- `educationSection` → `locator('section[aria-labelledby="education-heading"]')`
- `clientsSection` → `locator('section[aria-labelledby="clients-heading"]')`
- `speakingSection` → `locator('section[aria-labelledby="speaking-heading"]')`
- `contactButtons()` → `headerSection.getByRole('link')` (MUI `Button` with `href` renders as `<a>`)
- `pdfDownloadButton()` → `headerSection.getByRole('link', { name: /opens in new tab/i })` (hardcoded suffix in `ResumeHeader.tsx`)

#### ColophonPage

Extends `BasePage` for `/colophon`. Sections use `aria-labelledby`:

- `technologiesSection` → `locator('section[aria-labelledby="technologies-heading"]')`
- `designSection` → `locator('section[aria-labelledby="design-heading"]')`
- `butaSection` → `locator('section[aria-labelledby="buta-heading"]')` (heading is visually hidden / sr-only)
- `v1Accordion` → `locator('#v1-accordion')`
- `v1AccordionSummary` → `locator('#v1-technologies-header')`
- `v1AccordionContent` → `locator('#v1-accordion .MuiAccordionDetails-root')` (MUI wraps `AccordionDetails` in a `region` div that also receives the `aria-controls` target ID, creating duplicate `#v1-technologies-content` elements — scope to the `AccordionDetails` class instead)
- `expandV1Accordion()` / `collapseV1Accordion()` — checks `aria-expanded` state before clicking to avoid toggling in the wrong direction

#### SamplesPage

Extends `BasePage` for `/samples`. Artifact sections use `aria-label` (not `aria-labelledby`):

- `artifactSection(heading)` → `locator('section[aria-label="${heading}"]')` — heading is the translated section title
- `allArtifactSections()` → `locator('#main-content section[aria-label]')` — returns all 5 sections for positional access via `.nth(index)`, avoiding locale dependency
- `downloadButtons(section)` → `section.getByRole('link')` — download buttons render as `<a>` elements with `aria-label` containing the artifact title and format
- 5 sections in order: Product Strategy, UX Design, Technical, Process & Ops, Cost Savings

### Selector Strategy

Semantic ARIA selectors are the primary approach. E2E tests use the same interface that assistive technologies rely on — when a selector breaks, it signals a real accessibility regression. This makes the test suite a continuous accessibility monitor, not just a functional check.

**Preferred selectors (in priority order):**

1. `getByRole` with accessible name — `getByRole('button', { name: /open settings/i })`
2. `getByRole` with navigation landmark — `getByRole('navigation', { name: /main navigation/i })`
3. Stable `id` attributes — `locator('#main-content')` (real `id` in `MainLayout.tsx`)
4. ARIA attribute combinations — `locator('[role="status"][aria-live="assertive"]')`
5. `aria-labelledby` section targeting — `locator('section[aria-labelledby="resume-name"]')`

If a locator proves fragile, add an `aria-label` to the production element (improves accessibility simultaneously).

**Note on `data-testid`:** One legacy `data-testid="project-gallery"` exists in `ProjectGallery.tsx`. The `HomePage` POM may reference it for gallery scoping, but new production code should not introduce additional `data-testid` attributes. Prefer semantic alternatives where possible.

### Accessibility Testing

`helpers/axe.ts` wraps `@axe-core/playwright` with the same WCAG 2.2 Level AA rules enforced in unit tests (`axe-helpers.ts`):

- `color-contrast`, `link-name`, `button-name`, `image-alt`, `label`
- `aria-allowed-attr`, `aria-required-attr`, `aria-valid-attr-value`
- `landmark-one-main`, `region`, `target-size`

Excludes third-party iframes (PostHog, Sentry).

The `accessibility.spec.ts` runs full-page axe scans across: **4 baseline (light/EN) + 8 theme matrix (dark + highContrast) + 4 locale matrix (FR) = 16 static page scans**, plus scans on interactive states (lightbox, settings popover, hamburger menu).

**Theme/locale matrix strategy:** The matrix tests use `seedTheme()`/`seedLocale()` (via `addInitScript` before `goto()`) rather than driving the settings UI. This isolates the axe scan from the settings panel interaction, which is tested separately in the interactive states group and in `settings.spec.ts`.

### Responsive Testing

Mobile breakpoint is 600px (MUI `sm`). The `viewport.fixture.ts` provides:

- `asMobile()` → 375x812 (below breakpoint)
- `asDesktop()` → 1280x800

Tests verify:

- Mobile: hamburger visible, desktop nav hidden, drawer opens with nav + settings
- Desktop: nav buttons visible, hamburger hidden, settings in popover

### Gherkin-Syntax Translation Pattern

Gherkin scenarios appear as JSDoc comments and descriptive test names. No `.feature` files, no step definitions.

```typescript
test.describe("Project Lightbox", () => {
  /**
   * Scenario: User navigates images with keyboard Arrow keys.
   *
   * Given the home page is loaded and the lightbox is open on image 1
   * When the user presses ArrowRight
   * Then image 2 is displayed and the counter reads "2 of N"
   * And the ARIA status region announces the new image position
   */
  test("Given lightbox open, When ArrowRight pressed, Then shows next image", async ({
    homePage,
  }) => {
    // Given
    await homePage.goto();
    await homePage.openLightboxForImage(0, 0);
    await homePage.lightbox.waitForOpen();

    // When
    await homePage.lightbox.nextByKeyboard();

    // Then
    await expect(homePage.lightbox.counter).toContainText("2 of");
    await expect(homePage.lightbox.liveRegion).toContainText("2");
  });
});
```

### localStorage Keys

| Preference | Key                    | Values                          |
| ---------- | ---------------------- | ------------------------------- |
| Theme      | `portfolio-theme-mode` | `light`, `dark`, `highContrast` |
| Locale     | `locale`               | `en`, `fr`                      |

### localStorage and Preference Persistence

Between tests, Playwright creates a fresh browser context (clean `localStorage`). For tests needing pre-set preferences, use `page.addInitScript`:

```typescript
// helpers/storage.ts
export async function seedTheme(
  page: Page,
  theme: "light" | "dark" | "highContrast",
) {
  await page.addInitScript((t) => {
    localStorage.setItem("portfolio-theme-mode", t);
  }, theme);
}

export async function seedLocale(page: Page, locale: "en" | "fr") {
  await page.addInitScript((l) => {
    localStorage.setItem("locale", l);
  }, locale);
}
```

### Language Switching in E2E

The home page is SSG'd in English. After switching to French, `useProjectLoader` re-fetches client-side. Tests must wait for French content to appear:

```typescript
await homePage.settings.switchLanguage("fr");
await expect(page.getByText(/projets/i)).toBeVisible({ timeout: 5_000 });
```

### Touch Gestures

The `ProjectLightbox` sub-POM uses `mouse.down/move/up` rather than `touchscreen.tap` for cross-browser consistency. However, the production `useSwipe` hook listens for `touchstart`/`touchend` events (not mouse events), so mouse-based simulation may not trigger the swipe handler. The `swipe()` method exists in the POM for spec authors to use; actual test behavior should be verified per-browser and annotated accordingly:

```typescript
test.skip(browserName === "webkit", "Touch events unstable in headless WebKit");
```

### npm Scripts

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:report": "playwright show-report e2e/reports/html",
  "test:e2e:install": "playwright install chromium webkit"
}
```

### .gitignore Additions

```
e2e/reports/
e2e/test-results/
```

### Dependencies

```bash
npm install --save-dev @playwright/test @axe-core/playwright
```

### Setup

After installing npm dependencies, Playwright browser binaries must be downloaded separately (~400MB for Chromium + WebKit). This is a one-time operation per Playwright version upgrade:

```bash
# One-time browser installation (from v2/)
npm run test:e2e:install
```

**First-time workflow:**
1. `npm install` — installs `@playwright/test` and `@axe-core/playwright`
2. `npm run test:e2e:install` — downloads Chromium and WebKit browser binaries
3. `npm run build` — creates the production build (required before E2E tests)
4. `npm run test:e2e` — runs E2E tests against the production build

**When to re-run `test:e2e:install`:** Only after upgrading `@playwright/test` to a new version. Playwright pins browser versions to its own release — a Playwright upgrade requires re-downloading browsers.

**CI:** Cache the Playwright browser directory (`~/.cache/ms-playwright`) keyed on `npx playwright --version` to avoid re-downloading on every CI run. See [CI Integration](#ci-integration-deferred) for details.

---

## Fixtures Architecture

### Base Fixture (`base.fixture.ts`)

Extends Playwright's `test` object with typed page objects:

```typescript
import { test as base } from "@playwright/test";
// ... page object imports

type AppFixtures = {
  homePage: HomePage;
  resumePage: ResumePage;
  colophonPage: ColophonPage;
  samplesPage: SamplesPage;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  resumePage: async ({ page }, use) => {
    await use(new ResumePage(page));
  },
  // ...
});

export { expect } from "@playwright/test";
```

All spec files import `test` and `expect` from `base.fixture.ts` instead of `@playwright/test`.

---

## Error Handling

- Page objects **never** contain `try/catch` — let errors propagate to the test runner
- Only exception: `global-setup.ts` throws a formatted error for missing builds
- Stack traces remain clean and readable

---

## Future Considerations

### CI Integration (deferred)

- Add `test:e2e` to `test-deploy-dev.yml` after unit tests, before deploy
- Cache Playwright browsers with `actions/cache` keyed on `playwright --version`
- Upload `e2e/reports/html` as GitHub Actions artifact on failure

### Visual Regression (deferred)

- Separate Playwright project: `{ name: 'visual' }` with `updateSnapshots: 'missing'`
- Snapshots stored in `e2e/snapshots/` committed to git
- Run separately: `playwright test --project=visual`
- Caution: font rendering differs between macOS and CI Linux

### Firefox Support (deferred)

- Add `{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }` when ready
- No known blockers; excluded from initial scope per requirements
