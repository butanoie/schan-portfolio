/**
 * Navigation — cross-page navigation, active state, and preference persistence.
 *
 * Verifies all routes load with correct headings, `aria-current="page"` updates
 * on both desktop and mobile nav, theme and language preferences survive page
 * transitions, and footer navigation links work.
 *
 * Scenario doc: docs/test-scenarios/E2E_NAVIGATION.md
 *
 * @module e2e/specs/navigation.spec
 */
import { test, expect } from '../fixtures/base.fixture';
import { asMobile, asDesktop } from '../fixtures/viewport.fixture';
import type { BasePage } from '../pages/BasePage';

/**
 * Route configuration for data-driven navigation tests.
 *
 * @property key - Runtime fixture map key (matches POM fixture names minus "Page")
 * @property navTarget - Target passed to `Navigation.navigateTo()`
 * @property path - URL path for the route
 * @property h1 - Expected H1 heading text inside `#main-content`
 */
interface RouteConfig {
  /** Runtime fixture map key. */
  key: string;
  /** Navigation target for `navigateTo()`. */
  navTarget: 'portfolio' | 'resume' | 'colophon' | 'samples';
  /** URL path. */
  path: string;
  /** Expected H1 text in `#main-content`. */
  h1: string;
  /** Regex matching the nav link's accessible name. */
  navLabel: RegExp;
}

/** All navigable routes with their expected headings and nav labels. */
const ROUTES: readonly RouteConfig[] = [
  {
    // Fixture key differs from nav target: home page POM is "homePage"
    // but the nav link reads "Portfolio" (nav target = 'portfolio').
    key: 'home',
    navTarget: 'portfolio',
    path: '/',
    h1: 'Sing Chan',
    navLabel: /portfolio/i,
  },
  {
    key: 'resume',
    navTarget: 'resume',
    path: '/resume',
    h1: 'Sing Chan',
    navLabel: /résumé|resume/i,
  },
  {
    key: 'colophon',
    navTarget: 'colophon',
    path: '/colophon',
    h1: 'Colophon',
    navLabel: /colophon/i,
  },
  {
    key: 'samples',
    navTarget: 'samples',
    path: '/samples',
    h1: 'Writing Samples',
    navLabel: /samples/i,
  },
];

test.describe('Navigation', () => {
  // ─── Route Loading ─────────────────────────────────────────

  test.describe('Route loading', () => {
    for (const route of ROUTES) {
      /**
       * Scenario: Page loads with correct H1 heading.
       *
       * Given the <page> page is loaded via direct URL
       * When the page content is visible
       * Then the H1 heading in #main-content matches the expected text
       */
      test(`Given ${route.key} page loaded, When content visible, Then H1 is "${route.h1}"`, async ({
        homePage,
        resumePage,
        colophonPage,
        samplesPage,
      }) => {
        const pages: Record<string, BasePage> = {
          home: homePage,
          resume: resumePage,
          colophon: colophonPage,
          samples: samplesPage,
        };
        const pageObject = pages[route.key];

        await pageObject.goto();
        await expect(pageObject.mainContent).toBeVisible();

        await expect(
          pageObject.mainContent.getByRole('heading', {
            level: 1,
            name: route.h1,
          })
        ).toBeVisible();
      });
    }
  });

  // ─── Active Nav Link ───────────────────────────────────────

  test.describe('Active nav link', () => {
    for (const route of ROUTES) {
      /**
       * Scenario: Desktop nav link has aria-current="page" on the active route.
       *
       * Given the desktop viewport
       * And the <page> page is loaded
       * Then the correct desktop nav link has aria-current="page"
       * And only one nav link in the desktop nav has aria-current="page"
       */
      test(`Given desktop viewport on ${route.key} page, Then nav link has aria-current="page"`, async ({
        homePage,
        resumePage,
        colophonPage,
        samplesPage,
      }) => {
        const pages: Record<string, BasePage> = {
          home: homePage,
          resume: resumePage,
          colophon: colophonPage,
          samples: samplesPage,
        };
        const pageObject = pages[route.key];

        await asDesktop(pageObject.page);
        await pageObject.goto();
        await expect(pageObject.mainContent).toBeVisible();

        const activeLink = pageObject.navigation.desktopNav.locator(
          '[aria-current="page"]'
        );
        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveAccessibleName(route.navLabel);
      });

      /**
       * Scenario: Mobile nav link has aria-current="page" on the active route.
       *
       * Given the mobile viewport
       * And the <page> page is loaded
       * When the mobile drawer is opened
       * Then the correct mobile nav link has aria-current="page"
       * And only one nav link in the mobile nav has aria-current="page"
       */
      test(`Given mobile viewport on ${route.key} page, When drawer opened, Then nav link has aria-current="page"`, async ({
        homePage,
        resumePage,
        colophonPage,
        samplesPage,
      }) => {
        const pages: Record<string, BasePage> = {
          home: homePage,
          resume: resumePage,
          colophon: colophonPage,
          samples: samplesPage,
        };
        const pageObject = pages[route.key];

        await asMobile(pageObject.page);
        await pageObject.goto();
        await expect(pageObject.mainContent).toBeVisible();

        await pageObject.navigation.openDrawer();

        const activeLink = pageObject.navigation.mobileNav.locator(
          '[aria-current="page"]'
        );
        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveAccessibleName(route.navLabel);
      });
    }
  });

  // ─── Preference Persistence ────────────────────────────────

  test.describe('Preference persistence', () => {
    /**
     * Scenario: Theme preference persists across navigation.
     *
     * Given the home page is loaded
     * And the theme is switched to dark via the settings panel
     * When navigating to the resume page
     * Then the html element has data-theme="dark"
     */
    test('Given dark theme set on home, When navigating to resume, Then data-theme is "dark"', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      // Switch theme to dark via settings panel
      await homePage.settings.open();
      await homePage.settings.switchTheme('dark');
      await homePage.settings.close();

      // Navigate to resume
      await homePage.navigation.navigateTo('resume');
      await expect(homePage.mainContent).toBeVisible();

      // Verify theme persisted
      await expect(homePage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'dark'
      );
    });

    /**
     * Scenario: Language preference persists across navigation.
     *
     * Given the home page is loaded
     * And the language is switched to French via the settings panel
     * When navigating to the resume page
     * Then the nav link for Samples reads "Exemples" (French translation)
     */
    test('Given French locale set on home, When navigating to resume, Then French nav text visible', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      // Switch language to French via settings panel
      await homePage.settings.open();
      await homePage.settings.switchLanguage('fr');
      await homePage.settings.close();

      // Navigate to resume via direct URL — navigateTo() cannot be used
      // because the Navigation POM's desktopNav locator uses the English
      // aria-label "Main navigation", which becomes "Navigation principale"
      // after switching to French.
      await homePage.page.goto('/resume', { waitUntil: 'domcontentloaded' });
      await expect(homePage.mainContent).toBeVisible();

      // Verify French locale persisted — nav.samples = "Exemples" in French
      // (src/locales/fr/common.json). Scope to the header nav (now
      // "Navigation principale" in French) to avoid strict mode violation
      // from the duplicate link in footer nav.
      await expect(
        homePage.page
          .getByRole('navigation', { name: /navigation principale/i })
          .getByRole('link', { name: /exemples/i })
      ).toBeVisible();
    });
  });

  // ─── Footer Navigation ────────────────────────────────────

  test.describe('Footer navigation', () => {
    for (const route of ROUTES) {
      /**
       * Scenario: Footer nav link navigates to the correct page.
       *
       * Given the desktop viewport on the home page
       * When the <page> link in the footer nav is clicked
       * Then the URL path matches the expected route
       * And the page main content is visible
       */
      test(`Given desktop home page, When footer ${route.key} link clicked, Then navigates to ${route.path}`, async ({
        homePage,
      }) => {
        await asDesktop(homePage.page);
        await homePage.goto();
        await expect(homePage.mainContent).toBeVisible();

        const footerNav = homePage.page.getByRole('navigation', {
          name: /footer navigation/i,
        });

        await footerNav.getByRole('link', { name: route.navLabel }).click();

        // Wait for navigation to complete — for non-home routes, waitForURL
        // confirms the URL changed. For the home route (already on /),
        // waitForURL resolves immediately, so the H1 check below serves
        // as the content-based readiness gate for all routes.
        if (route.path !== '/') {
          await homePage.page.waitForURL(`**${route.path}`);
        }
        await expect(homePage.mainContent).toBeVisible();
        await expect(
          homePage.mainContent.getByRole('heading', {
            level: 1,
            name: route.h1,
          })
        ).toBeVisible();
      });
    }
  });
});
