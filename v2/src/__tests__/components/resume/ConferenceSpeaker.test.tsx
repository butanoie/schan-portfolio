import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConferenceSpeaker from "../../../components/resume/ConferenceSpeaker";
import type { SpeakingContent } from "../../../types/resume";
import { ThemeContextProvider } from "../../../contexts/ThemeContext";
import { LocaleProvider } from "../../../components/i18n/LocaleProvider";

/**
 * Tests for the ConferenceSpeaker component.
 * Verifies the conference speaking history display.
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
    render(<ConferenceSpeaker content={mockContent} />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /conference speaker/i, level: 3 })
    ).toBeInTheDocument();
  });

  it("should render the intro text when provided", () => {
    render(<ConferenceSpeaker content={mockContent} />, { wrapper: Wrapper });

    expect(
      screen.getByText("I have presented sessions at the following conferences:")
    ).toBeInTheDocument();
  });

  it("should not render intro text when not provided", () => {
    const noIntroContent: SpeakingContent = {
      events: [
        {
          conference: "Tech Conference 2024",
          year: "2024",
        },
      ],
    };

    render(<ConferenceSpeaker content={noIntroContent} />, { wrapper: Wrapper });

    expect(
      screen.queryByText("I have presented sessions at the following conferences:")
    ).not.toBeInTheDocument();
  });

  it("should render all conference names", () => {
    render(<ConferenceSpeaker content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByText(/react conf 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/javascript summit 2022/i)).toBeInTheDocument();
    expect(screen.getByText(/devops days 2021/i)).toBeInTheDocument();
  });

  it("should render topics when present", () => {
    render(<ConferenceSpeaker content={mockContent} />, { wrapper: Wrapper });

    // Topics are rendered in separate elements
    expect(screen.getByText("React Conf 2023")).toBeInTheDocument();
    expect(screen.getByText("Advanced React Patterns")).toBeInTheDocument();
    expect(screen.getByText("DevOps Days 2021")).toBeInTheDocument();
    expect(screen.getByText("CI/CD Best Practices")).toBeInTheDocument();
  });

  it("should not show topic separator when topic is absent", () => {
    render(<ConferenceSpeaker content={mockContent} />, { wrapper: Wrapper });

    // JavaScript Summit 2022 has no topic, so topic element should not be rendered
    const heading = screen.getByText("JavaScript Summit 2022");
    expect(heading).toBeInTheDocument();

    // Find the parent container for this event and check that no topic is rendered
    const eventContainer = heading.closest("div");
    const topicElements = eventContainer?.querySelectorAll("p");
    // Should have 2 p elements (name and year+location), not 3 (which would include topic)
    expect(topicElements).toHaveLength(2);
  });

  it("should render locations when present", () => {
    render(<ConferenceSpeaker content={mockContent} />, { wrapper: Wrapper });

    // Locations are rendered together with year in the same element
    expect(screen.getByText(/2023.*San Francisco, CA/)).toBeInTheDocument();
    expect(screen.getByText(/2022.*Virtual/)).toBeInTheDocument();
    expect(screen.getByText(/2021.*Seattle, WA/)).toBeInTheDocument();
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

    render(<ConferenceSpeaker content={noLocationContent} />, { wrapper: Wrapper });

    expect(screen.getByText("Tech Conference 2020")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
    // Ensure location is not rendered when not provided
    expect(screen.queryByText(/–/)).not.toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<ConferenceSpeaker content={mockContent} />, { wrapper: Wrapper });

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

    render(<ConferenceSpeaker content={singleEvent} />, { wrapper: Wrapper });

    expect(screen.getByText("I spoke at one conference:")).toBeInTheDocument();
    expect(screen.getByText("Tech Talk 2020")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
  });

  it("should render with empty events array", () => {
    const noEvents: SpeakingContent = {
      intro: "I plan to speak at conferences soon.",
      events: [],
    };

    render(<ConferenceSpeaker content={noEvents} />, { wrapper: Wrapper });

    // Should still render the heading and intro
    expect(
      screen.getByRole("heading", { name: /conference speaker/i, level: 3 })
    ).toBeInTheDocument();
    expect(
      screen.getByText("I plan to speak at conferences soon.")
    ).toBeInTheDocument();
  });

  it("should render events as list items", () => {
    render(<ConferenceSpeaker content={mockContent} />, { wrapper: Wrapper });

    // Component renders events as divs with left borders, not ul > li
    expect(screen.getByText("React Conf 2023")).toBeInTheDocument();
    expect(screen.getByText("JavaScript Summit 2022")).toBeInTheDocument();
    expect(screen.getByText("DevOps Days 2021")).toBeInTheDocument();
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

    render(<ConferenceSpeaker content={fullEvent} />, { wrapper: Wrapper });

    // Component renders each property in separate elements
    expect(screen.getByText("Complete Conference 2024")).toBeInTheDocument();
    expect(screen.getByText(/2024.*Austin, TX/)).toBeInTheDocument();
    expect(screen.getByText("Full Stack Development")).toBeInTheDocument();
  });
});
