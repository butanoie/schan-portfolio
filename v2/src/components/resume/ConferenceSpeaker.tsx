"use client";

import { Box, Typography } from "@mui/material";
import type { SpeakingContent } from "../../types/resume";
import { BRAND_COLORS } from "../../constants";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getPaletteByMode } from "../../lib/themes";
import { useI18n } from "../../hooks/useI18n";

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
 * - List of conferences with years and locations
 * - Optional topic display for each event
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
  const { mode } = useThemeContext();
  const palette = getPaletteByMode(mode);
  const { t } = useI18n();

  return (
    <Box component="section" aria-labelledby="speaking-heading">
      <Box
        sx={{
          backgroundColor: BRAND_COLORS.duckEgg,
          borderRadius: 2,
          p: 2.5,
        }}
      >
        {/* Section Heading */}
        <Typography
          id="speaking-heading"
          variant="h3"
          sx={{
            fontWeight: 600,
            color: palette.card.text,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 1.5,
          }}
        >
          {t('resume.conferenceSpeaker.heading', { ns: 'pages' })}
        </Typography>

        {/* Intro Text */}
        <Typography
          variant="body2"
          sx={{
            mb: 1.5,
            color: palette.card.text,
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
              color: palette.card.text,
              fontSize: "0.875rem",
            },
          }}
        >
          {events.map((event, index) => (
            <li key={index}>
              {event.conference}, {event.year}
              {event.location && ` (${event.location})`}
              {event.topic && ` - ${event.topic}`}
            </li>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
