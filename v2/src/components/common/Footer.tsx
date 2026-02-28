"use client";

import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND_COLORS, UI_COLORS } from "../../constants";
import { useProjectLoading, type ProjectLoadingContextValue } from "../../contexts/ProjectLoadingContext";
import { LoadMoreButton } from "../project/LoadMoreButton";
import { NavButtons } from "./NavButtons";
import { useI18n } from "@/src/hooks/useI18n";

/**
 * Props for the ThoughtBubble component.
 */
interface ThoughtBubbleProps {
  /** Content to display inside the bubble */
  children: React.ReactNode;
  /** Accessibility label for the bubble */
  ariaLabel: string;
}

/** Current year, computed once at module load to avoid hydration mismatch */
const CURRENT_YEAR = new Date().getFullYear();

/** Shared typography styling for thought bubble text in Gochi Hand cursive font */
const THOUGHT_BUBBLE_TEXT_SX = {
  fontFamily: '"Gochi Hand", cursive',
  fontSize: "1rem",
  color: UI_COLORS.secondaryText,
  "@media (min-width: 760px)": {
    fontSize: "1.125rem",
  },
} as const;

/**
 * A reusable thought bubble component positioned above the Buta mascot.
 * Provides consistent styling and positioning for all bubble variations.
 *
 * @param props - Component props
 * @param props.children - Content to display inside the bubble
 * @param props.ariaLabel - Accessibility label for the bubble
 * @returns A styled thought bubble container
 */
function ThoughtBubble({ children, ariaLabel}: ThoughtBubbleProps) {
  return (
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
        "@media (max-width: 599px)": {
          bottom: 185,
        },
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
      aria-label={ariaLabel}
    >
      {children}
    </Box>
  );
}

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
  const { t } = useI18n();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            "@media (max-width: 599px)": {
              bottom: 45,
            },
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
        <FooterThoughtBubble
          pathname={pathname}
          loadingContext={loadingContext}
          t={t}
        />
      </Container>

      {/* Footer Container with Sage Green Background */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: BRAND_COLORS.sage,
          pt: 2,
          pb: 0,
          pl: { xs: 2, sm:3, md: 4, lg: 10 },
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
            {/* Navigation Links - Hidden on mobile */}
            {!isMobile && (
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
                <NavButtons />
              </Box>
            )}

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
              {t('footer.copyright', { year: CURRENT_YEAR })}
              <br />
              {t('footer.trademarks')}
            </Typography>
          </Box>
        </Container>
      </Container>
    </Box>
  );
}

/**
 * Props for the FooterThoughtBubble component.
 */
interface FooterThoughtBubbleProps {
  /** Current URL pathname */
  pathname: string;
  /** Project loading context value (undefined when not on home page or not in provider) */
  loadingContext: ProjectLoadingContextValue | undefined;
  /** Translation function from useI18n */
  t: (key: string, options?: Record<string, unknown>) => string;
}

/**
 * Renders the appropriate thought bubble content based on the current page and loading state.
 *
 * On non-home pages, displays the default thought bubble.
 * On the home page with loading context:
 * - Shows Load More button when more projects are available
 * - Shows completion message when all projects are loaded
 * - Shows nothing during initial loading (no thought bubble)
 *
 * @param props - Component props
 * @param props.pathname - Current URL pathname
 * @param props.loadingContext - Project loading context value
 * @param props.t - Translation function
 * @returns The appropriate thought bubble, or null if none should be shown
 */
function FooterThoughtBubble({ pathname, loadingContext, t }: FooterThoughtBubbleProps): React.ReactNode {
  // Non-home pages: default thought bubble
  if (pathname !== '/') {
    return (
      <ThoughtBubble ariaLabel={`Buta's thought bubble saying: ${t('footer.butaThought')}`}>
        <Typography sx={THOUGHT_BUBBLE_TEXT_SX}>
          {t('footer.butaThought')}
        </Typography>
      </ThoughtBubble>
    );
  }

  // Home page without loading context: no bubble
  if (!loadingContext?.isHomePage) {
    return null;
  }

  // Home page: Load More button
  if (loadingContext.hasMore) {
    return (
      <ThoughtBubble ariaLabel="Load more projects button">
        <LoadMoreButton
          onClick={loadingContext.onLoadMore}
          loading={loadingContext.loading}
          disabled={false}
          remainingCount={loadingContext.remainingCount}
        />
      </ThoughtBubble>
    );
  }

  // Home page: All projects loaded
  if (loadingContext.allLoaded) {
    return (
      <ThoughtBubble ariaLabel={t('footer.allProjectsLoaded')}>
        <Typography sx={{ ...THOUGHT_BUBBLE_TEXT_SX, margin: 0, color: BRAND_COLORS.maroon }}>
          {t('footer.allProjectsLoaded')}
        </Typography>
        <Typography sx={THOUGHT_BUBBLE_TEXT_SX}>
          {t('footer.thankYou')}
        </Typography>
      </ThoughtBubble>
    );
  }

  return null;
}
