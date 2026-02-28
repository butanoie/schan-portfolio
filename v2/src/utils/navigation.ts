import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import { createElement } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { NAV_COLORS, BRAND_COLORS } from "../constants";

/**
 * Navigation link configuration used across Header, HamburgerMenu, and Footer.
 */
export interface NavLink {
  /** Translation key for the link label */
  labelKey: string;
  /** URL path for the link */
  href: string;
  /** Icon component to display */
  icon: React.ReactNode;
}

/**
 * Primary navigation links for the portfolio site.
 *
 * Used by Header, HamburgerMenu, and Footer to render consistent navigation.
 * Icons are created via createElement to avoid JSX in a non-component file.
 *
 * @returns Array of navigation link configurations
 */
export function getNavLinks(): NavLink[] {
  return [
    { labelKey: "nav.portfolio", href: "/", icon: createElement(HomeIcon) },
    { labelKey: "nav.resume", href: "/resume", icon: createElement(DescriptionIcon) },
    { labelKey: "nav.colophon", href: "/colophon", icon: createElement(InfoIcon) },
  ];
}

/**
 * Determines if a navigation link matches the current pathname.
 *
 * For the root path ("/"), requires an exact match to avoid false positives.
 * For other paths, uses startsWith to match nested routes (e.g., "/resume/print").
 *
 * @param pathname - The current URL pathname (from usePathname)
 * @param href - The link path to check
 * @returns True if the link matches the current pathname
 *
 * @example
 * isActivePath("/resume", "/resume")     // true
 * isActivePath("/resume/print", "/resume") // true
 * isActivePath("/resume", "/")            // false
 * isActivePath("/", "/")                  // true
 */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

/**
 * Returns the shared MUI sx styling for navigation buttons used in Header and Footer.
 *
 * Produces consistent button appearance with active/inactive states based on
 * whether the link matches the current pathname.
 *
 * @param isActive - Whether the button represents the currently active page
 * @returns SxProps object with background, color, font, and hover styling
 *
 * @example
 * const sx = getNavButtonSx(isActivePath(pathname, link.href));
 * <Button sx={sx}>{label}</Button>
 */
export function getNavButtonSx(isActive: boolean): SxProps<Theme> {
  return {
    backgroundColor: isActive ? NAV_COLORS.active : BRAND_COLORS.sage,
    color: NAV_COLORS.text,
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: 600,
    textTransform: "none",
    borderRadius: 1,
    boxShadow: 0,
    px: 3,
    py: 0.75,
    "&:hover": {
      backgroundColor: isActive
        ? NAV_COLORS.activeHover
        : NAV_COLORS.inactiveHover,
      boxShadow: 0,
    },
  };
}
