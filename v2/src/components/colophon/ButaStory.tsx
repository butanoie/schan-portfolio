"use client";

import { Box, Typography, Paper } from "@mui/material";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import type { ButaStoryContent } from "../../types/colophon";

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

  return (
    <Box component="section" aria-labelledby="buta-heading" sx={{ mb: 6 }}>
      <Typography
        id="buta-heading"
        variant="h2"
        component="h2"
        sx={{
          // Visually hidden but accessible to screen readers
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        The Story of Buta
      </Typography>

      {/* Boo vs Bu Image */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "transparent",
            maxWidth: 700,
            width: "100%",
          }}
        >
          <Image
            src={versusImage}
            alt={versusImageAlt}
            width={700}
            height={80}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
            priority={false}
          />
        </Paper>
      </Box>

      {/* Story Paragraphs */}
      <Box>
        {paragraphs.map((paragraph, index) => (
          <Typography
            key={index}
            variant="body1"
            component="div"
            sx={{
              mb: 2,
              lineHeight: 1.7,
              "& a": {
                color: "primary.dark",
                textDecoration: "underline",
                "&:hover": {
                  color: "#8B1538",
                },
              },
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(paragraph, {
                ALLOWED_TAGS: ["a", "strong", "em", "br"],
                ALLOWED_ATTR: ["href", "target", "rel"],
              }),
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
