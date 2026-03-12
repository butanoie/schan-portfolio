# Test Scenarios: AsyncProjectsList Rendering

**Type:** Integration (Vitest)
**Test file:** `v2/src/__tests__/integration/asyncProjectsList.test.tsx`

Tests the component rendering with real useProjectLoader and data layer.

```gherkin
Feature: AsyncProjectsList Rendering Integration

  Scenario: Initial render shows projects immediately without skeletons
    Given initialProjects contains 5 English projects
    When AsyncProjectsList renders
    Then all 5 project titles are visible
    And no skeleton loaders are present

  Scenario: LoadMore context provides correct state
    Given the component is rendered on the home page
    When reading the ProjectLoadingContext value
    Then remainingCount equals total minus initial batch
    And hasMore is true

  Scenario: All projects loaded shows completion state
    Given initialProjects contains all 18 projects
    When AsyncProjectsList renders
    Then allLoaded is true in the context
    And hasMore is false

  Scenario: Locale switch causes French titles to appear
    Given the component is wrapped in a LocaleProvider set to "en"
    When the locale changes to "fr"
    Then project titles update to French strings

  Scenario: Error displays alert with previously loaded projects preserved
    Given getProjects throws an error during loadMore
    When the error occurs
    Then an alert role element appears with an error message
    And previously loaded projects remain visible
```

## Mocks Required

- `next/navigation`: `usePathname → '/'`
- `next/image`: plain `<img>` passthrough
- `@mui/material useMediaQuery`: `() => false`
