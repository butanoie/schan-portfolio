/**
 * Lightbox — open/close, keyboard/button/touch navigation, and ARIA.
 *
 * Tests all lightbox interaction modes: opening via thumbnail click, closing
 * via button and Escape, keyboard navigation (ArrowLeft/ArrowRight with
 * circular wrap-around), button navigation (prev/next), touch swipe gestures,
 * focus return to the triggering thumbnail, and ARIA live region announcements.
 *
 * Scenario doc: docs/test-scenarios/E2E_LIGHTBOX.md
 *
 * @module e2e/specs/lightbox.spec
 */
import { test, expect } from '../fixtures/base.fixture';

/** Project index used for simple open/close tests (4 images). */
const OPEN_CLOSE_PROJECT = 0;

/** Project index used for navigation tests (8 images — good for wrap-around). */
const NAV_PROJECT = 1;

/** Total image count for the navigation project. */
const NAV_PROJECT_IMAGE_COUNT = 8;

/** Last image index in the navigation project. */
const LAST_IMAGE_INDEX = NAV_PROJECT_IMAGE_COUNT - 1;

test.describe('Lightbox — Open / Close', () => {
  // ─── Open ───────────────────────────────────────────────────────

  /**
   * ```gherkin
   * Given the home page is loaded
   * When the user clicks on a project thumbnail
   * Then the lightbox dialog opens
   * And the image counter shows "1 of N"
   * ```
   */
  test('Given gallery thumbnail, When clicked, Then lightbox opens with counter', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(OPEN_CLOSE_PROJECT, 0);

    await expect(homePage.lightbox.dialog).toBeVisible();
    await expect(homePage.lightbox.counter).toHaveText(/1 of \d+/);
  });

  // ─── Close via Button ───────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open
   * When the user clicks the close button
   * Then the lightbox dialog closes
   * ```
   */
  test('Given open lightbox, When close button clicked, Then lightbox closes', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(OPEN_CLOSE_PROJECT, 0);

    await homePage.lightbox.closeByButton();

    await expect(homePage.lightbox.dialog).toBeHidden();
  });

  // ─── Close via Escape ───────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open
   * When the user presses Escape
   * Then the lightbox dialog closes
   * ```
   */
  test('Given open lightbox, When Escape pressed, Then lightbox closes', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(OPEN_CLOSE_PROJECT, 0);

    await homePage.lightbox.closeByKeyboard();

    await expect(homePage.lightbox.dialog).toBeHidden();
  });

  // ─── Focus Return ──────────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open (opened from thumbnail 0)
   * When the user closes the lightbox
   * Then focus returns to the triggering thumbnail button
   * ```
   *
   * Thumbnails are wrapped in `<button>` elements for keyboard access.
   * On lightbox close, `ProjectGallery` restores focus to the button
   * that originally opened the lightbox (WCAG 2.4.3 Focus Order).
   */
  test('Given open lightbox, When closed, Then focus returns to triggering thumbnail', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(OPEN_CLOSE_PROJECT, 0);

    await homePage.lightbox.closeByButton();

    await expect(homePage.lightbox.dialog).toBeHidden();
    // Focus returns to the thumbnail button that opened the lightbox
    await expect(
      homePage.galleryThumbnailButtons(OPEN_CLOSE_PROJECT).nth(0)
    ).toBeFocused();
  });
});

test.describe('Lightbox — Keyboard Navigation', () => {
  // ─── ArrowRight ─────────────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on image 1 of 8
   * When the user presses ArrowRight
   * Then image 2 is displayed
   * And the counter updates to "2 of 8"
   * ```
   */
  test('Given image 1 of 8, When ArrowRight pressed, Then counter shows 2 of 8', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, 0);

    await homePage.lightbox.nextByKeyboard();

    await expect(homePage.lightbox.counter).toHaveText(/2 of 8/);
  });

  // ─── ArrowLeft ──────────────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on image 2 of 8
   * When the user presses ArrowLeft
   * Then image 1 is displayed
   * And the counter updates to "1 of 8"
   * ```
   */
  test('Given image 2 of 8, When ArrowLeft pressed, Then counter shows 1 of 8', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, 1);

    await homePage.lightbox.prevByKeyboard();

    await expect(homePage.lightbox.counter).toHaveText(/1 of 8/);
  });

  // ─── Wrap Forward ──────────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on the last image (8 of 8)
   * When the user presses ArrowRight
   * Then the first image is displayed
   * And the counter wraps to "1 of 8"
   * ```
   */
  test('Given last image, When ArrowRight pressed, Then counter wraps to 1 of 8', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, LAST_IMAGE_INDEX);

    await homePage.lightbox.nextByKeyboard();

    await expect(homePage.lightbox.counter).toHaveText(/1 of 8/);
  });

  // ─── Wrap Backward ─────────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on the first image (1 of 8)
   * When the user presses ArrowLeft
   * Then the last image is displayed
   * And the counter wraps to "8 of 8"
   * ```
   */
  test('Given first image, When ArrowLeft pressed, Then counter wraps to 8 of 8', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, 0);

    await homePage.lightbox.prevByKeyboard();

    await expect(homePage.lightbox.counter).toHaveText(/8 of 8/);
  });
});

test.describe('Lightbox — Button Navigation', () => {
  // ─── Next Button ────────────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on image 1 of 8
   * When the user clicks the next button
   * Then the counter updates to "2 of 8"
   * ```
   */
  test('Given image 1 of 8, When Next button clicked, Then counter shows 2 of 8', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, 0);

    await homePage.lightbox.nextButton.click();

    await expect(homePage.lightbox.counter).toHaveText(/2 of 8/);
  });

  // ─── Previous Button ───────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on image 2 of 8
   * When the user clicks the previous button
   * Then the counter updates to "1 of 8"
   * ```
   */
  test('Given image 2 of 8, When Prev button clicked, Then counter shows 1 of 8', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, 1);

    await homePage.lightbox.prevButton.click();

    await expect(homePage.lightbox.counter).toHaveText(/1 of 8/);
  });
});

test.describe('Lightbox — Touch Gestures', () => {
  // ─── Swipe Left (Next) ─────────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on image 1 of 8
   * When the user swipes left
   * Then the next image is displayed
   * And the counter updates to "2 of 8"
   * ```
   */
  test('Given image 1 of 8, When swiped left, Then counter shows 2 of 8', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, 0);

    await homePage.lightbox.swipeByTouch('left');

    await expect(homePage.lightbox.counter).toHaveText(/2 of 8/);
  });

  // ─── Swipe Right (Previous) ────────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on image 2 of 8
   * When the user swipes right
   * Then the previous image is displayed
   * And the counter updates to "1 of 8"
   * ```
   */
  test('Given image 2 of 8, When swiped right, Then counter shows 1 of 8', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, 1);

    await homePage.lightbox.swipeByTouch('right');

    await expect(homePage.lightbox.counter).toHaveText(/1 of 8/);
  });
});

test.describe('Lightbox — ARIA Live Region', () => {
  // ─── Announcement on Navigation ────────────────────────────────

  /**
   * ```gherkin
   * Given the lightbox is open on image 1 of 8
   * When the user navigates to image 2
   * Then the ARIA live region announces the new image position
   * ```
   */
  test('Given image 1 of 8, When navigated to image 2, Then live region announces position', async ({
    homePage,
  }) => {
    await homePage.goto();
    await homePage.openLightboxForImage(NAV_PROJECT, 0);

    await homePage.lightbox.nextByKeyboard();

    await expect(homePage.lightbox.liveRegion).toContainText(/2.*of.*8/i);
  });
});
