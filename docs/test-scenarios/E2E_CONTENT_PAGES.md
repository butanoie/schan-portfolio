# Test Scenarios: Content Pages (Resume, Colophon, Samples)

**Type:** E2E (Playwright)
**Spec files:** `v2/e2e/specs/resume.spec.ts`, `v2/e2e/specs/colophon.spec.ts`, `v2/e2e/specs/samples.spec.ts`
**Status:** ✅ Implemented — 13 tests across 3 spec files

Content verification, interaction, and i18n tests for each content page. French locale tests use `seedLocale(page, 'fr')` before navigation (not runtime settings panel switching).

```gherkin
Feature: Resume Page
  Professional resume with responsive two-column layout.

  Scenario: Resume renders all 7 sections
    Given the résumé page is loaded
    When the main content is visible
    Then the header, summary, work experience, skills, education,
    clients, and speaking sections are all visible

  Scenario: Contact links have correct href patterns
    Given the résumé page is loaded
    When the header section is visible
    Then a contact link with href containing "linkedin.com" is present
    And a contact link with href containing "github.com" is present

  Scenario: PDF download link is visible with .pdf href
    Given the résumé page is loaded
    When the header section is visible
    Then a link with "(opens in new tab)" in its aria-label is visible
    And its href attribute ends with ".pdf"

  Scenario: French locale translates section headings
    Given the French locale is seeded in localStorage
    And the résumé page is loaded
    When the main content is visible
    Then the professional summary heading reads "Résumé professionnel"
    And the work experience heading reads "Expérience professionnelle"

Feature: Colophon Page
  Technologies showcase, design philosophy, and Buta mascot story.

  Scenario: Colophon renders all 3 sections
    Given the colophon page is loaded
    When the main content is visible
    Then the technologies, design, and buta sections are all visible

  Scenario: V1 accordion starts collapsed
    Given the colophon page is loaded
    When the main content is visible
    Then the V1 accordion summary has aria-expanded="false"
    And the V1 accordion content is hidden

  Scenario: V1 accordion expands and collapses on toggle
    Given the colophon page is loaded
    And the V1 accordion is collapsed
    When the accordion header is clicked
    Then the accordion content becomes visible
    When the accordion header is clicked again
    Then the accordion content is hidden

  Scenario: Technology cards have external links
    Given the colophon page is loaded
    When the technologies section is visible
    Then at least one link matches the "Visit <name> website" aria-label pattern

  Scenario: French locale translates section headings
    Given the French locale is seeded in localStorage
    And the colophon page is loaded
    When the main content is visible
    Then the design heading reads "Conception et typographie"
    And the buta heading reads "L'histoire de Buta"

Feature: Samples Page
  Professional documentation artifacts organized by theme.
  5 sections in order: Product Strategy, UX Design, Technical,
  Process & Ops, Cost Savings. Positional access avoids locale dependency.

  Scenario: All 5 artifact sections are present
    Given the samples page is loaded
    When the main content is visible
    Then exactly 5 artifact sections are present

  Scenario: Download buttons carry format labels in aria-labels
    Given the samples page is loaded
    When the main content is visible
    Then every download link has an aria-label containing "PDF" or "Markdown"

  Scenario: Cost Savings Roadmap has no download button
    Given the samples page is loaded
    When the 5th artifact section (Cost Savings, index 4) is visible
    Then the section has 4 card headings but only 3 download links

  Scenario: French locale translates section headings
    Given the French locale is seeded in localStorage
    And the samples page is loaded
    When the main content is visible
    Then the first section heading reads "Définir la vision"
    And the last section heading reads "Mesurer l'impact"
```
