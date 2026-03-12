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
