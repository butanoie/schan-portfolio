# Test Scenarios: Server Data Fetching

**Type:** Integration (Vitest)
**Test file:** `v2/src/__tests__/integration/serverDataFetching.test.ts`

Tests fetchProjects (the `'use server'` action) end-to-end through projectDataServer → projectData → localization → JSON.

```gherkin
Feature: Server Data Fetching

  # Note: fetchProjects/getProjects defaults to pageSize=6 (DEFAULT_PAGE_SIZE in projectData.ts).
  # useProjectLoader/AsyncProjectsList override this to pageSize=5 for the home page.
  # These tests explicitly pass pageSize to match the SSG call in app/page.tsx.

  Scenario: SSG simulation returns first page of English projects
    Given the default locale and page 1 with pageSize 5 (matching app/page.tsx)
    When fetchProjects is called
    Then exactly 5 projects are returned
    And total equals the full project count (18)
    And every project has non-empty title, desc, circa, and captioned images

  Scenario: Default pageSize returns 6 items
    Given the default locale and page 1 with no explicit pageSize
    When fetchProjects is called
    Then exactly 6 projects are returned (DEFAULT_PAGE_SIZE in projectData.ts)

  Scenario: French locale returns localized content
    Given locale "fr" and page 1 with pageSize 5
    When fetchProjects is called
    Then 5 projects are returned with French titles and descriptions

  Scenario: Same IDs returned regardless of locale
    Given page 1 with pageSize 5
    When fetchProjects is called for "en" and "fr"
    Then both return the same project IDs in the same order
    And the titles differ between locales

  Scenario: Tag filter works with French locale
    Given locale "fr" and a tag filter (e.g., "C#")
    When fetchProjects is called
    Then only projects with the matching tag are returned
    And all returned projects have French-localized titles

  Scenario: Search works with French locale
    Given locale "fr" and a search term (e.g., "SharePoint")
    When fetchProjects is called
    Then matching projects are returned with French titles

  Scenario: Three consecutive pages cover all projects without overlap
    Given pageSize 7
    When fetchProjects is called for pages 1, 2, 3
    Then the combined results include all 18 projects
    And no project ID appears in more than one page
```
