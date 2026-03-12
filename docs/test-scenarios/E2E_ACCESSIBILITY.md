# Test Scenarios: Accessibility Compliance

**Type:** E2E (Playwright)
**Spec file:** `v2/e2e/specs/accessibility.spec.ts`

All pages must pass WCAG 2.2 Level AA axe scans across all visual configurations and interactive states.

## Implementation Decisions

- **Theme/locale matrix setup:** Use `seedTheme()`/`seedLocale()` via `addInitScript` before `goto()` (not settings panel UI). The matrix tests validate axe compliance, not the settings interaction — that's covered by the interactive states group and the future `settings.spec.ts`.
- **Lightbox scan scope:** Full-page axe scan with the dialog open (not scoped to the dialog element via `AxeBuilder.include()`). This catches backdrop/overlay issues in addition to dialog content.
- **Lightbox target:** First project's first image (`openLightboxForImage(0, 0)`) — simplest and most stable selector.
- **Keyboard navigation scope:** Targeted test covering ~5-8 representative elements on the home page (nav links, buttons, settings gear) with visible focus indicator checks. Not an exhaustive tab-through of every element.
- **Browser configuration:** Rely on default Playwright config (Chromium + WebKit). No per-browser `test.describe.configure` needed.

```gherkin
Feature: Accessibility Compliance

  # ─── Per-Page Baseline Scans ───────────────────────────────

  Scenario Outline: Page passes axe scan in default state
    Given the <page> page is loaded in English with the light theme
    When an axe accessibility scan is run
    Then there are zero violations

    Examples:
      | page     |
      | home     |
      | resume   |
      | colophon |
      | samples  |

  # ─── Theme Matrix ─────────────────────────────────────────

  Scenario Outline: Page passes axe scan in <theme> theme
    Given the <page> page is loaded
    And the theme is switched to <theme>
    When an axe accessibility scan is run
    Then there are zero violations

    Examples:
      | page     | theme        |
      | home     | dark         |
      | home     | highContrast |
      | resume   | dark         |
      | resume   | highContrast |
      | colophon | dark         |
      | colophon | highContrast |
      | samples  | dark         |
      | samples  | highContrast |

  # ─── Locale Matrix ────────────────────────────────────────

  Scenario Outline: Page passes axe scan in French locale
    Given the <page> page is loaded
    And the language is switched to French
    When an axe accessibility scan is run
    Then there are zero violations

    Examples:
      | page     |
      | home     |
      | resume   |
      | colophon |
      | samples  |

  # ─── Interactive States ───────────────────────────────────

  Scenario: Lightbox dialog passes axe scan
    Given the home page is loaded
    And the first project's first image thumbnail is clicked to open the lightbox
    When a full-page axe accessibility scan is run
    Then there are zero violations

  Scenario: Settings popover passes axe scan
    Given any page is loaded
    And the settings gear is clicked to open the popover
    When an axe accessibility scan is run
    Then there are zero violations

  Scenario: Mobile hamburger menu passes axe scan
    Given the viewport is set to mobile (375px)
    And the hamburger menu is opened
    When an axe accessibility scan is run
    Then there are zero violations

  # ─── Keyboard Navigation ──────────────────────────────────

  Scenario: Skip link moves focus to main content
    Given any page is loaded
    When the user presses Tab once
    Then the skip-to-main-content link receives focus
    When the user presses Enter
    Then focus moves to the main content area

  Scenario: All interactive elements are keyboard accessible
    Given any page is loaded
    When tabbing through the page
    Then every focusable element has a visible focus indicator
    And no element traps keyboard focus
```
