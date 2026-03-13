/**
 * Samples — artifact sections, download buttons, no-download edge case,
 * and French locale.
 *
 * Verifies all 5 artifact sections render, download buttons carry PDF or
 * Markdown format labels in their aria-labels, the Cost Savings section
 * contains an artifact without a download button, and French locale
 * translates section headings.
 *
 * Section order (locale-independent, positional):
 * nth(0) — Defining the Vision (Product Strategy)
 * nth(1) — Designing the Experience (UX Design)
 * nth(2) — Evaluating the Technology (Technical)
 * nth(3) — Operationalizing the Practice (Process & Ops)
 * nth(4) — Measuring the Impact (Cost Savings)
 *
 * Scenario doc: docs/test-scenarios/E2E_CONTENT_PAGES.md
 *
 * @module e2e/specs/samples.spec
 */
import { test, expect } from '../fixtures/base.fixture';
import { seedLocale } from '../helpers/storage';

/** Total number of artifact sections on the samples page. */
const ARTIFACT_SECTION_COUNT = 5;

/**
 * Cost Savings section index (0-based) — the only section containing
 * an artifact (Cost Savings Roadmap) without a download button.
 */
const COST_SAVINGS_INDEX = 4;

/** Number of items with download buttons in the Cost Savings section. */
const COST_SAVINGS_DOWNLOAD_COUNT = 3;

/** Number of items in the Cost Savings section. */
const COST_SAVINGS_ITEM_COUNT = 4;

test.describe('Samples', () => {
  // ─── Artifact Section Presence ─────────────────────────────

  test.describe('Artifact section presence', () => {
    /**
     * ```gherkin
     * Given the samples page is loaded
     * When the main content is visible
     * Then exactly 5 artifact sections are present
     * ```
     */
    test('Given samples page loaded, When content visible, Then all 5 artifact sections are present', async ({
      samplesPage,
    }) => {
      await samplesPage.goto();
      await expect(samplesPage.mainContent).toBeVisible();

      await expect(samplesPage.allArtifactSections()).toHaveCount(
        ARTIFACT_SECTION_COUNT
      );
    });
  });

  // ─── Download Buttons ──────────────────────────────────────

  test.describe('Download buttons', () => {
    /**
     * ```gherkin
     * Given the samples page is loaded
     * When the main content is visible
     * Then every download link has an aria-label containing "PDF" or "Markdown"
     * ```
     */
    test('Given samples page loaded, When content visible, Then download links have PDF or Markdown in aria-labels', async ({
      samplesPage,
    }) => {
      await samplesPage.goto();
      await expect(samplesPage.mainContent).toBeVisible();

      // All download links across all sections share the
      // "View document: <title>, <format>" aria-label pattern
      const allDownloadLinks = samplesPage.mainContent.getByRole('link', {
        name: /view document/i,
      });

      await expect(allDownloadLinks).not.toHaveCount(0);

      // Every download link must reference PDF or Markdown
      const count = await allDownloadLinks.count();
      for (let i = 0; i < count; i++) {
        await expect(allDownloadLinks.nth(i)).toHaveAttribute(
          'aria-label',
          /pdf|markdown/i
        );
      }
    });
  });

  // ─── Cost Savings — No Download ────────────────────────────

  test.describe('Cost Savings section', () => {
    /**
     * ```gherkin
     * Given the samples page is loaded
     * When the 5th artifact section (Cost Savings, index 4) is visible
     * Then the section has 4 card headings but only 3 download links
     * ```
     */
    test('Given samples page loaded, When Cost Savings section visible, Then one artifact has no download button', async ({
      samplesPage,
    }) => {
      await samplesPage.goto();
      await expect(samplesPage.mainContent).toBeVisible();

      const costSection = samplesPage
        .allArtifactSections()
        .nth(COST_SAVINGS_INDEX);
      await expect(costSection).toBeVisible();

      // 4 items in the section, but only 3 have format → download buttons
      const downloadLinks = samplesPage.downloadButtons(costSection);
      await expect(downloadLinks).toHaveCount(COST_SAVINGS_DOWNLOAD_COUNT);

      // Verify the section has more card headings than download links
      const cardHeadings = costSection.getByRole('heading', { level: 3 });
      await expect(cardHeadings).toHaveCount(COST_SAVINGS_ITEM_COUNT);
    });
  });

  // ─── French Locale ─────────────────────────────────────────

  test.describe('French locale', () => {
    /**
     * ```gherkin
     * Given the French locale is seeded in localStorage
     * And the samples page is loaded
     * When the main content is visible
     * Then the first section heading reads "Définir la vision"
     * And the last section heading reads "Mesurer l'impact"
     * ```
     */
    test('Given French locale seeded, When samples page loaded, Then section headings are in French', async ({
      samplesPage,
    }) => {
      await seedLocale(samplesPage.page, 'fr');
      await samplesPage.goto();
      await expect(samplesPage.mainContent).toBeVisible();

      // First and last sections verify i18n loaded for this page namespace
      await expect(samplesPage.allArtifactSections().nth(0)).toContainText(
        'Définir la vision'
      );
      await expect(
        samplesPage.allArtifactSections().nth(COST_SAVINGS_INDEX)
      ).toContainText("Mesurer l'impact");
    });
  });
});
