import { describe, it, expect } from 'vitest';
import {
  getProjects,
  getProjectById,
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
        const matchesDesc = project.desc.join(' ').toLowerCase().includes('collabware');
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
          project.desc.join(' ').toLowerCase().includes('portal');
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

});
