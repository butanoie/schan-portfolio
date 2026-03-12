/**
 * Integration tests for the JSON Merge Localization Pipeline.
 *
 * Verifies that getLocalizedProjects(), getLocalizedProject(), and
 * getLocalizedImageCaption() correctly merge base project data from
 * projects.ts with locale-specific translation files (en/fr projects.json).
 *
 * ## Scope
 *
 * This file tests the localization module directly (data/localization.ts),
 * complementing the higher-level locale consistency tests in dataLayer.test.ts
 * which exercise getProjects() through the pagination wrapper.
 *
 * Concerns unique to this file:
 * - Caption-to-image index alignment and caption content verification
 * - getLocalizedImageCaption() standalone contract (including EN short-circuit)
 * - Circa field locale specificity for season-named dates
 * - Unknown locale fallback via module cache bypass (vi.resetModules())
 * - getLocalizedProject() undefined contract for missing IDs
 *
 * All tests use real data — no mocks for the localization layer.
 *
 * @see {@link data/localization.ts} for the functions under test
 * @see {@link __tests__/integration/dataLayer.test.ts} for higher-level locale consistency tests
 * @see {@link docs/test-scenarios/INT_LOCALIZATION_PIPELINE.md} for Gherkin scenarios
 */

import { describe, it, expect, vi } from 'vitest';
import {
  getLocalizedProjects,
  getLocalizedProject,
  getLocalizedImageCaption,
} from '../../data/localization';
import { PROJECTS } from '../../data/projects';
import type { Locale } from '../../lib/i18n';

// ---------------------------------------------------------------------------
// 1. Cross-locale merge integrity
// ---------------------------------------------------------------------------

/**
 * Verifies that getLocalizedProjects() returns a complete, correctly merged
 * project list for both supported locales. Tests field population, cross-locale
 * differentiation, caption consistency, and structural preservation.
 */
describe('getLocalizedProjects() — cross-locale merge', () => {
  /**
   * Scenario: Project count is consistent across locales.
   * Given locales "en" and "fr"
   * When getLocalizedProjects is called for each
   * Then both return the same number of projects (18)
   */
  it('should return all projects for both locales', async () => {
    const en = await getLocalizedProjects('en');
    const fr = await getLocalizedProjects('fr');

    expect(en).toHaveLength(PROJECTS.length);
    expect(fr).toHaveLength(PROJECTS.length);
  });

  /**
   * Scenario: English and French projects have populated titles and descriptions.
   * Given both locales
   * When getLocalizedProjects is called
   * Then every project has a non-empty title, description array, and circa
   */
  it('should populate title, desc, and circa for every project in both locales', async () => {
    const en = await getLocalizedProjects('en');
    const fr = await getLocalizedProjects('fr');

    for (const projects of [en, fr]) {
      const locale = projects === en ? 'en' : 'fr';
      for (const project of projects) {
        expect(
          project.title,
          `${project.id}: title should be non-empty [${locale}]`
        ).toBeTruthy();
        expect(
          project.desc.length,
          `${project.id}: desc should have at least one paragraph [${locale}]`
        ).toBeGreaterThan(0);
        expect(
          project.desc[0],
          `${project.id}: desc[0] should be non-empty [${locale}]`
        ).toBeTruthy();
        expect(
          project.circa,
          `${project.id}: circa should be non-empty [${locale}]`
        ).toBeTruthy();
      }
    }
  });

  /**
   * Scenario: English and French translations differ.
   * Given both locales have been loaded
   * When comparing translatable fields for the same project
   * Then at least one description paragraph differs for every project
   *
   * Note: Titles may be identical for brand names (e.g., "Collabware - Collabmail").
   * Descriptions always differ because prose is translated. This matches the
   * approach in dataLayer.test.ts but tests the pipeline directly.
   */
  it('should have different descriptions between EN and FR for every project', async () => {
    const en = await getLocalizedProjects('en');
    const fr = await getLocalizedProjects('fr');

    for (let i = 0; i < en.length; i++) {
      const enProject = en[i];
      const frProject = fr[i];
      const descsDiffer = enProject.desc.some(
        (s, j) => s !== frProject.desc[j]
      );
      expect(
        descsDiffer,
        `${enProject.id}: EN and FR descriptions should differ`
      ).toBe(true);
    }
  });

  /**
   * Scenario: English and French titles differ.
   * Given both locales have been loaded
   * When comparing project titles for the same ID
   * Then the English title differs from the French title for most projects
   *
   * Note: Some titles are identical across locales when they are brand names
   * (e.g., "Collabware - Collabmail", "Thatch Cay"). This test verifies that
   * at least one title differs, proving the merge pipeline applied translations.
   */
  it('should have different titles between EN and FR for translated projects', async () => {
    const en = await getLocalizedProjects('en');
    const fr = await getLocalizedProjects('fr');

    const titlesDiffer = en.some(
      (enProject, i) => enProject.title !== fr[i].title
    );
    expect(
      titlesDiffer,
      'At least some EN and FR titles should differ'
    ).toBe(true);
  });

  /**
   * Scenario: Circa field is locale-specific.
   * Given a project with a season-named circa (e.g., "Winter 2025")
   * When comparing circa for "en" and "fr"
   * Then the values differ (season names are translated)
   *
   * Note: Projects with purely numeric circa values (e.g., "2006 - 2012")
   * may be identical across locales — this test uses a known anchor project.
   */
  it('should produce locale-specific circa for projects with translated seasons', async () => {
    const en = await getLocalizedProjects('en');
    const fr = await getLocalizedProjects('fr');

    // collabspaceDownloader: "Winter 2025" (EN) vs "Hiver 2025" (FR)
    const enDownloader = en.find((p) => p.id === 'collabspaceDownloader');
    const frDownloader = fr.find((p) => p.id === 'collabspaceDownloader');

    expect(enDownloader).toBeDefined();
    expect(frDownloader).toBeDefined();
    expect(enDownloader!.circa).not.toBe(frDownloader!.circa);

    // collabspace: "Fall 2017 - Present" (EN) vs "Automne 2017 - présent" (FR)
    const enCollabspace = en.find((p) => p.id === 'collabspace');
    const frCollabspace = fr.find((p) => p.id === 'collabspace');

    expect(enCollabspace).toBeDefined();
    expect(frCollabspace).toBeDefined();
    expect(enCollabspace!.circa).not.toBe(frCollabspace!.circa);
  });

  /**
   * Verifies that structural (non-translatable) fields are preserved
   * identically across locales after the merge.
   */
  it('should preserve structural fields unchanged across locales', async () => {
    const en = await getLocalizedProjects('en');
    const fr = await getLocalizedProjects('fr');

    for (let i = 0; i < en.length; i++) {
      const enProject = en[i];
      const frProject = fr[i];

      expect(enProject.id).toBe(frProject.id);
      expect(enProject.tags).toEqual(frProject.tags);
      expect(enProject.altGrid).toBe(frProject.altGrid);
      expect(enProject.videos).toEqual(frProject.videos);
      expect(
        enProject.images.length,
        `${enProject.id}: image count`
      ).toBe(frProject.images.length);

      for (let j = 0; j < enProject.images.length; j++) {
        expect(enProject.images[j].url).toBe(frProject.images[j].url);
        expect(enProject.images[j].tnUrl).toBe(frProject.images[j].tnUrl);
      }
    }
  });

  /**
   * Verifies that every image has a non-empty caption after the merge,
   * confirming that the locale JSON captions array is the same length
   * as the PROJECTS images array for every project.
   */
  it('should provide a non-empty caption for every image in both locales', async () => {
    const en = await getLocalizedProjects('en');
    const fr = await getLocalizedProjects('fr');

    for (const projects of [en, fr]) {
      const locale = projects === en ? 'en' : 'fr';
      for (const project of projects) {
        for (let j = 0; j < project.images.length; j++) {
          expect(
            project.images[j].caption,
            `${project.id}[${j}]: caption should be non-empty [${locale}]`
          ).toBeTruthy();
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Single-project merge and caption pipeline
// ---------------------------------------------------------------------------

/**
 * Verifies getLocalizedProject() single-project merge correctness and
 * getLocalizedImageCaption() standalone contract. Uses 'collabspace' (8 images)
 * as the primary anchor project for spot-checks.
 */
describe('getLocalizedProject() and getLocalizedImageCaption()', () => {
  /**
   * Scenario: Image captions are merged at correct indices.
   * Given a project with multiple images
   * When getLocalizedProject is called with locale "en"
   * Then each image has a caption matching the corresponding index in the locale JSON
   */
  it('should merge captions at the correct index positions', async () => {
    const project = await getLocalizedProject('collabspace', 'en');

    expect(project).toBeDefined();
    expect(project!.images).toHaveLength(8);
    expect(project!.images[0].caption).toBe('Collabspace - Analytics');
    expect(project!.images[7].caption).toBe(
      'Collabspace - Physical Records Library'
    );

    // Structural fields preserved
    expect(project!.id).toBe('collabspace');
    expect(project!.images[0].url).toBe(
      '/images/gallery/collabspace/analytics.jpg'
    );
  });

  /**
   * Scenario: French image captions differ from English.
   * Given a project with captioned images
   * When comparing captions for the same project and image index
   * Then the English caption differs from the French caption
   */
  it('should apply locale-specific captions that differ between EN and FR', async () => {
    const en = await getLocalizedProject('collabspace', 'en');
    const fr = await getLocalizedProject('collabspace', 'fr');

    expect(en).toBeDefined();
    expect(fr).toBeDefined();

    // At least one caption must differ — some captions may share brand names
    const captionsDiffer = en!.images.some(
      (img, j) => img.caption !== fr!.images[j].caption
    );
    expect(
      captionsDiffer,
      'collabspace: at least one EN and FR caption should differ'
    ).toBe(true);
  });

  /**
   * Scenario: Non-existent project ID returns undefined.
   * Given a valid locale "en"
   * When getLocalizedProject is called with an invalid ID
   * Then the result is undefined
   */
  it('should return undefined for a non-existent project ID', async () => {
    const result = await getLocalizedProject(
      '__nonexistent_project_id__',
      'en'
    );
    expect(result).toBeUndefined();
  });

  /**
   * Tests getLocalizedImageCaption() for the EN locale.
   *
   * Note: The EN code path in localization.ts (line 207-209) short-circuits
   * and returns project.images[imageIndex].caption from the base PROJECTS
   * constant, which has empty strings. This means getLocalizedImageCaption
   * returns '' for EN, even though getLocalizedProject correctly merges
   * captions from the locale JSON.
   */
  it('should return empty string from getLocalizedImageCaption for EN (short-circuit path)', async () => {
    const caption = await getLocalizedImageCaption(
      'collabspace',
      0,
      'en'
    );
    // EN short-circuit reads from PROJECTS base data where caption is ''
    expect(caption).toBe('');
  });

  /**
   * Tests getLocalizedImageCaption() for the FR locale, which follows
   * the full locale data lookup path.
   */
  it('should return a translated FR caption from getLocalizedImageCaption', async () => {
    const caption = await getLocalizedImageCaption(
      'collabspace',
      0,
      'fr'
    );
    expect(caption).toBe('Collabspace - Analyses');
  });

  /**
   * Tests getLocalizedImageCaption() boundary: out-of-bounds image index
   * for both EN (short-circuit) and FR (full lookup) code paths.
   */
  it('should return empty string for an out-of-bounds image index', async () => {
    const enCaption = await getLocalizedImageCaption(
      'collabspace',
      9999,
      'en'
    );
    const frCaption = await getLocalizedImageCaption(
      'collabspace',
      9999,
      'fr'
    );
    expect(enCaption).toBe('');
    expect(frCaption).toBe('');
  });

  /**
   * Tests getLocalizedImageCaption() boundary: unknown project ID.
   */
  it('should return empty string for an unknown project ID in getLocalizedImageCaption', async () => {
    const caption = await getLocalizedImageCaption(
      '__does_not_exist__',
      0,
      'en'
    );
    expect(caption).toBe('');
  });
});

// ---------------------------------------------------------------------------
// 3. Unknown locale fallback (isolated — requires module cache reset)
// ---------------------------------------------------------------------------

/**
 * Unknown locale fallback tests for the localization pipeline.
 *
 * Isolated in a separate describe block because the module-level localeCache
 * Map in data/localization.ts persists across tests. vi.resetModules() with
 * a dynamic re-import obtains a fresh module instance with an empty cache,
 * ensuring the unknown locale path (loadLocaleData returning null) is exercised.
 *
 * @see {@link docs/guides/TESTING_ARCHITECTURE.md} Cache Isolation section
 */
describe('Localization Pipeline — unknown locale fallback', () => {
  /**
   * Scenario: Unknown locale falls back to base data.
   * Given a locale that does not exist (e.g., "xx")
   * When getLocalizedProjects is called
   * Then projects are returned with empty translatable fields (base PROJECTS data)
   */
  it('should fall back to base PROJECTS data when locale JSON does not exist', async () => {
    vi.resetModules();
    const { getLocalizedProjects: freshGetLocalizedProjects } = await import(
      '../../data/localization'
    );

    const projects = await freshGetLocalizedProjects(
      'xx' as Locale
    );

    expect(projects).toHaveLength(PROJECTS.length);
    expect(projects[0].id).toBe(PROJECTS[0].id);
    // Base PROJECTS data has empty translatable fields — no merge occurred
    expect(projects[0].title).toBe('');
    expect(projects[0].desc).toEqual([]);
    expect(projects[0].circa).toBe('');
  });

  /**
   * Verifies getLocalizedProject also falls back for an unknown locale.
   */
  it('should return base project data from getLocalizedProject for an unknown locale', async () => {
    vi.resetModules();
    const { getLocalizedProject: freshGetLocalizedProject } = await import(
      '../../data/localization'
    );

    const project = await freshGetLocalizedProject(
      'collabspace',
      'xx' as Locale
    );

    expect(project).toBeDefined();
    expect(project!.id).toBe('collabspace');
    expect(project!.title).toBe('');
    expect(project!.desc).toEqual([]);
  });
});
