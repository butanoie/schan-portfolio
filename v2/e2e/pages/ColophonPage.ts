/**
 * ColophonPage POM — the colophon page (/colophon).
 *
 * Three main sections identified by `aria-labelledby`, plus the V1
 * accordion which uses stable MUI-generated IDs for its header and
 * content panels.
 *
 * @module e2e/pages/ColophonPage
 */
import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** ColophonPage POM for the colophon route (/colophon). */
export class ColophonPage extends BasePage {
  /** Technologies showcase section. */
  readonly technologiesSection: Locator;

  /** Design philosophy section. */
  readonly designSection: Locator;

  /** Buta mascot story section (heading is visually hidden / sr-only). */
  readonly butaSection: Locator;

  /** V1 technologies accordion container. */
  readonly v1Accordion: Locator;

  /** V1 accordion summary (clickable header). */
  readonly v1AccordionSummary: Locator;

  /** V1 accordion content panel. */
  readonly v1AccordionContent: Locator;

  /**
   * Initialize colophon-specific section and accordion locators.
   *
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    this.technologiesSection = page.locator(
      'section[aria-labelledby="technologies-heading"]'
    );
    this.designSection = page.locator(
      'section[aria-labelledby="design-heading"]'
    );
    this.butaSection = page.locator('section[aria-labelledby="buta-heading"]');
    this.v1Accordion = page.locator('#v1-accordion');
    this.v1AccordionSummary = page.locator('#v1-technologies-header');
    // MUI Accordion wraps AccordionDetails in a region div that
    // also receives the id from aria-controls, creating duplicate IDs.
    // Target the AccordionDetails element specifically.
    this.v1AccordionContent = page.locator(
      '#v1-accordion .MuiAccordionDetails-root'
    );
  }

  /**
   * Navigate to the colophon page.
   */
  async goto(): Promise<void> {
    await super.goto('/colophon');
  }

  /**
   * Expand the V1 technologies accordion if it is currently collapsed.
   */
  async expandV1Accordion(): Promise<void> {
    await this.setAccordionState(true);
  }

  /**
   * Collapse the V1 technologies accordion if it is currently expanded.
   */
  async collapseV1Accordion(): Promise<void> {
    await this.setAccordionState(false);
  }

  /**
   * Set the V1 accordion to the desired expanded/collapsed state.
   *
   * Checks `aria-expanded` before clicking to avoid toggling in the
   * wrong direction.
   *
   * @param expanded - Whether the accordion should be expanded
   */
  private async setAccordionState(expanded: boolean): Promise<void> {
    const current = await this.v1AccordionSummary.getAttribute('aria-expanded');
    if ((current === 'true') !== expanded) {
      await this.v1AccordionSummary.click();
      await this.v1AccordionContent.waitFor({
        state: expanded ? 'visible' : 'hidden',
      });
    }
  }
}
