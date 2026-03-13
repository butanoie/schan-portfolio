/**
 * Home page — progressive loading, project structure, video embed, and i18n.
 *
 * Verifies the home page renders 5 projects initially, supports progressive
 * loading via the "Load more" button, displays correct project structure
 * (headings, galleries, tags), embeds video iframes, and loads French
 * translations via both seeded locale and runtime settings switch.
 *
 * Scenario doc: docs/test-scenarios/E2E_HOME_PAGE.md
 *
 * @module e2e/specs/home.spec
 */
import { test, expect } from '../fixtures/base.fixture';
import { seedLocale } from '../helpers/storage';

/** Number of projects rendered on initial page load (SSG batch). */
const INITIAL_PROJECT_COUNT = 5;

/** Total number of projects in the dataset. */
const TOTAL_PROJECT_COUNT = 18;

/** Batch size used by useProjectLoader. */
const BATCH_SIZE = 5;

/**
 * Zero-based index of the first project with a Vimeo video embed.
 * Project 4 in the dataset is "Collabware CLM" (index 3).
 */
const VIDEO_PROJECT_INDEX = 3;

test.describe('Home page — progressive loading', () => {
  // ─── Initial Load ───────────────────────────────────────────────

  test.describe('Initial load', () => {
    /**
     * ```gherkin
     * Given the home page is loaded
     * Then 5 project headings (h2) are visible
     * ```
     */
    test('Given home page loaded, Then 5 project headings are visible', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.projectSections()).toHaveCount(
        INITIAL_PROJECT_COUNT
      );
    });

    /**
     * ```gherkin
     * Given the home page is loaded
     * Then a "Load more projects" button is visible in the footer area
     * ```
     */
    test('Given home page loaded, Then Load More button is visible', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.loadMoreButton).toBeVisible();
    });
  });

  // ─── Load More ──────────────────────────────────────────────────

  test.describe('Load More', () => {
    /**
     * ```gherkin
     * Given the home page is loaded with 5 projects
     * When the user clicks "Load more projects"
     * Then 10 projects total are visible
     * ```
     */
    test('Given 5 projects, When Load More clicked, Then 10 projects visible', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.projectSections()).toHaveCount(
        INITIAL_PROJECT_COUNT
      );

      await homePage.loadMoreButton.click();

      await expect(homePage.projectSections()).toHaveCount(10);
    });

    /**
     * ```gherkin
     * Given the home page is loaded
     * When the user clicks "Load more" until all projects are loaded
     * Then 18 projects total are visible
     * And the "Load more projects" button is no longer present
     * And a completion message appears
     * ```
     */
    test('Given home page, When Load More clicked until exhausted, Then 18 projects and completion message', async ({
      homePage,
    }) => {
      await homePage.goto();

      // Click Load More and wait for the next batch to render before re-clicking.
      // 18 projects in batches of 5 (5→10→15→18), so 3 clicks total.
      // Each cycle includes a 1s simulated delay + skeleton render + project mount,
      // which exceeds the default 5s timeout on slow WebKit CI runners.
      let expectedCount = INITIAL_PROJECT_COUNT;

      while (expectedCount < TOTAL_PROJECT_COUNT) {
        await homePage.loadMoreButton.click();
        expectedCount = Math.min(
          expectedCount + BATCH_SIZE,
          TOTAL_PROJECT_COUNT
        );
        await expect(homePage.projectSections()).toHaveCount(expectedCount, {
          timeout: 10_000,
        });
      }

      // After the final batch renders, React still needs to:
      // 1. Complete the loadMore async (setLoading(false) in `finally`)
      // 2. Re-derive hasMore = false from the new project count
      // 3. Re-render Footer to unmount the LoadMore ThoughtBubble
      // WebKit in CI is slow enough that this exceeds the default 5s timeout.
      await expect(homePage.loadMoreButton).toBeHidden({ timeout: 10_000 });
      await expect(homePage.completionBubble).toBeVisible({ timeout: 10_000 });
    });
  });

  // ─── Project Structure ─────────────────────────────────────────

  test.describe('Project structure', () => {
    for (let i = 0; i < INITIAL_PROJECT_COUNT; i++) {
      /**
       * ```gherkin
       * Given the home page is loaded
       * Then project at index N has a heading, gallery images, and tags
       * ```
       */
      test(`Given home page, Then project ${i} has heading, gallery images, and tags`, async ({
        homePage,
      }) => {
        await homePage.goto();

        // h2 heading exists for this project
        const heading = homePage.projectSections().nth(i);
        await expect(heading).toBeVisible();

        // Gallery images exist (at least 1 visible proves the gallery rendered)
        await expect(homePage.galleryImages(i).first()).toBeVisible();

        // Tags (MUI Chips) exist — includes circa chip + technology tags
        await expect(homePage.projectTags(i).first()).toBeVisible();
      });
    }
  });

  // ─── Video Embed ────────────────────────────────────────────────

  test.describe('Video embed', () => {
    /**
     * ```gherkin
     * Given the home page is loaded
     * And project 4 (CLM, index 3) has a video
     * Then a Vimeo iframe is present within the project section
     * ```
     */
    test('Given home page, Then CLM project has a Vimeo iframe', async ({
      homePage,
    }) => {
      await homePage.goto();

      const iframe = homePage.videoEmbed(VIDEO_PROJECT_INDEX);
      await expect(iframe).toBeVisible();
      await expect(iframe).toHaveAttribute(
        'src',
        /player\.vimeo\.com\/video\/\d+/
      );
      await expect(iframe).toHaveAttribute('title', /vimeo/i);
    });

    /**
     * ```gherkin
     * Given the home page is loaded
     * And the CLM project has a Vimeo iframe
     * When the iframe is focused programmatically
     * Then it receives focus
     * ```
     */
    test('Given CLM iframe visible, When focused, Then iframe receives focus', async ({
      homePage,
    }) => {
      await homePage.goto();

      const iframe = homePage.videoEmbed(VIDEO_PROJECT_INDEX);
      await expect(iframe).toBeVisible();

      await iframe.focus();
      await expect(iframe).toBeFocused();
    });
  });

  // ─── French Load More — Seeded Locale ──────────────────────────

  test.describe('French Load More — seeded locale', () => {
    /**
     * ```gherkin
     * Given the locale is seeded to French before navigation
     * And the home page is loaded
     * Then the initial 5 projects have French titles
     * ```
     */
    test('Given locale seeded to fr, Then initial projects have French titles', async ({
      homePage,
    }) => {
      await seedLocale(homePage.page, 'fr');
      await homePage.goto();

      // Verify a distinctive French title from the initial batch
      // Project 1 (index 0): "Collabware - Téléchargeur d'exportation Collabspace"
      const firstHeading = homePage.projectSections().first();
      await expect(firstHeading).toContainText(/Téléchargeur/);
    });

    /**
     * ```gherkin
     * Given the locale is seeded to French
     * And the home page is loaded with 5 French projects
     * When the user clicks the French "Load more" button
     * Then newly loaded projects have French titles
     * ```
     */
    test('Given fr locale, When French Load More clicked, Then new projects have French titles', async ({
      homePage,
    }) => {
      await seedLocale(homePage.page, 'fr');
      await homePage.goto();
      await expect(homePage.projectSections()).toHaveCount(
        INITIAL_PROJECT_COUNT
      );

      await expect(homePage.loadMoreButton).toBeVisible();
      await homePage.loadMoreButton.click();

      await expect(homePage.projectSections()).toHaveCount(10);

      // Verify a French title from batch 2 — project 6 (index 5): "Servus Credit Union - café"
      const batch2Heading = homePage.projectSections().nth(5);
      await expect(batch2Heading).toContainText(/café/);
    });
  });

  // ─── French Load More — Runtime Switch ─────────────────────────

  test.describe('French Load More — runtime switch', () => {
    /**
     * ```gherkin
     * Given the home page is loaded in English
     * When the user switches language to French via settings
     * And clicks the French "Load more" button
     * Then newly loaded projects have French titles
     * ```
     */
    test('Given English page, When switched to French and Load More clicked, Then French titles', async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.projectSections()).toHaveCount(
        INITIAL_PROJECT_COUNT
      );

      // Switch to French via settings panel
      await homePage.settings.open();
      await homePage.settings.switchLanguage('fr');
      await homePage.settings.close();

      // After locale switch, useProjectLoader re-fetches page 1 in French
      // and resets to 5 projects. Wait for the re-fetch to settle before
      // asserting heading text.
      await expect(homePage.projectSections()).toHaveCount(
        INITIAL_PROJECT_COUNT
      );
      const firstHeading = homePage.projectSections().first();
      await expect(firstHeading).toContainText(/Téléchargeur/);

      // Click French Load More
      await expect(homePage.loadMoreButton).toBeVisible();
      await homePage.loadMoreButton.click();

      await expect(homePage.projectSections()).toHaveCount(10);

      // Verify French title from batch 2
      const batch2Heading = homePage.projectSections().nth(5);
      await expect(batch2Heading).toContainText(/café/);
    });
  });
});
