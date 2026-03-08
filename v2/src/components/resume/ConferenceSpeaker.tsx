import { Box, Typography } from "@mui/material";
import type { SpeakingContent } from "../../types/resume";
import { BRAND_COLORS } from "../../constants";

/**
 * Props for the ConferenceSpeaker component.
 */
export interface ConferenceSpeakerProps {
  /** Speaking history content with intro and events */
  content: SpeakingContent;

  /** Theme-aware text color for card content, sourced from parent's cardTextColor */
  cardTextColor: string;

  /** Pre-translated section heading text (e.g., "Conference Speaking") */
  sectionHeading: string;
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
 * @param props.cardTextColor - Theme-aware text color from parent's palette
 * @param props.sectionHeading - Pre-translated heading text
 * @returns A section displaying conference speaking history
 *
 * @example
 * <ConferenceSpeaker content={resumeData.speaking} cardTextColor={palette.card.text} sectionHeading={t('resume.conferenceSpeaker.heading', { ns: 'pages' })} />
 */
export default function ConferenceSpeaker({
  content,
  cardTextColor,
  sectionHeading,
}: ConferenceSpeakerProps) {
  const { intro, events } = content;

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
            color: cardTextColor,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 1.5,
          }}
        >
          {sectionHeading}
        </Typography>

        {/* Intro Text */}
        {intro && (
          <Typography
            variant="body2"
            sx={{
              color: cardTextColor,
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
                  color: cardTextColor,
                  fontSize: "0.9rem",
                }}
              >
                {event.conference}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: cardTextColor,
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
                    color: cardTextColor,
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
