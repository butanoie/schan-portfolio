/**
 * Responsive layouts — mobile vs desktop layout differences at the MUI sm breakpoint.
 *
 * Verifies hamburger menu visibility, drawer navigation with inline settings,
 * desktop nav buttons, settings gear button, and footer nav responsiveness
 * across the 600px MUI `sm` breakpoint.
 *
 * Scenario doc: docs/test-scenarios/E2E_RESPONSIVE.md
 *
 * @module e2e/specs/responsive.spec
 */
import { test, expect } from '../fixtures/base.fixture';
import { asMobile, asDesktop } from '../fixtures/viewport.fixture';

test.describe('Responsive layouts', () => {
  // ─── Mobile Navigation ────────────────────────────────────

  test.describe('Mobile navigation', () => {
    /**
     * ```gherkin
     * Scenario: Mobile shows hamburger menu instead of nav buttons
     *   Given the viewport is 375px wide
     *   And the home page is loaded
     *   Then the hamburger menu button is visible
     *   And the desktop navigation buttons are not visible
     * ```
     */
    test('Given 375px viewport and home page loaded, Then hamburger button is visible and desktop nav is not visible', async ({
      homePage,
    }) => {
      await asMobile(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      // Hamburger uses next/dynamic with ssr: false — extended timeout
      // covers the hydration delay before the button appears.
      await expect(homePage.navigation.hamburgerButton).toBeVisible({
        timeout: 10_000,
      });

      // The main nav landmark is always visible (wraps both mobile and desktop
      // content). Assert that the desktop nav *links* are absent — NavButtons
      // is not rendered on mobile (React conditional, not CSS hiding).
      await expect(
        homePage.navigation.desktopNav.getByRole('link')
      ).toHaveCount(0);
    });

    /**
     * ```gherkin
     * Scenario: Hamburger menu opens a drawer with navigation
     *   Given the viewport is 375px wide
     *   And the home page is loaded
     *   When the user taps the hamburger button
     *   Then a navigation drawer slides in from the right
     *   And the drawer contains Portfolio, Resume, Colophon, Samples links
     *   And the drawer contains theme, language, and animations controls
     * ```
     */
    test('Given 375px viewport and home page loaded, When hamburger tapped, Then drawer has nav links and settings controls', async ({
      homePage,
    }) => {
      await asMobile(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.navigation.openDrawer();

      // Verify all four navigation links in the drawer
      const { mobileNav } = homePage.navigation;
      await expect(
        mobileNav.getByRole('link', { name: /portfolio/i })
      ).toBeVisible();
      await expect(
        mobileNav.getByRole('link', { name: /résumé|resume/i })
      ).toBeVisible();
      await expect(
        mobileNav.getByRole('link', { name: /colophon/i })
      ).toBeVisible();
      await expect(
        mobileNav.getByRole('link', { name: /samples/i })
      ).toBeVisible();

      // Verify inline settings controls (same ARIA labels as desktop popover)
      await expect(homePage.settings.themeGroup).toBeVisible();
      await expect(homePage.settings.languageGroup).toBeVisible();
      await expect(homePage.settings.animationsSwitch).toBeVisible();
    });

    /**
     * ```gherkin
     * Scenario: Navigating from hamburger menu closes the drawer
     *   Given the hamburger drawer is open on mobile
     *   When the user taps the Resume link
     *   Then the drawer closes
     *   And the resume page loads
     * ```
     */
    test('Given hamburger drawer open on mobile, When Resume link tapped, Then drawer closes and resume page loads', async ({
      homePage,
    }) => {
      await asMobile(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.navigation.openDrawer();
      await homePage.navigation.mobileNav
        .getByRole('link', { name: /résumé|resume/i })
        .click();

      // Assert URL first (deterministic), then drawer removed from DOM, then H1.
      // MUI Drawer unmounts content when closed (keepMounted defaults to false),
      // so toHaveCount(0) confirms the drawer was actually removed.
      await homePage.page.waitForURL('**/resume');
      await expect(homePage.navigation.mobileNav).toHaveCount(0);
      await expect(
        homePage.mainContent.getByRole('heading', {
          level: 1,
          name: 'Sing Chan',
        })
      ).toBeVisible();
    });

    /**
     * ```gherkin
     * Scenario: Footer nav links are hidden on mobile
     *   Given the viewport is 375px wide
     *   And the home page is loaded
     *   Then the footer text navigation links are not visible
     * ```
     */
    test('Given 375px viewport and home page loaded, Then footer nav links are not visible', async ({
      homePage,
    }) => {
      await asMobile(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      // Footer nav is conditionally excluded from the DOM on mobile
      // (React conditional, not CSS hiding) — toHaveCount(0) confirms
      // the element is truly absent, not just hidden.
      const footerNav = homePage.page.getByRole('navigation', {
        name: /footer navigation/i,
      });
      await expect(footerNav).toHaveCount(0);
    });
  });

  // ─── Desktop Navigation ───────────────────────────────────

  test.describe('Desktop navigation', () => {
    /**
     * ```gherkin
     * Scenario: Desktop shows nav buttons instead of hamburger
     *   Given the viewport is 1280px wide
     *   And the home page is loaded
     *   Then the desktop navigation buttons are visible
     *   And the hamburger menu button is not visible
     * ```
     */
    test('Given 1280px viewport and home page loaded, Then desktop nav is visible and hamburger is not visible', async ({
      homePage,
    }) => {
      await asDesktop(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await expect(homePage.navigation.desktopNav).toBeVisible();
      await expect(homePage.navigation.hamburgerButton).not.toBeVisible();
    });

    /**
     * ```gherkin
     * Scenario: Desktop shows settings gear button
     *   Given the viewport is 1280px wide
     *   And the home page is loaded
     *   Then the settings gear button is visible
     * ```
     */
    test('Given 1280px viewport and home page loaded, Then settings gear button is visible', async ({
      homePage,
    }) => {
      await asDesktop(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      // Gear button uses next/dynamic with ssr: false — extended timeout
      // covers the hydration delay before the button appears.
      await expect(homePage.settings.gearButton).toBeVisible({
        timeout: 10_000,
      });
    });

    /**
     * ```gherkin
     * Scenario: Footer nav links are visible on desktop
     *   Given the viewport is 1280px wide
     *   And the home page is loaded
     *   Then the footer text navigation links are visible
     * ```
     */
    test('Given 1280px viewport and home page loaded, Then footer nav links are visible', async ({
      homePage,
    }) => {
      await asDesktop(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      const footerNav = homePage.page.getByRole('navigation', {
        name: /footer navigation/i,
      });
      await expect(footerNav).toBeVisible();
    });
  });
});
