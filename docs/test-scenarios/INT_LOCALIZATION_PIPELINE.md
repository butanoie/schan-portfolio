# Test Scenarios: Localization Pipeline

**Type:** Integration (Vitest)
**Test file:** `v2/src/__tests__/integration/localizationPipeline.test.ts`

Tests the full data flow: PROJECTS base data → dynamic JSON import → field merge → localized Project output.

```gherkin
Feature: Localization Pipeline

  Scenario: English projects have populated titles
    Given the locale is "en"
    When getLocalizedProjects is called
    Then all 18 projects are returned
    And every project has a non-empty title
    And every project has a non-empty description array

  Scenario: French projects have populated titles
    Given the locale is "fr"
    When getLocalizedProjects is called
    Then all 18 projects are returned
    And every project has a non-empty title
    And every project has a non-empty description array

  Scenario: English and French titles differ
    Given both locales have been loaded
    When comparing project titles for the same ID
    Then the English title differs from the French title for every project

  Scenario: Image captions are merged at correct indices
    Given a project with multiple images
    When getLocalizedProject is called with locale "en"
    Then each image has a caption matching the corresponding index in the locale JSON

  Scenario: French image captions differ from English
    Given a project with captioned images
    When comparing captions for the same project and image index
    Then the English caption differs from the French caption

  Scenario: Unknown locale falls back to base data
    Given a locale that does not exist (e.g., "de")
    When getLocalizedProjects is called
    Then projects are returned with empty translatable fields (base PROJECTS data)

  Scenario: Project count is consistent across locales
    Given locales "en" and "fr"
    When getLocalizedProjects is called for each
    Then both return the same number of projects (18)

  Scenario: Non-existent project ID returns undefined
    Given a valid locale "en"
    When getLocalizedProject is called with an invalid ID
    Then the result is undefined

  Scenario: Circa field is locale-specific
    Given a project with a circa field
    When comparing the circa for "en" and "fr"
    Then the values differ between locales
```
