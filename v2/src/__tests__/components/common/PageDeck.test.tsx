import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageDeck from "../../../components/common/PageDeck";
import type { PageDeckData } from "../../../types/pageDeck";

/**
 * Tests for the PageDeck component.
 * Verifies the reusable page deck intro with image, heading, and deck paragraphs.
 */
describe("PageDeck", () => {
  const mockContent: PageDeckData = {
    imageUrl: "/images/test-header.png",
    imageAlt: "Test header image",
    headingId: "test-heading",
    heading: "Test Section",
    deck: [
      "First paragraph of the deck.",
      "Second paragraph with more details.",
      "Third paragraph to conclude.",
    ],
  };

  it("should render the page heading", () => {
    render(<PageDeck content={mockContent} />);

    expect(
      screen.getByRole("heading", { name: "Test Section", level: 1 })
    ).toBeInTheDocument();
  });

  it("should render all deck paragraphs", () => {
    render(<PageDeck content={mockContent} />);

    expect(screen.getByText("First paragraph of the deck.")).toBeInTheDocument();
    expect(
      screen.getByText("Second paragraph with more details.")
    ).toBeInTheDocument();
    expect(screen.getByText("Third paragraph to conclude.")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<PageDeck content={mockContent} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("id", "test-heading");
  });

  it("should render with empty deck", () => {
    const contentWithEmptyDeck: PageDeckData = {
      ...mockContent,
      deck: [],
    };

    render(<PageDeck content={contentWithEmptyDeck} />);

    // Should still render the heading
    expect(
      screen.getByRole("heading", { name: "Test Section", level: 1 })
    ).toBeInTheDocument();
  });
});
