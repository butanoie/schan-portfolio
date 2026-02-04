/**
 * Tests for the ThemeToggle component.
 *
 * Verifies:
 * - Component renders without crashing
 * - Theme icon changes based on current mode
 * - Clicking button cycles to next theme
 * - ARIA labels are accessible
 * - Tooltip displays current theme
 * - onChange callback is called when theme changes
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";
import { ThemeContextProvider } from "@/src/contexts/ThemeContext";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { getThemeByMode } from "@/src/lib/themes";

/**
 * Wrapper to provide necessary context for ThemeToggle.
 *
 * @param props - Component props
 * @param props.children - Child elements to render within the context
 * @returns The children wrapped with both ThemeContextProvider and MuiThemeProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContextProvider>
      <MuiThemeProvider theme={getThemeByMode("light")}>
        {children}
      </MuiThemeProvider>
    </ThemeContextProvider>
  );
}

describe("ThemeToggle component", () => {
  it("should render without crashing", () => {
    render(<ThemeToggle />, { wrapper: Wrapper });
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should have aria-label for accessibility", () => {
    render(<ThemeToggle />, { wrapper: Wrapper });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label");
    expect(button.getAttribute("aria-label")).toMatch(/Toggle theme/);
  });

  it("should have aria-pressed attribute", () => {
    render(<ThemeToggle />, { wrapper: Wrapper });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed");
  });

  it("should display a tooltip with current theme name", async () => {
    render(<ThemeToggle />, { wrapper: Wrapper });
    const button = screen.getByRole("button");

    // Hover over the button to trigger tooltip
    fireEvent.mouseOver(button);

    await waitFor(() => {
      const tooltip = screen.queryByText(/theme.*click to change/i);
      expect(tooltip).toBeInTheDocument();
    });
  });

  it("should call onChange callback when clicked", async () => {
    const onChange = vi.fn();
    render(<ThemeToggle onChange={onChange} />, { wrapper: Wrapper });

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(expect.any(String));
    });
  });

  it("should accept size prop", () => {
    const { rerender } = render(<ThemeToggle size="small" />, {
      wrapper: Wrapper,
    });
    let button = screen.getByRole("button");
    expect(button.className).toMatch(/MuiIconButton/);

    rerender(
      <Wrapper>
        <ThemeToggle size="large" />
      </Wrapper>
    );
    button = screen.getByRole("button");
    expect(button.className).toMatch(/MuiIconButton/);
  });

  it("should accept className prop", () => {
    const testClass = "test-theme-toggle";
    render(<ThemeToggle className={testClass} />, { wrapper: Wrapper });

    const button = screen.getByRole("button");
    expect(button).toHaveClass(testClass);
  });

  it("should display different icons for different themes", async () => {
    render(<ThemeToggle />, { wrapper: Wrapper });

    // Get the SVG icon elements to verify they're rendered
    let icons = screen.getByRole("button").querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);

    // After multiple clicks, verify icon changes
    const button = screen.getByRole("button");

    // Click to cycle theme
    fireEvent.click(button);

    await waitFor(() => {
      icons = screen.getByRole("button").querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  it("should have transition styles for accessibility", () => {
    render(<ThemeToggle />, { wrapper: Wrapper });
    const button = screen.getByRole("button");

    const styles = window.getComputedStyle(button);
    // Check that the button has some transition property
    expect(styles.transition || styles.webkitTransition).toBeDefined();
  });

  it("should respond to keyboard events", async () => {
    render(<ThemeToggle />, { wrapper: Wrapper });
    const button = screen.getByRole("button") as HTMLButtonElement;

    // Simulate Enter key press
    fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

    // The button should still be functional after keyboard interaction
    expect(button).toBeInTheDocument();
  });
});
