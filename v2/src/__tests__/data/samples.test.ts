/**
 * Tests for the Writing Samples page data layer.
 *
 * Verifies:
 * - getLocalizedSamplesData returns correct structure
 * - All sections have heading and intro
 * - All artifacts have title and description; downloadable artifacts have formats
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

    it('should have correct item counts per section (3, 3, 2, 5, 4)', () => {
      const counts = data.sections.map((s) => s.items.length);
      expect(counts).toEqual([3, 3, 2, 5, 4]);
    });

    it('should total 17 artifacts across all sections', () => {
      const total = data.sections.reduce((sum, s) => sum + s.items.length, 0);
      expect(total).toBe(17);
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

    it('should have a format with label and href for downloadable artifacts', () => {
      for (const section of data.sections) {
        for (const item of section.items) {
          if (item.format) {
            expect(item.format.label).toBeTruthy();
            expect(item.format.href).toBeTruthy();
          }
        }
      }
    });

    it('should have PDF format for cost savings report', () => {
      const costSavings = data.sections[4];
      const report = costSavings.items.find((i) =>
        i.title.includes('costCuttingAudit')
      );
      expect(report).toBeDefined();
      expect(report!.format?.label).toBe('PDF');
    });

    it('should have valid href paths for all formats', () => {
      for (const section of data.sections) {
        for (const item of section.items) {
          if (item.format) {
            expect(item.format.href).toMatch(/^\/documents\/.+\.(pdf|md)$/);
          }
        }
      }
    });
  });
});
