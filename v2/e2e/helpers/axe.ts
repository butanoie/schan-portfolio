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
 * Run an axe accessibility scan on the current page.
 *
 * Applies WCAG 2.2 Level AA rules and excludes third-party iframes.
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
  let builder = new AxeBuilder({ page }).withRules(WCAG_AA_RULES);

  for (const selector of THIRD_PARTY_EXCLUDES) {
    builder = builder.exclude(selector);
  }

  return builder.analyze();
}
