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
        project.desc.toLowerCase().includes('sharepoint');
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
