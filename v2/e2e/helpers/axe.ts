/**
 * Axe-core wrapper for Playwright E2E accessibility testing.
 *
 * Enforces WCAG 2.2 Level AA rules matching the unit-test axe configuration
 * in `src/__tests__/utils/axe-helpers.ts`. Excludes third-party iframes
 * (PostHog, Sentry) that are outside our control.
 *
 * @module e2e/helpers/axe
 */
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/**
 * WCAG 2.2 Level AA rules enforced across all page scans.
 *
 * Matches the rule set in the Vitest axe helper for consistency
 * between unit and E2E accessibility testing.
 */
const WCAG_AA_RULES = [
  'color-contrast',
  'link-name',
  'button-name',
  'image-alt',
  'label',
  'aria-allowed-attr',
  'aria-required-attr',
  'aria-valid-attr-value',
  'landmark-one-main',
  'region',
  'target-size',
];

/**
 * CSS selectors for third-party iframes to exclude from axe scans.
 * These are injected by analytics/error-tracking services and are
 * outside our control.
 */
const THIRD_PARTY_EXCLUDES = [
  'iframe[src*="posthog"]',
  'iframe[src*="sentry"]',
];

/**
 * Wait for all CSS transitions on the page to finish.
 *
 * axe-core computes contrast ratios via `getComputedStyle`, so scanning during
 * an active CSS transition produces false-positive violations with intermediate
 * colors. The primary case is body background transitions (MUI CssBaseline:
 * `background-color 300ms ease-in-out`) when themes are seeded via localStorage
 * before navigation.
 *
 * Uses the Web Animations API to wait until no CSS transitions are running.
 * Checks `constructor.name` instead of `instanceof CSSTransition` because
 * Playwright's bundled WebKit may not expose the `CSSTransition` global.
 *
 * @param page - Playwright Page instance to wait on
 * @throws {Error} Playwright TimeoutError if transitions do not settle within 2000ms
 */
async function waitForTransitionsToSettle(page: Page): Promise<void> {
  await page.waitForFunction(
    () =>
      !document
        .getAnimations()
        .some(
          (a) =>
            a.constructor.name === 'CSSTransition' && a.playState === 'running'
        ),
    { timeout: 2000, polling: 100 }
  );
}

/**
 * Run an axe accessibility scan on the current page.
 *
 * Waits for CSS transitions to settle before scanning to avoid false-positive
 * color-contrast violations from intermediate background colors. Applies
 * WCAG 2.2 Level AA rules and excludes third-party iframes.
 * Returns the raw AxeResults for assertion in test specs.
 *
 * @param page - Playwright Page instance to scan
 * @returns Axe scan results for assertion
 *
 * @example
 * const results = await runAxeScan(page);
 * expect(results.violations).toEqual([]);
 */
export async function runAxeScan(page: Page) {
  await waitForTransitionsToSettle(page);

  let builder = new AxeBuilder({ page }).withRules(WCAG_AA_RULES);

  for (const selector of THIRD_PARTY_EXCLUDES) {
    builder = builder.exclude(selector);
  }

  return builder.analyze();
}
