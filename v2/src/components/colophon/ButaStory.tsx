"use client";

import { Box, Typography, Paper } from "@mui/material";
import Image from "next/image";
import { sanitizeDescriptionHtml } from "../../utils/sanitization";
import type { ButaStoryContent } from "../../types/colophon";
import { getPaletteByMode } from "../../lib/themes";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useI18n } from "../../hooks/useI18n";

/**
 * Props for the ButaStory component.
 */
export interface ButaStoryProps {
  /** Content data for the Buta story section */
  content: ButaStoryContent;
}

/**
 * ButaStory displays the origin and meaning of the Buta mascot.
 *
 * Features:
 * - Multiple paragraphs with HTML content (sanitized with DOMPurify)
 * - Boo vs Bu comparison image
 *
 * Note: The Buta mascot image and thought bubble are displayed in the
 * global Footer component, not in this section.
 *
 * @param props - Component props containing Buta story content
 * @param props.content - Content data for the Buta story section
 * @returns A section displaying the mascot's story
 *
 * @example
 * <ButaStory content={colophonData.butaStory} />
 */
export default function ButaStory({ content }: ButaStoryProps) {
  const { paragraphs, versusImage, versusImageAlt } = content;
  const { mode } = useThemeContext();
  const palette = getPaletteByMode(mode);
  const { t } = useI18n();

  return (
    <Box component="section" aria-labelledby="buta-heading">
      <Typography
        id="buta-heading"
        variant="h2"
        sx={{
          // Visually hidden but accessible to screen readers (sr-only)
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {t("colophon.butaStory.heading", { ns: "components" })}
      </Typography>

      {/* Boo vs Bu Image */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "transparent",
            width: "100%",
          }}
        >
          <Image
            src={versusImage}
            alt={versusImageAlt}
            width={1400}
            height={160}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Paper>

      {/* Story Paragraphs */}
      <Box>
        {paragraphs.map((paragraph, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              mb: 2,
              "& a": {
                color: "primary.dark",
                textDecoration: "underline",
                "&:hover": {
                  color: palette.accents.red,
                },
              },
            }}
            dangerouslySetInnerHTML={{
              __html: sanitizeDescriptionHtml(paragraph),
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
