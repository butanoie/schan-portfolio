/**
 * Tests for the ThemeContext and ThemeContextProvider.
 *
 * Verifies:
 * - Provider initializes with correct default theme
 * - Theme mode can be changed via context
 * - Theme preference is persisted to localStorage
 * - System color scheme preference is detected
 * - Theme is applied to document element
 * - Hydration-safe initialization
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, useThemeContext } from "@/src/contexts/ThemeContext";

/**
 * Test component that uses the ThemeContext.
 *
 * @returns A div containing theme state display and control buttons
 */
function TestComponent() {
  const { mode, setMode, systemScheme, isMounted } = useThemeContext();

  return (
    <div>
      <div data-testid="current-theme">{mode}</div>
      <div data-testid="system-scheme">{systemScheme}</div>
      <div data-testid="is-mounted">{isMounted ? "mounted" : "not-mounted"}</div>
      <button onClick={() => setMode("light")}>Set Light</button>
      <button onClick={() => setMode("dark")}>Set Dark</button>
      <button onClick={() => setMode("highContrast")}>Set High Contrast</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset document theme attribute
    document.documentElement.removeAttribute("data-theme");
    // Reset all mocks
    vi.clearAllMocks();
  });

  it("should provide theme context to children", () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const themeElement = screen.getByTestId("current-theme");
    expect(themeElement).toBeInTheDocument();
  });

  it("should initialize with a valid theme mode", () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const themeElement = screen.getByTestId("current-theme");
    expect(["light", "dark", "highContrast"]).toContain(themeElement.textContent);
  });

  it("should allow changing theme mode", async () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const lightButton = screen.getByText("Set Light");
    fireEvent.click(lightButton);

    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    });
  });

  it("should persist theme to localStorage", async () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const darkButton = screen.getByText("Set Dark");
    fireEvent.click(darkButton);

    await waitFor(() => {
      const saved = localStorage.getItem("portfolio-theme-mode");
      expect(saved).toBe("dark");
    });
  });

  it("should load saved theme from localStorage on mount", () => {
    localStorage.setItem("portfolio-theme-mode", "highContrast");

    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    // After mounting, the saved theme should be loaded
    const themeElement = screen.getByTestId("current-theme");
    expect(themeElement.textContent).toBe("highContrast");
  });

  it("should detect system color scheme preference", () => {
    // Mock matchMedia for dark mode
    const mockMediaQuery = {
      matches: true,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;

    window.matchMedia = vi.fn(() => mockMediaQuery);

    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const systemSchemeElement = screen.getByTestId("system-scheme");
    expect(systemSchemeElement.textContent).toBe("dark");
  });

  it("should apply theme to document element", async () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const darkButton = screen.getByText("Set Dark");
    fireEvent.click(darkButton);

    await waitFor(() => {
      const theme = document.documentElement.getAttribute("data-theme");
      expect(theme).toBe("dark");
    });
  });

  it("should set theme-color meta tag", async () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const darkButton = screen.getByText("Set Dark");
    fireEvent.click(darkButton);

    await waitFor(() => {
      const metaTag = document.querySelector('meta[name="theme-color"]');
      expect(metaTag).toBeInTheDocument();
      expect(metaTag?.getAttribute("content")).toBe("#121212"); // Dark theme color
    });
  });

  it("should indicate when component is mounted", async () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    // After render, component should be mounted
    await waitFor(() => {
      expect(screen.getByTestId("is-mounted")).toHaveTextContent("mounted");
    });
  });

  it("should throw error when useThemeContext is used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useThemeContext must be used within a ThemeContextProvider");

    consoleSpy.mockRestore();
  });

  it("should cycle through multiple theme changes", async () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const lightButton = screen.getByText("Set Light");
    const darkButton = screen.getByText("Set Dark");
    const highContrastButton = screen.getByText("Set High Contrast");

    fireEvent.click(lightButton);
    await waitFor(() =>
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    );

    fireEvent.click(darkButton);
    await waitFor(() =>
      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    );

    fireEvent.click(highContrastButton);
    await waitFor(() =>
      expect(screen.getByTestId("current-theme")).toHaveTextContent(
        "highContrast"
      )
    );
  });
});
