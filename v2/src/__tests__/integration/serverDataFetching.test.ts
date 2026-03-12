/**
 * Integration tests for the fetchProjects server action data path.
 *
 * Verifies that fetchProjects (the `'use server'` action in projectDataServer.ts)
 * traverses the full data stack correctly:
 * fetchProjects → getProjects → getLocalizedProjects → locale JSON merge
 *
 * This simulates what `app/page.tsx` does at build time (SSG) and what
 * `useProjectLoader` does at runtime when the client fetches additional pages
 * or switches locales.
 *
 * ## Scope
 *
 * This file tests through the server action boundary (`fetchProjects`), not
 * `getProjects` directly. Filtering, pagination, and locale consistency at
 * the `getProjects` level are covered in dataLayer.test.ts. Localization
 * pipeline internals are covered in localizationPipeline.test.ts.
 *
 * All tests use real data — no mocks for the data or localization layers.
 *
 * @see {@link lib/projectDataServer.ts} for the server action under test
 * @see {@link lib/projectData.ts} for the underlying query engine
 * @see {@link docs/test-scenarios/INT_SERVER_DATA_FETCHING.md} for Gherkin scenarios
 */

import { describe, it, expect } from 'vitest';
import { fetchProjects } from '../../lib/projectDataServer';
import { PROJECTS } from '../../data/projects';

/**
 * Tests the fetchProjects server action end-to-end, covering SSG simulation,
 * locale variants, combined filter + locale, and pagination coverage.
 */
describe('Server Data Fetching — fetchProjects', () => {
  /**
   * Scenario: SSG simulation returns first page of English projects.
   * Given the default locale and page 1 with pageSize 5 (matching app/page.tsx)
   * When fetchProjects is called
   * Then exactly 5 projects are returned
   * And total equals the full project count
   * And every project has non-empty title, desc, circa, and captioned images
   */
  it('should return first page of English projects matching SSG call in app/page.tsx', async () => {
    const result = await fetchProjects({ page: 1, pageSize: 5, locale: 'en' });

    expect(result.items).toHaveLength(5);
    expect(result.total).toBe(PROJECTS.length);
    expect(result.start).toBe(0);
    expect(result.end).toBe(4); // inclusive end for 5 items

    for (const project of result.items) {
      expect(
        project.title,
        `${project.id}: title should be non-empty`
      ).toBeTruthy();
      expect(
        project.desc.length,
        `${project.id}: desc should have at least one paragraph`
      ).toBeGreaterThan(0);
      expect(
        project.desc[0],
        `${project.id}: desc[0] should be non-empty`
      ).toBeTruthy();
      expect(
        project.circa,
        `${project.id}: circa should be non-empty`
      ).toBeTruthy();

      for (let j = 0; j < project.images.length; j++) {
        expect(
          project.images[j].caption,
          `${project.id}[${j}]: caption should be non-empty`
        ).toBeTruthy();
      }
    }
  });

  /**
   * Scenario: Default pageSize returns 6 items.
   * Given the default locale and page 1 with no explicit pageSize
   * When fetchProjects is called
   * Then exactly 6 projects are returned (DEFAULT_PAGE_SIZE in projectData.ts)
   */
  it('should return 6 projects when no explicit pageSize is provided', async () => {
    const result = await fetchProjects({ page: 1, locale: 'en' });

    expect(result.items).toHaveLength(6);
    expect(result.total).toBe(PROJECTS.length);
  });

  /**
   * Scenario: French locale returns localized content.
   * Given locale "fr" and page 1 with pageSize 5
   * When fetchProjects is called
   * Then 5 projects are returned with French titles and descriptions
   */
  it('should return French-localized projects for locale "fr"', async () => {
    const result = await fetchProjects({ page: 1, pageSize: 5, locale: 'fr' });

    expect(result.items).toHaveLength(5);
    expect(result.total).toBe(PROJECTS.length);

    for (const project of result.items) {
      expect(
        project.title,
        `${project.id}: FR title should be non-empty`
      ).toBeTruthy();
      expect(
        project.desc.length,
        `${project.id}: FR desc should have at least one paragraph`
      ).toBeGreaterThan(0);
      expect(
        project.desc[0],
        `${project.id}: FR desc[0] should be non-empty`
      ).toBeTruthy();
      expect(
        project.circa,
        `${project.id}: FR circa should be non-empty`
      ).toBeTruthy();
    }
  });

  /**
   * Scenario: Same IDs returned regardless of locale.
   * Given page 1 with pageSize 5
   * When fetchProjects is called for "en" and "fr"
   * Then both return the same project IDs in the same order
   * And the titles differ between locales
   */
  it('should return same project IDs for EN and FR with differing titles', async () => {
    const en = await fetchProjects({ page: 1, pageSize: 5, locale: 'en' });
    const fr = await fetchProjects({ page: 1, pageSize: 5, locale: 'fr' });

    const enIds = en.items.map((p) => p.id);
    const frIds = fr.items.map((p) => p.id);

    expect(enIds).toEqual(frIds);

    // At least one title must differ — proves the locale merge occurred
    const titlesDiffer = en.items.some(
      (enProject, i) => enProject.title !== fr.items[i].title
    );
    expect(
      titlesDiffer,
      'At least one EN and FR title should differ on page 1'
    ).toBe(true);
  });

  /**
   * Scenario: Tag filter works with French locale.
   * Given locale "fr" and a tag filter ("C#")
   * When fetchProjects is called
   * Then only projects with the matching tag are returned
   * And all returned projects have French-localized titles
   */
  it('should filter by tag with French locale', async () => {
    const result = await fetchProjects({
      tags: ['C#'],
      locale: 'fr',
      pageSize: 100,
    });

    expect(result.items.length).toBeGreaterThan(0);

    for (const project of result.items) {
      expect(project.tags, `${project.id}: should have C# tag`).toContain(
        'C#'
      );
      expect(
        project.title,
        `${project.id}: FR title should be non-empty`
      ).toBeTruthy();
    }
  });

  /**
   * Scenario: Search works with French locale.
   * Given locale "fr" and a search term ("SharePoint")
   * When fetchProjects is called
   * Then matching projects are returned with French titles
   */
  it('should search with French locale', async () => {
    const result = await fetchProjects({
      search: 'SharePoint',
      locale: 'fr',
      pageSize: 100,
    });

    expect(result.items.length).toBeGreaterThan(0);

    for (const project of result.items) {
      const matchesSearch =
        project.title.toLowerCase().includes('sharepoint') ||
        project.desc.join(' ').toLowerCase().includes('sharepoint');
      expect(
        matchesSearch,
        `${project.id}: should match search term "SharePoint"`
      ).toBe(true);
      expect(
        project.title,
        `${project.id}: FR title should be non-empty`
      ).toBeTruthy();
    }
  });

  /**
   * Scenario: Consecutive pages cover all projects without overlap.
   * Given pageSize 7
   * When fetchProjects is called for each page needed to cover all projects
   * Then the combined results include all projects
   * And no project ID appears in more than one page
   */
  it('should paginate across all pages covering all projects without overlap', async () => {
    const pageSize = 7;
    const totalPages = Math.ceil(PROJECTS.length / pageSize);
    const pages = await Promise.all(
      Array.from({ length: totalPages }, (_, i) =>
        fetchProjects({ page: i + 1, pageSize, locale: 'en' })
      )
    );

    // Total should be consistent across all pages
    for (const page of pages) {
      expect(page.total).toBe(PROJECTS.length);
    }

    // Combined items should cover every project
    const allItems = pages.flatMap((p) => p.items);
    expect(allItems).toHaveLength(PROJECTS.length);

    // No project ID should appear more than once
    const allIds = allItems.map((p) => p.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);

    // Every known project ID should be present
    const expectedIds = PROJECTS.map((p) => p.id);
    expect([...uniqueIds].sort()).toEqual([...expectedIds].sort());
  });
});
