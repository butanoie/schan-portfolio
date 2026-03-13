/**
 * Resume — section presence, contact links, PDF download, and French locale.
 *
 * Verifies all 7 résumé sections are visible, contact buttons carry
 * correct href patterns (LinkedIn, GitHub, mailto, tel), the PDF
 * download link has the "(opens in new tab)" aria-label suffix and
 * points to a .pdf file, and French locale translates section headings.
 *
 * Scenario doc: docs/test-scenarios/E2E_CONTENT_PAGES.md
 *
 * @module e2e/specs/resume.spec
 */
import { test, expect } from '../fixtures/base.fixture';
import { seedLocale } from '../helpers/storage';

test.describe('Resume', () => {
  // ─── Section Presence ──────────────────────────────────────

  test.describe('Section presence', () => {
    /**
     * ```gherkin
     * Given the résumé page is loaded
     * When the main content is visible
     * Then the header, summary, work experience, skills, education,
     * clients, and speaking sections are all visible
     * ```
     */
    test('Given resume page loaded, When content visible, Then all 7 sections are present', async ({
      resumePage,
    }) => {
      await resumePage.goto();
      await expect(resumePage.mainContent).toBeVisible();

      await expect(resumePage.headerSection).toBeVisible();
      await expect(resumePage.summarySection).toBeVisible();
      await expect(resumePage.workSection).toBeVisible();
      await expect(resumePage.skillsSection).toBeVisible();
      await expect(resumePage.educationSection).toBeVisible();
      await expect(resumePage.clientsSection).toBeVisible();
      await expect(resumePage.speakingSection).toBeVisible();
    });
  });

  // ─── Contact Links ─────────────────────────────────────────

  test.describe('Contact links', () => {
    /**
     * ```gherkin
     * Given the résumé page is loaded
     * When the header section is visible
     * Then a contact link with href containing "linkedin.com" is present
     * And a contact link with href containing "github.com" is present
     * And a contact link with href beginning with "mailto:" is present
     * And a contact link with href beginning with "tel:" is present
     * ```
     */
    test('Given resume page loaded, When header visible, Then LinkedIn, GitHub, email, and phone links are present', async ({
      resumePage,
    }) => {
      await resumePage.goto();
      await expect(resumePage.headerSection).toBeVisible();

      // LinkedIn
      await expect(
        resumePage.headerSection.locator('a[href*="linkedin.com"]')
      ).toHaveCount(1);

      // GitHub
      await expect(
        resumePage.headerSection.locator('a[href*="github.com"]')
      ).toHaveCount(1);

      // Email (rot13-decoded at render time → mailto: href)
      await expect(
        resumePage.headerSection.locator('a[href^="mailto:"]')
      ).toHaveCount(1);

      // Phone (rot13-decoded at render time → tel: href)
      await expect(
        resumePage.headerSection.locator('a[href^="tel:"]')
      ).toHaveCount(1);
    });
  });

  // ─── PDF Download ──────────────────────────────────────────

  test.describe('PDF download', () => {
    /**
     * ```gherkin
     * Given the résumé page is loaded
     * When the header section is visible
     * Then a link with "(opens in new tab)" in its aria-label is visible
     * And its href attribute ends with ".pdf"
     * ```
     */
    test('Given resume page loaded, When header visible, Then PDF download link is visible with .pdf href', async ({
      resumePage,
    }) => {
      await resumePage.goto();
      await expect(resumePage.headerSection).toBeVisible();

      const pdfLink = resumePage.pdfDownloadButton();
      await expect(pdfLink).toBeVisible();
      await expect(pdfLink).toHaveAttribute('href', /\.pdf$/i);
    });
  });

  // ─── French Locale ─────────────────────────────────────────

  test.describe('French locale', () => {
    /**
     * ```gherkin
     * Given the French locale is seeded in localStorage
     * And the résumé page is loaded
     * When the main content is visible
     * Then the professional summary heading reads "Résumé professionnel"
     * And the work experience heading reads "Expérience professionnelle"
     * ```
     */
    test('Given French locale seeded, When resume page loaded, Then section headings are in French', async ({
      resumePage,
    }) => {
      await seedLocale(resumePage.page, 'fr');
      await resumePage.goto();
      await expect(resumePage.mainContent).toBeVisible();

      await expect(
        resumePage.summarySection.getByRole('heading', {
          name: /résumé professionnel/i,
        })
      ).toBeVisible();
      await expect(
        resumePage.workSection.getByRole('heading', {
          name: /expérience professionnelle/i,
        })
      ).toBeVisible();
    });
  });
});
