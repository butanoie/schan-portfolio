import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../__tests__/test-utils";
import { ReactNode } from "react";
import ColophonPage from "../../../../app/colophon/page";
import { ThemeContextProvider } from "../../../../src/contexts/ThemeContext";
import { AnimationsContextProvider } from "../../../../src/contexts/AnimationsContext";
import { LocaleProvider } from "../../../../src/components/i18n/LocaleProvider";
import ThemeProvider from "../../../../src/components/ThemeProvider";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    priority,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

/**
 * Wrapper component to provide all necessary contexts for testing.
 *
 * @param props - Component props
 * @param props.children - Child elements to render within the contexts
 * @returns The children wrapped with LocaleProvider, ThemeContextProvider, AnimationsContextProvider, and ThemeProvider
 */
function Wrapper({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider initialLocale="en">
      <ThemeContextProvider>
        <AnimationsContextProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AnimationsContextProvider>
      </ThemeContextProvider>
    </LocaleProvider>
  );
}

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
    render(<ColophonPage />, { wrapper: Wrapper });

    const headerImage = screen.getByAltText(/choice cuts.*pork cuts diagram/i);
    expect(headerImage).toBeInTheDocument();
    expect(headerImage).toHaveAttribute("src", "/images/choice_cuts@2x-en.png");
  });

  it("should render the About section with Colophon heading", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /colophon/i, level: 1 })
    ).toBeInTheDocument();
  });

  it("should render the Technologies section", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /technologies/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render the Design & Typography section", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /design & typography/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render the Buta Story section", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    // The Buta Story has a visually hidden heading for accessibility
    expect(
      screen.getByRole("heading", { name: /the story of buta/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render the Boo vs Bu comparison image", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    const versusImage = screen.getByAltText(/boo vs bu/i);
    expect(versusImage).toBeInTheDocument();
  });

  it("should render all major content sections", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    // Verify all four sections are present via their aria-labeled regions
    expect(
      screen.getByRole("region", { name: /colophon/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /technologies/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /design/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /buta/i })).toBeInTheDocument();
  });

  it("should render color palette swatches", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    // Check for some of the color names from the palette
    expect(screen.getByText("Sakura")).toBeInTheDocument();
    expect(screen.getByText("Maroon")).toBeInTheDocument();
    expect(screen.getByText("Graphite")).toBeInTheDocument();
  });

  it("should render typography samples", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    // Check for font names
    expect(screen.getByText("Open Sans")).toBeInTheDocument();
    expect(screen.getByText("Oswald")).toBeInTheDocument();
    expect(screen.getByText("Gochi Hand")).toBeInTheDocument();
  });

  it("should render technology categories", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    // Check for V2 technology category headings
    expect(screen.getByText("Core Stack")).toBeInTheDocument();
    expect(screen.getByText("Development Experience")).toBeInTheDocument();
    expect(screen.getByText("AI-Powered Development")).toBeInTheDocument();
    expect(screen.getByText("UI & Styling")).toBeInTheDocument();
    expect(screen.getByText("Testing & Quality Assurance")).toBeInTheDocument();
    expect(screen.getByText("Deployment & CI/CD")).toBeInTheDocument();
  });

  it("should render the V1 technologies accordion", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    expect(
      screen.getByRole("button", { name: /original v1 technologies/i })
    ).toBeInTheDocument();
  });

  it("should have proper article landmark", () => {
    render(<ColophonPage />, { wrapper: Wrapper });

    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
