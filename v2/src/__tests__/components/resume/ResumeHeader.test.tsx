import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResumeHeader from "../../../components/resume/ResumeHeader";
import type { ResumeHeaderContent } from "../../../types/resume";

/**
 * Tests for the ResumeHeader component.
 * Verifies the resume header with name, tagline, and contact buttons.
 *
 * No ThemeContextProvider wrapper needed — palette colors are now passed as props.
 */

/** Test color values for prop-drilled palette colors */
const TEST_TEXT_PRIMARY = "#1a1a1a";
const TEST_TEXT_SECONDARY = "#666666";

describe("ResumeHeader", () => {
  const mockContent: ResumeHeaderContent = {
    name: "Test User",
    tagline: "I develop useful and engaging applications.",
    contactLinks: [
      {
        label: "portfolio.example.com",
        url: "https://portfolio.example.com",
        icon: "link",
      },
      {
        label: "linkedin.com/in/test",
        url: "https://linkedin.com/in/test",
        icon: "linkedin",
      },
      {
        label: "github.com/test",
        url: "https://github.com/test",
        icon: "github",
      },
      {
        label: "Download Résumé",
        url: "/Test_Resume.pdf",
        icon: "download",
      },
    ],
  };

  it("should render name as h1", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    expect(
      screen.getByRole("heading", { name: /test user/i, level: 1 })
    ).toBeInTheDocument();
  });

  it("should render tagline", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    expect(
      screen.getByText("I develop useful and engaging applications.")
    ).toBeInTheDocument();
  });

  it("should render all contact links as buttons", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    const portfolioLink = screen.getByRole("link", {
      name: /portfolio\.example\.com/i,
    });
    const linkedInLink = screen.getByRole("link", {
      name: /linkedin\.com\/in\/test/i,
    });
    const githubLink = screen.getByRole("link", { name: /github\.com\/test/i });
    const downloadLink = screen.getByRole("link", {
      name: /download résumé/i,
    });

    expect(portfolioLink).toBeInTheDocument();
    expect(linkedInLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(downloadLink).toBeInTheDocument();
  });

  it("should have correct href attributes for links", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    const portfolioLink = screen.getByRole("link", {
      name: /portfolio\.example\.com/i,
    });
    const linkedInLink = screen.getByRole("link", {
      name: /linkedin\.com\/in\/test/i,
    });
    const githubLink = screen.getByRole("link", { name: /github\.com\/test/i });
    const downloadLink = screen.getByRole("link", {
      name: /download résumé/i,
    });

    expect(portfolioLink).toHaveAttribute(
      "href",
      "https://portfolio.example.com"
    );
    expect(linkedInLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/test"
    );
    expect(githubLink).toHaveAttribute("href", "https://github.com/test");
    expect(downloadLink).toHaveAttribute("href", "/Test_Resume.pdf");
  });

  it("should have target blank for download link", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    const downloadLink = screen.getByRole("link", {
      name: /download résumé/i,
    });

    expect(downloadLink).toHaveAttribute("target", "_blank");
    expect(downloadLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should apply print-only class to portfolio link", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    const portfolioLink = screen.getByRole("link", {
      name: /portfolio\.example\.com/i,
    });

    expect(portfolioLink).toHaveClass("print-only");
  });

  it("should apply no-print class to download link", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    const downloadLink = screen.getByRole("link", {
      name: /download résumé/i,
    });

    expect(downloadLink).toHaveClass("no-print");
  });

  it("should not apply print-only or no-print classes to social links", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    const linkedInLink = screen.getByRole("link", {
      name: /linkedin\.com\/in\/test/i,
    });
    const githubLink = screen.getByRole("link", { name: /github\.com\/test/i });

    expect(linkedInLink).not.toHaveClass("print-only");
    expect(linkedInLink).not.toHaveClass("no-print");
    expect(githubLink).not.toHaveClass("print-only");
    expect(githubLink).not.toHaveClass("no-print");
  });

  it("should have proper accessibility attributes", () => {
    render(<ResumeHeader content={mockContent} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    const section = screen.getByRole("region", { name: /test user/i });
    expect(section).toBeInTheDocument();
  });

  it("should render with no contact links", () => {
    const contentWithNoLinks: ResumeHeaderContent = {
      ...mockContent,
      contactLinks: [],
    };

    render(<ResumeHeader content={contentWithNoLinks} textPrimaryColor={TEST_TEXT_PRIMARY} textSecondaryColor={TEST_TEXT_SECONDARY} />);

    // Should still render name and tagline
    expect(
      screen.getByRole("heading", { name: /test user/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText("I develop useful and engaging applications.")
    ).toBeInTheDocument();
  });
});
