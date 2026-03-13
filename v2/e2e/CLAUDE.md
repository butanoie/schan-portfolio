# E2E Testing (Playwright)

## Architecture Reference

See [TESTING_ARCHITECTURE.md](../../docs/guides/TESTING_ARCHITECTURE.md) for the full E2E architecture spec (POM design, selectors, fixtures, config).

## Gotchas

- **Avoid `networkidle`** in `page.goto()` — PostHog/Sentry background requests prevent settling. Use `'load'` or `'domcontentloaded'` and explicit locator waits instead.
- **`next/dynamic` with `ssr: false`** — components are absent from initial HTML. Use `waitFor({ state: 'visible', timeout: 10_000 })` before `isVisible()` checks, or the check returns false during hydration.
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
- **Dev server reuse alters tab order** — `reuseExistingServer: !process.env.CI` means local E2E tests reuse a running dev server. Next.js Dev Tools in dev mode inject focusable elements (iframe, buttons) that don't exist in production, causing keyboard navigation tests to fail. Stop the dev server before running E2E tests locally, or rely on CI for accurate results.
- **E2E tests use production build** — `npm run build` must complete before `npx playwright test`. The webServer runs `npm run start` (not dev). Stale builds serve old code silently when `reuseExistingServer: true`.
- **axe-core + CSS transitions** — axe computes incorrect contrast ratios when scanning during a CSS transition (e.g., body background, opacity). `runAxeScan()` automatically waits for all CSS transitions to finish via the Web Animations API before scanning. POM wait methods that previously used hardcoded delays for this purpose can rely on `runAxeScan` instead. For non-axe assertions during transitions, a post-visibility delay (~500ms) may still be needed.
