"use client";

import { Box, Typography } from "@mui/material";
import type { SpeakingContent } from "../../types/resume";
import { BRAND_COLORS } from "../../constants";

/**
 * Props for the ConferenceSpeaker component.
 */
export interface ConferenceSpeakerProps {
  /** Speaking history content with intro and events */
  content: SpeakingContent;
}

/**
 * ConferenceSpeaker displays the conference speaking history.
 *
 * Features:
 * - Introduction text explaining the speaking experience
 * - List of conferences with years
 * - Bullet list format for clear presentation
 * - Compact layout suitable for sidebar
 *
 * @param props - Component props containing speaking content
 * @param props.content - Speaking history data (intro text and events array)
 * @returns A section displaying conference speaking history
 *
 * @example
 * <ConferenceSpeaker content={resumeData.speaking} />
 */
export default function ConferenceSpeaker({
  content,
}: ConferenceSpeakerProps) {
  const { intro, events } = content;

  return (
    <Box component="section" aria-labelledby="speaking-heading">
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          p: 2.5,
        }}
      >
        {/* Section Heading */}
        <Typography
          id="speaking-heading"
          variant="h3"
          component="h3"
          sx={{
            fontFamily: '"Oswald", sans-serif',
            fontWeight: 600,
            color: BRAND_COLORS.maroon,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 1.5,
          }}
        >
          Conference Speaker
        </Typography>

        {/* Intro Text */}
        <Typography
          variant="body2"
          sx={{
            mb: 1.5,
            color: BRAND_COLORS.graphite,
            fontSize: "0.9rem",
            lineHeight: 1.6,
          }}
        >
          {intro}
        </Typography>

        {/* Events List */}
        <Box
          component="ul"
          sx={{
            pl: 2.5,
            m: 0,
            listStyleType: "disc",
            "& li": {
              mb: 0.5,
              lineHeight: 1.5,
              color: BRAND_COLORS.graphite,
              fontSize: "0.875rem",
            },
          }}
        >
          {events.map((event, index) => (
            <li key={index}>
              {event.conference}
              {event.topic && ` - ${event.topic}`}
            </li>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
