"use client";

import { Box, Typography } from "@mui/material";
import type { EducationEntry } from "../../types/resume";
import { BRAND_COLORS } from "../../constants";
import { usePalette } from "../../hooks/usePalette";
import { useI18n } from "../../hooks/useI18n";

/**
 * Props for the Education component.
 */
export interface EducationProps {
  /** Array of education entries to display */
  education: EducationEntry[];
}

/**
 * Education displays professional education and certifications.
 *
 * Features:
 * - Displays institution, program, and year for each entry
 * - Clean, organized layout with alternating styling
 * - Print-friendly layout
 * - Supports multiple certifications and degrees
 *
 * @param props - Component props containing education array
 * @param props.education - Array of education entries (degrees, certifications)
 * @returns A section displaying the education entries
 *
 * @example
 * <Education education={resumeData.education} />
 */
export default function Education({ education }: EducationProps) {
  const { palette } = usePalette({ hydrationSafe: true });
  const { t } = useI18n();

  return (
    <Box component="section" aria-labelledby="education-heading">
      <Box
        sx={{
          backgroundColor: BRAND_COLORS.duckEgg,
          borderRadius: 2,
          p: 2.5,
        }}
      >
        {/* Section Heading */}
        <Typography
          id="education-heading"
          variant="h3"
          component="h3"
          sx={{
            fontWeight: 600,
            color: palette.card.text,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 1.5,
          }}
        >
          {t('resume.education.heading', { ns: 'pages' })}
        </Typography>

        {/* Education Entries */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {education.map((entry, index) => (
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
                {entry.institution}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: palette.card.text,
                  fontSize: "0.85rem",
                  mt: 0.25,
                }}
              >
                {entry.program}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: palette.card.text,
                  fontSize: "0.8rem",
                  mt: 0.25,
                }}
              >
                {entry.year}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
