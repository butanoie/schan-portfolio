import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfessionalSummary from "../../../components/resume/ProfessionalSummary";
import { ThemeContextProvider } from "../../../contexts/ThemeContext";
import { LocaleProvider } from "../../../components/i18n/LocaleProvider";

/**
 * Tests for the ProfessionalSummary component.
 * Verifies the professional summary section display with proper localization.
 */

/**
 * Wrapper component that provides ThemeContext and LocaleProvider to tested components.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the contexts
 * @param props.initialLocale - Initial locale for the LocaleProvider (default: 'en')
 * @returns The children wrapped with LocaleProvider and ThemeContextProvider
 */
function Wrapper({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: "en" | "fr";
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </LocaleProvider>
  );
}

describe("ProfessionalSummary", () => {
  it("should render the Professional Summary heading", () => {
    render(<ProfessionalSummary />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", {
        name: /professional summary/i,
        level: 2,
      })
    ).toBeInTheDocument();
  });

  it("should render the professional summary content", () => {
    render(<ProfessionalSummary />, { wrapper: Wrapper });

    // Check for key phrases from the summary
    expect(
      screen.getByText(/Product and UX leader with 25\+ years/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enterprise SaaS, collaboration platforms/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/building UX practices from the ground up/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/federal agencies, Fortune 500 companies/i)
    ).toBeInTheDocument();
  });

  it("should render with French locale", () => {
    /**
     * Custom wrapper that provides French locale to the component.
     *
     * @param props - Render props with children
     * @param props.children - Child components to render
     * @returns Component wrapped with French locale
     */
    const FrenchWrapper = (props: { children: React.ReactNode }) => (
      <Wrapper {...props} initialLocale="fr">
        {props.children}
      </Wrapper>
    );

    render(<ProfessionalSummary />, {
      wrapper: FrenchWrapper,
    });

    // Check for French heading
    expect(
      screen.getByRole("heading", {
        name: /résumé professionnel/i,
        level: 2,
      })
    ).toBeInTheDocument();

    // Check for key French phrases from the summary
    expect(
      screen.getByText(/Responsable produit et UX avec plus de 25 ans/i)
    ).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<ProfessionalSummary />, { wrapper: Wrapper });

    const section = screen.getByRole("region", {
      name: /professional summary/i,
    });
    expect(section).toBeInTheDocument();
  });

  it("should render as a section element", () => {
    const { container } = render(<ProfessionalSummary />, { wrapper: Wrapper });

    const section = container.querySelector('section[aria-labelledby="professional-summary-heading"]');
    expect(section).toBeInTheDocument();
  });

  it("should contain the full professional summary text", () => {
    render(<ProfessionalSummary />, { wrapper: Wrapper });

    // The full summary should be present as a complete text block
    const summaryText = screen.getByText(
      /Product and UX leader with 25\+ years of experience spanning enterprise SaaS, collaboration platforms, and front-end architecture\. Unique ability to operate across the full stack/i
    );
    expect(summaryText).toBeInTheDocument();
  });

  it("should have proper id attribute on heading", () => {
    render(<ProfessionalSummary />, { wrapper: Wrapper });

    const heading = screen.getByRole("heading", {
      name: /professional summary/i,
      level: 2,
    });
    expect(heading).toHaveAttribute(
      "id",
      "professional-summary-heading"
    );
  });

  it("should render correctly with all content sections", () => {
    render(<ProfessionalSummary />, { wrapper: Wrapper });

    // Verify the component renders with proper structure
    const section = screen.getByRole("region", {
      name: /professional summary/i,
    });
    expect(section).toBeInTheDocument();

    // Verify heading is a direct child of section
    const heading = section.querySelector("h2");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Professional Summary");

    // Verify content paragraph is present
    const paragraph = section.querySelector("p");
    expect(paragraph).toBeInTheDocument();
  });
});
