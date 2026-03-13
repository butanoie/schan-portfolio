/**
 * Colophon — section presence, V1 accordion, technology links, and French locale.
 *
 * Verifies the three colophon sections are visible, the V1 technologies
 * accordion starts collapsed and toggles correctly, technology card
 * external links carry the "visit website" aria-label pattern, and
 * French locale translates section headings.
 *
 * Scenario doc: docs/test-scenarios/E2E_CONTENT_PAGES.md
 *
 * @module e2e/specs/colophon.spec
 */
import { test, expect } from '../fixtures/base.fixture';
import { seedLocale } from '../helpers/storage';

test.describe('Colophon', () => {
  // ─── Section Presence ──────────────────────────────────────

  test.describe('Section presence', () => {
    /**
     * ```gherkin
     * Given the colophon page is loaded
     * When the main content is visible
     * Then the technologies, design, and buta sections are all visible
     * ```
     */
    test('Given colophon page loaded, When content visible, Then all 3 sections are present', async ({
      colophonPage,
    }) => {
      await colophonPage.goto();
      await expect(colophonPage.mainContent).toBeVisible();

      await expect(colophonPage.technologiesSection).toBeVisible();
      await expect(colophonPage.designSection).toBeVisible();
      await expect(colophonPage.butaSection).toBeVisible();
    });
  });

  // ─── V1 Accordion ──────────────────────────────────────────

  test.describe('V1 accordion', () => {
    /**
     * ```gherkin
     * Given the colophon page is loaded
     * When the main content is visible
     * Then the V1 accordion summary has aria-expanded="false"
     * And the V1 accordion content is hidden
     * ```
     */
    test('Given colophon page loaded, When content visible, Then V1 accordion starts collapsed', async ({
      colophonPage,
    }) => {
      await colophonPage.goto();
      await expect(colophonPage.mainContent).toBeVisible();

      await expect(colophonPage.v1AccordionSummary).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      await expect(colophonPage.v1AccordionContent).toBeHidden();
    });

    /**
     * ```gherkin
     * Given the colophon page is loaded
     * And the V1 accordion is collapsed
     * When the accordion header is clicked
     * Then the accordion content becomes visible
     * When the accordion header is clicked again
     * Then the accordion content is hidden
     * ```
     */
    test('Given V1 accordion collapsed, When expanded then collapsed, Then content toggles visibility', async ({
      colophonPage,
    }) => {
      await colophonPage.goto();
      await expect(colophonPage.mainContent).toBeVisible();

      await colophonPage.expandV1Accordion();
      await expect(colophonPage.v1AccordionSummary).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      await expect(colophonPage.v1AccordionContent).toBeVisible();

      await colophonPage.collapseV1Accordion();
      await expect(colophonPage.v1AccordionSummary).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      await expect(colophonPage.v1AccordionContent).toBeHidden();
    });
  });

  // ─── Technology Card Links ─────────────────────────────────

  test.describe('Technology card links', () => {
    /**
     * ```gherkin
     * Given the colophon page is loaded
     * When the technologies section is visible
     * Then at least one link matches the "Visit <name> website" aria-label pattern
     * ```
     */
    test('Given colophon page loaded, When technologies section visible, Then tech cards have visit-website links', async ({
      colophonPage,
    }) => {
      await colophonPage.goto();
      await expect(colophonPage.technologiesSection).toBeVisible();

      const visitLinks = colophonPage.technologiesSection.getByRole('link', {
        name: /visit .+ website/i,
      });
      await expect(visitLinks.first()).toBeVisible();
    });
  });

  // ─── French Locale ─────────────────────────────────────────

  test.describe('French locale', () => {
    /**
     * ```gherkin
     * Given the French locale is seeded in localStorage
     * And the colophon page is loaded
     * When the main content is visible
     * Then the design heading reads "Conception et typographie"
     * And the buta heading reads "L'histoire de Buta"
     * ```
     */
    test('Given French locale seeded, When colophon page loaded, Then section headings are in French', async ({
      colophonPage,
    }) => {
      await seedLocale(colophonPage.page, 'fr');
      await colophonPage.goto();
      await expect(colophonPage.mainContent).toBeVisible();

      await expect(
        colophonPage.designSection.getByRole('heading', {
          name: /conception et typographie/i,
        })
      ).toBeVisible();
      await expect(
        colophonPage.butaSection.getByRole('heading', {
          name: /l'histoire de buta/i,
        })
      ).toBeVisible();
    });
  });
});
