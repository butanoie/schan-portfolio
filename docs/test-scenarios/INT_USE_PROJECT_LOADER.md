# Test Scenarios: useProjectLoader Locale Lifecycle

**Type:** Integration (Vitest)
**Test file:** `v2/src/__tests__/integration/useProjectLoaderIntegration.test.tsx`

Tests the hook's behavior when the locale changes, including state reset, re-fetch, and pagination continuity.

```gherkin
Feature: useProjectLoader Locale Lifecycle

  Scenario: Initial load returns English projects
    Given the hook is initialized with 5 English initialProjects
    When the hook settles
    Then projects contain English titles
    And hasMore is true
    And currentPage is 1

  Scenario: Switching to French resets projects to French page 1
    Given the hook has loaded English projects
    When the locale changes to "fr"
    Then projects are replaced with French titles
    And the project count resets to the first batch size
    And hasMore is true

  Scenario: LoadMore after locale switch fetches in new locale
    Given the locale was switched to "fr" and projects reset
    When loadMore is called
    Then page 2 of French projects is appended
    And all projects have French titles

  Scenario: Switching back to English resets again
    Given the locale was switched to "fr" and additional pages loaded
    When the locale changes back to "en"
    Then projects reset to English page 1
    And previously loaded French projects are gone

  Scenario: Pagination state resets on locale switch
    Given 3 batches have been loaded in English (15 projects)
    When the locale changes to "fr"
    Then the project count resets to the first batch size (5)
    And hasMore recalculates correctly for the new locale

  Scenario: Concurrent locale switch during loadMore (known limitation)
    Given loadMore is in progress for English page 2
    When the locale changes to "fr" before loadMore completes
    Then the locale-switch useEffect resets projects to French page 1
    # NOTE: The current loadMore implementation has no cancellation mechanism.
    # The locale-switch useEffect uses a local `cancelled` variable, but loadMore
    # (a useCallback) does not check it. If loadMore resolves after the locale
    # switch, it may append stale English data via setProjects(prev => [...prev, ...]).
    # This test should document the ACTUAL behavior. If the race condition is
    # unacceptable, a cancellation ref should be added to loadMore first.

  Scenario: allLoaded is true when all projects are fetched
    Given the hook has loaded all 18 projects
    When checking hasMore
    Then hasMore is false
    And allLoaded is true
```

## Technical Notes

- Requires a `ControlledLocaleWrapper` component that allows changing locale mid-test via `rerender`
- The locale-switch `useEffect` uses a local `let cancelled` variable (not a `useRef`) scoped to the effect callback. This cancels only locale-switch re-fetches, **not** in-flight `loadMore` calls.
- `SIMULATED_LOAD_DELAY` is already 0 in test environment
- `useProjectLoader` defaults `pageSize` to 5, while `getProjects` defaults `DEFAULT_PAGE_SIZE` to 6. Tests should use explicit `pageSize: 5` to match the home page behavior.
