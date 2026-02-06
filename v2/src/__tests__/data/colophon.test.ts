import { describe, it, expect } from 'vitest';
import { colophonData, getColophonData } from '../../data/colophon';

/**
 * Tests for the colophon data file.
 * Validates data integrity and structure.
 */
describe('Colophon Data', () => {
  describe('getColophonData', () => {
    it('should return colophon data object', () => {
      const data = getColophonData();
      expect(data).toBeDefined();
      expect(data).toBe(colophonData);
    });
  });

  describe('Page Metadata', () => {
    it('should have page title and description', () => {
      expect(colophonData.pageTitle).toBeTruthy();
      expect(colophonData.pageDescription).toBeTruthy();
    });
  });

  describe('About Section', () => {
    const { pageDeck } = colophonData;

    it('should have pageDeck content', () => {
      expect(pageDeck).toBeDefined();
      expect(pageDeck.imageUrl).toBeTruthy();
      expect(pageDeck.imageAlt).toBeTruthy();
      expect(pageDeck.headingId).toBeTruthy();
      expect(pageDeck.heading).toBeTruthy();
    });

    it('should have deck paragraphs', () => {
      expect(Array.isArray(pageDeck.paragraphs)).toBe(true);
      expect(pageDeck.paragraphs.length).toBeGreaterThan(0);

      pageDeck.paragraphs.forEach((paragraph) => {
        expect(paragraph).toBeTruthy();
      });
    });

    it('should have valid image path', () => {
      expect(pageDeck.imageUrl).toMatch(/^\/images\//);
    });
  });

  describe('Technologies Section', () => {
    const { technologies } = colophonData;

    it('should have intro text', () => {
      expect(technologies.intro).toBeTruthy();
    });

    it('should have V2 technology categories', () => {
      expect(Array.isArray(technologies.categories)).toBe(true);
      expect(technologies.categories.length).toBeGreaterThan(0);

      technologies.categories.forEach((category) => {
        expect(category.label).toBeTruthy();
        expect(Array.isArray(category.items)).toBe(true);
        expect(category.items.length).toBeGreaterThan(0);

        category.items.forEach((tech) => {
          expect(tech.name).toBeTruthy();
          expect(tech.description).toBeTruthy();
        });
      });
    });

    it('should have V1 technologies for historical context', () => {
      expect(technologies.v1).toBeDefined();
      expect(Array.isArray(technologies.v1.items)).toBe(true);
      expect(technologies.v1.items.length).toBeGreaterThan(0);

      technologies.v1.items.forEach((tech) => {
        expect(tech.name).toBeTruthy();
        expect(tech.description).toBeTruthy();
      });
    });

    it('should include expected V2 technologies', () => {
      const allV2Techs = technologies.categories.flatMap((c) =>
        c.items.map((t) => t.name)
      );

      expect(allV2Techs).toContain('Next.js 16');
      expect(allV2Techs).toContain('React 19');
      expect(allV2Techs).toContain('TypeScript');
    });

    it('should include expected V1 technologies', () => {
      const v1TechNames = technologies.v1.items.map((t) => t.name);

      expect(v1TechNames).toContain('Gumby Framework');
      expect(v1TechNames).toContain('jQuery');
      expect(v1TechNames).toContain('PHP');
    });
  });

  describe('Design Philosophy Section', () => {
    const { designPhilosophy } = colophonData;

    it('should have intro and description text', () => {
      expect(designPhilosophy.intro).toBeTruthy();
      expect(designPhilosophy.colorDescription).toBeTruthy();
      expect(designPhilosophy.typographyIntro).toBeTruthy();
    });

    it('should have color swatches with valid hex codes', () => {
      expect(Array.isArray(designPhilosophy.colors)).toBe(true);
      expect(designPhilosophy.colors.length).toBeGreaterThan(0);

      designPhilosophy.colors.forEach((color) => {
        expect(color.name).toBeTruthy();
        expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(color.description).toBeTruthy();
      });
    });

    it('should include expected colors', () => {
      const colorNames = designPhilosophy.colors.map((c) => c.name);

      expect(colorNames).toContain('Sakura');
      expect(colorNames).toContain('Duck Egg');
      expect(colorNames).toContain('Sky Blue');
      expect(colorNames).toContain('Graphite');
    });

    it('should have typography entries', () => {
      expect(Array.isArray(designPhilosophy.typography)).toBe(true);
      expect(designPhilosophy.typography.length).toBeGreaterThan(0);

      designPhilosophy.typography.forEach((font) => {
        expect(font.name).toBeTruthy();
        expect(font.usage).toBeTruthy();
        expect(font.sample).toBeTruthy();
        expect(font.fontFamily).toBeTruthy();
      });
    });

    it('should include expected fonts', () => {
      const fontNames = designPhilosophy.typography.map((f) => f.name);

      expect(fontNames).toContain('Open Sans');
      expect(fontNames).toContain('Oswald');
      expect(fontNames).toContain('Gochi Hand');
    });
  });

  describe('Buta Story Section', () => {
    const { butaStory } = colophonData;

    it('should have story paragraphs', () => {
      expect(Array.isArray(butaStory.paragraphs)).toBe(true);
      expect(butaStory.paragraphs.length).toBeGreaterThan(0);

      butaStory.paragraphs.forEach((paragraph) => {
        expect(paragraph).toBeTruthy();
      });
    });

    it('should have valid image paths', () => {
      expect(butaStory.mainImage).toMatch(/^\/images\/buta\//);
      expect(butaStory.versusImage).toMatch(/^\/images\/buta\//);
    });

    it('should have alt text for images', () => {
      expect(butaStory.mainImageAlt).toBeTruthy();
      expect(butaStory.versusImageAlt).toBeTruthy();
    });
  });
});
