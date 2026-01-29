import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConferenceSpeaker from "../../../components/resume/ConferenceSpeaker";
import type { SpeakingContent } from "../../../types/resume";

/**
 * Tests for the ConferenceSpeaker component.
 * Verifies the conference speaking history display.
 */
describe("ConferenceSpeaker", () => {
  const mockContent: SpeakingContent = {
    intro: "I have presented sessions at the following conferences:",
    events: [
      {
        conference: "React Conf 2023",
        year: "2023",
        topic: "Advanced React Patterns",
        location: "San Francisco, CA",
      },
      {
        conference: "JavaScript Summit 2022",
        year: "2022",
        location: "Virtual",
      },
      {
        conference: "DevOps Days 2021",
        year: "2021",
        topic: "CI/CD Best Practices",
        location: "Seattle, WA",
      },
    ],
  };

  it("should render the Conference Speaker heading", () => {
    render(<ConferenceSpeaker content={mockContent} />);

    expect(
      screen.getByRole("heading", { name: /conference speaker/i, level: 3 })
    ).toBeInTheDocument();
  });

  it("should render the intro text", () => {
    render(<ConferenceSpeaker content={mockContent} />);

    expect(
      screen.getByText("I have presented sessions at the following conferences:")
    ).toBeInTheDocument();
  });

  it("should render all conference names", () => {
    render(<ConferenceSpeaker content={mockContent} />);

    expect(screen.getByText(/react conf 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/javascript summit 2022/i)).toBeInTheDocument();
    expect(screen.getByText(/devops days 2021/i)).toBeInTheDocument();
  });

  it("should render topics when present", () => {
    render(<ConferenceSpeaker content={mockContent} />);

    expect(
      screen.getByText(/react conf 2023.*advanced react patterns/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/devops days 2021.*ci\/cd best practices/i)
    ).toBeInTheDocument();
  });

  it("should not show topic separator when topic is absent", () => {
    render(<ConferenceSpeaker content={mockContent} />);

    const jssummit = screen.getByText(/javascript summit 2022/i);
    expect(jssummit.textContent).not.toContain(" - ");
  });

  it("should render locations when present", () => {
    render(<ConferenceSpeaker content={mockContent} />);

    expect(
      screen.getByText(/react conf 2023.*san francisco, ca/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/javascript summit 2022.*virtual/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/devops days 2021.*seattle, wa/i)
    ).toBeInTheDocument();
  });

  it("should render without location when not provided", () => {
    const noLocationContent: SpeakingContent = {
      intro: "I have presented at conferences:",
      events: [
        {
          conference: "Tech Conference 2020",
          year: "2020",
        },
      ],
    };

    render(<ConferenceSpeaker content={noLocationContent} />);

    const eventText = screen.getByText(/tech conference 2020, 2020/i);
    expect(eventText).toBeInTheDocument();
    expect(eventText.textContent).not.toContain("(");
  });

  it("should have proper accessibility attributes", () => {
    render(<ConferenceSpeaker content={mockContent} />);

    const section = screen.getByRole("region", { name: /conference speaker/i });
    expect(section).toBeInTheDocument();
  });

  it("should render with single event", () => {
    const singleEvent: SpeakingContent = {
      intro: "I spoke at one conference:",
      events: [
        {
          conference: "Tech Talk 2020",
          year: "2020",
        },
      ],
    };

    render(<ConferenceSpeaker content={singleEvent} />);

    expect(screen.getByText("I spoke at one conference:")).toBeInTheDocument();
    expect(screen.getByText(/tech talk 2020, 2020/i)).toBeInTheDocument();
  });

  it("should render with empty events array", () => {
    const noEvents: SpeakingContent = {
      intro: "I plan to speak at conferences soon.",
      events: [],
    };

    render(<ConferenceSpeaker content={noEvents} />);

    // Should still render the heading and intro
    expect(
      screen.getByRole("heading", { name: /conference speaker/i, level: 3 })
    ).toBeInTheDocument();
    expect(
      screen.getByText("I plan to speak at conferences soon.")
    ).toBeInTheDocument();
  });

  it("should render events as list items", () => {
    const { container } = render(<ConferenceSpeaker content={mockContent} />);

    const listItems = container.querySelectorAll("ul > li");
    expect(listItems).toHaveLength(3);
  });

  it("should render event with all properties", () => {
    const fullEvent: SpeakingContent = {
      intro: "Speaking history:",
      events: [
        {
          conference: "Complete Conference 2024",
          year: "2024",
          topic: "Full Stack Development",
          location: "Austin, TX",
        },
      ],
    };

    render(<ConferenceSpeaker content={fullEvent} />);

    const eventText = screen.getByText(
      /complete conference 2024.*austin, tx.*full stack development/i
    );
    expect(eventText).toBeInTheDocument();
  });
});
