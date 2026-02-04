"use client";

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_COLORS, NAV_COLORS } from "../../constants";
import { SettingsButton } from "../settings/SettingsButton";
import { useTheme } from "@/src/hooks/useTheme";
import { getPaletteByMode } from "@/src/lib/themes";

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
 * Header component with site branding, social links, and main navigation.
 *
 * Features:
 * - Site name in Oswald font
 * - LinkedIn and GitHub icon links next to the name
 * - Main navigation buttons (Portfolio, Résumé, Colophon) with active page indication
 * - Icons change color on hover for visual feedback
 * - Navigation buttons styled consistently with the Footer component
 *
 * @returns An app bar with site branding, social icons, and accessible navigation menu
 */
export default function Header() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const palette = getPaletteByMode(theme);

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
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            my: 3,
            px: { xs: 3, lg: 6 },
            alignItems: { xs: "center", md: "center" },
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box sx={{
              flexGrow: { xs: 0, md: 1 },
              display: "flex",
              alignItems: "bottom",
              gap: 1
            }}>
            <Typography variant="h6" component="div" sx={{ fontFamily: "Oswald" }}>
              Sing Chan
            </Typography>
            <Box sx={{ display: "flex", gap: 0.25, alignItems: "baseline" }}>
              <IconButton
                href="https://www.linkedin.com/in/sing-chan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                size="small"
                sx={{
                  color: palette.text.primary,
                  "&:hover": {
                    color: BRAND_COLORS.maroon,
                  },
                }}
              >
                <LinkedInIcon fontSize="medium" />
              </IconButton>
              <IconButton
                href="https://github.com/butanoie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                size="small"
                sx={{
                  color: palette.text.primary,
                  "&:hover": {
                    color: BRAND_COLORS.maroon,
                  },
                }}
              >
                <GitHubIcon fontSize="medium" />
              </IconButton>
            </Box>
          </Box>
          <Box
            component="nav"
            aria-label="Main navigation"
            sx={{
              display: "flex",
              gap: 1,
              alignSelf: { xs: "auto", md: "flex-end" },
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
                  px: 3,
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
            <SettingsButton size="small" />
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
