import { describe, it, expect } from 'vitest';
import {
  isProjectImage,
  isProjectVideo,
  isProject,
  validateProjects,
} from '../../types/typeGuards';
import type { Project, ProjectImage, ProjectVideo } from '../../types';

/**
 * Tests for type guard functions.
 * Validates runtime type checking for project data structures.
 */
describe('Type Guards', () => {
  describe('isProjectImage', () => {
    it('should return true for valid ProjectImage', () => {
      const validImage: ProjectImage = {
        url: '/images/test.jpg',
        tnUrl: '/images/test_tn.jpg',
        caption: 'Test image',
      };

      expect(isProjectImage(validImage)).toBe(true);
    });

    it('should return true for ProjectImage with optional tnUrl2x', () => {
      const imageWith2x: ProjectImage = {
        url: '/images/test.jpg',
        tnUrl: '/images/test_tn.jpg',
        tnUrl2x: '/images/test_tn@2x.jpg',
        caption: 'Test image',
      };

      expect(isProjectImage(imageWith2x)).toBe(true);
    });

    it('should return false for image with missing required fields', () => {
      const invalidImage = {
        url: '/images/test.jpg',
        // Missing tnUrl and caption
      };

      expect(isProjectImage(invalidImage)).toBe(false);
    });

    it('should return false for image with wrong field types', () => {
      const invalidImage = {
        url: 123, // Should be string
        tnUrl: '/images/test_tn.jpg',
        caption: 'Test',
      };

      expect(isProjectImage(invalidImage)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isProjectImage(null)).toBe(false);
      expect(isProjectImage(undefined)).toBe(false);
    });
  });

  describe('isProjectVideo', () => {
    it('should return true for valid vimeo video', () => {
      const validVideo: ProjectVideo = {
        type: 'vimeo',
        id: '12345678',
        width: 640,
        height: 480,
      };

      expect(isProjectVideo(validVideo)).toBe(true);
    });

    it('should return true for valid youtube video', () => {
      const validVideo: ProjectVideo = {
        type: 'youtube',
        id: 'dQw4w9WgXcQ',
        width: 640,
        height: 360,
      };

      expect(isProjectVideo(validVideo)).toBe(true);
    });

    it('should return false for invalid video type', () => {
      const invalidVideo = {
        type: 'dailymotion', // Invalid type
        id: '12345',
        width: 640,
        height: 480,
      };

      expect(isProjectVideo(invalidVideo)).toBe(false);
    });

    it('should return false for video with non-numeric dimensions', () => {
      const invalidVideo = {
        type: 'vimeo',
        id: '12345678',
        width: '640', // Should be number
        height: 480,
      };

      expect(isProjectVideo(invalidVideo)).toBe(false);
    });
  });

  describe('isProject', () => {
    const validProject: Project = {
      id: 'test-project',
      title: 'Test Project',
      desc: '<p>Description</p>',
      circa: '2025',
      tags: ['React', 'TypeScript'],
      images: [
        {
          url: '/images/test.jpg',
          tnUrl: '/images/test_tn.jpg',
          caption: 'Test',
        },
      ],
      videos: [],
      altGrid: false,
    };

    it('should return true for valid project', () => {
      expect(isProject(validProject)).toBe(true);
    });

    it('should return true for project with videos', () => {
      const projectWithVideo: Project = {
        ...validProject,
        videos: [
          {
            type: 'vimeo',
            id: '12345678',
            width: 640,
            height: 480,
          },
        ],
      };

      expect(isProject(projectWithVideo)).toBe(true);
    });

    it('should return false for project with missing required fields', () => {
      const invalidProject = {
        id: 'test',
        title: 'Test',
        // Missing desc, circa, tags, images, videos, altGrid
      };

      expect(isProject(invalidProject)).toBe(false);
    });

    it('should return false for project with invalid tags array', () => {
      const invalidProject = {
        ...validProject,
        tags: ['React', 123], // Invalid: contains number
      };

      expect(isProject(invalidProject)).toBe(false);
    });

    it('should return false for project with invalid images array', () => {
      const invalidProject = {
        ...validProject,
        images: [{ url: 'test.jpg' }], // Missing required fields
      };

      expect(isProject(invalidProject)).toBe(false);
    });
  });

  describe('validateProjects', () => {
    const validProjects: Project[] = [
      {
        id: 'project1',
        title: 'Project 1',
        desc: '<p>Description 1</p>',
        circa: '2025',
        tags: ['React'],
        images: [
          {
            url: '/images/p1.jpg',
            tnUrl: '/images/p1_tn.jpg',
            caption: 'Project 1 image',
          },
        ],
        videos: [],
        altGrid: false,
      },
      {
        id: 'project2',
        title: 'Project 2',
        desc: '<p>Description 2</p>',
        circa: '2024',
        tags: ['TypeScript'],
        images: [
          {
            url: '/images/p2.jpg',
            tnUrl: '/images/p2_tn.jpg',
            caption: 'Project 2 image',
          },
        ],
        videos: [],
        altGrid: false,
      },
    ];

    it('should return true for valid projects array', () => {
      expect(validateProjects(validProjects)).toBe(true);
    });

    it('should throw error for non-array input', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => validateProjects({} as any)).toThrow('Projects data must be an array');
    });

    it('should throw error for array with invalid project', () => {
      const invalidProjects = [
        validProjects[0],
        { id: 'invalid' }, // Missing required fields
      ];

      expect(() => validateProjects(invalidProjects)).toThrow(/Invalid project at index 1/);
    });

    it('should return true for empty array', () => {
      expect(validateProjects([])).toBe(true);
    });
  });
});
