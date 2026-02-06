import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WorkExperience from "../../../components/resume/WorkExperience";
import type { Job } from "../../../types/resume";
import { ThemeContextProvider } from "../../../contexts/ThemeContext";
import { LocaleProvider } from "../../../components/i18n/LocaleProvider";

/**
 * Tests for the WorkExperience component.
 * Verifies the work history display with companies, roles, and descriptions.
 */

/**
 * Wrapper component that provides ThemeContext and LocaleProvider to tested components.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the contexts
 * @returns The children wrapped with LocaleProvider and ThemeContextProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider initialLocale="en">
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </LocaleProvider>
  );
}
describe("WorkExperience", () => {
  const mockJobs: Job[] = [
    {
      company: "Test Company Inc",
      roles: [
        {
          title: "Senior Developer",
          startDate: "January 2020",
          endDate: "Present",
        },
        {
          title: "Developer",
          startDate: "June 2018",
          endDate: "December 2019",
        },
      ],
      description:
        "Developed innovative solutions and led technical initiatives.",
      keyContributions: [
        "Implemented new features",
        "Mentored junior developers",
        "Improved code quality",
      ],
    },
    {
      company: "Another Company LLC",
      roles: [
        {
          title: "Junior Developer",
          startDate: "May 2016",
          endDate: "May 2018",
        },
      ],
      description: "Built web applications and maintained existing systems.",
    },
  ];

  it("should render the Work Experience heading", () => {
    render(<WorkExperience jobs={mockJobs} />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /work experience/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("should render all company names", () => {
    render(<WorkExperience jobs={mockJobs} />, { wrapper: Wrapper });

    expect(screen.getByText("Test Company Inc")).toBeInTheDocument();
    expect(screen.getByText("Another Company LLC")).toBeInTheDocument();
  });

  it("should render all roles with dates", () => {
    render(<WorkExperience jobs={mockJobs} />, { wrapper: Wrapper });

    expect(screen.getByText("Senior Developer")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Junior Developer")).toBeInTheDocument();

    expect(screen.getByText("January 2020 - Present")).toBeInTheDocument();
    expect(
      screen.getByText("June 2018 - December 2019")
    ).toBeInTheDocument();
    expect(screen.getByText("May 2016 - May 2018")).toBeInTheDocument();
  });

  it("should render job descriptions", () => {
    render(<WorkExperience jobs={mockJobs} />, { wrapper: Wrapper });

    expect(
      screen.getByText(
        "Developed innovative solutions and led technical initiatives."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Built web applications and maintained existing systems.")
    ).toBeInTheDocument();
  });

  it("should render key contributions when present", () => {
    render(<WorkExperience jobs={mockJobs} />, { wrapper: Wrapper });

    expect(screen.getByText("Key Contributions:")).toBeInTheDocument();
    expect(screen.getByText("Implemented new features")).toBeInTheDocument();
    expect(screen.getByText("Mentored junior developers")).toBeInTheDocument();
    expect(screen.getByText("Improved code quality")).toBeInTheDocument();
  });

  it("should not render key contributions heading when absent", () => {
    const jobsWithoutContributions: Job[] = [
      {
        company: "Simple Company",
        roles: [
          {
            title: "Developer",
            startDate: "2020",
            endDate: "Present",
          },
        ],
        description: "Simple description",
      },
    ];

    render(<WorkExperience jobs={jobsWithoutContributions} />, { wrapper: Wrapper });

    expect(screen.queryByText("Key Contributions:")).not.toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<WorkExperience jobs={mockJobs} />, { wrapper: Wrapper });

    const section = screen.getByRole("region", {
      name: /work experience/i,
    });
    expect(section).toBeInTheDocument();
  });

  it("should render with empty jobs array", () => {
    render(<WorkExperience jobs={[]} />, { wrapper: Wrapper });

    // Should still render the heading
    expect(
      screen.getByRole("heading", { name: /work experience/i, level: 2 })
    ).toBeInTheDocument();
  });
});
