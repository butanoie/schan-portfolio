"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
import type { ResumeHeaderContent } from "../../types/resume";
import { BRAND_COLORS } from "../../constants";

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
};

/**
 * ResumeHeader displays the resume page header with name, tagline, and contact buttons.
 *
 * Features:
 * - Name in Oswald font with responsive sizing
 * - Professional tagline below name
 * - Contact buttons (LinkedIn, GitHub, Download) with icons
 * - Buttons stack vertically on mobile, display in row on desktop
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

  return (
    <Box
      component="section"
      aria-labelledby="resume-name"
      sx={{
        pt: { xs: 4, md: 6 },
        pb: { xs: 2, md: 3 },
      }}
    >
      {/* Name */}
      <Typography
        id="resume-name"
        variant="h1"
        component="h1"
        sx={{
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 700,
          color: BRAND_COLORS.graphite,
          fontSize: { xs: "2rem", md: "2.5rem" },
          mb: 2,
        }}
      >
        {name}
      </Typography>

      {/* Tagline */}
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          fontSize: { xs: "1rem", md: "1.1rem" },
          lineHeight: 1.6,
          color: BRAND_COLORS.graphite,
        }}
      >
        {tagline}
      </Typography>

      {/* Contact Buttons */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mt: 3,
        }}
      >
        {contactLinks.map((link, index) => {
          const IconComponent = iconMap[link.icon];
          const isDownload = link.icon === "download";

          return (
            <Button
              key={index}
              variant="contained"
              href={link.url}
              target={isDownload ? "_blank" : undefined}
              rel={isDownload ? "noopener noreferrer" : undefined}
              startIcon={<IconComponent />}
              aria-label={`${link.label}${isDownload ? " (opens in new tab)" : ""}`}
              className={isDownload ? "no-print" : undefined}
              sx={{
                backgroundColor:
                  link.icon === "download"
                    ? BRAND_COLORS.duckEgg
                    : BRAND_COLORS.maroon,
                color:
                  link.icon === "download"
                    ? BRAND_COLORS.graphite
                    : "#ffffff",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor:
                    link.icon === "download"
                      ? "#b8d6b9"
                      : BRAND_COLORS.maroonDark,
                },
                // Full width on mobile for better touch targets
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {link.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
