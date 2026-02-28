"use client";

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container, useMediaQuery } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_COLORS } from "../../constants";
import { SettingsButton } from "../settings/SettingsButton";
import HamburgerMenu from "./HamburgerMenu";
import { useTheme } from "@/src/hooks/useTheme";
import { getPaletteByMode } from "@/src/lib/themes";
import { useI18n } from "@/src/hooks/useI18n";
import { getNavLinks, isActivePath, getNavButtonSx } from "../../utils/navigation";

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
  const { t } = useI18n();
  const palette = getPaletteByMode(theme);
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const navItems = getNavLinks();

  /** Shared styling for social icon buttons (LinkedIn, GitHub) */
  const socialIconSx = {
    color: palette.text.primary,
    minWidth: 44,
    minHeight: 44,
    "&:hover": {
      color: BRAND_COLORS.maroon,
    },
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
            <Typography
              component="div"
              sx={{
                fontFamily: "Oswald",
                fontSize: "1.25rem",
                fontWeight: 600,
                lineHeight: 1.5,
                display: "flex",
                alignItems: "center"
              }}
            >
              {t("header.siteTitle")}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.25, alignItems: "baseline" }}>
              <IconButton
                href="https://www.linkedin.com/in/sing-chan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("nav.social.linkedin")}
                size="medium"
                sx={socialIconSx}
              >
                <LinkedInIcon fontSize="medium" />
              </IconButton>
              <IconButton
                href="https://github.com/butanoie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("nav.social.github")}
                size="medium"
                sx={socialIconSx}
              >
                <GitHubIcon fontSize="medium" />
              </IconButton>
            </Box>
          </Box>
          <Box
            component="nav"
            aria-label={t('nav.mainNavigation')}
            sx={{
              display: "flex",
              gap: 1,
              alignSelf: { xs: "auto", md: "flex-end" },
            }}
          >
            {/* Show hamburger on mobile, full nav + settings on desktop */}
            {isMobile ? (
              <HamburgerMenu />
            ) : (
              <>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    variant="contained"
                    startIcon={item.icon}
                    size="medium"
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                    sx={getNavButtonSx(isActivePath(pathname, item.href))}
                  >
                    {t(item.labelKey)}
                  </Button>
                ))}
                <SettingsButton size="medium" />
              </>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
