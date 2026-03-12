# Test Scenarios: Navigation

**Type:** E2E (Playwright)
**Spec file:** `v2/e2e/specs/navigation.spec.ts`

Cross-page navigation via header links, URL verification, and active state.

```gherkin
Feature: Navigation

  Scenario Outline: Navigation to <page> loads correct content
    Given the home page is loaded
    When the user clicks the <page> nav link
    Then the URL path is <path>
    And the page heading contains <heading>

    Examples:
      | page      | path      | heading     |
      | Resume    | /resume   | Sing Chan   |
      | Colophon  | /colophon | Colophon    |
      | Samples   | /samples  | Samples     |
      | Portfolio | /         | Sing Chan   |

  Scenario: Active nav link has aria-current="page"
    Given the resume page is loaded
    Then the Resume nav link has aria-current="page"
    And no other nav link has aria-current="page"

  Scenario: Navigation preserves theme preference
    Given the theme is switched to dark on the home page
    When navigating to the resume page
    Then the dark theme is still active

  Scenario: Navigation preserves language preference
    Given the language is switched to French on the home page
    When navigating to the resume page
    Then the page content is in French

  Scenario: Direct URL access loads page correctly
    Given the user navigates directly to /resume
    Then the resume page loads without errors
    And the Resume nav link has aria-current="page"

  Scenario: Footer navigation links work
    Given the home page is loaded on desktop viewport
    When the user clicks the Resume link in the footer
    Then the URL path is /resume
```
