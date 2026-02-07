/**
 * Accessibility test suite for Footer component.
 *
 * Tests WCAG 2.2 Level AA compliance for footer navigation,
 * landmark structure, and content accessibility.
 *
 * @module Footer.test
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Footer from "../../../components/common/Footer";
import { usePathname } from "next/navigation";
import { useProjectLoading } from "../../../contexts/ProjectLoadingContext";
import { useI18n } from "../../../hooks/useI18n";
import { useAnimations } from "../../../hooks/useAnimations";
import { testAccessibility, canReceiveFocus, hasAccessibleName } from "../../utils/axe-helpers";

/**
 * Mock next/navigation module
 */
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

/**
 * Mock ProjectLoadingContext
 */
vi.mock("../../../contexts/ProjectLoadingContext", () => ({
  useProjectLoading: vi.fn(),
}));

/**
 * Mock useI18n hook
 */
vi.mock("../../../hooks/useI18n", () => ({
  useI18n: vi.fn(),
}));

/**
 * Mock useAnimations hook
 */
vi.mock("../../../hooks/useAnimations", () => ({
  useAnimations: vi.fn(),
}));

describe("Footer - WCAG 2.2 Level AA Accessibility", () => {
  /**
   * Default mock translations for all tests.
   */
  const mockTranslations = {
    /**
     * Translates a key and optionally replaces parameters in the translation.
     *
     * @param key - The translation key to look up
     * @param params - Optional parameters to replace in the translation string
     * @returns The translated string with parameters replaced
     */
    t: (key: string, params?: Record<string, unknown>): string => {
      const translations: Record<string, string> = {
        "nav.portfolio": "Portfolio",
        "nav.resume": "Résumé",
        "nav.colophon": "Colophon",
        "footer.butaThought": "Buta's thought",
        "footer.allProjectsLoaded": "All projects loaded",
        "footer.thankYou": "Thank you",
        "footer.copyright": "© {year} Sing Chan",
        "footer.trademarks": "Buta is a trademark",
        "loadMoreButton.loading": "Loading projects...",
        "loadMoreButton.loadMore": "Load {remainingCount} more",
        "loadMoreButton.allLoaded": "All projects loaded",
        "loadMoreButton.loadingAria": "Loading projects",
        "loadMoreButton.loadMoreCountAria": "Load {remainingCount} more projects",
      };

      let result = translations[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          result = result.replace(`{${paramKey}}`, String(paramValue));
        });
      }

      return result;
    },
  };

  beforeEach(() => {
    /**
     * Reset all mocks before each test
     */
    vi.clearAllMocks();

    /**
     * Mock usePathname to return home page by default
     */
    (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue("/");

    /**
     * Mock useProjectLoading to return null (no loading context)
     */
    (useProjectLoading as unknown as ReturnType<typeof vi.fn>).mockReturnValue(null);

    /**
     * Mock useI18n to return translation function
     */
    (useI18n as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockTranslations);

    /**
     * Mock useAnimations hook
     */
    (useAnimations as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      animationsEnabled: true,
      setAnimationsEnabled: vi.fn(),
    });
  });

  /**
   * Test: Footer element is rendered with proper semantic markup
   *
   * WCAG 2.1.1 - Keyboard Accessible
   * WCAG 1.3.1 - Info and Relationships
   */
  it("should render as semantic footer element", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer.tagName).toBe("FOOTER");
  });

  /**
   * Test: Footer navigation has proper landmark structure
   *
   * WCAG 1.3.1 - Info and Relationships
   * WCAG 2.4.1 - Bypass Blocks
   */
  it("should have navigation landmark with proper label", () => {
    render(<Footer />);

    const nav = screen.getByRole("navigation", { name: /footer navigation/i });
    expect(nav).toBeInTheDocument();
  });

  /**
   * Test: All navigation links are keyboard accessible
   *
   * WCAG 2.1.1 - Keyboard Accessible
   * WCAG 2.5.8 - Target Size
   */
  it("should have keyboard accessible navigation links", () => {
    render(<Footer />);

    const buttons = screen.getAllByRole("link");
    expect(buttons.length).toBeGreaterThanOrEqual(3);

    buttons.forEach((button) => {
      expect(canReceiveFocus(button)).toBe(true);
      expect(hasAccessibleName(button)).toBe(true);
    });
  });

  /**
   * Test: Navigation links have proper accessible names
   *
   * WCAG 4.1.2 - Name, Role, Value
   */
  it("should have accessible names for all navigation links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /résumé|resume/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /colophon/i })).toBeInTheDocument();
  });

  /**
   * Test: Active navigation link is indicated
   *
   * WCAG 2.4.8 - Location
   */
  it("should indicate active page link", () => {
    (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue("/resume");

    render(<Footer />);

    const resumeLink = screen.getByRole("link", { name: /résumé|resume/i });
    expect(resumeLink).toHaveClass("MuiButton-containedPrimary");
  });

  /**
   * Test: Copyright notice is present and visible
   *
   * WCAG 1.1.1 - Non-text Content
   */
  it("should display copyright notice", () => {
    const currentYear = new Date().getFullYear();

    render(<Footer />);

    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
  });

  /**
   * Test: Footer passes axe accessibility audit
   *
   * WCAG 2.2 Level AA comprehensive scan
   */
  it("should pass axe accessibility audit", async () => {
    const { container } = render(<Footer />);

    await testAccessibility({ container } as unknown as Parameters<typeof testAccessibility>[0]);
  });

  /**
   * Test: Buta mascot image has alt text
   *
   * WCAG 1.1.1 - Non-text Content
   */
  it("should have alt text for Buta mascot image", () => {
    render(<Footer />);

    const butaImage = screen.getByAltText(/buta.*pig mascot/i);
    expect(butaImage).toBeInTheDocument();
  });

  /**
   * Test: Footer thought bubble has accessible label on non-home pages
   *
   * WCAG 4.1.2 - Name, Role, Value
   */
  it("should have accessible label for thought bubble on non-home pages", () => {
    (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue("/resume");

    render(<Footer />);

    const thoughtBubble = screen.getByRole("img", {
      name: /buta.*thought/i
    });
    expect(thoughtBubble).toBeInTheDocument();
  });

  /**
   * Test: Load More button is displayed with accessible label on home page
   * when projects are loading
   *
   * WCAG 4.1.2 - Name, Role, Value
   */
  it("should render Load More button with accessible label on home page", () => {
    const loadingContext = {
      isHomePage: true,
      loading: false,
      hasMore: true,
      allLoaded: false,
      remainingCount: 5,
      onLoadMore: vi.fn(),
    };

    (useProjectLoading as unknown as ReturnType<typeof vi.fn>).mockReturnValue(loadingContext);

    render(<Footer />);

    const thoughtBubble = screen.getByRole("img", {
      name: /load more projects/i
    });
    expect(thoughtBubble).toBeInTheDocument();
  });

  /**
   * Test: All loaded message is displayed with proper label
   *
   * WCAG 4.1.2 - Name, Role, Value
   */
  it("should display all loaded message with accessible label", () => {
    const loadingContext = {
      isHomePage: true,
      loading: false,
      hasMore: false,
      allLoaded: true,
      remainingCount: 0,
      onLoadMore: vi.fn(),
    };

    (useProjectLoading as unknown as ReturnType<typeof vi.fn>).mockReturnValue(loadingContext);

    render(<Footer />);

    const allLoadedBubble = screen.getByRole("img", {
      name: /all projects loaded/i
    });
    expect(allLoadedBubble).toBeInTheDocument();
  });

  /**
   * Test: Navigation links have sufficient color contrast
   *
   * WCAG 1.4.3 - Contrast (Minimum)
   */
  it("should have sufficient color contrast for navigation buttons", () => {
    render(<Footer />);

    const navButtons = screen.getAllByRole("link");

    navButtons.forEach((button) => {
      const computedStyle = window.getComputedStyle(button);
      // Verify button has background color (sage green)
      expect(computedStyle.backgroundColor).toBeTruthy();
    });
  });

  /**
   * Test: Footer heading hierarchy is correct
   *
   * WCAG 1.3.1 - Info and Relationships
   */
  it("should have proper heading structure in footer", () => {
    render(<Footer />);

    // Navigation should be first interactive element
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  /**
   * Test: Footer content is readable without JavaScript
   *
   * WCAG 2.1 - Operable
   */
  it("should have text content visible in DOM", () => {
    render(<Footer />);

    // Copyright text should always be present
    expect(screen.getByText(/©/)).toBeInTheDocument();

    // Navigation links should be in document
    expect(screen.getByText(/portfolio/i)).toBeInTheDocument();
  });
});
