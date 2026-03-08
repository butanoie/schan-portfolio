/**
 * Tests for the usePalette hook.
 *
 * Verifies:
 * - Hook returns palette and mode from ThemeContext
 * - hydrationSafe option falls back to light palette when not mounted
 * - Default behavior returns the actual theme mode palette
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePalette } from "@/src/hooks/usePalette";
import { getPaletteByMode } from "@/src/lib/themes";
import type { ThemeMode } from "@/src/types/theme";

/** Mock return values for useThemeContext */
const mockThemeContext = {
  mode: "dark" as ThemeMode,
  isMounted: true,
  setMode: vi.fn(),
};

vi.mock("@/src/contexts/ThemeContext", () => ({
  /**
   * Returns mock theme context for controlling mode and mount state.
   *
   * @returns Mock context with mode, isMounted, and setMode
   */
  useThemeContext: () => mockThemeContext,
}));

describe("usePalette", () => {
  beforeEach(() => {
    mockThemeContext.mode = "dark";
    mockThemeContext.isMounted = true;
  });

  it("should return palette for the current mode", () => {
    const { result } = renderHook(() => usePalette());
    const expectedPalette = getPaletteByMode("dark");
    expect(result.current.palette).toEqual(expectedPalette);
  });

  it("should return the current mode", () => {
    const { result } = renderHook(() => usePalette());
    expect(result.current.mode).toBe("dark");
  });

  it("should return light palette when hydrationSafe and not mounted", () => {
    mockThemeContext.isMounted = false;
    const { result } = renderHook(() =>
      usePalette({ hydrationSafe: true })
    );
    const lightPalette = getPaletteByMode("light");
    expect(result.current.palette).toEqual(lightPalette);
    expect(result.current.mode).toBe("light");
  });

  it("should return actual mode when hydrationSafe and mounted", () => {
    mockThemeContext.isMounted = true;
    const { result } = renderHook(() =>
      usePalette({ hydrationSafe: true })
    );
    expect(result.current.mode).toBe("dark");
  });

  it("should return actual mode when not hydrationSafe and not mounted", () => {
    mockThemeContext.isMounted = false;
    const { result } = renderHook(() => usePalette());
    expect(result.current.mode).toBe("dark");
  });

  it("should work with light mode", () => {
    mockThemeContext.mode = "light";
    const { result } = renderHook(() => usePalette());
    const lightPalette = getPaletteByMode("light");
    expect(result.current.palette).toEqual(lightPalette);
    expect(result.current.mode).toBe("light");
  });

  it("should work with highContrast mode", () => {
    mockThemeContext.mode = "highContrast";
    const { result } = renderHook(() => usePalette());
    const hcPalette = getPaletteByMode("highContrast");
    expect(result.current.palette).toEqual(hcPalette);
    expect(result.current.mode).toBe("highContrast");
  });
});
