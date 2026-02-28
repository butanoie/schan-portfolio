"use client";

import { useState } from "react";
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme, Divider, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_COLORS, NAV_COLORS } from "../../constants";
import { useI18n } from "@/src/hooks/useI18n";
import { useAnimations } from "@/src/hooks/useAnimations";
import { ThemeSwitcher } from "../settings/ThemeSwitcher";
import { LanguageSwitcher } from "../settings/LanguageSwitcher";
import { AnimationsSwitcher } from "../settings/AnimationsSwitcher";
import { getNavLinks, isActivePath } from "../../utils/navigation";

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

  const navItems = getNavLinks();

  /**
   * Closes the navigation drawer.
   * Also used as the click handler for navigation links (closes drawer after navigation).
   */
  const handleClose = () => {
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
        onClick={() => setOpen(true)}
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
          aria-label={t('nav.mobileNavigation')}
          sx={{ px: 2 }}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleClose}
                  aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                  sx={{
                    backgroundColor: isActivePath(pathname, item.href)
                      ? NAV_COLORS.active
                      : BRAND_COLORS.sage,
                    color: NAV_COLORS.text,
                    borderRadius: 1,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: isActivePath(pathname, item.href)
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
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: '"Open Sans", sans-serif',
                          fontWeight: 600,
                        },
                      },
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

          {[
            { labelKey: "settings.theme", component: <ThemeSwitcher /> },
            { labelKey: "settings.language", component: <LanguageSwitcher /> },
            { labelKey: "settings.animations", component: <AnimationsSwitcher /> },
          ].map((item, index, arr) => (
            <Box key={item.labelKey} sx={index < arr.length - 1 ? { mb: 2 } : undefined}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontSize: "0.875rem",
                  opacity: 0.7,
                }}
              >
                {t(item.labelKey)}
              </Typography>
              {item.component}
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
