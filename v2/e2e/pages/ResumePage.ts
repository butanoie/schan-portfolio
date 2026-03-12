/**
 * ResumePage POM — the résumé page (/resume).
 *
 * All 7 sections use `aria-labelledby` with stable IDs matching the
 * heading element IDs in the resume components. Contact buttons and
 * the PDF download link are scoped to the header section.
 *
 * @module e2e/pages/ResumePage
 */
import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** ResumePage POM for the résumé route (/resume). */
export class ResumePage extends BasePage {
  /** Header section containing name, title, and contact info. */
  readonly headerSection: Locator;

  /** Professional summary section. */
  readonly summarySection: Locator;

  /** Work experience section. */
  readonly workSection: Locator;

  /** Skills section. */
  readonly skillsSection: Locator;

  /** Education section. */
  readonly educationSection: Locator;

  /** Clients section. */
  readonly clientsSection: Locator;

  /** Speaking engagements section. */
  readonly speakingSection: Locator;

  /**
   * Initialize résumé section locators from `aria-labelledby` IDs.
   *
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    this.headerSection = page.locator('section[aria-labelledby="resume-name"]');
    this.summarySection = page.locator(
      'section[aria-labelledby="professional-summary-heading"]'
    );
    this.workSection = page.locator(
      'section[aria-labelledby="work-experience-heading"]'
    );
    this.skillsSection = page.locator(
      'section[aria-labelledby="skills-heading"]'
    );
    this.educationSection = page.locator(
      'section[aria-labelledby="education-heading"]'
    );
    this.clientsSection = page.locator(
      'section[aria-labelledby="clients-heading"]'
    );
    this.speakingSection = page.locator(
      'section[aria-labelledby="speaking-heading"]'
    );
  }

  /**
   * Navigate to the résumé page.
   */
  async goto(): Promise<void> {
    await super.goto('/resume');
  }

  /**
   * Get all contact links in the header section.
   *
   * MUI `Button` with `href` renders as `<a>` elements.
   * Includes LinkedIn, GitHub, email, and phone links.
   *
   * @returns Locator for all contact link elements
   */
  contactButtons(): Locator {
    return this.headerSection.getByRole('link');
  }

  /**
   * Get the PDF download link in the header section.
   *
   * Identified by the "(opens in new tab)" suffix hardcoded in
   * `ResumeHeader.tsx`'s aria-label.
   *
   * @returns Locator for the PDF download link
   */
  pdfDownloadButton(): Locator {
    return this.headerSection.getByRole('link', { name: /opens in new tab/i });
  }
}
