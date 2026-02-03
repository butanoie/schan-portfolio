"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_COLORS, UI_COLORS, NAV_COLORS } from "../../constants";
import { useProjectLoading } from "../../contexts/ProjectLoadingContext";
import { LoadMoreButton } from "../project/LoadMoreButton";

/**
 * Navigation link configuration for the footer.
 */
interface NavLink {
  /** Display label for the link */
  label: string;
  /** URL path for the link */
  href: string;
  /** Icon component to display */
  icon: React.ReactNode;
}


/** Current year, computed once at module load to avoid hydration mismatch */
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer component displaying navigation, Buta mascot, and copyright.
 * Styled to match the V1 portfolio footer with:
 * - Sage green background
 * - Navigation buttons (Portfolio, Résumé, Colophon)
 * - Buta mascot with thought bubble positioned on the right
 * - Copyright notice
 *
 * **Conditional Rendering:**
 * On the home page, the thought bubble is replaced with a Load More button
 * when projects are still loading. The button allows users to load the next
 * batch of projects. When all projects are loaded, the thought bubble returns
 * with a completion message ("All projects loaded").
 *
 * **Home Page States:**
 * 1. Loading: Shows normal thought bubble while loading
 * 2. Has More: Shows Load More button styled as thought bubble
 * 3. All Loaded: Shows completion thought bubble ("All projects loaded")
 *
 * @returns A footer section with navigation, mascot, and copyright
 */
export default function Footer() {
  const pathname = usePathname();
  const loadingContext = useProjectLoading();

  /**
   * Navigation links for the footer.
   */
  const navLinks: NavLink[] = [
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
    <Box
      component="footer"
      sx={{
        position: "relative",
        pt: 30,
        overflow: "hidden",
        "@media (min-width: 760px)": {
          pt: 25,
        },
      }}
    >
      {/* Positioning container for Buta - aligned to centered column */}
      <Container
        maxWidth="lg"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      >
        {/* Buta Mascot - positioned relative to centered column */}
        <Box
          sx={{
            position: "absolute",
            bottom: 90,
            right: 16,
            width: 180,
            height: 125,
            margin: 0,
            zIndex: 0,
            pointerEvents: "auto",
            "@media (min-width: 760px)": {
              bottom: -56,
              right: 16,
              width: 300,
              height: 209,
              zIndex: 5,
            },
          }}
        >
          <Image
            src="/images/buta/buta@2x.png"
            alt="Buta, a pig mascot wearing a business suit"
            width={300}
            height={209}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Thought Bubble or Load More Button - positioned above Buta */}
        {loadingContext && loadingContext.isHomePage && loadingContext.hasMore ? (
          /* Load More Button inside thought bubble */
          <Box
            sx={{
              position: "absolute",
              bottom: 230,
              right: 145,
              width: 180,
              height: 90,
              padding: "15px 16px",
              border: `2px solid ${UI_COLORS.border}`,
              textAlign: "center",
              color: UI_COLORS.secondaryText,
              backgroundColor: UI_COLORS.cardBackground,
              borderRadius: "160px / 80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              pointerEvents: "auto",
              fontFamily: '\"Gochi Hand\", cursive',
              fontSize: "1rem",
              "@media (min-width: 760px)": {
                bottom: 165,
                right: 225,
                width: 250,
                height: 125,
                padding: "25px 20px",
                fontSize: "1.125rem",
              },
              // Small thought bubble circles
              "&::before": {
                content: '\"\"',
                position: "absolute",
                zIndex: 10,
                bottom: -25,
                right: 30,
                width: 17,
                height: 17,
                border: `2px solid ${UI_COLORS.border}`,
                backgroundColor: UI_COLORS.cardBackground,
                borderRadius: "50%",
                display: "block",
                "@media (min-width: 760px)": {
                  right: 52,
                },
              },
              "&::after": {
                content: '\"\"',
                position: "absolute",
                zIndex: 10,
                bottom: -35,
                right: 20,
                width: 8,
                height: 8,
                border: `2px solid ${UI_COLORS.border}`,
                backgroundColor: UI_COLORS.cardBackground,
                borderRadius: "50%",
                display: "block",
                "@media (min-width: 760px)": {
                  right: 35,
                },
              },
            }}
          >
            <LoadMoreButton
              onClick={loadingContext.onLoadMore}
              loading={loadingContext.loading}
              disabled={false}
              remainingCount={loadingContext.remainingCount}
            />
          </Box>
        ) : loadingContext &&
          loadingContext.isHomePage &&
          loadingContext.allLoaded ? (
          /* Completion Thought Bubble (all projects loaded) */
          <Box
            sx={{
              position: "absolute",
              bottom: 230,
              right: 145,
              width: 180,
              height: 90,
              padding: "15px 16px",
              border: `2px solid ${UI_COLORS.border}`,
              textAlign: "center",
              color: UI_COLORS.secondaryText,
              backgroundColor: UI_COLORS.cardBackground,
              borderRadius: "160px / 80px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              pointerEvents: "auto",
              "@media (min-width: 760px)": {
                bottom: 165,
                right: 225,
                width: 250,
                height: 125,
                padding: "25px 20px",
              },
              // Small thought bubble circles
              "&::before": {
                content: '""',
                position: "absolute",
                zIndex: 10,
                bottom: -25,
                right: 30,
                width: 17,
                height: 17,
                border: `2px solid ${UI_COLORS.border}`,
                backgroundColor: UI_COLORS.cardBackground,
                borderRadius: "50%",
                display: "block",
                "@media (min-width: 760px)": {
                  right: 52,
                },
              },
              "&::after": {
                content: '""',
                position: "absolute",
                zIndex: 10,
                bottom: -35,
                right: 20,
                width: 8,
                height: 8,
                border: `2px solid ${UI_COLORS.border}`,
                backgroundColor: UI_COLORS.cardBackground,
                borderRadius: "50%",
                display: "block",
                "@media (min-width: 760px)": {
                  right: 35,
                },
              },
            }}
            role="img"
            aria-label="All projects loaded!"
          >
            <Typography sx={{
                fontFamily: '"Gochi Hand", cursive',
                margin: 0,
                color: BRAND_COLORS.maroon,
                "@media (min-width: 760px)": {
                  fontSize: "1.125rem",
                },
              }}>All projects loaded!</Typography>
            <Typography
              sx={{
                fontFamily: '"Gochi Hand", cursive',
                fontSize: "1rem",
                color: UI_COLORS.secondaryText,
                "@media (min-width: 760px)": {
                  fontSize: "1.125rem",
                },
              }}
            >Thanks for coming by!</Typography>
          </Box>
        ) : (
          /* Normal Thought Bubble (not home page or still loading) */
          <Box
            sx={{
              position: "absolute",
              bottom: 230,
              right: 145,
              width: 180,
              height: 90,
              padding: "15px 16px",
              border: `2px solid ${UI_COLORS.border}`,
              textAlign: "center",
              color: UI_COLORS.secondaryText,
              backgroundColor: UI_COLORS.cardBackground,
              borderRadius: "160px / 80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              pointerEvents: "auto",
              "@media (min-width: 760px)": {
                bottom: 165,
                right: 225,
                width: 250,
                height: 125,
                padding: "25px 20px",
              },
              // Small thought bubble circles
              "&::before": {
                content: '""',
                position: "absolute",
                zIndex: 10,
                bottom: -25,
                right: 30,
                width: 17,
                height: 17,
                border: `2px solid ${UI_COLORS.border}`,
                backgroundColor: UI_COLORS.cardBackground,
                borderRadius: "50%",
                display: "block",
                "@media (min-width: 760px)": {
                  right: 52,
                },
              },
              "&::after": {
                content: '""',
                position: "absolute",
                zIndex: 10,
                bottom: -35,
                right: 20,
                width: 8,
                height: 8,
                border: `2px solid ${UI_COLORS.border}`,
                backgroundColor: UI_COLORS.cardBackground,
                borderRadius: "50%",
                display: "block",
                "@media (min-width: 760px)": {
                  right: 35,
                },
              },
            }}
            role="img"
            aria-label="Buta's thought bubble saying: Pork products FTW!"
          >
            <Typography
              sx={{
                fontFamily: '"Gochi Hand", cursive',
                fontSize: "1rem",
                color: UI_COLORS.secondaryText,
                "@media (min-width: 760px)": {
                  fontSize: "1.125rem",
                },
              }}
            >
              Pork products FTW!
            </Typography>
          </Box>
        )}
      </Container>

      {/* Footer Container with Sage Green Background */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: BRAND_COLORS.sage,
          pt: 2,
          pb: 0,
          pl: { xs: 2, sm:3, md: 4 },
          pr: { xs: 3, md: 5 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Navigation Links */}
            <Box
              component="nav"
              aria-label="Footer navigation"
              sx={{
                display: "flex",
                gap: 1,
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="contained"
                  startIcon={link.icon}
                  size="medium"
                  sx={{
                    backgroundColor: isActive(link.href)
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
                      backgroundColor: isActive(link.href)
                        ? NAV_COLORS.activeHover
                        : NAV_COLORS.inactiveHover,
                      boxShadow: 0,
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Copyright */}
            <Typography
              variant="body2"
              sx={{
                color: UI_COLORS.copyrightText,
                fontSize: "0.8125rem",
                lineHeight: 1.4,
                py: 1.25,
              }}
            >
              2013-{CURRENT_YEAR} Sing Chan
              <br />
              All trademarks are the property of their respective owners.
            </Typography>
          </Box>
        </Container>
      </Container>
    </Box>
  );
}
