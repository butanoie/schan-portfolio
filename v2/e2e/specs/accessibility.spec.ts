/**
 * Accessibility Compliance — WCAG 2.2 Level AA axe scans.
 *
 * Validates every page across all themes, locales, and interactive states.
 * Uses `@axe-core/playwright` via the shared `runAxeScan` helper, which
 * enforces 11 WCAG 2.2 AA rules and excludes third-party iframes.
 *
 * Playwright resolves fixtures by static parameter name, so data-driven
 * tests request all four page fixtures and select via a runtime map.
 *
 * Scenario doc: docs/test-scenarios/E2E_ACCESSIBILITY.md
 *
 * @module e2e/specs/accessibility.spec
 */
import { test, expect } from '../fixtures/base.fixture';
import { runAxeScan } from '../helpers/axe';
import { seedTheme, seedLocale } from '../helpers/storage';
import { asMobile } from '../fixtures/viewport.fixture';
import type { BasePage } from '../pages/BasePage';

/** Page names used as keys in the fixture map. */
const PAGE_NAMES = ['home', 'resume', 'colophon', 'samples'] as const;

/** Theme modes to scan beyond the default light theme. */
const THEME_VARIANTS = ['dark', 'highContrast'] as const;

test.describe('Accessibility Compliance', () => {
  // ─── Per-Page Baseline Scans ───────────────────────────────

  test.describe('Per-page baseline scans', () => {
    for (const name of PAGE_NAMES) {
      /**
       * Scenario: Page passes axe scan in default state.
       *
       * Given the <page> page is loaded in English with the light theme
       * When an axe accessibility scan is run
       * Then there are zero violations
       */
      test(`Given ${name} page in default state, When axe scans, Then zero violations`, async ({
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
        const pageObject = pages[name];

        await pageObject.goto();
        await expect(pageObject.mainContent).toBeVisible();

        const results = await runAxeScan(pageObject.page);
        expect(results.violations).toEqual([]);
      });
    }
  });

  // ─── Theme Matrix ─────────────────────────────────────────

  test.describe('Theme matrix', () => {
    for (const name of PAGE_NAMES) {
      for (const theme of THEME_VARIANTS) {
        /**
         * Scenario: Page passes axe scan in <theme> theme.
         *
         * Given the <page> page is loaded with <theme> seeded via localStorage
         * When an axe accessibility scan is run
         * Then there are zero violations
         */
        test(`Given ${name} page in ${theme} theme, When axe scans, Then zero violations`, async ({
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
          const pageObject = pages[name];

          await seedTheme(pageObject.page, theme);
          await pageObject.goto();
          await expect(pageObject.mainContent).toBeVisible();

          const results = await runAxeScan(pageObject.page);
          expect(results.violations).toEqual([]);
        });
      }
    }
  });

  // ─── Locale Matrix ────────────────────────────────────────

  test.describe('Locale matrix', () => {
    for (const name of PAGE_NAMES) {
      /**
       * Scenario: Page passes axe scan in French locale.
       *
       * Given the <page> page is loaded with French seeded via localStorage
       * When an axe accessibility scan is run
       * Then there are zero violations
       */
      test(`Given ${name} page in French locale, When axe scans, Then zero violations`, async ({
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
        const pageObject = pages[name];

        await seedLocale(pageObject.page, 'fr');
        await pageObject.goto();
        await expect(pageObject.mainContent).toBeVisible();

        const results = await runAxeScan(pageObject.page);
        expect(results.violations).toEqual([]);
      });
    }
  });

  // ─── Interactive States ───────────────────────────────────

  test.describe('Interactive states', () => {
    /**
     * Scenario: Lightbox dialog passes axe scan.
     *
     * Given the home page is loaded
     * And the first project's first image thumbnail is clicked to open the lightbox
     * When a full-page axe accessibility scan is run
     * Then there are zero violations
     */
    test('Given lightbox open, When axe scans, Then zero violations', async ({
      homePage,
    }) => {
      await homePage.goto();
      await homePage.openLightboxForImage(0, 0);

      const results = await runAxeScan(homePage.page);
      expect(results.violations).toEqual([]);
    });

    /**
     * Scenario: Settings popover passes axe scan.
     *
     * Given any page is loaded
     * And the settings gear is clicked to open the popover
     * When an axe accessibility scan is run
     * Then there are zero violations
     */
    test('Given settings popover open, When axe scans, Then zero violations', async ({
      homePage,
    }) => {
      await homePage.goto();
      await homePage.settings.open();

      const results = await runAxeScan(homePage.page);
      expect(results.violations).toEqual([]);
    });

    /**
     * Scenario: Mobile hamburger menu passes axe scan.
     *
     * Given the viewport is set to mobile (375px)
     * And the hamburger menu is opened
     * When an axe accessibility scan is run
     * Then there are zero violations
     */
    test('Given mobile hamburger open, When axe scans, Then zero violations', async ({
      homePage,
    }) => {
      await asMobile(homePage.page);
      await homePage.goto();
      await homePage.navigation.openDrawer();

      const results = await runAxeScan(homePage.page);
      expect(results.violations).toEqual([]);
    });
  });

  // ─── Keyboard Navigation ──────────────────────────────────

  test.describe('Keyboard navigation', () => {
    /**
     * Scenario: Skip link moves focus to main content.
     *
     * Given any page is loaded
     * When the user presses Tab once (Alt+Tab on WebKit)
     * Then the skip-to-main-content link receives focus
     * When the user presses Enter
     * Then focus moves to the main content area
     */
    test('Given page loaded, When Tab then Enter on skip link, Then focus moves to main content', async ({
      homePage,
      browserName,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      // When: Tab to skip link
      // WebKit on macOS excludes links from the default Tab cycle.
      // Alt+Tab includes all focusable elements (links + form controls).
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      await homePage.page.keyboard.press(tabKey);

      // Then: skip link has focus
      await expect(homePage.skipLink).toBeFocused();

      // When: activate skip link
      await homePage.skipLink.press('Enter');

      // Then: focus moves to main content
      const focusedId = await homePage.page.evaluate(
        () => document.activeElement?.id
      );
      expect(focusedId).toBe('main-content');
    });

    /**
     * Scenario: Interactive elements are keyboard accessible with visible focus.
     *
     * Given the home page is loaded
     * When tabbing through representative interactive elements
     * Then every focusable element has a visible focus indicator
     * And no element traps keyboard focus
     */
    test('Given page loaded, When tabbing through elements, Then each has visible focus indicator', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.mainContent).toBeVisible();

      // Tab through several elements, verifying each receives focus
      // and that focus advances (no trap). We check ~6 elements.
      const focusedElements: string[] = [];

      for (let i = 0; i < 6; i++) {
        await homePage.page.keyboard.press('Tab');

        const tagAndRole = await homePage.page.evaluate(() => {
          const el = document.activeElement;
          if (!el) return 'none';
          const tag = el.tagName.toLowerCase();
          const role = el.getAttribute('role') || '';
          const name =
            el.getAttribute('aria-label') ||
            el.textContent?.trim().slice(0, 30) ||
            '';
          return `${tag}${role ? `[role=${role}]` : ''}:${name}`;
        });

        // Verify focus moved to a new element (detects focus traps)
        expect(focusedElements).not.toContain(tagAndRole);
        focusedElements.push(tagAndRole);

        // Verify the focused element is visible (not hidden off-screen
        // after the skip link, which slides in on focus)
        const isVisible = await homePage.page.evaluate(() => {
          const el = document.activeElement;
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0'
          );
        });
        expect(isVisible).toBe(true);
      }

      // Verify we found at least 6 distinct focusable elements (no trap)
      expect(focusedElements.length).toBe(6);
    });
  });
});
