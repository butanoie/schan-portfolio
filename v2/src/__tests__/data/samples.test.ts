/**
 * Tests for the Writing Samples page data layer.
 *
 * Verifies:
 * - getLocalizedSamplesData returns correct structure
 * - All sections have heading and intro
 * - All artifacts have title and description
 * - Available artifacts have non-empty formats arrays
 * - Coming-soon artifacts have available: false
 * - Page deck data is correctly formed
 */

import { describe, it, expect } from 'vitest';
import { getLocalizedSamplesData } from '@/src/data/samples';
import type { TranslationFunction } from '@/src/hooks/useI18n';

/**
 * Mock translation function that returns the key for verification.
 *
 * @param key - Translation key
 * @returns The key itself as a string
 */
const mockT: TranslationFunction = (key: string) => key;

describe('getLocalizedSamplesData', () => {
  const data = getLocalizedSamplesData(mockT, 'en');

  describe('pageDeck', () => {
    it('should return page deck with all required fields', () => {
      expect(data.pageDeck).toHaveProperty('imageUrl');
      expect(data.pageDeck).toHaveProperty('imageAlt');
      expect(data.pageDeck).toHaveProperty('headingId');
      expect(data.pageDeck).toHaveProperty('heading');
      expect(data.pageDeck).toHaveProperty('paragraphs');
    });

    it('should use tasty_morsels hero image with locale suffix', () => {
      expect(data.pageDeck.imageUrl).toBe('/images/tasty_morsels@2x-en.png');
    });

    it('should use French hero image for fr locale', () => {
      const frData = getLocalizedSamplesData(mockT, 'fr');
      expect(frData.pageDeck.imageUrl).toBe('/images/tasty_morsels@2x-fr.png');
    });

    it('should have two intro paragraphs', () => {
      expect(data.pageDeck.paragraphs).toHaveLength(2);
    });

    it('should have a heading ID for accessibility', () => {
      expect(data.pageDeck.headingId).toBe('samples-heading');
    });
  });

  describe('sections', () => {
    it('should return exactly 5 sections', () => {
      expect(data.sections).toHaveLength(5);
    });

    it('should have heading and intro for every section', () => {
      for (const section of data.sections) {
        expect(section.heading).toBeTruthy();
        expect(section.intro).toBeTruthy();
      }
    });

    it('should have items array for every section', () => {
      for (const section of data.sections) {
        expect(Array.isArray(section.items)).toBe(true);
        expect(section.items.length).toBeGreaterThan(0);
      }
    });

    it('should have correct item counts per section (3, 3, 2, 3, 3)', () => {
      const counts = data.sections.map((s) => s.items.length);
      expect(counts).toEqual([3, 3, 2, 3, 3]);
    });

    it('should total 14 artifacts across all sections', () => {
      const total = data.sections.reduce((sum, s) => sum + s.items.length, 0);
      expect(total).toBe(14);
    });
  });

  describe('artifacts', () => {
    it('should have title and description for every artifact', () => {
      for (const section of data.sections) {
        for (const item of section.items) {
          expect(item.title).toBeTruthy();
          expect(item.description).toBeTruthy();
        }
      }
    });

    it('should have formats array for every artifact', () => {
      for (const section of data.sections) {
        for (const item of section.items) {
          expect(Array.isArray(item.formats)).toBe(true);
          expect(item.formats.length).toBeGreaterThan(0);
        }
      }
    });

    it('should have available boolean for every artifact', () => {
      for (const section of data.sections) {
        for (const item of section.items) {
          expect(typeof item.available).toBe('boolean');
        }
      }
    });

    it('should have available: true for first four sections', () => {
      for (const section of data.sections.slice(0, 4)) {
        for (const item of section.items) {
          expect(item.available).toBe(true);
        }
      }
    });

    it('should have available: false for cost savings section items', () => {
      const costSavings = data.sections[4];
      for (const item of costSavings.items) {
        expect(item.available).toBe(false);
      }
    });

    it('should have PDF-only format for cost savings roadmap', () => {
      const costSavings = data.sections[4];
      const roadmap = costSavings.items.find((i) =>
        i.title.includes('costSavingsRoadmap')
      );
      expect(roadmap).toBeDefined();
      expect(roadmap!.formats).toHaveLength(1);
      expect(roadmap!.formats[0].label).toBe('PDF');
    });

    it('should have valid href paths for all formats', () => {
      for (const section of data.sections) {
        for (const item of section.items) {
          for (const format of item.formats) {
            expect(format.href).toMatch(/^\/documents\/.+\.(pdf|md)$/);
          }
        }
      }
    });
  });
});
