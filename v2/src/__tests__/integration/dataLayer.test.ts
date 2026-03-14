import { describe, it, expect } from 'vitest';
import { getProjects, getProjectById } from '../../lib/projectData';
import { PROJECTS } from '../../data/projects';

/**
 * Integration tests for the complete data layer.
 * Tests end-to-end workflows combining multiple functions.
 */
describe('Data Layer Integration', () => {
  it('should fetch and paginate projects correctly', async () => {
    const page1 = await getProjects({ page: 1, pageSize: 6 });
    const page2 = await getProjects({ page: 2, pageSize: 6 });
    const page3 = await getProjects({ page: 3, pageSize: 6 });

    // Total should match across all pages
    expect(page1.total).toBe(page2.total);
    expect(page2.total).toBe(page3.total);

    // Should cover all projects
    const allPagedItems = [...page1.items, ...page2.items, ...page3.items];
    expect(allPagedItems.length).toBe(PROJECTS.length);
  });

  it('should maintain data integrity through queries', async () => {
    const allProjects = await getProjects({ pageSize: 100 });

    // Each project from query should match data file
    for (const queriedProject of allProjects.items) {
      const dataFileProject = await getProjectById(queriedProject.id);
      expect(dataFileProject).toEqual(queriedProject);
    }
  });

  it('should filter and paginate together', async () => {
    const filtered = await getProjects({ tags: ['C#'], pageSize: 3 });

    expect(filtered.items.length).toBeLessThanOrEqual(3);
    filtered.items.forEach((project) => {
      expect(project.tags).toContain('C#');
    });
  });

  it('should search and filter together', async () => {
    const results = await getProjects({
      search: 'SharePoint',
      tags: ['ASP.Net'],
      pageSize: 10,
    });

    results.items.forEach((project) => {
      expect(project.tags).toContain('ASP.Net');

      const matchesSearch =
        project.title.toLowerCase().includes('sharepoint') ||
        project.desc.join(' ').toLowerCase().includes('sharepoint');
      expect(matchesSearch).toBe(true);
    });
  });

  it('should handle complex filtering scenarios', async () => {
    // Get projects with multiple shared tags
    const results = await getProjects({
      tags: ['C#', 'ASP.Net'],
      page: 1,
      pageSize: 5,
    });

    results.items.forEach((project) => {
      expect(project.tags).toContain('C#');
      expect(project.tags).toContain('ASP.Net');
    });
  });

  it('should return consistent results for same query', async () => {
    const result1 = await getProjects({ tags: ['C#'], pageSize: 10 });
    const result2 = await getProjects({ tags: ['C#'], pageSize: 10 });

    expect(result1.total).toBe(result2.total);
    expect(result1.items).toEqual(result2.items);
  });

  it('should handle edge case of no matching results', async () => {
    const results = await getProjects({
      tags: ['NonExistentTag123'],
      search: 'NonExistentSearch456',
    });

    expect(results.total).toBe(0);
    expect(results.items.length).toBe(0);
    expect(results.start).toBe(0);
    expect(results.end).toBe(-1); // End is -1 when there are no items
  });
});

/**
 * Locale consistency tests for the data layer.
 *
 * Verifies that English and French locales return structurally consistent
 * data through the public `getProjects` API, and that translated fields
 * are populated and differ between locales.
 *
 * Deeper localization pipeline tests (cache behavior, caption index alignment,
 * unknown locale fallback) are covered in localizationPipeline.test.ts.
 */
describe('Data Layer — Locale Consistency', () => {
  it('should return the same number of projects for both locales', async () => {
    const en = await getProjects({ pageSize: 100, locale: 'en' });
    const fr = await getProjects({ pageSize: 100, locale: 'fr' });

    expect(en.total).toBe(fr.total);
    expect(en.total).toBe(PROJECTS.length);
  });

  it('should return the same project IDs in both locales', async () => {
    const en = await getProjects({ pageSize: 100, locale: 'en' });
    const fr = await getProjects({ pageSize: 100, locale: 'fr' });

    const enIds = en.items.map((p) => p.id);
    const frIds = fr.items.map((p) => p.id);

    expect(enIds).toEqual(frIds);
  });

  it('should have non-empty translatable fields in English', async () => {
    const { items } = await getProjects({ pageSize: 100, locale: 'en' });

    for (const project of items) {
      expect(project.title, `${project.id}: title`).toBeTruthy();
      expect(project.desc.length, `${project.id}: desc`).toBeGreaterThan(0);
      expect(project.desc[0], `${project.id}: desc[0]`).toBeTruthy();
      expect(project.circa, `${project.id}: circa`).toBeTruthy();
    }
  });

  it('should have non-empty translatable fields in French', async () => {
    const { items } = await getProjects({ pageSize: 100, locale: 'fr' });

    for (const project of items) {
      expect(project.title, `${project.id}: title`).toBeTruthy();
      expect(project.desc.length, `${project.id}: desc`).toBeGreaterThan(0);
      expect(project.desc[0], `${project.id}: desc[0]`).toBeTruthy();
      expect(project.circa, `${project.id}: circa`).toBeTruthy();
    }
  });

  it('should have different descriptions between English and French for every project', async () => {
    const en = await getProjects({ pageSize: 100, locale: 'en' });
    const fr = await getProjects({ pageSize: 100, locale: 'fr' });

    // At least one desc paragraph must differ per project, proving the merge
    // pipeline applied translations. Titles may be identical for brand names
    // (e.g., "Collabware - Collabmail"), but prose descriptions always differ.
    for (let i = 0; i < en.items.length; i++) {
      const enProject = en.items[i];
      const frProject = fr.items[i];

      const descsDiffer = enProject.desc.some(
        (s, j) => s !== frProject.desc[j]
      );
      expect(
        descsDiffer,
        `${enProject.id}: EN and FR descriptions should differ`
      ).toBe(true);
    }
  });

  it('should preserve structural fields across locales', async () => {
    const en = await getProjects({ pageSize: 100, locale: 'en' });
    const fr = await getProjects({ pageSize: 100, locale: 'fr' });

    for (let i = 0; i < en.items.length; i++) {
      const enProject = en.items[i];
      const frProject = fr.items[i];

      // Structural fields should be identical regardless of locale
      expect(enProject.id).toBe(frProject.id);
      expect(enProject.tags).toEqual(frProject.tags);
      expect(enProject.altGrid).toBe(frProject.altGrid);
      expect(enProject.videos).toEqual(frProject.videos);
      expect(enProject.images.length).toBe(frProject.images.length);

      // Image URLs (structural) should be identical; captions (translated) may differ
      for (let j = 0; j < enProject.images.length; j++) {
        expect(enProject.images[j].url).toBe(frProject.images[j].url);
        expect(enProject.images[j].tnUrl).toBe(frProject.images[j].tnUrl);
      }
    }
  });
});
