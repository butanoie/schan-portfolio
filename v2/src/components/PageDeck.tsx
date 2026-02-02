"use client";

import Image from "next/image";
import { Box, Typography } from "@mui/material";
import type { PageDeckData } from "../types";
import { BRAND_COLORS } from "../constants";

/**
 * Props for the PageDeck component.
 */
export interface PageDeckProps {
  /** Page deck content data (image, heading, paragraphs) */
  content: PageDeckData;
}

/**
 * PageDeck displays a reusable page intro section with header image and deck paragraphs.
 *
 * Features:
 * - Customizable header image with responsive sizing
 * - Customizable heading styled in Oswald font
 * - Centered deck paragraphs describing the section
 * - Proper accessibility with heading IDs
 *
 * Used by multiple pages including colophon and projects pages.
 *
 * @param props - Component props containing page deck content
 * @param props.content - Content data with image, heading, and paragraphs
 * @returns A section displaying the page intro
 *
 * @example
 * <PageDeck content={colophonData.about.pageDeck} />
 */
export default function PageDeck({ content }: PageDeckProps) {
  const { imageUrl, imageAlt, headingId, heading, deck } = content;

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      sx={{
        mt: 4,
        textAlign: "center",
      }}
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={940}
        height={240}
        priority
        style={{
          width: "100%",
          height: "auto",
        }}
      />

      {/* Section heading */}
      <Typography
        id={headingId}
        variant="h1"
        component="h1"
        sx={{
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 700,
          color: BRAND_COLORS.graphite,
          fontSize: { xs: "2rem", md: "2.5rem" },
          mt: 6,
          mb: 3,
        }}
      >
        {heading}
      </Typography>

      {deck.map((paragraph, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={{
            mt: 2,
            mx: 10,
            lineHeight: 1.7,
            fontSize: { xs: "1rem", md: "1.1rem" },
          }}
        >
          {paragraph}
        </Typography>
      ))}
    </Box>
  );
}
