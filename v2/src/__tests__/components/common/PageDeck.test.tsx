import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageDeck from "../../../components/common/PageDeck";
import type { PageDeckData } from "../../../types/pageDeck";
import { ThemeContextProvider } from "../../../contexts/ThemeContext";

/**
 * Tests for the PageDeck component.
 * Verifies the reusable page deck intro with image, heading, and deck paragraphs.
 */

/**
 * Wrapper component that provides ThemeContext to tested components.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the theme context
 * @returns The children wrapped with ThemeContextProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}
describe("PageDeck", () => {
  const mockContent: PageDeckData = {
    imageUrl: "/images/test-header.png",
    imageAlt: "Test header image",
    headingId: "test-heading",
    heading: "Test Section",
    paragraphs: [
      "First paragraph of the deck.",
      "Second paragraph with more details.",
      "Third paragraph to conclude.",
    ],
  };

  it("should render the page heading", () => {
    render(<PageDeck content={mockContent} />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: "Test Section", level: 1 })
    ).toBeInTheDocument();
  });

  it("should render all deck paragraphs", () => {
    render(<PageDeck content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByText("First paragraph of the deck.")).toBeInTheDocument();
    expect(
      screen.getByText("Second paragraph with more details.")
    ).toBeInTheDocument();
    expect(screen.getByText("Third paragraph to conclude.")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<PageDeck content={mockContent} />, { wrapper: Wrapper });

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("id", "test-heading");
  });

  it("should render with empty deck", () => {
    const contentWithEmptyDeck: PageDeckData = {
      ...mockContent,
      paragraphs: [],
    };

    render(<PageDeck content={contentWithEmptyDeck} />, { wrapper: Wrapper });

    // Should still render the heading
    expect(
      screen.getByRole("heading", { name: "Test Section", level: 1 })
    ).toBeInTheDocument();
  });
});
