/**
 * ProjectLightbox sub-POM — dialog, keyboard/button/swipe navigation.
 *
 * The lightbox uses `next/dynamic` with `ssr: false` — the component chunk
 * loads only after the first thumbnail click. `waitForOpen()` accounts for
 * both chunk loading and the dialog mount.
 *
 * The `swipe()` method uses mouse-based gesture simulation for cross-browser
 * compatibility. Note: the production `useSwipe` hook listens for
 * `touchstart`/`touchend` events, so mouse-based simulation may not trigger
 * the handler in all browsers. Test specs should verify and annotate accordingly.
 *
 * @module e2e/components/ProjectLightbox
 */
import type { Locator, Page } from '@playwright/test';

/** Swipe direction for gesture simulation. */
type SwipeDirection = 'left' | 'right';

/** ProjectLightbox sub-POM for image lightbox dialog interactions. */
export class ProjectLightbox {
  /** Page instance for keyboard and mouse interactions. */
  readonly page: Page;

  /** Lightbox dialog container. */
  readonly dialog: Locator;

  /** Close button inside the lightbox. */
  readonly closeButton: Locator;

  /** Previous image navigation button. */
  readonly prevButton: Locator;

  /** Next image navigation button. */
  readonly nextButton: Locator;

  /**
   * ARIA live region announcing image position to screen readers.
   * Uses `role="status"` with `aria-live="assertive"`.
   *
   * Only rendered when the project has more than one image
   * (`showNavigation` is true). Tests for single-image projects
   * should not assert on this locator.
   */
  readonly liveRegion: Locator;

  /**
   * Visual counter showing "N of M" (aria-hidden, for sighted users).
   * The screen reader equivalent is in the live region.
   */
  readonly counter: Locator;

  /**
   * Create a ProjectLightbox sub-POM bound to the given page.
   *
   * @param page - Playwright Page instance used for all locator queries
   */
  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: /image lightbox/i });
    this.closeButton = page.getByRole('button', { name: /close lightbox/i });
    this.prevButton = page.getByRole('button', { name: /previous image/i });
    this.nextButton = page.getByRole('button', { name: /next image/i });
    this.liveRegion = this.dialog.locator(
      '[role="status"][aria-live="assertive"]'
    );
    this.counter = this.dialog
      .locator('[aria-hidden="true"]')
      .filter({ hasText: /of/i });
  }

  /**
   * Wait for the lightbox dialog to open and become fully visible.
   *
   * Uses extended timeout to account for `next/dynamic` chunk loading
   * on first open. After the dialog becomes visible, waits for the MUI
   * Fade transition (300ms) to complete so axe-core computes correct
   * contrast ratios against fully opaque elements.
   *
   * @returns Resolves when the lightbox is fully visible and the Fade transition has completed
   */
  async waitForOpen(): Promise<void> {
    await this.dialog.waitFor({ state: 'visible', timeout: 10_000 });
    // Wait for MUI Fade transition to reach full opacity (300ms + margin)
    await this.page.waitForTimeout(500);
  }

  /**
   * Wait for the lightbox dialog to close and become hidden.
   */
  async waitForClose(): Promise<void> {
    await this.dialog.waitFor({ state: 'hidden' });
  }

  /**
   * Close the lightbox by clicking the close button.
   */
  async closeByButton(): Promise<void> {
    await this.closeButton.click();
    await this.waitForClose();
  }

  /**
   * Close the lightbox by pressing the Escape key.
   */
  async closeByKeyboard(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.waitForClose();
  }

  /**
   * Navigate to the next image using the ArrowRight key.
   */
  async nextByKeyboard(): Promise<void> {
    await this.page.keyboard.press('ArrowRight');
  }

  /**
   * Navigate to the previous image using the ArrowLeft key.
   */
  async prevByKeyboard(): Promise<void> {
    await this.page.keyboard.press('ArrowLeft');
  }

  /**
   * Simulate a swipe gesture using mouse events.
   *
   * Uses mouse.down → mouse.move → mouse.up to simulate touch swipes.
   * Note: production `useSwipe` uses touch events, so this may not
   * trigger in all browsers. Annotate tests accordingly.
   *
   * @param direction - Swipe direction ('left' advances, 'right' goes back)
   */
  async swipe(direction: SwipeDirection): Promise<void> {
    const box = await this.dialog.boundingBox();
    if (!box) return;

    const centerY = box.y + box.height / 2;
    const startX =
      direction === 'left' ? box.x + box.width * 0.8 : box.x + box.width * 0.2;
    const endX =
      direction === 'left' ? box.x + box.width * 0.2 : box.x + box.width * 0.8;

    await this.page.mouse.move(startX, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, centerY, { steps: 10 });
    await this.page.mouse.up();
  }

  /**
   * Read the visual counter text (e.g., "2 of 5").
   *
   * @returns The counter text content, or null if not found
   */
  async getCounterText(): Promise<string | null> {
    return this.counter.textContent();
  }
}
