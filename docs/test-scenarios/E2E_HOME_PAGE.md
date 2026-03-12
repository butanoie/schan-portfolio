# Test Scenarios: Home Page Progressive Loading

**Type:** E2E (Playwright)
**Spec file:** `v2/e2e/specs/home.spec.ts`

The home page loads 5 projects initially (SSG, pageSize=5 set by AsyncProjectsList) and progressively loads more in batches of 5 via the "Load more projects" button.

> **Note:** The production `NEXT_PUBLIC_LOAD_DELAY` controls skeleton visibility duration.

```gherkin
Feature: Home Page Progressive Loading

  Scenario: Initial page load shows first batch of projects
    Given the home page is loaded
    Then 5 project cards are visible
    And a "Load more projects" button is visible in the footer area

  Scenario: Load More adds the next batch of projects
    Given the home page is loaded with 5 projects
    When the user clicks "Load more projects"
    Then additional projects appear (skeleton loaders may be visible depending on load delay)
    And then 10 projects total are visible

  Scenario: Loading all projects shows completion message
    Given the user has clicked "Load more projects" until all projects are loaded
    Then 18 projects total are visible
    And the "Load more projects" button is no longer present
    And a completion/thank-you message appears in the footer

  Scenario: Projects display correct structure
    Given the home page is loaded
    Then each project card has a title, description, and image gallery
    And project tags are visible

  Scenario: Project with video shows embedded video
    Given a project with a video is visible
    Then a video embed iframe is present within the project card

  Scenario: Load More in French loads French projects
    Given the home page is loaded and language switched to French
    When the user clicks "Load more projects"
    Then newly loaded projects have French titles and descriptions
```
