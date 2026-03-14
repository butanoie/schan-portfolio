# E2E Testing (Playwright)

## Commands
```bash
npm run test:e2e                              # Run all E2E tests (must build first)
npm run build && npx playwright test          # Build + run all
npx playwright test specs/home.spec.ts        # Run a single spec
npx playwright test --headed                  # Run with visible browser
npx playwright test --project=chromium        # Run in specific browser
npx playwright test --grep "load more"        # Run tests matching pattern
npx playwright show-report                    # Open last HTML report
```

## CI Integration
- **Workflow:** `.github/workflows/test-deploy-dev.yml` — `e2e` job runs after `tests`, parallel with `deploy`
- **Blob reporter in CI** — sequential `--project=chromium` / `--project=webkit` runs overwrite the HTML report; CI uses `--reporter=blob,list` + `merge-reports --reporter=html` to produce a combined report
- **WebKit is soft-fail** — `continue-on-error: true` on the WebKit step; Chromium failures block merge, WebKit failures don't
- **Browser caching** — `actions/cache` keyed on `playwright-{os}-{version}`; cache stores browser binaries only, system deps (`install-deps`) reinstalled each run
- **`if: always()`** for artifact uploads, not `if: failure()` — `continue-on-error` steps don't trigger `failure()` condition

## Architecture Reference

See [TESTING_ARCHITECTURE.md](../../docs/guides/TESTING_ARCHITECTURE.md) for the full E2E architecture spec (POM design, selectors, fixtures, config).

## Gotchas

- **Avoid `networkidle`** in `page.goto()` — PostHog/Sentry background requests prevent settling. Use `'load'` or `'domcontentloaded'` and explicit locator waits instead.
- **`next/dynamic` with `ssr: false`** — components are absent from initial HTML. Use `expect(locator).toBeVisible({ timeout: 10_000 })` for assertions, or `waitFor({ state: 'visible', timeout: 10_000 })` before `isVisible()` checks, or the check returns false during hydration.
- **tsconfig `extends` inherits `exclude`** — `tsconfig.e2e.json` must explicitly override `exclude` to avoid inheriting the parent's `"e2e"` exclusion.
- **Page objects hold locators and actions only** — never assertions. Tests own all assertions.
- **Semantic ARIA selectors only** — no new `data-testid` attributes. One legacy exception exists in `ProjectGallery.tsx`.
- **Playwright requires at least one spec file** — it exits with error on empty `specs/`. Keep `smoke.spec.ts` as the baseline infrastructure validation test.
- **ESLint `react-hooks/rules-of-hooks` false positive** — Playwright's `test.extend()` uses `{ use }` destructuring that ESLint mistakes for React's `use()` hook. The `e2e/**/*.ts` override in `eslint.config.mjs` disables this rule for E2E files.
- **JSDoc on Playwright fixtures** — `test.extend()` arrow functions use destructured `{ page }` which ESLint reports as `root0`/`root0.page` params. Document these with `@param root0 - Playwright fixtures object` etc.
- **Always run `npm run lint` after writing E2E code** — code-review agents do not catch JSDoc or ESLint rule violations.
- **Playwright fixtures are resolved statically** — computed property destructuring like `{ [varName]: alias }` does NOT work. Playwright inspects parameter names at registration time. For data-driven tests across pages, request all four fixtures and select via a runtime map: `const pages: Record<string, BasePage> = { home: homePage, resume: resumePage, ... }`.
- **Gherkin test titles required** — test names must use `Given..., When..., Then...` shorthand format per TESTING_ARCHITECTURE.md. Full Gherkin goes in JSDoc above each test.
- **Run `npm run test:e2e` after writing specs** — lint, typecheck, and unit tests do NOT catch Playwright runtime errors (e.g., unknown fixture parameters). Always run E2E tests before considering a spec complete.
- **WebKit excludes links from default Tab cycle** — Safari/WebKit on macOS only tabs through form controls. Use `Alt+Tab` in WebKit tests to include links. Check `browserName` fixture: `const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab'`.
- **E2E tests run on port 3100** — the Playwright `webServer` starts `next start -p 3100` with `reuseExistingServer: false`, so it never conflicts with a dev server on port 3000 and always starts a fresh production server.
- **E2E tests use production build** — `npm run build` must complete before `npx playwright test`. The webServer runs `npm run start` (not dev).
- **MUI Popover `aria-hidden` on siblings** — while a Popover/Modal is open, MUI sets `aria-hidden="true"` on all sibling DOM branches. `getByRole` queries for elements outside the popover (nav links, footer, gear button) will fail. **Fix:** close the popover before asserting sibling elements, or pre-capture bounding boxes/data before opening.
- **MUI Popover backdrop blocks pointer events** — the invisible backdrop intercepts clicks. To "click the gear button" while the popover is open, use `page.mouse.click(x, y)` at pre-captured coordinates instead of `locator.click()`.
- **Locale switching invalidates ARIA locators** — after switching to French, English-based POM locators (e.g., `/open settings/i`) stop matching. Close the popover before switching, use URL navigation instead of `navigateTo()`, and scope French assertions to French ARIA labels (e.g., `/navigation principale/i`).
- **axe-core + CSS transitions** — axe computes incorrect contrast ratios when scanning during a CSS transition (e.g., body background, opacity). `runAxeScan()` automatically waits for all CSS transitions to finish via the Web Animations API before scanning. POM wait methods that previously used hardcoded delays for this purpose can rely on `runAxeScan` instead. For non-axe assertions during transitions, a post-visibility delay (~500ms) may still be needed.
- **`role="img"` hides children from ARIA tree** — the Footer's `ThoughtBubble` uses `role="img"`, making all children (including the Load More button) invisible to `getByRole()`. Scope via the parent's `aria-label` instead: `page.getByRole('img', { name: /load more projects button/i }).locator('button')`. The ThoughtBubble's `aria-label` is hardcoded English regardless of locale.
- **Selector exception: `.project-detail`** — `ProjectDetail` renders `<section class="project-detail">` without an accessible name, so it maps to `generic` role (not `region`). The `.project-detail` class selector is used in `HomePage.projectSection()` as a second permitted exception alongside the `data-testid="project-gallery"` exception.
- **Avoid `isVisible()` polling loops for stateful buttons** — buttons whose text changes during async operations (e.g., "Load more" → "Loading projects...") cause text-based locators to briefly resolve to zero elements mid-fetch. Use deterministic count-based loops (click → assert `toHaveCount(expectedN)` → repeat) instead of `while (isVisible())`.
- **WebKit `Touch()` constructor unavailable** — Desktop Safari/WebKit does not support `new Touch()` (iOS-only API). To dispatch touch events, use `new Event('touchstart', { bubbles: true })` with `Object.defineProperty` to attach `touches`/`changedTouches` as plain coordinate arrays. See `ProjectLightbox.swipeByTouch()` for the pattern.
- **MUI Accordion duplicate `id` on content** — `AccordionDetails` and its parent `<div role="region">` both receive the `id` from `aria-controls`, causing Playwright strict mode violations. Target `.MuiAccordionDetails-root` inside the accordion instead of the `id` directly.
- **Playwright `filter({ has })` matches children, not self** — `locator.filter({ has: page.locator('[href*="foo"]') })` finds elements whose *children* match, not the element itself. To filter by an attribute on the element, use CSS attribute selectors: `parent.locator('a[href*="foo"]')`.
- **Fenced Gherkin in JSDoc** — use `` ```gherkin `` fenced code blocks for scenario comments above tests (matching `home.spec.ts`), not plain prose.
- **`desktopNav` is the shared nav landmark** — `getByRole('navigation', { name: /main navigation/i })` matches the parent `<Box component="nav">` in Header, which wraps both the hamburger (mobile) and NavButtons (desktop). It is always visible. To assert "no desktop nav buttons on mobile", check `desktopNav.getByRole('link').toHaveCount(0)` instead of `desktopNav.not.toBeVisible()`.
- **Use `toHaveCount(0)` for React-conditional elements, not `not.toBeVisible()`** — Footer nav (`{!isMobile && <FooterNavLinks />}`) and MUI Drawer content (`keepMounted` defaults to `false`) are unmounted from the DOM, not CSS-hidden. `not.toBeVisible()` passes vacuously on absent elements and won't catch locator typos or regressions. Use `toHaveCount(0)` to confirm true DOM absence.
- **`toBeVisible({ timeout })` replaces `waitFor` + `toBeVisible`** — For `next/dynamic` hydration waits, `expect(locator).toBeVisible({ timeout: 10_000 })` retries internally. A separate `waitFor({ state: 'visible' })` before `toBeVisible()` is redundant.
- **Load More needs `toBeEnabled` guard + extended timeouts** — Each Load More cycle includes a 1s simulated delay + skeleton render + project mount + `setLoading(false)`. On slow WebKit CI runners, `toHaveCount` can pass (headings rendered) while the button is still disabled. Always `await expect(button).toBeEnabled({ timeout: 15_000 })` before clicking, and use `{ timeout: 15_000 }` on `toHaveCount`/`toBeHidden` assertions that follow a Load More click.
