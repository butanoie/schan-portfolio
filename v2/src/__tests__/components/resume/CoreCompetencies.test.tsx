import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CoreCompetencies from "../../../components/resume/CoreCompetencies";
import type { SkillCategory } from "../../../types/resume";

/**
 * Tests for the CoreCompetencies component.
 * Verifies the skills display organized by category with chips.
 */
describe("CoreCompetencies", () => {
  const mockCategories: SkillCategory[] = [
    {
      label: "Core Competencies",
      skills: ["JavaScript", "TypeScript", "React.js", "Node.js"],
    },
    {
      label: "Everyday Tools",
      skills: ["VS Code", "Git", "Docker"],
    },
    {
      label: "Once in a While",
      skills: ["Photoshop", "Illustrator"],
    },
  ];

  it("should render all category headings", () => {
    render(<CoreCompetencies categories={mockCategories} />);

    expect(
      screen.getByRole("heading", { name: /core competencies/i, level: 3 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /everyday tools/i, level: 3 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /once in a while/i, level: 3 })
    ).toBeInTheDocument();
  });

  it("should render all skills from Core Competencies", () => {
    render(<CoreCompetencies categories={mockCategories} />);

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("should render all skills from Everyday Tools", () => {
    render(<CoreCompetencies categories={mockCategories} />);

    expect(screen.getByText("VS Code")).toBeInTheDocument();
    expect(screen.getByText("Git")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("should render all skills from Once in a While", () => {
    render(<CoreCompetencies categories={mockCategories} />);

    expect(screen.getByText("Photoshop")).toBeInTheDocument();
    expect(screen.getByText("Illustrator")).toBeInTheDocument();
  });

  it("should render correct number of skills", () => {
    const { container } = render(
      <CoreCompetencies categories={mockCategories} />
    );

    const chips = container.querySelectorAll('[class*="MuiChip-root"]');
    // Total: 4 + 3 + 2 = 9 skills
    expect(chips).toHaveLength(9);
  });

  it("should have proper accessibility attributes", () => {
    render(<CoreCompetencies categories={mockCategories} />);

    const section = screen.getByRole("region", { name: /core competencies/i });
    expect(section).toBeInTheDocument();
  });

  it("should render with single category", () => {
    const singleCategory: SkillCategory[] = [
      {
        label: "Skills",
        skills: ["Skill 1", "Skill 2"],
      },
    ];

    render(<CoreCompetencies categories={singleCategory} />);

    expect(
      screen.getByRole("heading", { name: /skills/i, level: 3 })
    ).toBeInTheDocument();
    expect(screen.getByText("Skill 1")).toBeInTheDocument();
    expect(screen.getByText("Skill 2")).toBeInTheDocument();
  });

  it("should render with empty categories array", () => {
    render(<CoreCompetencies categories={[]} />);

    // Should render without crashing
    const section = screen.getByRole("region");
    expect(section).toBeInTheDocument();
  });

  it("should render category with empty skills", () => {
    const categoryWithNoSkills: SkillCategory[] = [
      {
        label: "Empty Category",
        skills: [],
      },
    ];

    render(<CoreCompetencies categories={categoryWithNoSkills} />);

    expect(
      screen.getByRole("heading", { name: /empty category/i, level: 3 })
    ).toBeInTheDocument();
  });
});
