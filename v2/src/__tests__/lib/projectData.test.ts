import { describe, it, expect } from 'vitest';
import {
  getProjects,
  getProjectById,
  getAllTags,
  getTagCounts,
  getRelatedProjects,
  getPaginationInfo,
} from '../../lib/projectData';

/**
 * Tests for project data utilities.
 * Validates filtering, pagination, and query functions.
 */
describe('Project Data Utilities', () => {
  describe('getProjects', () => {
    it('should return all projects with default pagination', async () => {
      const response = await getProjects();

      expect(response.total).toBeGreaterThan(0);
      expect(response.items).toBeInstanceOf(Array);
      expect(response.start).toBe(0);
      expect(response.items.length).toBeLessThanOrEqual(6); // Default page size
    });

    it('should paginate correctly', async () => {
      const page1 = await getProjects({ page: 1, pageSize: 5 });
      const page2 = await getProjects({ page: 2, pageSize: 5 });

      expect(page1.start).toBe(0);
      expect(page2.start).toBe(5);
      expect(page1.items.length).toBe(5);

      // Ensure different projects on different pages
      expect(page1.items[0].id).not.toBe(page2.items[0].id);
    });

    it('should filter by single tag', async () => {
      const response = await getProjects({ tags: ['C#'] });

      // All returned projects should have the C# tag
      response.items.forEach((project) => {
        expect(project.tags).toContain('C#');
      });
    });

    it('should filter by multiple tags (AND logic)', async () => {
      const response = await getProjects({ tags: ['C#', 'SQL Server'] });

      // All returned projects should have both tags
      response.items.forEach((project) => {
        expect(project.tags).toContain('C#');
        expect(project.tags).toContain('SQL Server');
      });
    });

    it('should search by title', async () => {
      const response = await getProjects({ search: 'Collabware' });

      // All results should have "Collabware" in title or description
      response.items.forEach((project) => {
        const matchesTitle = project.title.toLowerCase().includes('collabware');
        const matchesDesc = project.desc.toLowerCase().includes('collabware');
        expect(matchesTitle || matchesDesc).toBe(true);
      });
    });

    it('should search case-insensitively', async () => {
      const response1 = await getProjects({ search: 'COLLABWARE' });
      const response2 = await getProjects({ search: 'collabware' });

      expect(response1.total).toBe(response2.total);
    });

    it('should handle search with no results', async () => {
      const response = await getProjects({ search: 'nonexistentproject12345' });

      expect(response.total).toBe(0);
      expect(response.items.length).toBe(0);
    });

    it('should combine filters correctly', async () => {
      const response = await getProjects({
        tags: ['SharePoint 2010'],
        search: 'portal',
        page: 1,
        pageSize: 10,
      });

      response.items.forEach((project) => {
        expect(project.tags).toContain('SharePoint 2010');
        const matchesSearch =
          project.title.toLowerCase().includes('portal') ||
          project.desc.toLowerCase().includes('portal');
        expect(matchesSearch).toBe(true);
      });
    });

    it('should handle empty page gracefully', async () => {
      const response = await getProjects({ page: 999, pageSize: 6 });

      expect(response.items.length).toBe(0);
      expect(response.start).toBeGreaterThan(response.total);
    });

    it('should respect custom page size', async () => {
      const response = await getProjects({ page: 1, pageSize: 3 });

      expect(response.items.length).toBe(3);
    });

    it('should calculate end index correctly for last page', async () => {
      const firstPage = await getProjects({ pageSize: 100 });
      const total = firstPage.total;
      const lastPageSize = 5;
      const lastPage = Math.ceil(total / lastPageSize);
      const response = await getProjects({ page: lastPage, pageSize: lastPageSize });

      expect(response.end).toBe(total - 1); // End should be last item index
    });
  });

  describe('getProjectById', () => {
    it('should return project for valid ID', async () => {
      const project = await getProjectById('collabspace');

      expect(project).not.toBeNull();
      expect(project?.id).toBe('collabspace');
      expect(project?.title).toContain('Collabspace');
    });

    it('should return null for non-existent ID', async () => {
      const project = await getProjectById('nonexistent-project');

      expect(project).toBeNull();
    });

    it('should return complete project data', async () => {
      const project = await getProjectById('collabspace');

      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('desc');
      expect(project).toHaveProperty('circa');
      expect(project).toHaveProperty('tags');
      expect(project).toHaveProperty('images');
      expect(project).toHaveProperty('videos');
      expect(project).toHaveProperty('altGrid');
    });

    it('should return project with images array', async () => {
      const project = await getProjectById('collabspace');

      expect(project?.images).toBeInstanceOf(Array);
      expect(project?.images.length).toBeGreaterThan(0);
    });

    it('should return project with videos array', async () => {
      const project = await getProjectById('collabwareCLM');

      expect(project?.videos).toBeInstanceOf(Array);
      expect(project?.videos.length).toBeGreaterThan(0);
    });
  });

  describe('getAllTags', () => {
    it('should return array of unique tags', async () => {
      const tags = await getAllTags();

      expect(tags).toBeInstanceOf(Array);
      expect(tags.length).toBeGreaterThan(0);

      // Check for uniqueness
      const uniqueTags = new Set(tags);
      expect(tags.length).toBe(uniqueTags.size);
    });

    it('should return sorted tags', async () => {
      const tags = await getAllTags();

      const sortedTags = [...tags].sort();
      expect(tags).toEqual(sortedTags);
    });

    it('should include expected tags', async () => {
      const tags = await getAllTags();

      // Should include common tags from v1
      expect(tags).toContain('C#');
      expect(tags).toContain('ASP.Net');
    });

    it('should include all tags as strings', async () => {
      const tags = await getAllTags();

      tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getTagCounts', () => {
    it('should return Map with tag counts', async () => {
      const counts = await getTagCounts();

      expect(counts).toBeInstanceOf(Map);
      expect(counts.size).toBeGreaterThan(0);
    });

    it('should have correct counts', async () => {
      const counts = await getTagCounts();

      // Verify counts are positive integers
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      counts.forEach((count, tag) => {
        expect(count).toBeGreaterThan(0);
        expect(Number.isInteger(count)).toBe(true);
      });
    });

    it('should match getAllTags length', async () => {
      const tags = await getAllTags();
      const counts = await getTagCounts();

      expect(counts.size).toBe(tags.length);
    });

    it('should count C# tag correctly', async () => {
      const counts = await getTagCounts();
      const csharpCount = counts.get('C#');

      expect(csharpCount).toBeDefined();
      expect(csharpCount).toBeGreaterThan(0);
    });
  });

  describe('getRelatedProjects', () => {
    it('should return related projects for valid ID', async () => {
      const related = await getRelatedProjects('collabspace', 3);

      expect(related).toBeInstanceOf(Array);
      expect(related.length).toBeLessThanOrEqual(3);
    });

    it('should exclude source project', async () => {
      const related = await getRelatedProjects('collabspace');

      const sourceInResults = related.some((p) => p.id === 'collabspace');
      expect(sourceInResults).toBe(false);
    });

    it('should return projects with shared tags', async () => {
      const sourceProject = await getProjectById('collabspace');
      expect(sourceProject).not.toBeNull();

      const related = await getRelatedProjects('collabspace', 5);

      // At least one related project should share at least one tag
      if (related.length > 0) {
        const hasSharedTags = related.some((project) =>
          project.tags.some((tag) => sourceProject!.tags.includes(tag))
        );
        expect(hasSharedTags).toBe(true);
      }
    });

    it('should respect limit parameter', async () => {
      const related = await getRelatedProjects('collabspace', 2);

      expect(related.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array for non-existent project', async () => {
      const related = await getRelatedProjects('nonexistent-project');

      expect(related).toEqual([]);
    });

    it('should sort by relevance (shared tags)', async () => {
      const related = await getRelatedProjects('collabspace', 5);
      const sourceProject = await getProjectById('collabspace');

      if (related.length > 1 && sourceProject) {
        // First result should have at least as many shared tags as second
        const firstShared = related[0].tags.filter((tag) =>
          sourceProject.tags.includes(tag)
        ).length;
        const secondShared = related[1].tags.filter((tag) =>
          sourceProject.tags.includes(tag)
        ).length;

        expect(firstShared).toBeGreaterThanOrEqual(secondShared);
      }
    });
  });

  describe('getPaginationInfo', () => {
    it('should calculate pagination correctly', () => {
      const info = getPaginationInfo(18, 2, 6);

      expect(info.totalPages).toBe(3); // 18 / 6 = 3
      expect(info.currentPage).toBe(2);
      expect(info.pageSize).toBe(6);
      expect(info.totalItems).toBe(18);
      expect(info.hasNextPage).toBe(true);
      expect(info.hasPreviousPage).toBe(true);
    });

    it('should handle first page correctly', () => {
      const info = getPaginationInfo(18, 1, 6);

      expect(info.hasPreviousPage).toBe(false);
      expect(info.hasNextPage).toBe(true);
    });

    it('should handle last page correctly', () => {
      const info = getPaginationInfo(18, 3, 6);

      expect(info.hasPreviousPage).toBe(true);
      expect(info.hasNextPage).toBe(false);
    });

    it('should handle single page correctly', () => {
      const info = getPaginationInfo(5, 1, 10);

      expect(info.totalPages).toBe(1);
      expect(info.hasPreviousPage).toBe(false);
      expect(info.hasNextPage).toBe(false);
    });

    it('should calculate indices correctly', () => {
      const info = getPaginationInfo(18, 2, 6);

      expect(info.startIndex).toBe(6); // Page 2 starts at index 6
      expect(info.endIndex).toBe(12); // Page 2 ends at index 12
    });

    it('should handle zero items', () => {
      const info = getPaginationInfo(0, 1, 6);

      expect(info.totalPages).toBe(0);
      expect(info.hasNextPage).toBe(false);
      expect(info.hasPreviousPage).toBe(false);
    });

    it('should handle partial last page', () => {
      const info = getPaginationInfo(20, 4, 6);

      expect(info.totalPages).toBe(4); // ceil(20/6) = 4
      expect(info.endIndex).toBe(20); // Last page has 2 items (18-19)
    });
  });
});
