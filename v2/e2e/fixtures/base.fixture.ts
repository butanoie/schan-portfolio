/**
 * Extended Playwright test fixture with typed page object instances.
 *
 * All spec files import `test` and `expect` from this module instead of
 * `@playwright/test` directly. This provides page objects as first-class
 * fixture parameters, enabling clean Given/When/Then test structure.
 *
 * @example
 * import { test, expect } from '../fixtures/base.fixture';
 *
 * test('loads home page', async ({ homePage }) => {
 *   await homePage.goto();
 *   await expect(homePage.mainContent).toBeVisible();
 * });
 *
 * @module e2e/fixtures/base.fixture
 */
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ResumePage } from '../pages/ResumePage';
import { ColophonPage } from '../pages/ColophonPage';
import { SamplesPage } from '../pages/SamplesPage';

/**
 * Typed fixture interface for page object injection.
 *
 * Each property lazily creates a page object instance scoped to
 * the current test's browser context.
 */
interface AppFixtures {
  /** Home page (/) page object */
  homePage: HomePage;
  /** Resume page (/resume) page object */
  resumePage: ResumePage;
  /** Colophon page (/colophon) page object */
  colophonPage: ColophonPage;
  /** Samples page (/samples) page object */
  samplesPage: SamplesPage;
}

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  resumePage: async ({ page }, use) => {
    await use(new ResumePage(page));
  },
  colophonPage: async ({ page }, use) => {
    await use(new ColophonPage(page));
  },
  samplesPage: async ({ page }, use) => {
    await use(new SamplesPage(page));
  },
});

export { expect } from '@playwright/test';
