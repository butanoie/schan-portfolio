/**
 * Integration tests for the useProjectLoader hook lifecycle with real locale switching.
 *
 * Verifies that useProjectLoader correctly handles locale changes, including
 * state reset, re-fetch with translated content, pagination continuity, and
 * concurrent locale-switch edge cases.
 *
 * ## Scope
 *
 * This file tests the hook's integration with the full data pipeline:
 * useProjectLoader → getProjects → getLocalizedProjects → locale JSON merge
 *
 * The existing unit tests (hooks/useProjectLoader.test.tsx) cover basic
 * pagination, loading state, and error handling but never trigger the
 * locale-switch `useEffect`. This file fills that gap.
 *
 * All tests use real data — no mocks for the data or localization layers.
 * Only framework boundaries (next/navigation) are mocked.
 *
 * @see {@link hooks/useProjectLoader.ts} for the hook under test
 * @see {@link docs/test-scenarios/INT_USE_PROJECT_LOADER.md} for Gherkin scenarios
 * @see {@link docs/guides/TESTING_ARCHITECTURE.md} for integration test conventions
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ReactNode, FC, useEffect } from 'react';
import { useProjectLoader } from '../../hooks/useProjectLoader';
import { getProjects, getTotalProjectCount } from '../../lib/projectData';
import { PROJECTS } from '../../data/projects';
import { LocaleProvider } from '../../components/i18n/LocaleProvider';
import { useLocale } from '../../hooks/useLocale';
import type { Locale } from '../../lib/i18n';

// ─── Test Constants ───────────────────────────────────────────────────────────

/** Page size matching the home page's useProjectLoader default. */
const PAGE_SIZE = 5;

/**
 * Known anchor titles for spot-checking locale content.
 * collabspaceDownloader is the first project (index 0 on page 1).
 */
const ANCHOR = {
  id: 'collabspaceDownloader',
  en: 'Collabware - Collabspace Export Downloader',
  fr: "Collabware - Téléchargeur d'exportation Collabspace",
} as const;

/**
 * Secondary anchor for page 2 verification.
 * spMisc is at index 7 overall (3rd on page 2 with pageSize 5).
 */
const PAGE2_ANCHOR = {
  id: 'spMisc',
  en: 'Other SharePoint 2007 and 2010 Projects',
  fr: 'Autres projets SharePoint 2007 et 2010',
} as const;

// ─── ControlledLocaleWrapper ──────────────────────────────────────────────────

/**
 * Type alias for the renderHook result ref, used by switchLocale to detect
 * when the async locale re-fetch has settled.
 */
type HookResultRef = { current: ReturnType<typeof useProjectLoader> };

/**
 * Props for the LocaleSetter bridge component.
 *
 * @interface LocaleSetterProps
 * @property {Locale} locale - The desired locale to enforce in context
 */
interface LocaleSetterProps {
  /** The desired locale. Triggers `setLocale` when changed. */
  locale: Locale;
}

/**
 * Bridge component that pushes a locale prop value into LocaleProvider's
 * internal state via the `setLocale` context function.
 *
 * `LocaleProvider` stores locale in its own `useState` and only reads
 * `initialLocale` on mount. This component bypasses that limitation by
 * calling `setLocale` from context whenever the `locale` prop changes,
 * which directly calls `setLocaleState` inside the provider.
 *
 * @param props - Component props
 * @param props.locale - The locale to enforce in context
 * @returns null — renders nothing, only drives the locale side effect
 */
const LocaleSetter: FC<LocaleSetterProps> = ({ locale }) => {
  const { setLocale } = useLocale();

  useEffect(() => {
    setLocale(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);
  // `setLocale` is a stable `useCallback` reference from LocaleProvider,
  // so omitting it from deps is safe and prevents double-firing on mount.

  return null;
};

/**
 * Factory that creates a `ControlledLocaleWrapper` whose locale can be
 * changed between `rerender` calls via the returned `setWrapperLocale`
 * setter.
 *
 * The wrapper reads from a mutable object (`localeRef`) rather than
 * closing over a primitive, so mutations are visible on the next render
 * without recreating the wrapper component (which would unmount/remount).
 *
 * ## Why this pattern is needed
 *
 * `renderHook`'s `rerender()` re-renders the hook call, not the wrapper.
 * The wrapper is a fixed component reference baked in at construction time.
 * `LocaleProvider.initialLocale` only seeds `useState` once on mount.
 * To change locale mid-test, we mutate `localeRef.current` before calling
 * `rerender()`, which causes `LocaleSetter` to see the new value and call
 * `setLocale()` through context.
 *
 * @param initialLocale - The locale to use on first render
 * @returns Object with the wrapper FC and a setter to change the locale
 *
 * @example
 * const { wrapper } = createControlledLocaleWrapper('en');
 * const { result, rerender } = renderHook(() => useProjectLoader([], 5), { wrapper });
 * await switchLocale('fr', rerender, result);
 */
function createControlledLocaleWrapper(initialLocale: Locale): {
  wrapper: FC<{ children: ReactNode }>;
  setWrapperLocale: (locale: Locale) => void;
  /**
   * Switches locale and flushes all async effects.
   *
   * `useProjectLoader`'s locale-switch `useEffect` fires an async
   * `reloadForNewLocale()` that is not tracked by React's `act()`.
   * A second `act()` flush is needed to let the async re-fetch settle
   * and update state with the new locale's projects.
   *
   * @param locale - The target locale
   * @param rerender - The `rerender` function from `renderHook`
   * @param result - The `result` ref from `renderHook`
   */
  switchLocale: (
    locale: Locale,
    rerender: () => void,
    result: HookResultRef
  ) => Promise<void>;
} {
  const localeRef = { current: initialLocale };

  /**
   * Wrapper component whose rendered locale is driven by `localeRef.current`.
   *
   * IMPORTANT: `initialLocale` is always pinned to the original value passed
   * to `createControlledLocaleWrapper`. If it were changed on rerender,
   * `LocaleProvider`'s init `useEffect([initialLocale])` would re-run, read
   * the stale locale from localStorage, and override `LocaleSetter`'s
   * `setLocale()` call — causing a race condition where the locale reverts.
   *
   * @param props - Component props
   * @param props.children - Injected by renderHook
   * @returns Provider tree with controlled locale
   */
  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <LocaleProvider initialLocale={initialLocale}>
      <LocaleSetter locale={localeRef.current} />
      {children}
    </LocaleProvider>
  );

  /**
   * Mutates the locale ref. Call before `rerender()` inside `act()`
   * so React sees the new value on the next render pass.
   *
   * @param locale - The new locale to enforce
   */
  const setWrapperLocale = (locale: Locale): void => {
    localeRef.current = locale;
  };

  /**
   * Switches locale and waits for the async re-fetch to settle.
   *
   * The locale-switch `useEffect` in `useProjectLoader` fires
   * `reloadForNewLocale()` as a fire-and-forget async call. This chain
   * (`getProjects` → `getLocalizedProjects` → dynamic `import()` →
   * `setProjects`) is not tracked by React's `act()`. `waitFor` polls
   * until the state update from `setProjects` propagates.
   *
   * @param locale - The target locale
   * @param rerender - The `rerender` function from `renderHook`
   * @param result - The result ref from renderHook, used to detect when the async re-fetch has settled
   */
  const switchLocale = async (
    locale: Locale,
    rerender: () => void,
    result: HookResultRef
  ): Promise<void> => {
    const projectsBefore = result.current.projects;

    await act(async () => {
      setWrapperLocale(locale);
      rerender();
    });

    // Wait for the fire-and-forget reloadForNewLocale() to resolve.
    // The re-fetch replaces the projects array reference via setProjects,
    // so we detect completion by checking referential inequality.
    await waitFor(() => {
      expect(result.current.projects).not.toBe(projectsBefore);
    });
  };

  return { wrapper, setWrapperLocale, switchLocale };
}

// ─── Helper: get initial English projects ─────────────────────────────────────

/**
 * Fetches the first page of English projects for use as `initialProjects`.
 * Mirrors what `app/page.tsx` does at SSG time.
 *
 * @returns Promise resolving to the first PAGE_SIZE English projects
 */
async function getInitialEnglishProjects() {
  const response = await getProjects({ page: 1, pageSize: PAGE_SIZE, locale: 'en' });
  return response.items;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useProjectLoader — locale lifecycle integration', () => {
  // LocaleProvider reads localStorage on mount; clear it so each test
  // starts without a persisted locale preference.
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario 1: Initial load returns English projects
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: Initial load returns English projects.
   * Given the hook is initialized with 5 English initialProjects
   * When the hook settles
   * Then projects contain English titles
   * And hasMore is true
   * And currentPage is 1
   */
  describe('Scenario 1: Initial load returns English projects', () => {
    it('should contain the correct English anchor title on page 1', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper } = createControlledLocaleWrapper('en');

      const { result } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      const anchorProject = result.current.projects.find(
        (p) => p.id === ANCHOR.id
      );
      expect(anchorProject).toBeDefined();
      expect(anchorProject!.title).toBe(ANCHOR.en);
    });

    it('should have hasMore true with 5 of 18 projects loaded', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper } = createControlledLocaleWrapper('en');

      const { result } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      expect(result.current.projects).toHaveLength(PAGE_SIZE);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.allLoaded).toBe(false);
    });

    it('should report correct remainingCount', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper } = createControlledLocaleWrapper('en');

      const { result } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      expect(result.current.remainingCount).toBe(
        getTotalProjectCount() - PAGE_SIZE
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario 2: Switching to French resets projects to French page 1
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: Switching to French resets projects to French page 1.
   * Given the hook has loaded English projects
   * When the locale changes to "fr"
   * Then projects are replaced with French titles
   * And the project count resets to the first batch size
   * And hasMore is true
   */
  describe('Scenario 2: EN → FR locale switch resets to French page 1', () => {
    it('should replace English projects with French-titled projects', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Verify English anchor is present
      expect(
        result.current.projects.find((p) => p.id === ANCHOR.id)?.title
      ).toBe(ANCHOR.en);

      // Switch to French (pass result for waitFor-based polling)
      await switchLocale('fr', rerender, result);

      const anchorProject = result.current.projects.find(
        (p) => p.id === ANCHOR.id
      );
      expect(anchorProject).toBeDefined();
      expect(anchorProject!.title).toBe(ANCHOR.fr);
    });

    it('should reset project count to the first batch size', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      await switchLocale('fr', rerender, result);

      expect(result.current.projects).toHaveLength(PAGE_SIZE);
    });

    it('should still have hasMore true after locale switch', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      await switchLocale('fr', rerender, result);

      expect(result.current.hasMore).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario 3: LoadMore after locale switch fetches in new locale
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: LoadMore after locale switch fetches in new locale.
   * Given the locale was switched to "fr" and projects reset
   * When loadMore is called
   * Then page 2 of French projects is appended
   * And all projects have French titles
   */
  describe('Scenario 3: loadMore after locale switch fetches French page 2', () => {
    it('should append French page 2 projects after locale switch', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Switch to French
      await switchLocale('fr', rerender, result);

      expect(result.current.projects).toHaveLength(PAGE_SIZE);

      // Load more (page 2 in French)
      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.projects).toHaveLength(PAGE_SIZE * 2);
    });

    it('should contain French page 2 anchor title after loadMore', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Switch to French, then load more
      await switchLocale('fr', rerender, result);

      await act(async () => {
        await result.current.loadMore();
      });

      // spMisc is at index 7 (3rd item on page 2)
      const page2Anchor = result.current.projects.find(
        (p) => p.id === PAGE2_ANCHOR.id
      );
      expect(page2Anchor).toBeDefined();
      expect(page2Anchor!.title).toBe(PAGE2_ANCHOR.fr);

      // Page 1 anchor should also still be French
      const page1Anchor = result.current.projects.find(
        (p) => p.id === ANCHOR.id
      );
      expect(page1Anchor!.title).toBe(ANCHOR.fr);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario 4: Switching back to English resets again
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: Switching back to English resets again.
   * Given the locale was switched to "fr" and additional pages loaded
   * When the locale changes back to "en"
   * Then projects reset to English page 1
   * And previously loaded French projects are gone
   */
  describe('Scenario 4: FR → EN switch back resets to English page 1', () => {
    it('should reset to English page 1 after switching back from French', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // EN → FR
      await switchLocale('fr', rerender, result);

      // Load more in French (now 10 projects)
      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.projects).toHaveLength(PAGE_SIZE * 2);

      // FR → EN
      await switchLocale('en', rerender, result);

      // Should reset to page 1 English
      expect(result.current.projects).toHaveLength(PAGE_SIZE);
      const anchorProject = result.current.projects.find(
        (p) => p.id === ANCHOR.id
      );
      expect(anchorProject!.title).toBe(ANCHOR.en);
    });

    it('should not contain any French projects after switching back', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // EN → FR → EN
      await switchLocale('fr', rerender, result);
      await switchLocale('en', rerender, result);

      // Spot-check: anchor should have English title, not French
      const anchorProject = result.current.projects.find(
        (p) => p.id === ANCHOR.id
      );
      expect(anchorProject!.title).not.toBe(ANCHOR.fr);
      expect(anchorProject!.title).toBe(ANCHOR.en);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario 5: Pagination state resets on locale switch
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: Pagination state resets on locale switch.
   * Given 3 batches have been loaded in English (15 projects)
   * When the locale changes to "fr"
   * Then the project count resets to the first batch size (5)
   * And hasMore recalculates correctly for the new locale
   */
  describe('Scenario 5: Pagination state resets on locale switch', () => {
    it('should reset from 15 projects to 5 after locale switch', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Load 2 more batches: 5 → 10 → 15
      await act(async () => {
        await result.current.loadMore();
        await result.current.loadMore();
      });

      expect(result.current.projects).toHaveLength(15);

      // Switch to French
      await switchLocale('fr', rerender, result);

      // Should reset to first batch (5 French projects)
      expect(result.current.projects).toHaveLength(PAGE_SIZE);
    });

    it('should recalculate hasMore correctly after locale switch', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Load all remaining English projects
      await act(async () => {
        await result.current.loadMore(); // 10
        await result.current.loadMore(); // 15
        await result.current.loadMore(); // 18
      });

      expect(result.current.allLoaded).toBe(true);
      expect(result.current.hasMore).toBe(false);

      // Switch to French
      await switchLocale('fr', rerender, result);

      // After reset to page 1, hasMore should be true again
      expect(result.current.projects).toHaveLength(PAGE_SIZE);
      expect(result.current.hasMore).toBe(true);
      expect(result.current.allLoaded).toBe(false);
      expect(result.current.remainingCount).toBe(
        getTotalProjectCount() - PAGE_SIZE
      );
    });

    it('should allow loading more pages after pagination reset', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Load 2 batches in English
      await act(async () => {
        await result.current.loadMore();
        await result.current.loadMore();
      });

      // Switch to French (resets to page 1)
      await switchLocale('fr', rerender, result);

      // Load page 2 in French
      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.projects).toHaveLength(PAGE_SIZE * 2);

      // Verify the newly loaded page 2 is in French
      const page2Anchor = result.current.projects.find(
        (p) => p.id === PAGE2_ANCHOR.id
      );
      expect(page2Anchor!.title).toBe(PAGE2_ANCHOR.fr);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario 6: Concurrent locale switch during loadMore
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: Concurrent locale switch during loadMore (known limitation).
   * Given loadMore is in progress for English page 2
   * When the locale changes to "fr" before loadMore completes
   * Then the locale-switch useEffect resets projects to French page 1
   *
   * NOTE: The current `loadMore` implementation has no cancellation mechanism.
   * The locale-switch `useEffect` uses a local `cancelled` variable, but
   * `loadMore` (a `useCallback`) does not check it. If `loadMore` resolves
   * after the locale switch, it may append stale English data via
   * `setProjects(prev => [...prev, ...])`.
   *
   * Because `SIMULATED_LOAD_DELAY` is 0 in test env, `loadMore`'s promise
   * resolves within the same microtask queue. The actual behavior depends on
   * the order React processes the state updates. This test documents the
   * observed behavior rather than prescribing ideal behavior.
   */
  describe('Scenario 6: Concurrent locale switch during loadMore', () => {
    it('should end up with French projects after concurrent switch', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, setWrapperLocale } = createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Start loadMore and switch locale concurrently within the same act
      await act(async () => {
        // Start loadMore (English page 2) — does not await
        const loadMorePromise = result.current.loadMore();

        // Switch locale to French before loadMore resolves
        setWrapperLocale('fr');
        rerender();

        // Wait for loadMore to complete
        await loadMorePromise;
      });

      // Flush the async re-fetch from the locale-switch useEffect
      await act(async () => {});

      // The locale-switch useEffect should have fired and reset to French.
      // Due to the race condition, the final state may include stale English
      // page 2 data appended after the French reset. This documents the
      // ACTUAL behavior — if the count is > PAGE_SIZE, that confirms the
      // race condition exists.
      const anchorProject = result.current.projects.find(
        (p) => p.id === ANCHOR.id
      );

      // Regardless of race condition outcome, the first batch should
      // contain French page 1 data (the locale switch effect always runs)
      if (result.current.projects.length === PAGE_SIZE) {
        // Clean outcome: locale switch cancelled or overrode loadMore
        expect(anchorProject!.title).toBe(ANCHOR.fr);
      } else {
        // Race condition: loadMore appended English page 2 after French reset.
        // The French page 1 projects should still be present somewhere.
        // This documents the known limitation — loadMore lacks cancellation.
        const hasFrenchAnchor = result.current.projects.some(
          (p) => p.id === ANCHOR.id && p.title === ANCHOR.fr
        );
        expect(
          hasFrenchAnchor,
          'French page 1 anchor should be present even if race condition appended stale data'
        ).toBe(true);
      }
    });

    it('should allow clean loadMore in correct locale after concurrent switch', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper, setWrapperLocale } =
        createControlledLocaleWrapper('en');

      const { result, rerender } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Concurrent: start loadMore (English page 2) + locale switch
      await act(async () => {
        const loadMorePromise = result.current.loadMore();
        setWrapperLocale('fr');
        rerender();
        await loadMorePromise;
      });

      // Flush the async locale re-fetch from the concurrent switch
      await act(async () => {});
      await act(async () => {});

      // After the race settles, ensure locale is French by re-asserting
      // the wrapper state (may be a no-op if already 'fr')
      await act(async () => {
        setWrapperLocale('fr');
        rerender();
      });
      await act(async () => {});

      // Verify subsequent loadMore fetches in French
      await act(async () => {
        await result.current.loadMore();
      });

      // Page 2 project should be in French
      const page2Anchor = result.current.projects.find(
        (p) => p.id === PAGE2_ANCHOR.id
      );
      expect(page2Anchor).toBeDefined();
      expect(page2Anchor!.title).toBe(PAGE2_ANCHOR.fr);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario 7: allLoaded boundary
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: allLoaded is true when all projects are fetched.
   * Given the hook has loaded all 18 projects
   * When checking hasMore
   * Then hasMore is false
   * And allLoaded is true
   */
  describe('Scenario 7: allLoaded boundary', () => {
    it('should reach allLoaded after loading all pages', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper } = createControlledLocaleWrapper('en');

      const { result } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Load remaining pages: 5 → 10 → 15 → 18
      await act(async () => {
        await result.current.loadMore(); // page 2
        await result.current.loadMore(); // page 3
        await result.current.loadMore(); // page 4 (final, 3 items)
      });

      expect(result.current.projects).toHaveLength(PROJECTS.length);
      expect(result.current.hasMore).toBe(false);
      expect(result.current.allLoaded).toBe(true);
      expect(result.current.remainingCount).toBe(0);
    });

    it('should not load more when allLoaded is true', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { wrapper } = createControlledLocaleWrapper('en');

      const { result } = renderHook(
        () => useProjectLoader(initialProjects, PAGE_SIZE),
        { wrapper }
      );

      // Load all pages
      await act(async () => {
        await result.current.loadMore();
        await result.current.loadMore();
        await result.current.loadMore();
      });

      const countBefore = result.current.projects.length;

      // Attempt to load more — should be a no-op
      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.projects).toHaveLength(countBefore);
      expect(result.current.loading).toBe(false);
    });

    it('should reach allLoaded in French locale too', async () => {
      const { wrapper, switchLocale } = createControlledLocaleWrapper('en');

      // Start with empty initial projects (simulating fresh load)
      const { result, rerender } = renderHook(
        () => useProjectLoader([], PAGE_SIZE),
        { wrapper }
      );

      // Switch to French
      await switchLocale('fr', rerender, result);

      // Load all pages in French: 5 → 10 → 15 → 18
      await act(async () => {
        await result.current.loadMore(); // page 2
        await result.current.loadMore(); // page 3
        await result.current.loadMore(); // page 4
      });

      expect(result.current.projects).toHaveLength(PROJECTS.length);
      expect(result.current.allLoaded).toBe(true);
      expect(result.current.hasMore).toBe(false);

      // Verify content is actually French
      const anchorProject = result.current.projects.find(
        (p) => p.id === ANCHOR.id
      );
      expect(anchorProject!.title).toBe(ANCHOR.fr);
    });
  });
});
