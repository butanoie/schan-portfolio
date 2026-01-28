import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutSection from "../../../components/colophon/AboutSection";
import type { AboutContent } from "../../../types/colophon";

/**
 * Tests for the AboutSection component.
 * Verifies the V1-style colophon intro with heading and deck paragraphs.
 */
describe("AboutSection", () => {
  const mockContent: AboutContent = {
    name: "Test User",
    currentRole: "Software Engineer",
    company: "Test Company",
    bio: "A passionate developer.",
    deck: [
      "First paragraph of the deck.",
      "Second paragraph with more details.",
      "Third paragraph to conclude.",
    ],
    responsibilities: [
      "Building features",
      "Code review",
      "Documentation",
    ],
    links: [
      { label: "LinkedIn", url: "https://linkedin.com/in/test", icon: "linkedin" },
      { label: "GitHub", url: "https://github.com/test", icon: "github" },
    ],
  };

  it("should render the Colophon heading", () => {
    render(<AboutSection content={mockContent} />);

    expect(
      screen.getByRole("heading", { name: /colophon/i, level: 1 })
    ).toBeInTheDocument();
  });

  it("should render all deck paragraphs", () => {
    render(<AboutSection content={mockContent} />);

    expect(screen.getByText("First paragraph of the deck.")).toBeInTheDocument();
    expect(
      screen.getByText("Second paragraph with more details.")
    ).toBeInTheDocument();
    expect(screen.getByText("Third paragraph to conclude.")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<AboutSection content={mockContent} />);

    const section = screen.getByRole("region", { name: /colophon/i });
    expect(section).toBeInTheDocument();
  });

  it("should render with empty deck", () => {
    const contentWithEmptyDeck: AboutContent = {
      ...mockContent,
      deck: [],
    };

    render(<AboutSection content={contentWithEmptyDeck} />);

    // Should still render the heading
    expect(
      screen.getByRole("heading", { name: /colophon/i, level: 1 })
    ).toBeInTheDocument();
  });
});
