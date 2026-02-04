import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DesignPhilosophy from "../../../components/colophon/DesignPhilosophy";
import { ThemeContextProvider } from "../../../contexts/ThemeContext";
import type { DesignPhilosophyContent } from "../../../types/colophon";

/**
 * Wrapper component to provide ThemeContext for testing.
 *
 * @param props - Component props
 * @param props.children - Child elements to render within the context
 * @returns The children wrapped with ThemeContextProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}

/**
 * Tests for the DesignPhilosophy component.
 */
describe("DesignPhilosophy", () => {
  const mockContent: DesignPhilosophyContent = {
    intro: "The design was inspired by classic diagrams.",
    colors: [
      {
        name: "Primary Blue",
        hex: "#0066CC",
        description: "Used for links and CTAs",
      },
      {
        name: "Background",
        hex: "#FFFFFF",
        description: "Page background",
      },
      {
        name: "Dark Text",
        hex: "#333333",
        description: "Primary text color",
      },
    ],
    colorDescription: "Colors are chosen for accessibility.",
    typographyIntro: "We use Google Fonts:",
    typography: [
      {
        name: "Open Sans",
        usage: "Body text",
        sample: "The quick brown fox",
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        url: "https://fonts.google.com/specimen/Open+Sans",
      },
      {
        name: "Oswald",
        usage: "Headings",
        sample: "HEADLINES",
        fontFamily: '"Oswald", sans-serif',
        fontWeight: 700,
      },
    ],
  };

  it("should render the section heading", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /design.*typography/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render intro text", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    expect(
      screen.getByText("The design was inspired by classic diagrams.")
    ).toBeInTheDocument();
  });

  it("should render color palette section", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /colour palette/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Colors are chosen for accessibility.")
    ).toBeInTheDocument();
  });

  it("should render color swatches with hex codes", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByText("Primary Blue")).toBeInTheDocument();
    expect(screen.getByText("#0066CC")).toBeInTheDocument();
    expect(screen.getByText("Used for links and CTAs")).toBeInTheDocument();

    expect(screen.getByText("Background")).toBeInTheDocument();
    expect(screen.getByText("#FFFFFF")).toBeInTheDocument();

    expect(screen.getByText("Dark Text")).toBeInTheDocument();
    expect(screen.getByText("#333333")).toBeInTheDocument();
  });

  it("should render typography section", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /typography/i, level: 3 })
    ).toBeInTheDocument();
    expect(screen.getByText("We use Google Fonts:")).toBeInTheDocument();
  });

  it("should render typography samples", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByText("Open Sans")).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
    expect(screen.getByText("The quick brown fox")).toBeInTheDocument();

    expect(screen.getByText("Oswald")).toBeInTheDocument();
    expect(screen.getByText("Headings")).toBeInTheDocument();
    expect(screen.getByText("HEADLINES")).toBeInTheDocument();
  });

  it("should render font links when URL is provided", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    const openSansLink = screen.getByRole("link", {
      name: /view open sans on google fonts/i,
    });
    expect(openSansLink).toHaveAttribute(
      "href",
      "https://fonts.google.com/specimen/Open+Sans"
    );
    expect(openSansLink).toHaveAttribute("target", "_blank");
  });

  it("should not render link when URL is not provided", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    // Oswald doesn't have a URL in our mock data
    expect(
      screen.queryByRole("link", { name: /view oswald on google fonts/i })
    ).not.toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    const section = screen.getByRole("region", { name: /design/i });
    expect(section).toBeInTheDocument();
  });

  it("should apply correct font family to typography samples", () => {
    render(<DesignPhilosophy content={mockContent} />, { wrapper: Wrapper });

    const openSansSample = screen.getByText("The quick brown fox");
    expect(openSansSample).toHaveStyle({
      fontFamily: '"Open Sans", sans-serif',
    });

    const oswaldSample = screen.getByText("HEADLINES");
    expect(oswaldSample).toHaveStyle({ fontFamily: '"Oswald", sans-serif' });
  });
});
