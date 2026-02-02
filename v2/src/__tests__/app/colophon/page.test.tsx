import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ColophonPage from "../../../../app/colophon/page";

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
 * Integration tests for the ColophonPage component.
 *
 * Verifies that the page renders all sections correctly:
 * - Choice Cuts header image
 * - About section with Colophon heading
 * - Technologies section
 * - Design Philosophy section
 * - Buta Story section
 */
describe("ColophonPage", () => {
  it("should render the Choice Cuts header image", () => {
    render(<ColophonPage />);

    const headerImage = screen.getByAltText(/choice cuts.*pork cuts diagram/i);
    expect(headerImage).toBeInTheDocument();
    expect(headerImage).toHaveAttribute("src", "/images/choice_cuts@2x.png");
  });

  it("should render the About section with Colophon heading", () => {
    render(<ColophonPage />);

    expect(
      screen.getByRole("heading", { name: /colophon/i, level: 1 })
    ).toBeInTheDocument();
  });

  it("should render the Technologies section", () => {
    render(<ColophonPage />);

    expect(
      screen.getByRole("heading", { name: /technologies/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render the Design & Typography section", () => {
    render(<ColophonPage />);

    expect(
      screen.getByRole("heading", { name: /design & typography/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render the Buta Story section", () => {
    render(<ColophonPage />);

    // The Buta Story has a visually hidden heading for accessibility
    expect(
      screen.getByRole("heading", { name: /the story of buta/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render the Boo vs Bu comparison image", () => {
    render(<ColophonPage />);

    const versusImage = screen.getByAltText(/boo vs bu/i);
    expect(versusImage).toBeInTheDocument();
  });

  it("should render all major content sections", () => {
    render(<ColophonPage />);

    // Verify all four sections are present via their aria-labeled regions
    expect(screen.getByRole("region", { name: /colophon/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /technologies/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /design/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /buta/i })).toBeInTheDocument();
  });

  it("should render color palette swatches", () => {
    render(<ColophonPage />);

    // Check for some of the color names from the palette
    expect(screen.getByText("Sakura")).toBeInTheDocument();
    expect(screen.getByText("Maroon")).toBeInTheDocument();
    expect(screen.getByText("Graphite")).toBeInTheDocument();
  });

  it("should render typography samples", () => {
    render(<ColophonPage />);

    // Check for font names
    expect(screen.getByText("Open Sans")).toBeInTheDocument();
    expect(screen.getByText("Oswald")).toBeInTheDocument();
    expect(screen.getByText("Gochi Hand")).toBeInTheDocument();
  });

  it("should render technology categories", () => {
    render(<ColophonPage />);

    // Check for V2 technology category headings
    expect(screen.getByText("Framework & Runtime")).toBeInTheDocument();
    expect(screen.getByText("UI & Styling")).toBeInTheDocument();
    expect(screen.getByText("Development Tools")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("should render the V1 technologies accordion", () => {
    render(<ColophonPage />);

    expect(
      screen.getByRole("button", { name: /original v1 technologies/i })
    ).toBeInTheDocument();
  });

  it("should have proper article landmark", () => {
    render(<ColophonPage />);

    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
