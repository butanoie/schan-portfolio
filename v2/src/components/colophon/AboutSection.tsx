"use client";

import { Box, Typography } from "@mui/material";
import type { AboutContent } from "../../types/colophon";
import { BRAND_COLORS } from "../../constants";

/**
 * Props for the AboutSection component.
 */
export interface AboutSectionProps {
  /** Content data for the about section */
  content: AboutContent;
}

/**
 * AboutSection displays the colophon intro with V1-style deck paragraphs.
 *
 * Features:
 * - "Colophon" heading styled in Oswald font
 * - Centered deck paragraphs describing the site creator
 *
 * @param props - Component props containing about content
 * @param props.content - Content data for the about section
 * @returns A section displaying the colophon intro
 *
 * @example
 * <AboutSection content={colophonData.about} />
 */
export default function AboutSection({ content }: AboutSectionProps) {
  const { deck } = content;

  return (
    <Box
      component="section"
      aria-labelledby="colophon-heading"
    >
      <Typography
        id="colophon-heading"
        variant="h1"
        component="h1"
        sx={{
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 700,
          color: BRAND_COLORS.graphite,
          fontSize: { xs: "2rem", md: "2.5rem" },
          mb: 3,
          textAlign: "center",
        }}
      >
        Colophon
      </Typography>

      {/* V1-style deck paragraphs */}
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        {deck.map((paragraph, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              mb: 2,
              lineHeight: 1.7,
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
