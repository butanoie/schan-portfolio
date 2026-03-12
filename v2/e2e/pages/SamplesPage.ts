/**
 * SamplesPage POM — the writing samples page (/samples).
 *
 * Artifact sections use `aria-label` (not `aria-labelledby`) set by
 * `ArtifactSection.tsx`. Sections are locale-dependent when accessed
 * by heading text; use `allArtifactSections().nth(index)` for
 * locale-independent positional access.
 *
 * 5 sections in order: Product Strategy, UX Design, Technical,
 * Process & Ops, Cost Savings.
 *
 * @module e2e/pages/SamplesPage
 */
import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/** SamplesPage POM for the writing samples route (/samples). */
export class SamplesPage extends BasePage {
  /**
   * Navigate to the samples page.
   */
  async goto(): Promise<void> {
    await super.goto('/samples');
  }

  /**
   * Get an artifact section by its translated heading text.
   *
   * Matches the `aria-label` attribute set by `ArtifactSection.tsx`.
   * Note: heading text is locale-dependent.
   *
   * @param heading - The translated section heading text
   * @returns Locator for the section element
   */
  artifactSection(heading: string): Locator {
    return this.page.locator(`section[aria-label="${heading}"]`);
  }

  /**
   * Get all artifact sections for locale-independent positional access.
   *
   * Returns all 5 sections scoped to `#main-content` via `aria-label`
   * attribute presence. Use `.nth(index)` to access by position.
   *
   * @returns Locator for all artifact section elements
   */
  allArtifactSections(): Locator {
    return this.mainContent.locator('section[aria-label]');
  }

  /**
   * Get download buttons (rendered as `<a>` elements) within a section.
   *
   * Each download button has an `aria-label` containing the artifact
   * title and format. One artifact (Cost Savings Roadmap) has no
   * download button.
   *
   * @param section - Locator for the parent artifact section
   * @returns Locator for all download link elements in the section
   */
  downloadButtons(section: Locator): Locator {
    return section.getByRole('link');
  }
}
