# Test Scenarios: Responsive Layouts

**Type:** E2E (Playwright)
**Spec file:** `v2/e2e/specs/responsive.spec.ts`

Layout adapts between mobile (<600px) and desktop (>=600px) viewports.

```gherkin
Feature: Responsive Layouts

  # ─── Mobile (375px) ───────────────────────────────────────

  Scenario: Mobile shows hamburger menu instead of nav buttons
    Given the viewport is 375px wide
    And the home page is loaded
    Then the hamburger menu button is visible
    And the desktop navigation buttons are not visible

  Scenario: Hamburger menu opens a drawer with navigation
    Given the viewport is 375px wide
    And the home page is loaded
    When the user taps the hamburger button
    Then a navigation drawer slides in from the right
    And the drawer contains Portfolio, Resume, Colophon, Samples links
    And the drawer contains theme, language, and animations controls

  Scenario: Navigating from hamburger menu closes the drawer
    Given the hamburger drawer is open on mobile
    When the user taps the Resume link
    Then the drawer closes
    And the resume page loads

  Scenario: Footer nav links are hidden on mobile
    Given the viewport is 375px wide
    And the home page is loaded
    Then the footer text navigation links are not visible

  # ─── Desktop (1280px) ─────────────────────────────────────

  Scenario: Desktop shows nav buttons instead of hamburger
    Given the viewport is 1280px wide
    And the home page is loaded
    Then the desktop navigation buttons are visible
    And the hamburger menu button is not visible

  Scenario: Desktop shows settings gear button
    Given the viewport is 1280px wide
    And the home page is loaded
    Then the settings gear button is visible

  Scenario: Footer nav links are visible on desktop
    Given the viewport is 1280px wide
    And the home page is loaded
    Then the footer text navigation links are visible
```
