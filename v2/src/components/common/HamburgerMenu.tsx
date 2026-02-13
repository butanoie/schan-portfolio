"use client";

import { useState } from "react";
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme, Divider, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_COLORS, NAV_COLORS } from "../../constants";
import { useI18n } from "@/src/hooks/useI18n";
import { useAnimations } from "@/src/hooks/useAnimations";
import { ThemeSwitcher } from "../settings/ThemeSwitcher";
import { LanguageSwitcher } from "../settings/LanguageSwitcher";
import { AnimationsSwitcher } from "../settings/AnimationsSwitcher";

/**
 * Navigation link configuration for the hamburger menu.
 */
interface NavLink {
  /** Translation key for the link label */
  labelKey: string;
  /** URL path for the link */
  href: string;
  /** Icon component to display */
  icon: React.ReactNode;
}

/**
 * Hamburger menu component for mobile navigation.
 *
 * Displays a menu icon button on mobile devices (< 600px) that opens
 * a drawer containing the main navigation links and settings controls.
 * The drawer slides in from the right side and closes after navigation
 * or when clicking outside.
 *
 * Features:
 * - Only visible on mobile devices (< 600px)
 * - MUI Drawer component sliding from right
 * - Contains Portfolio, Résumé, and Colophon navigation links
 * - Contains settings controls: Theme, Language, and Animations switchers
 * - Active page indication with maroon background
 * - Drawer closes after navigation
 * - Respects animations setting from AnimationsContext
 * - Full keyboard navigation and ARIA support
 *
 * @returns A hamburger menu icon button and drawer for mobile navigation
 *
 * @example
 * ```tsx
 * <HamburgerMenu />
 * ```
 */
export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const { t } = useI18n();
  const { animationsEnabled } = useAnimations();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Navigation links for the hamburger menu.
   */
  const navItems: NavLink[] = [
    { labelKey: "nav.portfolio", href: "/", icon: <HomeIcon /> },
    { labelKey: "nav.resume", href: "/resume", icon: <DescriptionIcon /> },
    { labelKey: "nav.colophon", href: "/colophon", icon: <InfoIcon /> },
  ];

  /**
   * Check if a link is the current active page.
   *
   * @param href - The link path to check
   * @returns True if the link matches the current pathname
   */
  const isActive = (href: string): boolean => {
    if (!pathname) {
      return false;
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  /**
   * Opens the navigation drawer.
   */
  const handleOpen = () => {
    setOpen(true);
  };

  /**
   * Closes the navigation drawer.
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Handles navigation link click.
   * Closes the drawer after navigation.
   */
  const handleNavigate = () => {
    setOpen(false);
  };

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Hamburger Menu Icon Button */}
      <IconButton
        onClick={handleOpen}
        aria-label={t("nav.menu.hamburger")}
        aria-expanded={open}
        size="medium"
        sx={{
          color: BRAND_COLORS.maroon,
          minWidth: 44,
          minHeight: 44,
          "&:hover": {
            backgroundColor: "rgba(139, 21, 56, 0.08)",
          },
        }}
      >
        <MenuIcon fontSize="medium" />
      </IconButton>

      {/* Navigation Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        transitionDuration={animationsEnabled ? undefined : 0}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
          "& .MuiBackdrop-root": {
            transition: animationsEnabled ? undefined : "none !important",
          },
        }}
      >
        {/* Drawer Header with Close Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 1,
          }}
        >
          <IconButton
            onClick={handleClose}
            aria-label={t("nav.menu.close")}
            size="medium"
            sx={{
              color: BRAND_COLORS.maroon,
              "&:hover": {
                backgroundColor: "rgba(139, 21, 56, 0.08)",
              },
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>

        {/* Navigation List */}
        <Box
          component="nav"
          role="navigation"
          aria-label="Mobile navigation menu"
          sx={{ px: 2 }}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleNavigate}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  sx={{
                    backgroundColor: isActive(item.href)
                      ? NAV_COLORS.active
                      : BRAND_COLORS.sage,
                    color: NAV_COLORS.text,
                    borderRadius: 1,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: isActive(item.href)
                        ? NAV_COLORS.activeHover
                        : NAV_COLORS.inactiveHover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: NAV_COLORS.text,
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.labelKey)}
                    primaryTypographyProps={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Divider */}
        <Divider sx={{ mx: 2, my: 2 }} />

        {/* Settings Section */}
        <Box sx={{ px: 2, pb: 2 }}>
          {/* Settings Header */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {t("settings.title")}
          </Typography>

          {/* Theme Switcher */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                opacity: 0.7,
              }}
            >
              {t("settings.theme")}
            </Typography>
            <ThemeSwitcher />
          </Box>

          {/* Language Switcher */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                opacity: 0.7,
              }}
            >
              {t("settings.language")}
            </Typography>
            <LanguageSwitcher />
          </Box>

          {/* Animations Switcher */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                opacity: 0.7,
              }}
            >
              {t("settings.animations")}
            </Typography>
            <AnimationsSwitcher />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
