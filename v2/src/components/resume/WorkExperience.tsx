'use client';

import { Box, Typography } from '@mui/material';
import type { Job } from '../../types/resume';
import { usePalette } from '../../hooks/usePalette';
import { useI18n } from '../../hooks/useI18n';

/**
 * Shared styles for the contribution bullet list.
 *
 * @param textColor - Theme-aware text color from palette
 * @returns SX props for the bullet list container
 */
function getContributionListSx(textColor: string) {
  return {
    pl: 3,
    mt: 1,
    mb: 2,
    listStyleType: 'disc',
    '& li': {
      mb: 0.75,
      lineHeight: 1.6,
      color: textColor,
      fontSize: { xs: '0.9rem', md: '1rem' },
    },
  };
}

/**
 * Props for the WorkExperience component.
 */
export interface WorkExperienceProps {
  /** Array of job entries to display */
  jobs: Job[];
}

/**
 * WorkExperience displays the professional work history section.
 *
 * Features:
 * - Company names as prominent headings
 * - Multiple roles per company displayed with dates
 * - Per-role contributions rendered inline after each role
 * - Responsive layout: dates align right on desktop, stack below titles on mobile
 * - Print-friendly: prevents page breaks within job entries
 *
 * @param props - Component props containing jobs array
 * @param props.jobs - Array of job entries with company, roles, and contributions
 * @returns A section displaying the work experience history
 *
 * @example
 * <WorkExperience jobs={resumeData.jobs} />
 */
export default function WorkExperience({ jobs }: WorkExperienceProps) {
  const { palette } = usePalette({ hydrationSafe: true });
  const { t } = useI18n();

  return (
    <Box
      component="section"
      aria-labelledby="work-experience-heading"
      sx={{ mb: 4 }}
    >
      <Typography
        id="work-experience-heading"
        variant="h2"
        sx={{
          fontWeight: 600,
          color: palette.text.primary,
          fontSize: { xs: '1.75rem', md: '2rem' },
          mb: 3,
        }}
      >
        {t('resume.workExperience.heading', { ns: 'pages' })}
      </Typography>

      {jobs.map((job) => (
        <Box
          key={job.company}
          className="job-entry"
          sx={{
            mb: 5,
            pageBreakInside: 'avoid',
          }}
        >
          {/* Company Name */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: palette.secondary,
              fontSize: { xs: '1.35rem', md: '1.5rem' },
              mb: 1.5,
            }}
          >
            {job.company}
          </Typography>

          {/* Roles, Dates, and Contributions */}
          {job.roles.map((role) => (
            <Box key={`${role.title}-${role.startDate}`}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: {
                    xs: 'flex-start',
                    md: 'space-between',
                  },
                  mb: 1,
                }}
              >
                {/* Role Title */}
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    color: palette.text.secondary,
                    flex: { md: '1' },
                  }}
                >
                  {role.title}
                </Typography>

                {/* Dates */}
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    color: palette.text.secondary,
                    textAlign: { xs: 'left', md: 'right' },
                    flex: { md: '0 0 auto' },
                    minWidth: { md: '180px' },
                  }}
                >
                  {role.startDate} - {role.endDate}
                </Typography>
              </Box>

              {/* Role Contributions */}
              {role.contributions && role.contributions.length > 0 && (
                <Box
                  component="ul"
                  sx={getContributionListSx(palette.text.primary)}
                >
                  {role.contributions.map((contribution, index) => (
                    <li key={index}>{contribution}</li>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
