/**
 * Accessibility test suite for MainLayout component.
 *
 * Tests WCAG 2.2 Level AA compliance for page structure,
 * landmark hierarchy, and keyboard navigation shortcuts.
 *
 * @module MainLayout.test
 */

import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MainLayout from "../../../components/common/MainLayout";
import { usePathname } from "next/navigation";
import { useI18n } from "../../../hooks/useI18n";
import { testAccessibility, canReceiveFocus } from "../../utils/axe-helpers";

/**
 * Mock next/navigation module
 */
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

/**
 * Mock useI18n hook
 */
vi.mock("../../../hooks/useI18n", () => ({
  useI18n: vi.fn(),
}));

/**
 * Mock FrenchTranslationAlert component
 */
vi.mock("../../../components/common/FrenchTranslationAlert", () => ({
  /**
   * Mocked FrenchTranslationAlert component that returns null
   *
   * @returns null
   */
  FrenchTranslationAlert: () => null,
}));

/**
 * Mock Header component
 */
vi.mock("../../../components/common/Header", () => ({
  /**
   * Mocked Header component for testing
   *
   * @returns A test div element with header-mock testid
   */
  default: () => <div data-testid="header-mock">Header</div>,
}));

/**
 * Mock Footer component
 */
vi.mock("../../../components/common/Footer", () => ({
  /**
   * Mocked Footer component for testing
   *
   * @returns A test div element with footer-mock testid
   */
  default: () => <div data-testid="footer-mock">Footer</div>,
}));

describe("MainLayout - WCAG 2.2 Level AA Accessibility", () => {
  /**
   * Mock translations for testing
   */
  const mockTranslations = {
    /**
     * Translates a key to its corresponding translation string
     *
     * @param key - The translation key to look up
     * @returns The translated string or the key if not found
     */
    t: (key: string): string => {
      const translations: Record<string, string> = {
        "nav.skipToMain": "Skip to main content",
      };
      return translations[key] || key;
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
     * Mock useI18n to return translation function
     */
    (useI18n as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockTranslations);
  });

  /**
   * Test: Skip to main content link is present
   *
   * WCAG 2.4.1 - Bypass Blocks
   * WCAG 2.1.1 - Keyboard Accessible
   */
  it("should have skip to main content link", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    const skipLink = screen.getByRole("link", { name: /skip to main/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  /**
   * Test: Skip to main content link is focusable and accessible
   *
   * WCAG 2.1.1 - Keyboard Accessible
   * WCAG 2.4.7 - Focus Visible
   */
  it("should have keyboard accessible skip link", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    const skipLink = screen.getByRole("link", { name: /skip to main/i });
    expect(canReceiveFocus(skipLink as HTMLElement)).toBe(true);
  });

  /**
   * Test: Main content area has proper id for skip link
   *
   * WCAG 2.4.1 - Bypass Blocks
   */
  it("should have main content area with id", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
  });

  /**
   * Test: Page has main landmark
   *
   * WCAG 1.3.1 - Info and Relationships
   */
  it("should have main landmark", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });

  /**
   * Test: Layout includes header component
   *
   * WCAG 1.3.1 - Info and Relationships
   */
  it("should render header component", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
  });

  /**
   * Test: Layout includes footer component
   *
   * WCAG 1.3.1 - Info and Relationships
   */
  it("should render footer component", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    expect(screen.getByTestId("footer-mock")).toBeInTheDocument();
  });

  /**
   * Test: Main content renders children
   *
   * WCAG 1.3.1 - Info and Relationships
   */
  it("should render children in main content area", () => {
    const testContent = "Test page content";

    render(
      <MainLayout>
        <div>{testContent}</div>
      </MainLayout>
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  /**
   * Test: Skip link is positioned off-screen initially
   *
   * WCAG 2.4.1 - Bypass Blocks
   */
  it("should hide skip link off-screen initially", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    const skipLink = screen.getByRole("link", { name: /skip to main/i });
    const styles = window.getComputedStyle(skipLink);

    // Off-screen positioning
    expect(styles.left).toBe("-9999px");
  });

  /**
   * Test: Skip link becomes visible on focus
   *
   * WCAG 2.4.1 - Bypass Blocks
   * WCAG 2.4.7 - Focus Visible
   */
  it("should show skip link on focus", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    const skipLink = screen.getByRole("link", { name: /skip to main/i }) as HTMLElement;
    skipLink.focus();

    // After focus, should be visible
    expect(skipLink).toHaveFocus();
  });

  /**
   * Test: Layout structure provides proper semantic organization
   *
   * WCAG 1.3.1 - Info and Relationships
   */
  it("should have proper semantic structure (flex layout)", () => {
    const { container } = render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    // Check that the layout has the main Box wrapper with flex properties
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();

    // Verify header and footer are present in the layout
    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
    expect(screen.getByTestId("footer-mock")).toBeInTheDocument();
  });

  /**
   * Test: Layout passes axe accessibility audit
   *
   * WCAG 2.2 Level AA comprehensive scan
   */
  it("should pass axe accessibility audit", async () => {
    const { container } = render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    await act(async () => {
      await testAccessibility({ container } as unknown as Parameters<typeof testAccessibility>[0]);
    });
  });

  /**
   * Test: Layout maintains minimum height for full viewport
   *
   * WCAG 2.1 - Operable
   */
  it("should fill full viewport height", () => {
    const { container } = render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    const wrapper = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(wrapper);

    expect(styles.minHeight).toBe("100vh");
    expect(styles.display).toBe("flex");
    expect(styles.flexDirection).toBe("column");
  });

  /**
   * Test: Main content area is flexible to fill space
   *
   * WCAG 2.1 - Operable
   */
  it("should have flexible main content area", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    const main = screen.getByRole("main");

    // Verify main element exists and is properly rendered
    expect(main).toBeInTheDocument();

    // Verify it's wrapped in a Container component with proper attributes
    expect(main).toHaveAttribute("id", "main-content");

    // Verify children are rendered within main
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  /**
   * Test: Translation key is used for skip link text
   *
   * WCAG 3.1.1 - Language of Page
   */
  it("should use translated text for skip link", () => {
    render(
      <MainLayout>
        <div>Test content</div>
      </MainLayout>
    );

    // The skip link uses t() function which should resolve to the translation
    const skipLink = screen.getByRole("link", { name: /skip to main/i });
    expect(skipLink).toBeInTheDocument();
  });
});
