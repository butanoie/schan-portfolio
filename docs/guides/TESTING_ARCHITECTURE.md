# Testing Architecture: Integration & E2E Tests

This document defines the technical architecture for integration tests (Vitest) and end-to-end UI tests (Playwright) for the v2 portfolio application.

## Overview

| Layer | Tool | Scope | Runs Against |
|-------|------|-------|-------------|
| Unit tests | Vitest + RTL | Individual functions, components, hooks | jsdom (existing, 1,199 tests) |
| Integration tests | Vitest + RTL | Multi-module workflows, data pipelines, hook lifecycles | jsdom (new) |
| E2E / UI tests | Playwright | Full browser, real pages, user journeys | `next start` (production build) |

### Guiding Principles

1. **Accessibility first** — axe scans on every page, theme, and locale combination
2. **Semantic selectors only** — `getByRole`, `getByLabel`, ARIA attributes; no `data-testid`
3. **Real data in integration tests** — no mocking of the data/localization layer
4. **Gherkin-syntax scenarios** — Given/When/Then in test descriptions for readability, without a BDD framework
5. **Production-faithful E2E** — tests run against `next start` (optimized, SSG'd pages)

---

## Part 1: Integration Tests (Vitest)

### What Qualifies as Integration vs Unit

| Test | Classification | Reason |
|------|---------------|--------|
| `getProjects({ tags, search, page })` in isolation | Unit (exists) | Single function, single module |
| `fetchProjects` through `projectDataServer` → `projectData` → `localization` → JSON | **Integration** | Crosses 3 module boundaries including dynamic `import()` |
| `getProjects('fr')` returning French titles with real JSON merge | **Integration** | Tests the full localization pipeline end-to-end |
| `useProjectLoader` with locale switch from `'en'` to `'fr'` | **Integration** | Hook + localization layer + context interacting together |
| `AsyncProjectsList` rendering initial batch + loadMore + skeletons | **Integration** | Component + hook + data layer + context in DOM |

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
describe('unknown locale fallback', () => {
  let getLocalizedProjects: typeof import('@/src/data/localization').getLocalizedProjects;

  beforeAll(async () => {
    vi.resetModules();
    const mod = await import('@/src/data/localization');
    getLocalizedProjects = mod.getLocalizedProjects;
  });

  it('should fall back to base data for unsupported locale', async () => {
    const projects = await getLocalizedProjects('de' as Locale);
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

### TypeScript Configuration

A separate `tsconfig.e2e.json` extends the main config to avoid polluting it with Playwright types:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["@playwright/test"],
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["e2e/**/*.ts"]
}
```

### Page Object Model Design

#### BasePage (abstract)

All page objects extend `BasePage`, which encapsulates the persistent shell:

- `skipLink` → `getByRole('link', { name: /skip to main/i })`
- `mainContent` → `locator('#main-content')`
- `settings` → `SettingsPanel` sub-POM instance
- `navigation` → `Navigation` sub-POM instance
- `goto(path)` → navigates and waits for `networkidle`
- `activateSkipLink()` → Tab + Enter to exercise the skip link

#### SettingsPanel (sub-POM)

The most critical sub-POM — exercised on every page:

- `open()` / `close()` — gear button + popover visibility
- `switchTheme(mode: 'light' | 'dark' | 'highContrast')`
- `switchLanguage(locale: 'en' | 'fr')`
- `toggleAnimations()`

Waits for `gearButton` to be visible before clicking (handles `next/dynamic` hydration delay).

**Note:** The settings panel uses MUI `Popover` (not `Dialog`), so it does not have `role="dialog"`. Locate it through its trigger button (`getByRole('button', { name: /open settings/i })`) and its child controls (theme toggle buttons, language toggle, animations switch).

#### ProjectLightbox (sub-POM)

Covers all interaction modes:

- `closeByButton()` / `closeByKeyboard()` (Escape)
- `nextByKeyboard()` / `prevByKeyboard()` (ArrowRight/Left)
- `swipe(direction: 'left' | 'right')` — mouse-based gesture simulation for cross-browser compatibility
- `getCounterText()` — reads the "N of M" counter
- ARIA: `dialog`, `liveRegion` locators

#### Navigation (sub-POM)

- `navigateTo('portfolio' | 'resume' | 'colophon' | 'samples')`
- `activeLink()` → locator for `[aria-current="page"]`
- `hamburgerButton` — mobile menu trigger
- `openDrawer()` / `closeDrawer()` — hamburger menu interactions

**Note:** The hamburger drawer uses MUI `Drawer` (not `Dialog`). The drawer contains a `<nav aria-label="Mobile navigation menu">` with navigation links and settings controls. Locate drawer contents via `getByRole('navigation', { name: /mobile navigation menu/i })`.

### Selector Strategy

No `data-testid` attributes. The existing codebase uses semantic ARIA exclusively. E2E tests follow the same approach:

- `getByRole('button', { name: /open settings/i })` — from ARIA labels in production code
- `getByRole('navigation', { name: /main navigation/i })`
- `getByRole('dialog', { name: /image lightbox/i })`
- `locator('[role="status"][aria-live="assertive"]')` — for the lightbox image position announcements
- `locator('#main-content')` — for skip link target (real `id` in `MainLayout.tsx`)

If a locator proves fragile, add an `aria-label` to the production element (improves accessibility simultaneously).

### Accessibility Testing

`helpers/axe.ts` wraps `@axe-core/playwright` with the same WCAG 2.2 Level AA rules enforced in unit tests (`axe-helpers.ts`):

- `color-contrast`, `link-name`, `button-name`, `image-alt`, `label`
- `aria-allowed-attr`, `aria-required-attr`, `aria-valid-attr-value`
- `landmark-one-main`, `region`, `target-size`

Excludes third-party iframes (PostHog, Sentry).

The `accessibility.spec.ts` runs full-page axe scans across: **4 baseline (light/EN) + 8 theme matrix (dark + highContrast) + 4 locale matrix (FR) = 16 static page scans**, plus scans on interactive states (lightbox, settings popover, hamburger menu).

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
test.describe('Project Lightbox', () => {
  /**
   * Scenario: User navigates images with keyboard Arrow keys.
   *
   * Given the home page is loaded and the lightbox is open on image 1
   * When the user presses ArrowRight
   * Then image 2 is displayed and the counter reads "2 of N"
   * And the ARIA status region announces the new image position
   */
  test('Given lightbox open, When ArrowRight pressed, Then shows next image', async ({ homePage }) => {
    // Given
    await homePage.goto();
    await homePage.openLightboxForImage(0, 0);
    await homePage.lightbox.waitForOpen();

    // When
    await homePage.lightbox.nextByKeyboard();

    // Then
    await expect(homePage.lightbox.counter).toContainText('2 of');
    await expect(homePage.lightbox.liveRegion).toContainText('2');
  });
});
```

### localStorage Keys

| Preference | Key | Values |
|------------|-----|--------|
| Theme | `portfolio-theme-mode` | `light`, `dark`, `highContrast` |
| Locale | `locale` | `en`, `fr` |

### localStorage and Preference Persistence

Between tests, Playwright creates a fresh browser context (clean `localStorage`). For tests needing pre-set preferences, use `page.addInitScript`:

```typescript
// helpers/storage.ts
export async function seedTheme(page: Page, theme: 'light' | 'dark' | 'highContrast') {
  await page.addInitScript((t) => { localStorage.setItem('portfolio-theme-mode', t); }, theme);
}

export async function seedLocale(page: Page, locale: 'en' | 'fr') {
  await page.addInitScript((l) => { localStorage.setItem('locale', l); }, locale);
}
```

### Language Switching in E2E

The home page is SSG'd in English. After switching to French, `useProjectLoader` re-fetches client-side. Tests must wait for French content to appear:

```typescript
await homePage.settings.switchLanguage('fr');
await expect(page.getByText(/projets/i)).toBeVisible({ timeout: 5_000 });
```

### Touch Gestures

The `ProjectLightbox` sub-POM uses `mouse.down/move/up` rather than `touchscreen.tap` for cross-browser consistency. Swipe tests that fail in headless WebKit should be annotated:

```typescript
test.skip(browserName === 'webkit', 'Touch events unstable in headless WebKit');
```

### npm Scripts

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:report": "playwright show-report e2e/reports/html"
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
npx playwright install chromium webkit
```

---

## Fixtures Architecture

### Base Fixture (`base.fixture.ts`)

Extends Playwright's `test` object with typed page objects:

```typescript
import { test as base } from '@playwright/test';
// ... page object imports

type AppFixtures = {
  homePage: HomePage;
  resumePage: ResumePage;
  colophonPage: ColophonPage;
  samplesPage: SamplesPage;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  resumePage: async ({ page }, use) => { await use(new ResumePage(page)); },
  // ...
});

export { expect } from '@playwright/test';
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
