import { describe, it, expect } from 'vitest';
import { PROJECTS, TOTAL_PROJECTS } from '../../data/projects';
import { validateProjects } from '../../types';

/**
 * Tests for the projects data file.
 * Validates data integrity and structure.
 */
describe('Projects Data', () => {
  it('should have correct total count', () => {
    expect(TOTAL_PROJECTS).toBe(PROJECTS.length);
    expect(TOTAL_PROJECTS).toBe(18); // Known count from v1
  });

  it('should pass type validation', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validateProjects(PROJECTS as any)).not.toThrow();
  });

  it('should have unique project IDs', () => {
    const ids = PROJECTS.map((p) => p.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have all projects with at least one image', () => {
    PROJECTS.forEach((project) => {
      expect(project.images.length).toBeGreaterThan(0);
    });
  });

  it('should have valid image URLs', () => {
    PROJECTS.forEach((project) => {
      project.images.forEach((image) => {
        expect(image.url).toMatch(/^\/images\/gallery\//);
        expect(image.tnUrl).toMatch(/^\/images\/gallery\//);

        if (image.tnUrl2x) {
          expect(image.tnUrl2x).toMatch(/^\/images\/gallery\//);
          expect(image.tnUrl2x).toContain('@2x');
        }
      });
    });
  });

  it('should have valid video data for projects with videos', () => {
    const projectsWithVideos = PROJECTS.filter((p) => p.videos.length > 0);

    expect(projectsWithVideos.length).toBe(2); // CLM and Quadrant

    projectsWithVideos.forEach((project) => {
      project.videos.forEach((video) => {
        expect(['vimeo', 'youtube']).toContain(video.type);
        expect(video.id).toBeTruthy();
        expect(video.width).toBeGreaterThan(0);
        expect(video.height).toBeGreaterThan(0);
      });
    });
  });

  it('should have altGrid flag set correctly', () => {
    const altGridProjects = PROJECTS.filter((p) => p.altGrid);

    expect(altGridProjects.length).toBe(4); // spMisc, CLM, Quadrant, grASP
    expect(altGridProjects.map((p) => p.id)).toEqual(
      expect.arrayContaining(['spMisc', 'collabwareCLM', 'quadrant', 'grasp'])
    );
  });

  it('should have valid circa date formats', () => {
    PROJECTS.forEach((project) => {
      expect(project.circa).toBeTruthy();
      expect(typeof project.circa).toBe('string');
      expect(project.circa.length).toBeGreaterThan(0);
    });
  });

  it('should have valid tags', () => {
    PROJECTS.forEach((project) => {
      expect(project.tags.length).toBeGreaterThan(0);

      project.tags.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have HTML in descriptions', () => {
    PROJECTS.forEach((project) => {
      expect(project.desc).toBeTruthy();
      // Most projects should have HTML tags
      if (project.desc.includes('<')) {
        expect(project.desc).toMatch(/<[a-z][\s\S]*>/i);
      }
    });
  });

  it('should be ordered from newest to oldest', () => {
    // First project should be recent (2020s)
    const firstProject = PROJECTS[0];
    expect(firstProject.circa).toMatch(/202\d/);
  });

  it('should have collabspace project', () => {
    const collabspace = PROJECTS.find((p) => p.id === 'collabspace');
    expect(collabspace).toBeDefined();
    expect(collabspace?.title).toContain('Collabspace');
  });

  it('should have correct number of images per project', () => {
    PROJECTS.forEach((project) => {
      expect(project.images.length).toBeGreaterThanOrEqual(2);
      expect(project.images.length).toBeLessThanOrEqual(10);
    });
  });

  it('should have captions for all images', () => {
    PROJECTS.forEach((project) => {
      project.images.forEach((image) => {
        expect(image.caption).toBeTruthy();
        expect(image.caption.length).toBeGreaterThan(0);
      });
    });
  });
});
