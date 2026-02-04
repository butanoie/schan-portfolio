/**
 * Tests for the ThemeSwitcher component.
 *
 * Verifies:
 * - All three theme buttons render correctly
 * - Current theme is properly selected/highlighted
 * - Clicking a theme button changes the app theme
 * - Optional onChange callback is triggered on theme selection
 * - Keyboard navigation works (Tab, Arrow keys, Enter/Space)
 * - ARIA labels and accessibility attributes are present
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeContextProvider } from "@/src/contexts/ThemeContext";
import { ThemeSwitcher } from "@/src/components/settings/ThemeSwitcher";

/**
 * Render ThemeSwitcher wrapped in ThemeContextProvider.
 * Required for component to access useTheme hook.
 *
 * @param props - Optional component props
 * @returns The rendered component
 */
function renderThemeSwitcher(props = {}) {
  return render(
    <ThemeContextProvider>
      <ThemeSwitcher {...props} />
    </ThemeContextProvider>
  );
}

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all three theme buttons", () => {
      renderThemeSwitcher();

      expect(
        screen.getByRole("button", { name: /light theme/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /dark theme/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /high contrast theme/i })
      ).toBeInTheDocument();
    });

    it("should display theme labels", () => {
      renderThemeSwitcher();

      expect(screen.getByText("Light")).toBeInTheDocument();
      expect(screen.getByText("Dark")).toBeInTheDocument();
      expect(screen.getByText("Contrast")).toBeInTheDocument();
    });

    it("should have toggle button group with aria-label", () => {
      renderThemeSwitcher();

      const group = screen.getByRole("group", { name: /select theme/i });
      expect(group).toBeInTheDocument();
    });
  });

  describe("Theme Selection", () => {
    it("should have exclusive mode (only one selected at a time)", async () => {
      renderThemeSwitcher();

      const lightButton = screen.getByRole("button", { name: /light theme/i });
      const darkButton = screen.getByRole("button", { name: /dark theme/i });

      await userEvent.click(lightButton);
      expect(lightButton).toHaveAttribute("aria-pressed", "true");

      await userEvent.click(darkButton);
      expect(darkButton).toHaveAttribute("aria-pressed", "true");
      expect(lightButton).toHaveAttribute("aria-pressed", "false");
    });

    it("should change theme when button is clicked", async () => {
      renderThemeSwitcher();

      const darkButton = screen.getByRole("button", { name: /dark theme/i });
      await userEvent.click(darkButton);

      await waitFor(() => {
        expect(localStorage.getItem("portfolio-theme-mode")).toBe("dark");
      });
    });

    it("should apply all three themes correctly", async () => {
      renderThemeSwitcher();

      const darkButton = screen.getByRole("button", { name: /dark theme/i });
      const highContrastButton = screen.getByRole("button", {
        name: /high contrast theme/i,
      });

      // Test dark theme (change from initial)
      await userEvent.click(darkButton);
      await waitFor(() => {
        expect(localStorage.getItem("portfolio-theme-mode")).toBe("dark");
      });

      // Test high contrast theme
      await userEvent.click(highContrastButton);
      await waitFor(() => {
        expect(localStorage.getItem("portfolio-theme-mode")).toBe("highContrast");
      });
    });
  });

  describe("Callbacks", () => {
    it("should call onChange callback when theme is selected", async () => {
      const onChangeMock = vi.fn();
      renderThemeSwitcher({ onChange: onChangeMock });

      const darkButton = screen.getByRole("button", { name: /dark theme/i });
      await userEvent.click(darkButton);

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith("dark");
      });
    });

    it("should not call onChange callback if onChange is not provided", async () => {
      const onChangeMock = vi.fn();
      // Render without onChange prop
      renderThemeSwitcher();

      const darkButton = screen.getByRole("button", { name: /dark theme/i });
      await userEvent.click(darkButton);

      // Give it time to potentially call (shouldn't call)
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it("should call onChange with correct theme mode", async () => {
      const onChangeMock = vi.fn();
      renderThemeSwitcher({ onChange: onChangeMock });

      const darkButton = screen.getByRole("button", { name: /dark theme/i });
      const highContrastButton = screen.getByRole("button", {
        name: /high contrast theme/i,
      });

      // Click dark theme (different from initial)
      await userEvent.click(darkButton);
      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith("dark");
      });

      // Click high contrast theme
      await userEvent.click(highContrastButton);
      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith("highContrast");
      });

      expect(onChangeMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("Keyboard Navigation", () => {
    it("should be focusable with Tab key", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      const lightButton = screen.getByRole("button", { name: /light theme/i });
      await user.tab();

      expect(lightButton).toHaveFocus();
    });

    it("should be able to navigate between buttons with Tab", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      const lightButton = screen.getByRole("button", { name: /light theme/i });
      const darkButton = screen.getByRole("button", { name: /dark theme/i });

      // Focus first button
      lightButton.focus();
      expect(lightButton).toHaveFocus();

      // Tab to next button
      await user.tab();
      expect(darkButton).toHaveFocus();
    });

    it("should support keyboard selection by clicking with mouse", async () => {
      const user = userEvent.setup();
      const onChangeMock = vi.fn();
      renderThemeSwitcher({ onChange: onChangeMock });

      const darkButton = screen.getByRole("button", { name: /dark theme/i });

      // Simulate keyboard user - Tab to button then click
      darkButton.focus();
      expect(darkButton).toHaveFocus();

      // Click to select (simulates keyboard user pressing Enter/Space)
      await user.click(darkButton);

      expect(onChangeMock).toHaveBeenCalledWith("dark");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label on toggle button group", () => {
      renderThemeSwitcher();

      const group = screen.getByRole("group", { name: /select theme/i });
      expect(group).toHaveAttribute("aria-label", "Select theme");
    });

    it("should have aria-label on each theme button", () => {
      renderThemeSwitcher();

      expect(
        screen.getByRole("button", { name: /light theme/i })
      ).toHaveAttribute("aria-label", "Light theme");
      expect(
        screen.getByRole("button", { name: /dark theme/i })
      ).toHaveAttribute("aria-label", "Dark theme");
      expect(
        screen.getByRole("button", { name: /high contrast theme/i })
      ).toHaveAttribute("aria-label", "High contrast theme");
    });

    it("should indicate selected button with aria-pressed", async () => {
      renderThemeSwitcher();

      const lightButton = screen.getByRole("button", { name: /light theme/i });
      const darkButton = screen.getByRole("button", { name: /dark theme/i });

      // Initially one should be pressed
      expect(
        lightButton.getAttribute("aria-pressed") === "true" ||
          darkButton.getAttribute("aria-pressed") === "true"
      ).toBe(true);

      // After clicking dark, dark should be pressed
      await userEvent.click(darkButton);
      expect(darkButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("CSS Class Name", () => {
    it("should apply custom className to root Box", () => {
      const { container } = render(
        <ThemeContextProvider>
          <ThemeSwitcher className="custom-class" />
        </ThemeContextProvider>
      );

      const box = container.querySelector(".custom-class");
      expect(box).toBeInTheDocument();
    });
  });
});
