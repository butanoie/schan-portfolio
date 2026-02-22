"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import type { ResumeHeaderContent } from "../../types/resume";
import { BRAND_COLORS, NAV_COLORS } from "../../constants";
import { rot13 } from "../../utils/obfuscation";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getPaletteByMode } from "../../lib/themes";

/**
 * Props for the ResumeHeader component.
 */
export interface ResumeHeaderProps {
  /** Resume header content including name, tagline, and contact links */
  content: ResumeHeaderContent;
}

/**
 * Map of icon identifiers to MUI icon components.
 */
const iconMap = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  download: DownloadIcon,
  email: EmailIcon,
  phone: PhoneIcon,
};

/**
 * ResumeHeader displays the resume page header with name, tagline, and contact buttons.
 *
 * Features:
 * - Name in Oswald font with responsive sizing
 * - Professional tagline below name
 * - Contact buttons (LinkedIn, GitHub, Download) with icons on the right
 * - Two-column layout: left side for name/tagline, right side for buttons
 * - Buttons stack vertically on desktop, stack below content on mobile
 *
 * @param props - Component props containing resume header content
 * @param props.content - Header content data (name, tagline, contact links)
 * @returns A section displaying the resume header
 *
 * @example
 * <ResumeHeader content={resumeData.header} />
 */
export default function ResumeHeader({ content }: ResumeHeaderProps) {
  const { name, tagline, contactLinks } = content;
  const { mode, isMounted } = useThemeContext();
  const palette = getPaletteByMode(isMounted ? mode : "light");

  return (
    <Box
      component="section"
      aria-labelledby="resume-name"
      sx={{
        pt: 4,
        pb: { xs: 0, md: 0 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 3, md: 4 },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "flex-end" },
      }}
    >
      {/* Left Section: Name and Tagline */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          pb: 1,
        }}
      >
        {/* Name */}
        <Typography
          id="resume-name"
          variant="h1"
          sx={{
            fontFamily: '"Oswald", sans-serif',
            fontWeight: 700,
            color: palette.text.primary,
            fontSize: { xs: "2rem", md: "2.5rem" },
            mb: 2,
          }}
        >
          {name}
        </Typography>

        {/* Tagline - Split on em dash */}
        {tagline.includes('–') ? (
          <>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                fontWeight: 600,
                color: palette.text.primary,
              }}
            >
              {tagline.split('–')[0].trim()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.6,
                color: palette.text.secondary,
                mt: 0.5,
              }}
            >
              {tagline.split('–')[1].trim()}
            </Typography>
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.6,
              color: palette.text.primary,
            }}
          >
            {tagline}
          </Typography>
        )}
      </Box>

      {/* Right Section: Contact Buttons */}
      <Stack
        direction="column"
        spacing={1}
        sx={{
          flex: { xs: "100%", md: "0 0 33%" },
          minWidth: "320px",
        }}
      >
        {contactLinks.map((link, index) => {
          const IconComponent = iconMap[link.icon];
          const isDownload = link.icon === "download";
          const isSageColor = ["email", "phone", "linkedin", "github"].includes(link.icon);
          // Decode obfuscated email and phone labels and URLs
          const shouldDecode = ["email", "phone"].includes(link.icon);
          const displayLabel = shouldDecode ? rot13(link.label) : link.label;
          const displayUrl = shouldDecode ? rot13(link.url) : link.url;

          return (
            <Button
              key={index}
              variant="contained"
              href={displayUrl}
              target={isDownload ? "_blank" : undefined}
              rel={isDownload ? "noopener noreferrer" : undefined}
              startIcon={<IconComponent />}
              aria-label={`${displayLabel}${isDownload ? " (opens in new tab)" : ""}`}
              className={isDownload ? "no-print" : undefined}
              sx={{
                backgroundColor: isSageColor ? BRAND_COLORS.sage : BRAND_COLORS.maroon,
                color: "#ffffff",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                px: 3,
                py: 1,
                width: "100%",
                justifyContent: "flex-start",
                gap: 1,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: isSageColor
                    ? NAV_COLORS.inactiveHover
                    : BRAND_COLORS.maroonDark,
                  boxShadow: "none",
                },
              }}
            >
              {displayLabel}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
