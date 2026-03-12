/**
 * Integration tests for AsyncProjectsList rendering with real data and hooks.
 *
 * Verifies that AsyncProjectsList correctly renders projects using the real
 * `useProjectLoader` hook, real data layer, and real locale context in jsdom.
 *
 * ## Scope
 *
 * This file tests the component's integration with the full rendering pipeline:
 * AsyncProjectsList → useProjectLoader → getProjects → getLocalizedProjects → locale JSON
 *
 * All tests use real data — no mocks for the data or localization layers.
 * Only framework boundaries (next/navigation, next/image, MUI useMediaQuery) are mocked.
 *
 * ## Context State Testing
 *
 * `AsyncProjectsList` reports loading state upward via `ProjectLoadingStateBridgeContext`.
 * Tests capture this state using a mock `onStateChange` callback on the bridge context,
 * mirroring how `MainLayout` consumes it in production.
 *
 * @see {@link components/project/AsyncProjectsList.tsx} for the component under test
 * @see {@link docs/test-scenarios/INT_ASYNC_PROJECTS_LIST.md} for Gherkin scenarios
 * @see {@link docs/guides/TESTING_ARCHITECTURE.md} for integration test conventions
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FC, ReactNode, useEffect } from 'react';
import { AsyncProjectsList } from '../../components/project/AsyncProjectsList';
import { getProjects, getTotalProjectCount } from '../../lib/projectData';
import * as projectDataModule from '../../lib/projectData';
import { LocaleProvider } from '../../components/i18n/LocaleProvider';
import LocaleProviderErrorFallback from '../../components/i18n/LocaleProviderErrorFallback';
import { useLocale } from '../../hooks/useLocale';
import { ProjectLoadingStateBridgeContext } from '../../components/common/MainLayout';
import { ThemeContextProvider } from '../../contexts/ThemeContext';
import { AnimationsContextProvider } from '../../contexts/AnimationsContext';
import ThemeProvider from '../../components/ThemeProvider';
import type { Locale } from '../../lib/i18n';
import type { Project } from '../../types';

// ─── Framework boundary mocks ────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  usePathname: () => '/',
}));

/**
 * Mock Next.js Image component for testing.
 * Strips Next.js-specific props (fill, priority, placeholder, blurDataURL)
 * and renders a plain `<img>` element.
 *
 * @param props - Image props
 * @param props.src - Image source URL
 * @param props.alt - Image alt text
 * @returns An img element
 */
vi.mock('next/image', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  default: ({
    src,
    alt,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fill,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    priority,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    placeholder,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blurDataURL,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    placeholder?: string;
    blurDataURL?: string;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

vi.mock('@mui/material', async () => {
  const actual =
    await vi.importActual<typeof import('@mui/material')>('@mui/material');
  // eslint-disable-next-line jsdoc/require-jsdoc
  return { ...actual, useMediaQuery: () => false };
});

// ─── Test Constants ──────────────────────────────────────────────────────────

/** Page size matching the home page's useProjectLoader default. */
const PAGE_SIZE = 5;

/**
 * Known anchor title for spot-checking locale content.
 * collabspaceDownloader is the first project (index 0 on page 1).
 */
const ANCHOR = {
  id: 'collabspaceDownloader',
  en: 'Collabware - Collabspace Export Downloader',
  fr: "Collabware - Téléchargeur d'exportation Collabspace",
} as const;

// ─── LocaleSetter Bridge Component ───────────────────────────────────────────

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
 * calling `setLocale` from context whenever the `locale` prop changes.
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

// ─── Controlled Locale Wrapper ───────────────────────────────────────────────

/**
 * Factory that creates a provider wrapper whose locale can be changed between
 * rerenders via the returned `setWrapperLocale` setter.
 *
 * The wrapper reads from a mutable object (`localeRef`) rather than closing
 * over a primitive, so mutations are visible on the next render without
 * recreating the wrapper component.
 *
 * ## Why this pattern is needed
 *
 * `LocaleProvider.initialLocale` only seeds `useState` once on mount.
 * To change locale mid-test, we mutate `localeRef.current` before calling
 * `rerender()`, which causes `LocaleSetter` to see the new value and call
 * `setLocale()` through context.
 *
 * @param initialLocale - The locale to use on first render
 * @returns Object with the Wrapper FC and a setter to change the locale
 */
function createControlledLocaleWrapper(initialLocale: Locale): {
  Wrapper: FC<{ children: ReactNode }>;
  setWrapperLocale: (locale: Locale) => void;
} {
  const localeRef = { current: initialLocale };

  /**
   * Wrapper component whose rendered locale is driven by `localeRef.current`.
   *
   * IMPORTANT: `initialLocale` is always pinned to the original value passed
   * to `createControlledLocaleWrapper`. If it were changed on rerender,
   * `LocaleProvider`'s init `useEffect([initialLocale])` would re-run and
   * override `LocaleSetter`'s `setLocale()` call.
   *
   * @param props - Component props
   * @param props.children - Injected by render
   * @returns Provider tree with controlled locale
   */
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <LocaleProviderErrorFallback>
      <LocaleProvider initialLocale={initialLocale}>
        <LocaleSetter locale={localeRef.current} />
        <ThemeContextProvider>
          <AnimationsContextProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AnimationsContextProvider>
        </ThemeContextProvider>
      </LocaleProvider>
    </LocaleProviderErrorFallback>
  );

  /**
   * Mutates the locale ref. Call before `rerender()` so React sees the
   * new value on the next render pass.
   *
   * @param locale - The new locale to enforce
   */
  const setWrapperLocale = (locale: Locale): void => {
    localeRef.current = locale;
  };

  return { Wrapper, setWrapperLocale };
}

// ─── Bridge Capture Helper ───────────────────────────────────────────────────

/**
 * Captured loading state from the `ProjectLoadingStateBridgeContext`.
 * Mirrors the shape `AsyncProjectsList` reports via `bridge.onStateChange`.
 */
interface CapturedBridgeState {
  /** Whether the component considers itself on the home page */
  isHomePage: boolean;
  /** Whether projects are currently being loaded */
  loading: boolean;
  /** Whether more projects are available to load */
  hasMore: boolean;
  /** Whether all projects have been loaded */
  allLoaded: boolean;
  /** Number of projects remaining to be loaded */
  remainingCount: number;
  /** Callback to trigger loading the next batch */
  onLoadMore: () => void | Promise<void>;
}

/**
 * Wraps a component tree in a `ProjectLoadingStateBridgeContext.Provider` that
 * captures reported loading state into a mutable ref.
 *
 * This mirrors how `MainLayout` consumes the bridge in production:
 * `AsyncProjectsList` calls `bridge.onStateChange(contextValue)` in a
 * `useEffect`, and `MainLayout` stores the reported state in `useState`.
 *
 * @param props - Component props
 * @param props.children - The React tree to wrap (typically `AsyncProjectsList`)
 * @param props.capturedRef - Mutable ref object (shape: `{ current: CapturedBridgeState | null }`)
 * whose `.current` is written on each `onStateChange` call from the bridge
 * @returns JSX element with the bridge context provider
 */
function BridgeCaptureWrapper({
  children,
  capturedRef,
}: {
  children: ReactNode;
  capturedRef: React.RefObject<CapturedBridgeState | null>;
}) {
  return (
    <ProjectLoadingStateBridgeContext.Provider
      value={{
        // eslint-disable-next-line jsdoc/require-jsdoc
        onStateChange: (state) => {
          capturedRef.current = state as CapturedBridgeState | null;
        },
      }}
    >
      {children}
    </ProjectLoadingStateBridgeContext.Provider>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Fetches the first page of English projects for use as `initialProjects`.
 * Mirrors what `app/page.tsx` does at SSG time.
 *
 * @returns {Promise<Project[]>} Promise resolving to the first PAGE_SIZE English projects
 */
async function getInitialEnglishProjects(): Promise<Project[]> {
  const response = await getProjects({
    page: 1,
    pageSize: PAGE_SIZE,
    locale: 'en',
  });
  return response.items;
}

/**
 * Fetches all projects in English for the "all loaded" scenario.
 *
 * @returns {Promise<Project[]>} Promise resolving to all 18 English projects
 */
async function getAllEnglishProjects(): Promise<Project[]> {
  const response = await getProjects({
    page: 1,
    pageSize: getTotalProjectCount(),
    locale: 'en',
  });
  return response.items;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AsyncProjectsList — rendering integration', () => {
  // LocaleProvider reads localStorage on mount; clear it so each test
  // starts without a persisted locale preference.
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Scenario 1: Initial render shows projects immediately without skeletons
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: Initial render shows projects immediately without skeletons.
   * Given initialProjects contains 5 English projects
   * When AsyncProjectsList renders
   * Then all 5 project titles are visible
   * And no skeleton loaders are present
   */
  describe('Scenario 1: Initial render shows projects immediately without skeletons', () => {
    it('should render all 5 initial English project titles as headings', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper } = createControlledLocaleWrapper('en');

      render(
        <Wrapper>
          <AsyncProjectsList
            initialProjects={initialProjects}
            pageSize={PAGE_SIZE}
            isHomePage
          />
        </Wrapper>
      );

      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(PAGE_SIZE);

      // Spot-check the anchor project title
      expect(
        screen.getByRole('heading', { name: ANCHOR.en })
      ).toBeInTheDocument();
    });

    it('should not render loading skeletons on initial render', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper } = createControlledLocaleWrapper('en');

      render(
        <Wrapper>
          <AsyncProjectsList
            initialProjects={initialProjects}
            pageSize={PAGE_SIZE}
            isHomePage
          />
        </Wrapper>
      );

      // The skeleton region has aria-label="Loading more projects" and only
      // renders when loading=true. On initial render, no loadMore was called.
      expect(
        screen.queryByRole('region', { name: /loading more projects/i })
      ).not.toBeInTheDocument();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Scenario 2: LoadMore context provides correct state
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: LoadMore context provides correct state.
   * Given the component is rendered on the home page
   * When reading the ProjectLoadingContext value via the bridge
   * Then remainingCount equals total minus initial batch
   * And hasMore is true
   */
  describe('Scenario 2: LoadMore context provides correct state', () => {
    it('should report remainingCount of 13 with 5 of 18 projects loaded', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper } = createControlledLocaleWrapper('en');
      const capturedRef = { current: null as CapturedBridgeState | null };

      render(
        <Wrapper>
          <BridgeCaptureWrapper capturedRef={capturedRef}>
            <AsyncProjectsList
              initialProjects={initialProjects}
              pageSize={PAGE_SIZE}
              isHomePage
            />
          </BridgeCaptureWrapper>
        </Wrapper>
      );

      await waitFor(() => {
        expect(capturedRef.current).not.toBeNull();
      });

      expect(capturedRef.current!.remainingCount).toBe(
        getTotalProjectCount() - PAGE_SIZE
      );
    });

    it('should report hasMore=true and allLoaded=false', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper } = createControlledLocaleWrapper('en');
      const capturedRef = { current: null as CapturedBridgeState | null };

      render(
        <Wrapper>
          <BridgeCaptureWrapper capturedRef={capturedRef}>
            <AsyncProjectsList
              initialProjects={initialProjects}
              pageSize={PAGE_SIZE}
              isHomePage
            />
          </BridgeCaptureWrapper>
        </Wrapper>
      );

      await waitFor(() => {
        expect(capturedRef.current).not.toBeNull();
      });

      expect(capturedRef.current!.hasMore).toBe(true);
      expect(capturedRef.current!.allLoaded).toBe(false);
    });

    it('should report isHomePage=true when isHomePage prop is set', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper } = createControlledLocaleWrapper('en');
      const capturedRef = { current: null as CapturedBridgeState | null };

      render(
        <Wrapper>
          <BridgeCaptureWrapper capturedRef={capturedRef}>
            <AsyncProjectsList
              initialProjects={initialProjects}
              pageSize={PAGE_SIZE}
              isHomePage
            />
          </BridgeCaptureWrapper>
        </Wrapper>
      );

      await waitFor(() => {
        expect(capturedRef.current).not.toBeNull();
      });

      expect(capturedRef.current!.isHomePage).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Scenario 3: All projects loaded shows completion state
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: All projects loaded shows completion state.
   * Given initialProjects contains all 18 projects
   * When AsyncProjectsList renders
   * Then allLoaded is true in the context
   * And hasMore is false
   */
  describe('Scenario 3: All projects loaded shows completion state', () => {
    it('should report allLoaded=true and hasMore=false when all projects provided', async () => {
      const allProjects = await getAllEnglishProjects();
      const { Wrapper } = createControlledLocaleWrapper('en');
      const capturedRef = { current: null as CapturedBridgeState | null };

      render(
        <Wrapper>
          <BridgeCaptureWrapper capturedRef={capturedRef}>
            <AsyncProjectsList
              initialProjects={allProjects}
              pageSize={PAGE_SIZE}
              isHomePage
            />
          </BridgeCaptureWrapper>
        </Wrapper>
      );

      await waitFor(() => {
        expect(capturedRef.current).not.toBeNull();
      });

      expect(capturedRef.current!.allLoaded).toBe(true);
      expect(capturedRef.current!.hasMore).toBe(false);
      expect(capturedRef.current!.remainingCount).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Scenario 4: Locale switch causes French titles to appear
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: Locale switch causes French titles to appear.
   * Given the component is wrapped in a LocaleProvider set to "en"
   * When the locale changes to "fr"
   * Then project titles update to French strings
   */
  describe('Scenario 4: Locale switch causes French titles to appear', () => {
    it('should replace English headings with French headings after locale switch', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper, setWrapperLocale } = createControlledLocaleWrapper('en');

      const ui = (
        <AsyncProjectsList
          initialProjects={initialProjects}
          pageSize={PAGE_SIZE}
          isHomePage
        />
      );

      const { rerender } = render(<Wrapper>{ui}</Wrapper>);

      // Verify English anchor is present
      expect(
        screen.getByRole('heading', { name: ANCHOR.en })
      ).toBeInTheDocument();

      // Switch to French
      await act(async () => {
        setWrapperLocale('fr');
        rerender(<Wrapper>{ui}</Wrapper>);
      });

      // Wait for the async locale re-fetch to settle and French titles to appear
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: ANCHOR.fr })
        ).toBeInTheDocument();
      });

      // English anchor should no longer be present
      expect(
        screen.queryByRole('heading', { name: ANCHOR.en })
      ).not.toBeInTheDocument();
    });

    it('should preserve the correct number of project headings after locale switch', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper, setWrapperLocale } = createControlledLocaleWrapper('en');

      const ui = (
        <AsyncProjectsList
          initialProjects={initialProjects}
          pageSize={PAGE_SIZE}
          isHomePage
        />
      );

      const { rerender } = render(<Wrapper>{ui}</Wrapper>);

      // Switch to French
      await act(async () => {
        setWrapperLocale('fr');
        rerender(<Wrapper>{ui}</Wrapper>);
      });

      // Wait for French titles
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: ANCHOR.fr })
        ).toBeInTheDocument();
      });

      // Should still have exactly PAGE_SIZE headings
      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(PAGE_SIZE);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Scenario 5: Error displays alert with previously loaded projects preserved
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Scenario: Error displays alert with previously loaded projects preserved.
   * Given getProjects throws an error during loadMore
   * When the error occurs
   * Then an alert role element appears with an error message
   * And previously loaded projects remain visible
   */
  describe('Scenario 5: Error displays alert with previously loaded projects preserved', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should show role=alert when getProjects throws during loadMore', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper } = createControlledLocaleWrapper('en');
      const capturedRef = { current: null as CapturedBridgeState | null };

      render(
        <Wrapper>
          <BridgeCaptureWrapper capturedRef={capturedRef}>
            <AsyncProjectsList
              initialProjects={initialProjects}
              pageSize={PAGE_SIZE}
              isHomePage
            />
          </BridgeCaptureWrapper>
        </Wrapper>
      );

      // Wait for bridge state to be reported
      await waitFor(() => {
        expect(capturedRef.current).not.toBeNull();
      });

      // Spy on getProjects to throw on the next call (loadMore)
      vi.spyOn(projectDataModule, 'getProjects').mockRejectedValueOnce(
        new Error('Network failure')
      );

      // Trigger loadMore via the captured bridge callback
      await act(async () => {
        await capturedRef.current!.onLoadMore();
      });

      // An alert should appear with the error message
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Network failure');
    });

    it('should preserve previously loaded projects after error', async () => {
      const initialProjects = await getInitialEnglishProjects();
      const { Wrapper } = createControlledLocaleWrapper('en');
      const capturedRef = { current: null as CapturedBridgeState | null };

      render(
        <Wrapper>
          <BridgeCaptureWrapper capturedRef={capturedRef}>
            <AsyncProjectsList
              initialProjects={initialProjects}
              pageSize={PAGE_SIZE}
              isHomePage
            />
          </BridgeCaptureWrapper>
        </Wrapper>
      );

      await waitFor(() => {
        expect(capturedRef.current).not.toBeNull();
      });

      // Verify initial projects are rendered
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(
        PAGE_SIZE
      );

      // Spy on getProjects to throw on loadMore
      vi.spyOn(projectDataModule, 'getProjects').mockRejectedValueOnce(
        new Error('Network failure')
      );

      await act(async () => {
        await capturedRef.current!.onLoadMore();
      });

      // Original projects should still be visible despite the error
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(
        PAGE_SIZE
      );

      // Spot-check the anchor is still present
      expect(
        screen.getByRole('heading', { name: ANCHOR.en })
      ).toBeInTheDocument();
    });
  });
});
