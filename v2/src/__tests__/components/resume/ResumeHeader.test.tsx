import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResumeHeader from "../../../components/resume/ResumeHeader";
import type { ResumeHeaderContent } from "../../../types/resume";

/**
 * Tests for the ResumeHeader component.
 * Verifies the resume header with name, tagline, and contact buttons.
 */
describe("ResumeHeader", () => {
  const mockContent: ResumeHeaderContent = {
    name: "Test User",
    tagline: "I develop useful and engaging applications.",
    contactLinks: [
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
    render(<ResumeHeader content={mockContent} />);

    expect(
      screen.getByRole("heading", { name: /test user/i, level: 1 })
    ).toBeInTheDocument();
  });

  it("should render tagline", () => {
    render(<ResumeHeader content={mockContent} />);

    expect(
      screen.getByText("I develop useful and engaging applications.")
    ).toBeInTheDocument();
  });

  it("should render all contact links as buttons", () => {
    render(<ResumeHeader content={mockContent} />);

    const linkedInLink = screen.getByRole("link", {
      name: /linkedin\.com\/in\/test/i,
    });
    const githubLink = screen.getByRole("link", { name: /github\.com\/test/i });
    const downloadLink = screen.getByRole("link", {
      name: /download résumé/i,
    });

    expect(linkedInLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(downloadLink).toBeInTheDocument();
  });

  it("should have correct href attributes for links", () => {
    render(<ResumeHeader content={mockContent} />);

    const linkedInLink = screen.getByRole("link", {
      name: /linkedin\.com\/in\/test/i,
    });
    const githubLink = screen.getByRole("link", { name: /github\.com\/test/i });
    const downloadLink = screen.getByRole("link", {
      name: /download résumé/i,
    });

    expect(linkedInLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/test"
    );
    expect(githubLink).toHaveAttribute("href", "https://github.com/test");
    expect(downloadLink).toHaveAttribute("href", "/Test_Resume.pdf");
  });

  it("should have target blank for download link", () => {
    render(<ResumeHeader content={mockContent} />);

    const downloadLink = screen.getByRole("link", {
      name: /download résumé/i,
    });

    expect(downloadLink).toHaveAttribute("target", "_blank");
    expect(downloadLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should have proper accessibility attributes", () => {
    render(<ResumeHeader content={mockContent} />);

    const section = screen.getByRole("region", { name: /test user/i });
    expect(section).toBeInTheDocument();
  });

  it("should render with no contact links", () => {
    const contentWithNoLinks: ResumeHeaderContent = {
      ...mockContent,
      contactLinks: [],
    };

    render(<ResumeHeader content={contentWithNoLinks} />);

    // Should still render name and tagline
    expect(
      screen.getByRole("heading", { name: /test user/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText("I develop useful and engaging applications.")
    ).toBeInTheDocument();
  });
});
