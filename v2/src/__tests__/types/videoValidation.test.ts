import { describe, it, expect } from 'vitest';
import {
  isValidVideoId,
  isProjectVideo,
} from '../../types/typeGuards';

describe('Video ID Validation', () => {
  describe('isValidVideoId', () => {
    describe('Vimeo ID validation', () => {
      it('should accept valid 8-digit Vimeo ID', () => {
        expect(isValidVideoId('12345678', 'vimeo')).toBe(true);
      });

      it('should accept valid 9-digit Vimeo ID', () => {
        expect(isValidVideoId('123456789', 'vimeo')).toBe(true);
      });

      it('should accept valid 10-digit Vimeo ID', () => {
        expect(isValidVideoId('1234567890', 'vimeo')).toBe(true);
      });

      it('should accept valid 11-digit Vimeo ID', () => {
        expect(isValidVideoId('12345678901', 'vimeo')).toBe(true);
      });

      it('should reject Vimeo ID shorter than 8 digits', () => {
        expect(isValidVideoId('1234567', 'vimeo')).toBe(false);
      });

      it('should reject Vimeo ID longer than 11 digits', () => {
        expect(isValidVideoId('123456789012', 'vimeo')).toBe(false);
      });

      it('should reject Vimeo ID with letters', () => {
        expect(isValidVideoId('1234567a', 'vimeo')).toBe(false);
      });

      it('should reject Vimeo ID with special characters', () => {
        expect(isValidVideoId('12345678!', 'vimeo')).toBe(false);
      });

      it('should reject Vimeo ID with hyphens', () => {
        expect(isValidVideoId('1234567-8', 'vimeo')).toBe(false);
      });

      it('should reject Vimeo ID with spaces', () => {
        expect(isValidVideoId('1234567 8', 'vimeo')).toBe(false);
      });

      it('should reject Vimeo ID with semicolon (injection attempt)', () => {
        expect(isValidVideoId('12345678;', 'vimeo')).toBe(false);
      });

      it('should reject Vimeo ID with path traversal attempt', () => {
        expect(isValidVideoId('../../123456', 'vimeo')).toBe(false);
      });
    });

    describe('YouTube ID validation', () => {
      it('should accept valid 11-char YouTube ID', () => {
        expect(isValidVideoId('dQw4w9WgXcQ', 'youtube')).toBe(true);
      });

      it('should accept YouTube ID with uppercase letters', () => {
        expect(isValidVideoId('DQW4W9WGXCQ', 'youtube')).toBe(true);
      });

      it('should accept YouTube ID with lowercase letters', () => {
        expect(isValidVideoId('dqw4w9wgxcq', 'youtube')).toBe(true);
      });

      it('should accept YouTube ID with numbers', () => {
        expect(isValidVideoId('12345678901', 'youtube')).toBe(true);
      });

      it('should accept YouTube ID with hyphens', () => {
        expect(isValidVideoId('dQw4w9-gXcQ', 'youtube')).toBe(true);
      });

      it('should accept YouTube ID with underscores', () => {
        expect(isValidVideoId('dQw4w9_gXcQ', 'youtube')).toBe(true);
      });

      it('should accept YouTube ID with mixed characters', () => {
        expect(isValidVideoId('a1b2C3d4E5-', 'youtube')).toBe(true);
      });

      it('should reject YouTube ID shorter than 11 chars', () => {
        expect(isValidVideoId('dQw4w9WgXc', 'youtube')).toBe(false);
      });

      it('should reject YouTube ID longer than 11 chars', () => {
        expect(isValidVideoId('dQw4w9WgXcQQ', 'youtube')).toBe(false);
      });

      it('should reject YouTube ID with special characters', () => {
        expect(isValidVideoId('dQw4w9WgXc!', 'youtube')).toBe(false);
      });

      it('should reject YouTube ID with spaces', () => {
        expect(isValidVideoId('dQw4w9 gXcQ', 'youtube')).toBe(false);
      });

      it('should reject YouTube ID with semicolon (injection attempt)', () => {
        expect(isValidVideoId('dQw4w9Wg;cQ', 'youtube')).toBe(false);
      });

      it('should reject YouTube ID with dot', () => {
        expect(isValidVideoId('dQw4w9Wg.cQ', 'youtube')).toBe(false);
      });

      it('should reject YouTube ID with path traversal attempt', () => {
        expect(isValidVideoId('../../dQw4w', 'youtube')).toBe(false);
      });
    });

    describe('Error handling', () => {
      it('should throw TypeError if ID is not a string', () => {
        expect(() => isValidVideoId(null as unknown as string, 'vimeo')).toThrow(TypeError);
        expect(() => isValidVideoId(undefined as unknown as string, 'youtube')).toThrow(TypeError);
        expect(() => isValidVideoId(123 as unknown as string, 'vimeo')).toThrow(TypeError);
        expect(() => isValidVideoId({} as unknown as string, 'youtube')).toThrow(TypeError);
        expect(() => isValidVideoId([] as unknown as string, 'vimeo')).toThrow(TypeError);
      });

      it('should throw TypeError for invalid platform', () => {
        expect(() => isValidVideoId('12345678', 'invalid' as unknown as 'vimeo')).toThrow(TypeError);
        expect(() => isValidVideoId('dQw4w9WgXcQ', 'VIMEO' as unknown as 'vimeo')).toThrow(TypeError);
      });
    });

    describe('Security: URL Injection Prevention', () => {
      describe('Vimeo injection attempts', () => {
        it('should block URL with query parameter injection', () => {
          expect(isValidVideoId('12345678?param=value', 'vimeo')).toBe(false);
        });

        it('should block URL with fragment injection', () => {
          expect(isValidVideoId('12345678#section', 'vimeo')).toBe(false);
        });

        it('should block javascript: protocol', () => {
          expect(isValidVideoId('javascript:alert', 'vimeo')).toBe(false);
        });

        it('should block data: protocol', () => {
          expect(isValidVideoId('data:text/html', 'vimeo')).toBe(false);
        });

        it('should block commands with && operator', () => {
          expect(isValidVideoId('12345678&&cmd', 'vimeo')).toBe(false);
        });

        it('should block commands with | pipe operator', () => {
          expect(isValidVideoId('12345678|cmd', 'vimeo')).toBe(false);
        });

        it('should block commands with backtick injection', () => {
          expect(isValidVideoId('12345678`cmd`', 'vimeo')).toBe(false);
        });

        it('should block SQL injection syntax', () => {
          expect(isValidVideoId("12345678' OR '1'='1", 'vimeo')).toBe(false);
        });

        it('should block HTML/XML injection', () => {
          expect(isValidVideoId('12345678<script>', 'vimeo')).toBe(false);
        });
      });

      describe('YouTube injection attempts', () => {
        it('should block URL with query parameter injection', () => {
          expect(isValidVideoId('dQw4w9Wg?cmd=x', 'youtube')).toBe(false);
        });

        it('should block URL with fragment injection', () => {
          expect(isValidVideoId('dQw4w9Wg#cmd', 'youtube')).toBe(false);
        });

        it('should block javascript: protocol', () => {
          expect(isValidVideoId('javascript:al', 'youtube')).toBe(false);
        });

        it('should block unicode characters', () => {
          expect(isValidVideoId('dQw4w9Wgǚ̌', 'youtube')).toBe(false);
        });
      });
    });
  });

  describe('isProjectVideo', () => {
    describe('Valid project videos', () => {
      it('should accept valid YouTube video', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'dQw4w9WgXcQ',
            width: 560,
            height: 315,
          })
        ).toBe(true);
      });

      it('should accept valid Vimeo video', () => {
        expect(
          isProjectVideo({
            type: 'vimeo',
            id: '123456789',
            width: 640,
            height: 360,
          })
        ).toBe(true);
      });

      it('should accept video with any numeric dimensions', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'dQw4w9WgXcQ',
            width: 1920,
            height: 1080,
          })
        ).toBe(true);
      });
    });

    describe('Invalid project videos', () => {
      it('should reject if type is not object', () => {
        expect(isProjectVideo(null)).toBe(false);
        expect(isProjectVideo('string')).toBe(false);
        expect(isProjectVideo(123)).toBe(false);
        expect(isProjectVideo([])).toBe(false);
      });

      it('should reject if type is invalid', () => {
        expect(
          isProjectVideo({
            type: 'vimeo-video',
            id: '123456789',
            width: 640,
            height: 360,
          })
        ).toBe(false);

        expect(
          isProjectVideo({
            type: 'dailymotion',
            id: 'someId',
            width: 640,
            height: 360,
          })
        ).toBe(false);
      });

      it('should reject if id is invalid format', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'invalid!id', // Invalid character
            width: 560,
            height: 315,
          })
        ).toBe(false);

        expect(
          isProjectVideo({
            type: 'vimeo',
            id: '123', // Too short
            width: 640,
            height: 360,
          })
        ).toBe(false);
      });

      it('should reject if id is not string', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 12345678901,
            width: 560,
            height: 315,
          })
        ).toBe(false);
      });

      it('should reject if width is not number', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'dQw4w9WgXcQ',
            width: '560',
            height: 315,
          })
        ).toBe(false);
      });

      it('should reject if height is not number', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'dQw4w9WgXcQ',
            width: 560,
            height: '315',
          })
        ).toBe(false);
      });

      it('should reject if required fields are missing', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'dQw4w9WgXcQ',
          })
        ).toBe(false);

        expect(
          isProjectVideo({
            id: 'dQw4w9WgXcQ',
            width: 560,
            height: 315,
          })
        ).toBe(false);
      });

      it('should reject if fields have wrong types', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'dQw4w9WgXcQ',
            width: 560,
            height: null,
          })
        ).toBe(false);
      });
    });

    describe('Security: Injection Prevention', () => {
      it('should reject YouTube video with URL injection attempt', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'dQw4w9Wg?cmd=x',
            width: 560,
            height: 315,
          })
        ).toBe(false);
      });

      it('should reject Vimeo video with URL injection attempt', () => {
        expect(
          isProjectVideo({
            type: 'vimeo',
            id: '123456789;cmd',
            width: 640,
            height: 360,
          })
        ).toBe(false);
      });

      it('should reject video with javascript protocol injection', () => {
        expect(
          isProjectVideo({
            type: 'youtube',
            id: 'javascript:alert',
            width: 560,
            height: 315,
          })
        ).toBe(false);
      });

      it('should reject video with path traversal attempt', () => {
        expect(
          isProjectVideo({
            type: 'vimeo',
            id: '../../etc/passwd',
            width: 640,
            height: 360,
          })
        ).toBe(false);
      });
    });
  });
});
