# Test Scenarios: Project Lightbox

**Type:** E2E (Playwright)
**Spec file:** `v2/e2e/specs/lightbox.spec.ts`

Full-screen image viewer with keyboard navigation, touch gestures, image preloading, and ARIA status announcements.

The lightbox uses a `role="status"` element with `aria-live="assertive"` to announce image position changes.

## Implementation Notes

- **Open/close tests** use project index 0 (4 images) for simplicity
- **Navigation tests** use project index 1 (8 images) for wrap-around coverage
- **Touch gestures** dispatch real `TouchEvent` objects via `Event` + `Object.defineProperty` in `locator.evaluate()` — the `Touch()` constructor is unavailable in Desktop Safari/WebKit
- **Focus after close**: the triggering `<img>` is not natively focusable, and the lightbox unmounts via conditional rendering (`selectedIndex === null`), so focus falls to `#main-content` rather than the thumbnail
- **Single-image edge case**: dropped — no single-image projects exist in the current dataset
- **Counter locator**: `p[aria-hidden="true"]` filtered by `/^\d+ of \d+$/` to avoid matching caption text
- **ARIA live region locator**: `[role="status"][aria-live="assertive"]` disambiguates from the loading spinner's `role="status"` (which has no `aria-live`)

```gherkin
Feature: Project Lightbox

  # ─── Open / Close ─────────────────────────────────────────

  Scenario: Clicking a thumbnail opens the lightbox
    Given the home page is loaded
    When the user clicks on a project thumbnail
    Then the lightbox dialog opens
    And the image counter shows "1 of N"

  Scenario: Close lightbox via close button
    Given the lightbox is open
    When the user clicks the close button
    Then the lightbox dialog closes

  Scenario: Close lightbox via Escape key
    Given the lightbox is open
    When the user presses Escape
    Then the lightbox dialog closes

  Scenario: Focus is not trapped after close
    Given the lightbox is open
    When the user closes the lightbox
    Then the lightbox dialog closes
    And focus falls to #main-content (not the thumbnail)

  # ─── Keyboard Navigation ──────────────────────────────────

  Scenario: ArrowRight navigates to next image
    Given the lightbox is open on image 1 of 8
    When the user presses ArrowRight
    Then the counter updates to "2 of 8"

  Scenario: ArrowLeft navigates to previous image
    Given the lightbox is open on image 2 of 8
    When the user presses ArrowLeft
    Then the counter updates to "1 of 8"

  Scenario: ArrowRight on last image wraps to first
    Given the lightbox is open on image 8 of 8
    When the user presses ArrowRight
    Then the counter wraps to "1 of 8"

  Scenario: ArrowLeft on first image wraps to last
    Given the lightbox is open on image 1 of 8
    When the user presses ArrowLeft
    Then the counter wraps to "8 of 8"

  # ─── Button Navigation ────────────────────────────────────

  Scenario: Next button navigates forward
    Given the lightbox is open on image 1 of 8
    When the user clicks the next button
    Then the counter updates to "2 of 8"

  Scenario: Previous button navigates backward
    Given the lightbox is open on image 2 of 8
    When the user clicks the previous button
    Then the counter updates to "1 of 8"

  # ─── Touch Gestures ───────────────────────────────────────

  Scenario: Swipe left navigates to next image
    Given the lightbox is open on image 1 of 8
    When the user swipes left
    Then the counter updates to "2 of 8"

  Scenario: Swipe right navigates to previous image
    Given the lightbox is open on image 2 of 8
    When the user swipes right
    Then the counter updates to "1 of 8"

  # ─── ARIA Live Region ─────────────────────────────────────

  Scenario: Live region announces image position
    Given the lightbox is open on image 1 of 8
    When the user navigates to image 2
    Then the ARIA live region announces "2 of 8"
```
