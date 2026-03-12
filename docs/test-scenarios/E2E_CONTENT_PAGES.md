# Test Scenarios: Content Pages (Resume, Colophon, Samples)

**Type:** E2E (Playwright)
**Spec files:** `v2/e2e/specs/resume.spec.ts`, `v2/e2e/specs/colophon.spec.ts`, `v2/e2e/specs/samples.spec.ts`

Content verification and basic interaction tests for each content page.

```gherkin
Feature: Resume Page
  Professional resume with responsive two-column layout.

  Scenario: Resume renders all sections
    Given the resume page is loaded
    Then the professional summary section is visible
    And the work experience section is visible
    And the core competencies section is visible
    And the education section is visible
    And the enterprise clients section is visible
    And the conference speaking section is visible

  Scenario: Resume download link is present
    Given the resume page is loaded
    Then a download PDF link is visible
    And the link points to the resume PDF file

  Scenario: LinkedIn and GitHub links are present
    Given the resume page is loaded
    Then a LinkedIn icon link is visible
    And a GitHub icon link is visible

  Scenario: Resume content updates in French
    Given the resume page is loaded
    When the language is switched to French
    Then the section headings change to French

Feature: Colophon Page
  Technologies showcase, design philosophy, and Buta mascot story.

  Scenario: Colophon renders all sections
    Given the colophon page is loaded
    Then the technologies showcase section is visible
    And the design philosophy section is visible
    And the Buta story section is visible

  Scenario: Technology cards are displayed
    Given the colophon page is loaded
    Then multiple technology cards are visible
    And each card has a name and description

  Scenario: Colophon content updates in French
    Given the colophon page is loaded
    When the language is switched to French
    Then the section headings change to French

Feature: Samples Page
  Professional documentation artifacts organized by theme.

  Scenario: Samples renders all themed sections
    Given the samples page is loaded
    Then multiple artifact sections are visible
    And each section has a heading and introduction

  Scenario: Artifact items are displayed within sections
    Given the samples page is loaded
    Then each section contains one or more artifact items

  Scenario: Samples content updates in French
    Given the samples page is loaded
    When the language is switched to French
    Then the section headings change to French
```
