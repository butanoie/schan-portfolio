/**
 * Tests for navigation utility functions.
 *
 * Verifies:
 * - getNavLinks returns correct navigation configuration
 * - isActivePath handles exact match for root and prefix match for other paths
 * - getNavButtonSx returns correct active/inactive styles
 */

import { describe, it, expect } from "vitest";
import { getNavLinks, isActivePath, getNavButtonSx } from "@/src/utils/navigation";
import { NAV_COLORS, BRAND_COLORS } from "@/src/constants";

describe("getNavLinks", () => {
  it("should return three navigation links", () => {
    const links = getNavLinks();
    expect(links).toHaveLength(3);
  });

  it("should include portfolio, resume, and colophon links", () => {
    const links = getNavLinks();
    const hrefs = links.map((link) => link.href);
    expect(hrefs).toEqual(["/", "/resume", "/colophon"]);
  });

  it("should have translation keys for all labels", () => {
    const links = getNavLinks();
    for (const link of links) {
      expect(link.labelKey).toMatch(/^nav\./);
    }
  });

  it("should include icons for all links", () => {
    const links = getNavLinks();
    for (const link of links) {
      expect(link.icon).toBeDefined();
    }
  });
});

describe("isActivePath", () => {
  it("should return true for exact root match", () => {
    expect(isActivePath("/", "/")).toBe(true);
  });

  it("should return false for non-root path against root href", () => {
    expect(isActivePath("/resume", "/")).toBe(false);
  });

  it("should return true for exact non-root match", () => {
    expect(isActivePath("/resume", "/resume")).toBe(true);
  });

  it("should return true for nested route matching parent href", () => {
    expect(isActivePath("/resume/print", "/resume")).toBe(true);
  });

  it("should return false for non-matching paths", () => {
    expect(isActivePath("/colophon", "/resume")).toBe(false);
  });

  it("should return false when pathname is null", () => {
    expect(isActivePath(null, "/")).toBe(false);
  });

  it("should return false when pathname is null for non-root href", () => {
    expect(isActivePath(null, "/resume")).toBe(false);
  });
});

describe("getNavButtonSx", () => {
  it("should return active background when isActive is true", () => {
    const sx = getNavButtonSx(true) as Record<string, unknown>;
    expect(sx.backgroundColor).toBe(NAV_COLORS.active);
  });

  it("should return sage background when isActive is false", () => {
    const sx = getNavButtonSx(false) as Record<string, unknown>;
    expect(sx.backgroundColor).toBe(BRAND_COLORS.sage);
  });

  it("should return active hover style when active", () => {
    const sx = getNavButtonSx(true) as Record<string, Record<string, unknown>>;
    expect(sx["&:hover"].backgroundColor).toBe(NAV_COLORS.activeHover);
  });

  it("should return inactive hover style when not active", () => {
    const sx = getNavButtonSx(false) as Record<string, Record<string, unknown>>;
    expect(sx["&:hover"].backgroundColor).toBe(NAV_COLORS.inactiveHover);
  });

  it("should include consistent text color regardless of active state", () => {
    const activeSx = getNavButtonSx(true) as Record<string, unknown>;
    const inactiveSx = getNavButtonSx(false) as Record<string, unknown>;
    expect(activeSx.color).toBe(NAV_COLORS.text);
    expect(inactiveSx.color).toBe(NAV_COLORS.text);
  });
});
