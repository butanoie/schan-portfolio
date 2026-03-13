/**
 * Settings — theme switching, language switching, animations toggle,
 * popover open/close, and mobile drawer settings.
 *
 * Verifies all three settings controls (theme, language, animations)
 * work correctly, persist across navigation and page reloads, and are
 * accessible in both desktop (popover) and mobile (drawer) contexts.
 *
 * Scenario doc: docs/test-scenarios/E2E_SETTINGS.md
 *
 * @module e2e/specs/settings.spec
 */
import { test, expect } from '../fixtures/base.fixture';
import { asMobile, asDesktop } from '../fixtures/viewport.fixture';
import { seedTheme, seedLocale, seedAnimations } from '../helpers/storage';

// ─── Theme ─────────────────────────────────────────────────

test.describe('Settings', () => {
  test.describe('Theme switching', () => {
    /** Theme modes with their expected `data-theme` attribute values. */
    const THEMES = [
      { mode: 'light' as const, label: /light theme/i },
      { mode: 'dark' as const, label: /dark theme/i },
      { mode: 'highContrast' as const, label: /high contrast theme/i },
    ];

    for (const { mode, label } of THEMES) {
      /**
       * Scenario Outline: Switching to <theme> changes the visual appearance.
       *
       * Given the home page is loaded
       * When the user opens settings and selects <theme> theme
       * Then the page renders with <theme> visual styling
       * And the <theme> toggle button is in the pressed state
       */
      test(`Given home page, When selecting ${mode} theme, Then data-theme="${mode}" and button is pressed`, async ({
        homePage,
      }) => {
        await homePage.goto();
        await expect(homePage.mainContent).toBeVisible();

        await homePage.settings.open();
        await homePage.settings.switchTheme(mode);

        await expect(homePage.page.locator('html')).toHaveAttribute(
          'data-theme',
          mode
        );
        await expect(
          homePage.settings.themeGroup.getByRole('button', { name: label })
        ).toHaveAttribute('aria-pressed', 'true');
      });
    }

    /**
     * Scenario: Theme persists after page reload.
     *
     * Given the user switches to dark theme
     * When the page is reloaded
     * Then the dark theme is still active
     */
    test('Given dark theme set, When page reloaded, Then dark theme persists', async ({
      homePage,
    }) => {
      await seedTheme(homePage.page, 'dark');
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.page.reload({ waitUntil: 'domcontentloaded' });
      await expect(homePage.mainContent).toBeVisible();

      await expect(homePage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'dark'
      );
    });

    /**
     * Scenario: Theme persists across navigation.
     *
     * Given the user switches to high contrast on the home page
     * When navigating to the colophon page
     * Then the high contrast theme is still active
     */
    test('Given highContrast theme set on home, When navigating to colophon, Then theme persists', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.settings.open();
      await homePage.settings.switchTheme('highContrast');
      await homePage.settings.close();

      await homePage.navigation.navigateTo('colophon');
      await expect(homePage.mainContent).toBeVisible();

      await expect(homePage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'highContrast'
      );
    });
  });

  // ─── Language ──────────────────────────────────────────────

  test.describe('Language switching', () => {
    /**
     * Scenario: Switching to French translates UI text.
     *
     * Given the home page is loaded in English
     * When the user switches the language to French
     * Then the navigation labels change to French
     * And the settings labels change to French
     * And the footer text changes to French
     */
    test('Given English home page, When switching to French, Then nav, settings, and footer text are French', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.settings.open();
      await homePage.settings.switchLanguage('fr');

      // Close popover first — MUI modal sets aria-hidden on siblings,
      // blocking getByRole queries against nav/footer while open.
      await homePage.settings.close();

      // Nav labels change to French — scoped to header nav
      // (French label: "Navigation principale")
      const frenchNav = homePage.page.getByRole('navigation', {
        name: /navigation principale/i,
      });
      await expect(
        frenchNav.getByRole('link', { name: /portfolio/i })
      ).toBeVisible();
      await expect(
        frenchNav.getByRole('link', { name: /résumé/i })
      ).toBeVisible();
      await expect(
        frenchNav.getByRole('link', { name: /exemples/i })
      ).toBeVisible();
      await expect(
        frenchNav.getByRole('link', { name: /colophon/i })
      ).toBeVisible();

      // Footer contains French "Sing Chan" string
      const footer = homePage.page.getByRole('contentinfo');
      await expect(footer.getByText('Sing Chan')).toBeVisible();
    });

    /**
     * Scenario: Switching to French shows translation disclaimer.
     *
     * Given the home page is loaded in English
     * When the user switches to French
     * Then a translation disclaimer banner appears
     */
    test('Given English home page, When switching to French, Then translation disclaimer appears', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.settings.open();
      await homePage.settings.switchLanguage('fr');
      await homePage.settings.close();

      // FrenchTranslationAlert renders an MUI Alert with role="alert"
      await expect(
        homePage.page.getByRole('alert').getByText(/traduction automatique/i)
      ).toBeVisible();
    });

    /**
     * Scenario: French projects have French titles.
     *
     * Given the home page is loaded
     * When the user switches to French
     * Then project titles update to French text
     * And the "Load more projects" button text changes to French
     */
    test('Given home page, When switching to French, Then project titles and load-more button are French', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.settings.open();
      await homePage.settings.switchLanguage('fr');
      await homePage.settings.close();

      // First project title should be French
      // (en: "Collabware - Collabspace Export Downloader"
      //  fr: "Collabware - Téléchargeur d'exportation Collabspace")
      await expect(
        homePage
          .projectSections()
          .filter({ hasText: /téléchargeur d'exportation/i })
      ).toBeVisible();

      // Load more button text in French — accessible name includes the
      // count (e.g., "Charger 13 projets supplémentaires")
      await expect(
        homePage.page.getByRole('button', {
          name: /charger.*projets/i,
        })
      ).toBeVisible();
    });

    /**
     * Scenario: Language persists after page reload.
     *
     * Given the user switches to French
     * When the page is reloaded
     * Then the page remains in French
     */
    test('Given French locale set, When page reloaded, Then French persists', async ({
      homePage,
    }) => {
      await seedLocale(homePage.page, 'fr');
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.page.reload({ waitUntil: 'domcontentloaded' });
      await expect(homePage.mainContent).toBeVisible();

      // French nav label visible after reload
      await expect(
        homePage.page
          .getByRole('navigation', { name: /navigation principale/i })
          .getByRole('link', { name: /exemples/i })
      ).toBeVisible();
    });

    /**
     * Scenario: Language persists across navigation.
     *
     * Given the user switches to French on the home page
     * When navigating to the resume page
     * Then the resume content is in French
     */
    test('Given French set on home, When navigating to resume, Then French nav text visible', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.settings.open();
      await homePage.settings.switchLanguage('fr');
      await homePage.settings.close();

      // Navigate via direct URL — navigateTo() uses English ARIA labels
      // that become French after switching locale.
      await homePage.page.goto('/resume', { waitUntil: 'domcontentloaded' });
      await expect(homePage.mainContent).toBeVisible();

      // Verify French locale persisted — "Exemples" is the French label
      // for "Samples". Scoped to header nav to avoid footer duplicate.
      await expect(
        homePage.page
          .getByRole('navigation', { name: /navigation principale/i })
          .getByRole('link', { name: /exemples/i })
      ).toBeVisible();
    });
  });

  // ─── Animations ────────────────────────────────────────────

  test.describe('Animations toggle', () => {
    /**
     * Scenario: Disabling animations suppresses scroll effects.
     *
     * Given the home page is loaded
     * When the user disables animations
     * Then scroll-triggered fade-in effects do not animate
     */
    test('Given home page, When disabling animations, Then scroll animations are suppressed', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.settings.open();
      await homePage.settings.toggleAnimations();
      await homePage.settings.close();

      // ScrollAnimatedSection wraps each project in an animated Box.
      // DOM: Box (ScrollAnimatedSection) → section.project-detail → h2.
      // When animations are disabled, the Box sets transition to "none"
      // via MUI sx prop (computed CSS, not inline style).
      const firstProject = homePage.projectSections().first();
      const animatedWrapper = firstProject.locator('../..');
      await expect(animatedWrapper).toHaveCSS('transition-property', 'none');
    });

    /**
     * Scenario: Animations toggle persists across navigation.
     *
     * Given the user disables animations on the home page
     * When navigating to the colophon page
     * Then animations remain disabled
     */
    test('Given animations disabled on home, When navigating to colophon, Then animations still disabled', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.settings.open();
      await homePage.settings.toggleAnimations();
      await homePage.settings.close();

      await homePage.navigation.navigateTo('colophon');
      await expect(homePage.mainContent).toBeVisible();

      // Verify via settings panel — switch should be unchecked
      await homePage.settings.open();
      await expect(homePage.settings.animationsSwitch).not.toBeChecked();
    });

    /**
     * Scenario: Animations toggle persists after page reload.
     *
     * Given the user has disabled animations
     * When the page is reloaded
     * Then animations remain disabled
     */
    test('Given animations disabled, When page reloaded, Then animations still disabled', async ({
      homePage,
    }) => {
      await seedAnimations(homePage.page, false);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.page.reload({ waitUntil: 'domcontentloaded' });
      await expect(homePage.mainContent).toBeVisible();

      // Verify via settings panel — switch should be unchecked
      await homePage.settings.open();
      await expect(homePage.settings.animationsSwitch).not.toBeChecked();
    });
  });

  // ─── Settings Popover ──────────────────────────────────────

  test.describe('Settings popover', () => {
    /**
     * Scenario: Settings popover opens and closes via gear button.
     *
     * Given any page is loaded on desktop
     * When the user clicks the settings gear
     * Then the settings popover is visible
     * When the user clicks the gear again
     * Then the settings popover closes
     */
    test('Given desktop home page, When gear clicked, Then popover opens; When gear clicked again, Then popover closes', async ({
      homePage,
    }) => {
      await asDesktop(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      // Capture gear button position before opening — once the MUI
      // modal/backdrop is active, the gear button gets aria-hidden and
      // getByRole can no longer resolve it for boundingBox().
      const gearBox = await homePage.settings.gearButton.boundingBox();
      expect(gearBox).not.toBeNull();

      // Open via gear button
      await homePage.settings.open();
      await expect(homePage.settings.popover).toBeVisible();

      // Close via gear button — uses pre-captured coordinates since
      // MUI modal aria-hides the gear button while the popover is open.
      await homePage.settings.closeViaGearButton(gearBox!);
      await expect(homePage.settings.popover).toBeHidden();

      // After closing, verify gear button is accessible again
      await expect(homePage.settings.gearButton).toBeVisible();
      await expect(homePage.settings.gearButton).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });

    /**
     * Scenario: Settings popover closes on Escape.
     *
     * Given the settings popover is open
     * When the user presses Escape
     * Then the popover closes
     */
    test('Given settings popover open, When Escape pressed, Then popover closes', async ({
      homePage,
    }) => {
      await asDesktop(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.settings.open();
      await expect(homePage.settings.popover).toBeVisible();

      await homePage.settings.close();
      await expect(homePage.settings.popover).toBeHidden();
    });
  });

  // ─── Mobile Settings ──────────────────────────────────────

  test.describe('Mobile settings', () => {
    /**
     * Scenario: Settings controls are accessible in the mobile drawer.
     *
     * Given the mobile viewport
     * And the home page is loaded
     * When the user opens the navigation drawer
     * Then theme, language, and animations controls are visible
     */
    test('Given mobile home page, When drawer opened, Then settings controls are visible', async ({
      homePage,
    }) => {
      await asMobile(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.navigation.openDrawer();

      // Theme toggle group visible in drawer
      await expect(homePage.settings.themeGroup).toBeVisible();
      // Language toggle group visible in drawer
      await expect(homePage.settings.languageGroup).toBeVisible();
      // Animations switch visible in drawer
      await expect(homePage.settings.animationsSwitch).toBeVisible();
    });

    /**
     * Scenario: Theme switch works from the mobile drawer.
     *
     * Given the mobile viewport
     * And the home page is loaded
     * When the user opens the drawer and switches to dark theme
     * Then the page renders with dark visual styling
     */
    test('Given mobile home page, When switching to dark theme in drawer, Then data-theme="dark"', async ({
      homePage,
    }) => {
      await asMobile(homePage.page);
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      await homePage.navigation.openDrawer();
      await homePage.settings.switchTheme('dark');

      await expect(homePage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'dark'
      );
    });
  });
});
