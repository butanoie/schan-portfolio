"use client";

import { Box, Typography } from "@mui/material";
import type { SpeakingContent } from "../../types/resume";
import { BRAND_COLORS } from "../../constants";
import { usePalette } from "../../hooks/usePalette";
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
 * - Displays each conference as a card with left border
 * - Conference name, year, and location for each event
 * - Optional topic display for each event
 * - Clean, organized layout with alternating styling
 * - Print-friendly layout
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
  const { palette } = usePalette({ hydrationSafe: true });
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
        {intro && (
          <Typography
            variant="body2"
            sx={{
              color: palette.card.text,
              fontSize: "0.9rem",
              mb: 1.5,
            }}
          >
            {intro}
          </Typography>
        )}

        {/* Events List */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {events.map((event, index) => (
            <Box
              key={index}
              sx={{
                borderLeft: `3px solid ${BRAND_COLORS.sage}`,
                pl: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: palette.card.text,
                  fontSize: "0.9rem",
                }}
              >
                {event.conference}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: palette.card.text,
                  fontSize: "0.85rem",
                  mt: 0.25,
                }}
              >
                {event.year}
                {event.location && ` – ${event.location}`}
              </Typography>
              {event.topic && (
                <Typography
                  variant="body2"
                  sx={{
                    color: palette.card.text,
                    fontSize: "0.8rem",
                    mt: 0.25,
                  }}
                >
                  {event.topic}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
