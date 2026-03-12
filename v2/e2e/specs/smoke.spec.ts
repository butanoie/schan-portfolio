/**
 * Smoke test — validates that the Playwright infrastructure works.
 *
 * This minimal spec confirms that the production build is running,
 * page objects instantiate correctly, and the test fixture pipeline
 * is functional. It will be superseded by Phase 6+ spec files.
 *
 * @module e2e/specs/smoke.spec
 */
import { test, expect } from '../fixtures/base.fixture';

test.describe('Infrastructure smoke test', () => {
  test('home page loads and has main content', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.mainContent).toBeVisible();
  });
});
