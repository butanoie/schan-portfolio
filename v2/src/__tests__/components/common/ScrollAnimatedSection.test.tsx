/**
 * Tests for the ScrollAnimatedSection component.
 *
 * Verifies:
 * - Renders children correctly
 * - Applies animation styles when visible and animations enabled
 * - Disables transitions when animations are disabled
 * - Starts hidden (opacity 0, translated down) before entering viewport
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollAnimatedSection } from "@/src/components/common/ScrollAnimatedSection";

/** Mock return value for useScrollAnimation */
const mockScrollAnimation = {
  ref: { current: null },
  isInView: false,
};

/** Mock return value for useAnimations */
const mockAnimations = {
  animationsEnabled: true,
  shouldAnimate: true,
  toggleAnimations: vi.fn(),
};

vi.mock("../../../hooks", () => ({
  /**
   * Returns mock scroll animation state for controlling viewport visibility.
   *
   * @returns Mock scroll animation with ref and isInView
   */
  useScrollAnimation: () => mockScrollAnimation,

  /**
   * Returns mock animations state for controlling animation enabled flag.
   *
   * @returns Mock animations with animationsEnabled and toggleAnimations
   */
  useAnimations: () => mockAnimations,
}));

describe("ScrollAnimatedSection", () => {
  beforeEach(() => {
    mockScrollAnimation.isInView = false;
    mockAnimations.animationsEnabled = true;
  });

  it("should render children", () => {
    render(
      <ScrollAnimatedSection>
        <div data-testid="child">Test content</div>
      </ScrollAnimatedSection>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should start with hidden styles when not in view", () => {
    render(
      <ScrollAnimatedSection>
        <div>Content</div>
      </ScrollAnimatedSection>
    );
    const wrapper = screen.getByText("Content").parentElement;
    expect(wrapper).toHaveStyle({ opacity: 0 });
  });

  it("should show content when in view", () => {
    mockScrollAnimation.isInView = true;
    render(
      <ScrollAnimatedSection>
        <div>Content</div>
      </ScrollAnimatedSection>
    );
    const wrapper = screen.getByText("Content").parentElement;
    expect(wrapper).toHaveStyle({ opacity: 1 });
  });

  it("should disable transitions when animations are disabled", () => {
    mockAnimations.animationsEnabled = false;
    render(
      <ScrollAnimatedSection>
        <div>Content</div>
      </ScrollAnimatedSection>
    );
    const wrapper = screen.getByText("Content").parentElement;
    expect(wrapper).toHaveStyle({ transition: "none" });
  });
});
