# Test Scenarios: Settings

**Type:** E2E (Playwright)
**Spec file:** `v2/e2e/specs/settings.spec.ts`

Theme switching, language switching, and animations toggle.

```gherkin
Feature: Settings

  # ─── Theme ─────────────────────────────────────────────────

  Scenario Outline: Switching to <theme> changes the visual appearance
    Given the home page is loaded
    When the user opens settings and selects <theme> theme
    Then the page renders with <theme> visual styling
    And the <theme> toggle button is in the pressed state

    Examples:
      | theme        |
      | light        |
      | dark         |
      | highContrast |

  Scenario: Theme persists after page reload
    Given the user switches to dark theme
    When the page is reloaded
    Then the dark theme is still active

  Scenario: Theme persists across navigation
    Given the user switches to high contrast on the home page
    When navigating to the colophon page
    Then the high contrast theme is still active

  # ─── Language ──────────────────────────────────────────────

  Scenario: Switching to French translates UI text
    Given the home page is loaded in English
    When the user switches the language to French
    Then the navigation labels change to French
    And the settings labels change to French
    And the footer text changes to French

  Scenario: Switching to French shows translation disclaimer
    Given the home page is loaded in English
    When the user switches to French
    Then a translation disclaimer banner appears

  Scenario: French projects have French titles
    Given the home page is loaded
    When the user switches to French
    Then project titles update to French text
    And the "Load more projects" button text changes to French

  Scenario: Language persists after page reload
    Given the user switches to French
    When the page is reloaded
    Then the page remains in French

  Scenario: Language persists across navigation
    Given the user switches to French on the home page
    When navigating to the resume page
    Then the resume content is in French

  # ─── Animations ────────────────────────────────────────────

  Scenario: Disabling animations suppresses scroll effects
    Given the home page is loaded
    When the user disables animations
    Then scroll-triggered fade-in effects do not animate

  Scenario: Animations toggle persists across navigation
    Given the user disables animations on the home page
    When navigating to the colophon page
    Then animations remain disabled

  # ─── Settings Popover ──────────────────────────────────────

  Scenario: Settings popover opens and closes via gear button
    Given any page is loaded on desktop
    When the user clicks the settings gear
    Then the settings popover is visible
    When the user clicks the gear again
    Then the settings popover closes

  Scenario: Settings popover closes on Escape
    Given the settings popover is open
    When the user presses Escape
    Then the popover closes
```
