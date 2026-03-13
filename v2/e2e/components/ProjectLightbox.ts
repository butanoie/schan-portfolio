/**
 * ProjectLightbox sub-POM — dialog, keyboard/button/swipe navigation.
 *
 * The lightbox uses `next/dynamic` with `ssr: false` — the component chunk
 * loads only after the first thumbnail click. `waitForOpen()` accounts for
 * both chunk loading and the dialog mount.
 *
 * Touch gestures use `swipeByTouch()`, which dispatches real `TouchEvent`
 * objects via `locator.evaluate()` inside the browser context. This correctly
 * exercises the production `useSwipe` hook that listens for
 * `touchstart`/`touchend`. The legacy `swipe()` method uses mouse events
 * and cannot trigger touch handlers — it is retained but deprecated.
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
   * Scoped with `[role="status"][aria-live="assertive"]` to distinguish it
   * from the loading spinner, which also uses `role="status"` but has no
   * `aria-live` attribute.
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
      .locator('p[aria-hidden="true"]')
      .filter({ hasText: /^\d+ of \d+$/ });
  }

  /**
   * Wait for the lightbox dialog to open and become fully visible.
   *
   * Uses extended timeout to account for `next/dynamic` chunk loading
   * on first open. CSS transition settling (e.g., MUI Fade opacity) is
   * handled by `runAxeScan()` via `waitForTransitionsToSettle()`, so no
   * additional delay is needed here.
   *
   * @returns Resolves when the lightbox is visible
   */
  async waitForOpen(): Promise<void> {
    await this.dialog.waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Wait for the lightbox dialog to close and become hidden.
   *
   * @returns Resolves when the lightbox is no longer visible
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
   * @deprecated Use {@link swipeByTouch} instead. The production `useSwipe`
   * hook listens for `touchstart`/`touchend` events. This mouse-based method
   * cannot trigger those handlers and is retained only as a reference.
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
   * Simulate a touch swipe by dispatching real `TouchEvent` objects.
   *
   * Constructs `Touch` and `TouchEvent` instances inside the browser via
   * `locator.evaluate()`, bypassing CDP serialization limits on `TouchList`.
   * This correctly exercises the production `useSwipe` hook, which reads
   * `e.touches[0].clientX` on `touchstart` and `e.changedTouches[0].clientX`
   * on `touchend`.
   *
   * The default delta of 80px clears the 50px `SWIPE_THRESHOLD` used by
   * `useSwipe` with comfortable margin. Override via `options.deltaX` for
   * threshold-boundary tests.
   *
   * Works on both Chromium and WebKit (Desktop Safari). Uses generic `Event`
   * objects with `touches`/`changedTouches` defined via `Object.defineProperty`
   * instead of the `Touch`/`TouchEvent` constructors, because Desktop Safari
   * (WebKit) does not support the `Touch()` constructor (iOS-only API).
   * The `useSwipe` hook only reads `e.touches[0].clientX` and
   * `e.changedTouches[0].clientX`, so plain coordinate objects suffice.
   *
   * @param direction - 'left' fires onSwipeLeft (next image); 'right' fires onSwipeRight (prev)
   * @param options - Optional overrides
   * @param options.deltaX - Horizontal swipe distance in pixels (default: 80)
   */
  async swipeByTouch(
    direction: SwipeDirection,
    options?: { deltaX?: number }
  ): Promise<void> {
    const box = await this.dialog.boundingBox();
    if (!box) return;

    const deltaX = options?.deltaX ?? 80;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // Left swipe: finger moves from right-of-center to left-of-center
    // Right swipe: finger moves from left-of-center to right-of-center
    const startX =
      direction === 'left' ? centerX + deltaX / 2 : centerX - deltaX / 2;
    const endX =
      direction === 'left' ? centerX - deltaX / 2 : centerX + deltaX / 2;

    await this.dialog.evaluate(
      (el, coords) => {
        // Use generic Event with defineProperty to attach touch data.
        // The Touch() constructor is unavailable in Desktop Safari/WebKit.
        const startEvent = new Event('touchstart', {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(startEvent, 'touches', {
          value: [{ clientX: coords.startX, clientY: coords.centerY }],
        });
        Object.defineProperty(startEvent, 'changedTouches', {
          value: [{ clientX: coords.startX, clientY: coords.centerY }],
        });

        const endEvent = new Event('touchend', {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(endEvent, 'touches', { value: [] });
        Object.defineProperty(endEvent, 'changedTouches', {
          value: [{ clientX: coords.endX, clientY: coords.centerY }],
        });

        el.dispatchEvent(startEvent);
        el.dispatchEvent(endEvent);
      },
      { startX, endX, centerY }
    );
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
