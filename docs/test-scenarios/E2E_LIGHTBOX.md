# Test Scenarios: Project Lightbox

**Type:** E2E (Playwright)
**Spec file:** `v2/e2e/specs/lightbox.spec.ts`

Full-screen image viewer with keyboard navigation, touch gestures, image preloading, and ARIA status announcements.

The lightbox uses a `role="status"` element with `aria-live="assertive"` to announce image position changes.

```gherkin
Feature: Project Lightbox

  # ─── Open / Close ─────────────────────────────────────────

  Scenario: Clicking a thumbnail opens the lightbox
    Given the home page is loaded
    When the user clicks on a project thumbnail
    Then the lightbox dialog opens
    And the clicked image is displayed
    And the image counter shows "1 of N"

  Scenario: Close lightbox via close button
    Given the lightbox is open
    When the user clicks the close button
    Then the lightbox dialog closes
    And focus returns to the triggering thumbnail

  Scenario: Close lightbox via Escape key
    Given the lightbox is open
    When the user presses Escape
    Then the lightbox dialog closes

  # ─── Keyboard Navigation ──────────────────────────────────

  Scenario: ArrowRight navigates to next image
    Given the lightbox is open on image 1 of N
    When the user presses ArrowRight
    Then image 2 is displayed
    And the counter updates to "2 of N"
    And the ARIA status region announces the new image position

  Scenario: ArrowLeft navigates to previous image
    Given the lightbox is open on image 2 of N
    When the user presses ArrowLeft
    Then image 1 is displayed
    And the counter updates to "1 of N"

  Scenario: ArrowRight on last image wraps to first
    Given the lightbox is open on the last image
    When the user presses ArrowRight
    Then the first image is displayed

  Scenario: ArrowLeft on first image wraps to last
    Given the lightbox is open on the first image
    When the user presses ArrowLeft
    Then the last image is displayed

  # ─── Button Navigation ────────────────────────────────────

  Scenario: Next button navigates forward
    Given the lightbox is open
    When the user clicks the next button
    Then the next image is displayed

  Scenario: Previous button navigates backward
    Given the lightbox is open on image 2
    When the user clicks the previous button
    Then the previous image is displayed

  # ─── Touch Gestures ───────────────────────────────────────

  Scenario: Swipe left navigates to next image
    Given the lightbox is open
    When the user swipes left
    Then the next image is displayed

  Scenario: Swipe right navigates to previous image
    Given the lightbox is open on image 2
    When the user swipes right
    Then the previous image is displayed

  # ─── Edge Cases ────────────────────────────────────────────

  Scenario: Single-image project hides navigation buttons
    Given a project has only one image
    When the lightbox is opened for that project
    Then no next/previous buttons are visible
    And the counter shows "1 of 1"
```
