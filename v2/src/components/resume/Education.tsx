import { Box, Typography } from '@mui/material';
import type { EducationEntry } from '../../types/resume';
import { BRAND_COLORS } from '../../constants';
import { getHcContainerSx } from '../../utils/highContrastStyles';

/**
 * Props for the Education component.
 */
export interface EducationProps {
  /** Array of education entries to display */
  education: EducationEntry[];

  /** Theme-aware text color for card content, sourced from parent's cardTextColor */
  cardTextColor: string;

  /** Pre-translated section heading text (e.g., "Education & Certifications") */
  sectionHeading: string;

  /** Whether high-contrast mode is active */
  isHighContrast?: boolean;
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
 * @param props.cardTextColor - Theme-aware text color from parent's palette
 * @param props.sectionHeading - Pre-translated heading text
 * @param props.isHighContrast - Whether high-contrast mode is active
 * @returns A section displaying the education entries
 *
 * @example
 * <Education education={resumeData.education} cardTextColor={palette.card.text} sectionHeading={t('resume.education.heading', { ns: 'pages' })} />
 */
export default function Education({
  education,
  cardTextColor,
  sectionHeading,
  isHighContrast = false,
}: EducationProps) {
  const textColor = isHighContrast ? '#FFFFFF' : cardTextColor;

  return (
    <Box component="section" aria-labelledby="education-heading">
      <Box
        sx={{
          ...getHcContainerSx(isHighContrast),
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
            color: textColor,
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            mb: 1.5,
          }}
        >
          {sectionHeading}
        </Typography>

        {/* Education Entries */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {education.map((entry, index) => (
            <Box
              key={index}
              sx={{
                borderLeft: `3px solid ${isHighContrast ? '#FFFFFF' : BRAND_COLORS.sage}`,
                pl: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: textColor,
                  fontSize: '0.9rem',
                }}
              >
                {entry.institution}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: textColor,
                  fontSize: '0.85rem',
                  mt: 0.25,
                }}
              >
                {entry.program}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: textColor,
                  fontSize: '0.8rem',
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
