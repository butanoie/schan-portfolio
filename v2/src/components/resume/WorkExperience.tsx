"use client";

import { Box, Typography } from "@mui/material";
import type { Job } from "../../types/resume";
import { BRAND_COLORS } from "../../constants";

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
 * - Company names as prominent headings in Oswald font
 * - Multiple roles per company displayed with dates
 * - Job descriptions and key contributions
 * - Responsive layout: dates align right on desktop, stack below titles on mobile
 * - Print-friendly: prevents page breaks within job entries
 *
 * @param props - Component props containing jobs array
 * @param props.jobs - Array of job entries with company, roles, and descriptions
 * @returns A section displaying the work experience history
 *
 * @example
 * <WorkExperience jobs={resumeData.jobs} />
 */
export default function WorkExperience({ jobs }: WorkExperienceProps) {
  return (
    <Box
      component="section"
      aria-labelledby="work-experience-heading"
      sx={{ mb: 4 }}
    >
      <Typography
        id="work-experience-heading"
        variant="h2"
        component="h2"
        sx={{
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 600,
          color: BRAND_COLORS.graphite,
          fontSize: { xs: "1.75rem", md: "2rem" },
          mb: 3,
        }}
      >
        Work Experience
      </Typography>

      {jobs.map((job, jobIndex) => (
        <Box
          key={jobIndex}
          className="job-entry"
          sx={{
            mb: 4,
            pageBreakInside: "avoid",
          }}
        >
          {/* Company Name */}
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              color: BRAND_COLORS.maroon,
              fontSize: { xs: "1.35rem", md: "1.5rem" },
              mb: 1.5,
            }}
          >
            {job.company}
          </Typography>

          {/* Roles and Dates */}
          {job.roles.map((role, roleIndex) => (
            <Box
              key={roleIndex}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { xs: "flex-start", md: "space-between" },
                mb: 1,
              }}
            >
              {/* Role Title */}
              <Typography
                variant="body1"
                component="div"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: BRAND_COLORS.graphite,
                  flex: { md: "1" },
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
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: BRAND_COLORS.graphite,
                  textAlign: { xs: "left", md: "right" },
                  flex: { md: "0 0 auto" },
                  minWidth: { md: "180px" },
                }}
              >
                {role.startDate} - {role.endDate}
              </Typography>
            </Box>
          ))}

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              mb: job.keyContributions ? 1.5 : 0,
              lineHeight: 1.7,
              color: BRAND_COLORS.graphite,
              fontSize: { xs: "0.95rem", md: "1rem" },
            }}
          >
            {job.description}
          </Typography>

          {/* Key Contributions (if present) */}
          {job.keyContributions && job.keyContributions.length > 0 && (
            <>
              <Typography
                variant="body1"
                sx={{
                  mt: 1.5,
                  mb: 1,
                  fontWeight: 500,
                  color: BRAND_COLORS.graphite,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                Key Contributions:
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: 3,
                  m: 0,
                  listStyleType: "disc",
                  "& li": {
                    mb: 0.75,
                    lineHeight: 1.6,
                    color: BRAND_COLORS.graphite,
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                  },
                }}
              >
                {job.keyContributions.map((contribution, index) => (
                  <li key={index}>{contribution}</li>
                ))}
              </Box>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}
