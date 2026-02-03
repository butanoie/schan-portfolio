import { describe, it, expect } from 'vitest';
import {
  isProjectImage,
  isProjectVideo,
  isProject,
  validateProjects,
  isValidString,
  isValidUrlPath,
  isValidDimension,
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

  describe('isValidString', () => {
    it('should accept valid strings', () => {
      expect(isValidString('Hello')).toBe(true);
      expect(isValidString('a')).toBe(true);
      expect(isValidString('A'.repeat(10000))).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(isValidString('')).toBe(false);
    });

    it('should reject strings exceeding max length', () => {
      expect(isValidString('A'.repeat(10001))).toBe(false);
    });

    it('should respect custom length constraints', () => {
      expect(isValidString('ab', 1, 5)).toBe(true);
      expect(isValidString('a', 2, 5)).toBe(false); // Too short
      expect(isValidString('abcdef', 1, 5)).toBe(false); // Too long
    });

    it('should throw TypeError for non-string input', () => {
      expect(() => isValidString(null as unknown as string)).toThrow(TypeError);
      expect(() => isValidString(undefined as unknown as string)).toThrow(TypeError);
      expect(() => isValidString(123 as unknown as string)).toThrow(TypeError);
    });
  });

  describe('isValidUrlPath', () => {
    it('should accept valid absolute paths', () => {
      expect(isValidUrlPath('/images/photo.jpg')).toBe(true);
      expect(isValidUrlPath('/path/to/image.png')).toBe(true);
    });

    it('should accept valid relative paths', () => {
      expect(isValidUrlPath('./images/photo.jpg')).toBe(true);
      expect(isValidUrlPath('images/photo.jpg')).toBe(true);
    });

    it('should accept valid HTTP/HTTPS URLs', () => {
      expect(isValidUrlPath('https://example.com/image.jpg')).toBe(true);
      expect(isValidUrlPath('http://example.com/photo.png')).toBe(true);
    });

    it('should reject path traversal attempts', () => {
      expect(isValidUrlPath('../../etc/passwd')).toBe(false);
      expect(isValidUrlPath('../../../evil')).toBe(false);
      expect(isValidUrlPath('/path/../../etc')).toBe(false);
    });

    it('should reject double slashes', () => {
      expect(isValidUrlPath('//example.com')).toBe(false);
      expect(isValidUrlPath('/path//to//file')).toBe(false);
    });

    it('should reject command injection attempts', () => {
      expect(isValidUrlPath('/path;command')).toBe(false);
      expect(isValidUrlPath('/path|command')).toBe(false);
      expect(isValidUrlPath('/path&command')).toBe(false);
      expect(isValidUrlPath('/path`command`')).toBe(false);
    });

    it('should reject HTML/XML injection', () => {
      expect(isValidUrlPath('/path<script>')).toBe(false);
      expect(isValidUrlPath('/path>alert')).toBe(false);
    });

    it('should throw TypeError for non-string input', () => {
      expect(() => isValidUrlPath(null as unknown as string)).toThrow(TypeError);
      expect(() => isValidUrlPath(undefined as unknown as string)).toThrow(TypeError);
      expect(() => isValidUrlPath(123 as unknown as string)).toThrow(TypeError);
    });
  });

  describe('isValidDimension', () => {
    it('should accept valid positive dimensions', () => {
      expect(isValidDimension(1)).toBe(true);
      expect(isValidDimension(100)).toBe(true);
      expect(isValidDimension(10000)).toBe(true);
      expect(isValidDimension(800)).toBe(true);
    });

    it('should reject zero', () => {
      expect(isValidDimension(0)).toBe(false);
    });

    it('should reject negative numbers', () => {
      expect(isValidDimension(-1)).toBe(false);
      expect(isValidDimension(-100)).toBe(false);
    });

    it('should reject floating point numbers', () => {
      expect(isValidDimension(100.5)).toBe(false);
      expect(isValidDimension(800.1)).toBe(false);
    });

    it('should reject dimensions exceeding max', () => {
      expect(isValidDimension(10001)).toBe(false);
      expect(isValidDimension(999999)).toBe(false);
    });

    it('should reject Infinity', () => {
      expect(isValidDimension(Infinity)).toBe(false);
      expect(isValidDimension(-Infinity)).toBe(false);
    });

    it('should reject NaN', () => {
      expect(isValidDimension(NaN)).toBe(false);
    });

    it('should respect custom constraints', () => {
      expect(isValidDimension(50, 10, 100)).toBe(true);
      expect(isValidDimension(5, 10, 100)).toBe(false); // Too small
      expect(isValidDimension(150, 10, 100)).toBe(false); // Too large
    });
  });

  describe('Enhanced Security Validation', () => {
    describe('isProjectImage with security validation', () => {
      it('should reject image with path traversal in URL', () => {
        const maliciousImage = {
          url: '../../etc/passwd',
          tnUrl: '/images/test_tn.jpg',
          caption: 'Malicious',
        };

        expect(isProjectImage(maliciousImage)).toBe(false);
      });

      it('should reject image with command injection in URL', () => {
        const maliciousImage = {
          url: '/images/test.jpg;rm -rf /',
          tnUrl: '/images/test_tn.jpg',
          caption: 'Malicious',
        };

        expect(isProjectImage(maliciousImage)).toBe(false);
      });

      it('should reject image with extremely long caption', () => {
        const oversizeImage = {
          url: '/images/test.jpg',
          tnUrl: '/images/test_tn.jpg',
          caption: 'A'.repeat(10001),
        };

        expect(isProjectImage(oversizeImage)).toBe(false);
      });

      it('should reject image with empty caption', () => {
        const emptyImage = {
          url: '/images/test.jpg',
          tnUrl: '/images/test_tn.jpg',
          caption: '',
        };

        expect(isProjectImage(emptyImage)).toBe(false);
      });

      it('should accept valid image with all validations passing', () => {
        const validImage = {
          url: '/images/test.jpg',
          tnUrl: '/images/test_tn.jpg',
          tnUrl2x: '/images/test_tn@2x.jpg',
          caption: 'Valid image caption',
        };

        expect(isProjectImage(validImage)).toBe(true);
      });
    });

    describe('isProjectVideo with dimension validation', () => {
      it('should reject video with dimension of 0', () => {
        const invalidVideo = {
          type: 'youtube' as const,
          id: 'dQw4w9WgXcQ',
          width: 0,
          height: 360,
        };

        expect(isProjectVideo(invalidVideo)).toBe(false);
      });

      it('should reject video with negative dimensions', () => {
        const invalidVideo = {
          type: 'youtube' as const,
          id: 'dQw4w9WgXcQ',
          width: -560,
          height: 360,
        };

        expect(isProjectVideo(invalidVideo)).toBe(false);
      });

      it('should reject video with floating point dimensions', () => {
        const invalidVideo = {
          type: 'youtube' as const,
          id: 'dQw4w9WgXcQ',
          width: 560.5,
          height: 360,
        };

        expect(isProjectVideo(invalidVideo)).toBe(false);
      });

      it('should reject video with extremely large dimensions', () => {
        const invalidVideo = {
          type: 'youtube' as const,
          id: 'dQw4w9WgXcQ',
          width: 999999,
          height: 360,
        };

        expect(isProjectVideo(invalidVideo)).toBe(false);
      });

      it('should reject video with NaN dimensions', () => {
        const invalidVideo = {
          type: 'youtube' as const,
          id: 'dQw4w9WgXcQ',
          width: NaN,
          height: 360,
        };

        expect(isProjectVideo(invalidVideo)).toBe(false);
      });

      it('should accept video with valid dimensions', () => {
        const validVideo = {
          type: 'youtube' as const,
          id: 'dQw4w9WgXcQ',
          width: 560,
          height: 315,
        };

        expect(isProjectVideo(validVideo)).toBe(true);
      });
    });
  });

  /**
   * Edge case tests for null/undefined handling and circular references
   */
  describe('Edge Cases - Null/Undefined/Circular References', () => {
    describe('isProjectImage edge cases', () => {
      it('should reject null', () => {
        expect(isProjectImage(null)).toBe(false);
      });

      it('should reject undefined', () => {
        expect(isProjectImage(undefined)).toBe(false);
      });

      it('should reject image with null url', () => {
        const invalidImage = {
          url: null,
          tnUrl: '/thumb.jpg',
          caption: 'Test',
        };

        expect(isProjectImage(invalidImage)).toBe(false);
      });

      it('should reject image with undefined caption', () => {
        const invalidImage = {
          url: '/image.jpg',
          tnUrl: '/thumb.jpg',
          caption: undefined,
        };

        expect(isProjectImage(invalidImage)).toBe(false);
      });

      it('should handle image with circular reference in extra properties', () => {
        const circularImage = {
          url: '/image.jpg',
          tnUrl: '/thumb.jpg',
          caption: 'Test',
        } as Record<string, unknown>;
        // Create circular reference
        circularImage.self = circularImage;

        // Should still validate core properties
        expect(isProjectImage(circularImage)).toBe(true);
      });
    });

    describe('isProjectVideo edge cases', () => {
      it('should reject null', () => {
        expect(isProjectVideo(null)).toBe(false);
      });

      it('should reject undefined', () => {
        expect(isProjectVideo(undefined)).toBe(false);
      });

      it('should reject video with null type', () => {
        const invalidVideo = {
          type: null,
          id: 'dQw4w9WgXcQ',
          width: 560,
          height: 315,
        };

        expect(isProjectVideo(invalidVideo)).toBe(false);
      });

      it('should reject video with null id', () => {
        const invalidVideo = {
          type: 'youtube' as const,
          id: null,
          width: 560,
          height: 315,
        };

        expect(isProjectVideo(invalidVideo)).toBe(false);
      });

      it('should reject video with null dimensions', () => {
        const invalidVideo = {
          type: 'vimeo' as const,
          id: '123456789',
          width: null,
          height: 720,
        };

        expect(isProjectVideo(invalidVideo)).toBe(false);
      });
    });

    describe('isProject edge cases', () => {
      it('should reject null', () => {
        expect(isProject(null)).toBe(false);
      });

      it('should reject undefined', () => {
        expect(isProject(undefined)).toBe(false);
      });

      it('should reject project with null id', () => {
        const invalidProject = {
          id: null,
          name: 'Test Project',
          description: 'Test description',
          href: '/test',
          images: [],
        };

        expect(isProject(invalidProject)).toBe(false);
      });

      it('should reject project with undefined images array', () => {
        const invalidProject = {
          id: 'project-1',
          name: 'Test Project',
          description: 'Test description',
          href: '/test',
          images: undefined,
        };

        expect(isProject(invalidProject)).toBe(false);
      });
    });

    describe('isValidString edge cases', () => {
      it('should handle null input gracefully', () => {
        expect(() => {
          isValidString(null as unknown as string);
        }).toThrow();
      });

      it('should handle undefined input gracefully', () => {
        expect(() => {
          isValidString(undefined as unknown as string);
        }).toThrow();
      });

      it('should handle non-string input gracefully', () => {
        expect(() => {
          isValidString(123 as unknown as string);
        }).toThrow();
      });

      it('should handle empty string', () => {
        expect(isValidString('')).toBe(false);
      });

      it('should handle string at max boundary', () => {
        const maxString = 'a'.repeat(10000);
        expect(isValidString(maxString)).toBe(true);
      });

      it('should reject string exceeding max boundary', () => {
        const tooLongString = 'a'.repeat(10001);
        expect(isValidString(tooLongString)).toBe(false);
      });
    });
  });
});
