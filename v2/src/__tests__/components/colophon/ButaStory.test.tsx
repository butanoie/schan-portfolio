import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import ButaStory from "../../../components/colophon/ButaStory";
import { ThemeContextProvider } from "../../../contexts/ThemeContext";
import { LocaleProvider } from "../../../components/i18n/LocaleProvider";
import type { ButaStoryContent } from "../../../types/colophon";

/**
 * Mock Next.js Image component for testing.
 *
 * @param props - Image props
 * @param props.src - Image source URL
 * @param props.alt - Image alt text
 * @returns An img element
 */
vi.mock("next/image", () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

/**
 * Creates a wrapper component that provides ThemeContext and LocaleProvider for testing.
 *
 * @param props - Wrapper props
 * @param props.children - Child components
 * @returns Wrapped component with ThemeContextProvider and LocaleProvider
 */
function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider initialLocale="en">
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </LocaleProvider>
  );
}

/**
 * Tests for the ButaStory component.
 *
 * Note: The Buta mascot image and thought bubble are now in the Footer component.
 * These tests only cover the story section content.
 */
describe("ButaStory", () => {
  const mockContent: ButaStoryContent = {
    paragraphs: [
      'Buta is a pig mascot created by <a href="https://example.com">Artist Name</a>.',
      "The mascot was inspired by Yoshinoya.",
      "Buta became the portfolio avatar in 2005.",
    ],
    mainImage: "/images/buta/buta.png",
    mainImageAlt: "Buta mascot in a suit",
    versusImage: "/images/buta/boo-vs-bu.png",
    versusImageAlt: "Comparison of Boo and Bu",
  };

  it("should render the section heading", () => {
    render(<ButaStory content={mockContent} />, { wrapper: TestWrapper });

    expect(
      screen.getByRole("heading", { name: /story of buta/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render story paragraphs", () => {
    render(<ButaStory content={mockContent} />, { wrapper: TestWrapper });

    expect(screen.getByText(/pig mascot created by/i)).toBeInTheDocument();
    expect(screen.getByText(/inspired by Yoshinoya/i)).toBeInTheDocument();
    expect(screen.getByText(/portfolio avatar in 2005/i)).toBeInTheDocument();
  });

  it("should render HTML links in paragraphs", () => {
    render(<ButaStory content={mockContent} />, { wrapper: TestWrapper });

    const artistLink = screen.getByRole("link", { name: "Artist Name" });
    expect(artistLink).toHaveAttribute("href", "https://example.com");
  });

  it("should render the versus image", () => {
    render(<ButaStory content={mockContent} />, { wrapper: TestWrapper });

    const versusImg = screen.getByAltText("Comparison of Boo and Bu");
    expect(versusImg).toBeInTheDocument();
    expect(versusImg).toHaveAttribute("src", "/images/buta/boo-vs-bu.png");
  });

  it("should have proper section accessibility", () => {
    render(<ButaStory content={mockContent} />, { wrapper: TestWrapper });

    const section = screen.getByRole("region", { name: /buta/i });
    expect(section).toBeInTheDocument();
  });

  it("should sanitize HTML content to prevent XSS", () => {
    const maliciousContent: ButaStoryContent = {
      ...mockContent,
      paragraphs: [
        '<script>alert("XSS")</script>Safe content',
        '<img src="x" onerror="alert(1)">Image text',
      ],
    };

    render(<ButaStory content={maliciousContent} />, { wrapper: TestWrapper });

    // Script tags should be removed
    expect(screen.queryByText(/alert/)).not.toBeInTheDocument();
    expect(screen.getByText("Safe content")).toBeInTheDocument();

    // onerror attribute should be stripped
    expect(screen.getByText("Image text")).toBeInTheDocument();
  });
});
