/**
 * Tests for the useTheme hook.
 *
 * Verifies:
 * - Hook returns correct theme mode
 * - setTheme updates theme mode
 * - isMounted flag for SSR safety
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "@/src/hooks/useTheme";
import { ThemeContextProvider } from "@/src/contexts/ThemeContext";

/**
 * Wrapper component to provide ThemeContext for hook testing.
 *
 * @param props - Component props
 * @param props.children - Child elements to render within the context
 * @returns The children wrapped with ThemeContextProvider
 */
function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}

describe("useTheme hook", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset all mocks
    vi.clearAllMocks();
  });

  it("should return initial theme mode", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBeDefined();
    expect(["light", "dark", "highContrast"]).toContain(result.current.theme);
  });

  it("should have setTheme function", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(typeof result.current.setTheme).toBe("function");
  });

  it("should update theme when setTheme is called", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.setTheme("dark");
    });

    // After setting theme, it should be dark
    expect(result.current.theme).toBe("dark");
  });

  it("should have isMounted flag", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(typeof result.current.isMounted).toBe("boolean");
  });

  it("should throw error when used outside ThemeContextProvider", () => {
    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useThemeContext must be used within a ThemeContextProvider");

    consoleSpy.mockRestore();
  });

  it("should persist theme to localStorage", async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      result.current.setTheme("dark");
    });

    // Check that theme is saved to localStorage
    const saved = localStorage.getItem("portfolio-theme-mode");
    expect(saved).toBe("dark");
  });

  it("should load saved theme from localStorage on mount", () => {
    localStorage.setItem("portfolio-theme-mode", "highContrast");

    const { result } = renderHook(() => useTheme(), { wrapper });

    // The hook should load the saved theme
    // Note: This may take a moment due to React's effect hook
    expect(result.current.theme).toBe("highContrast");
  });
});
