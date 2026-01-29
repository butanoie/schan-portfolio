"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_COLORS, NAV_COLORS } from "../constants";

/**
 * Navigation link configuration for the header.
 */
interface NavLink {
  /** Display label for the link */
  label: string;
  /** URL path for the link */
  href: string;
  /** Icon component to display */
  icon: React.ReactNode;
}

/**
 * Header component with site branding and main navigation.
 * Displays the site name and navigation buttons with active page indication.
 * Navigation buttons are styled consistently with the Footer component.
 *
 * @returns An app bar with site branding and accessible navigation menu
 */
export default function Header() {
  const pathname = usePathname();

  /**
   * Navigation links for the header.
   */
  const navItems: NavLink[] = [
    { label: "Portfolio", href: "/", icon: <HomeIcon /> },
    { label: "Résumé", href: "/resume", icon: <DescriptionIcon /> },
    { label: "Colophon", href: "/colophon", icon: <InfoIcon /> },
  ];

  /**
   * Check if a link is the current active page.
   *
   * @param href - The link path to check
   * @returns True if the link matches the current pathname
   */
  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Oswald" }}
        >
          Sing Chan
        </Typography>
        <Box
          component="nav"
          aria-label="Main navigation"
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              variant="contained"
              startIcon={item.icon}
              size="medium"
              aria-current={isActive(item.href) ? "page" : undefined}
              sx={{
                backgroundColor: isActive(item.href)
                  ? NAV_COLORS.active
                  : BRAND_COLORS.sage,
                color: NAV_COLORS.text,
                fontFamily: '"Open Sans", sans-serif',
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1,
                boxShadow: 0,
                px: 2,
                py: 0.75,
                "&:hover": {
                  backgroundColor: isActive(item.href)
                    ? NAV_COLORS.activeHover
                    : NAV_COLORS.inactiveHover,
                  boxShadow: 0,
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
