"use client";

import { Container, Box, Divider } from "@mui/material";
import {
  ResumeHeader,
  WorkExperience,
  CoreCompetencies,
  ClientList,
  ConferenceSpeaker,
} from "../../src/components/resume";
import { getLocalizedResumeData } from "../../src/data/resume";
import { useI18n } from "../../src/hooks/useI18n";
import "./print.css";

/**
 * Resume page component.
 *
 * Displays a comprehensive professional resume including:
 * - Header with name, tagline, and contact buttons (LinkedIn, GitHub, Download)
 * - Work experience with detailed job history (5 companies, 25+ years)
 * - Core competencies organized by category (skills, tools)
 * - Client list (50+ enterprise clients)
 * - Conference speaking history
 *
 * Layout:
 * - Mobile: Single column, stacked sections
 * - Desktop: Two columns (8/4 split - 70/30 approximately)
 * - Left: Header + Work Experience
 * - Right: Skills + Clients + Speaking
 *
 * All content is localized to the user's preferred language (English or French).
 *
 * @returns The complete resume page with print-friendly styling
 */
export default function ResumePage() {
  const { t } = useI18n();
  const data = getLocalizedResumeData(t);

  return (
    <Container
      component="main"
      role="article"
      maxWidth="lg"
      className="resume-page"
      sx={{
        py: { xs: 2, md: 0 },
        px: { xs: 2, sm: 3, md: 3 },
      }}
    >
      {/* Header - Full Width */}
      <ResumeHeader content={data.header} />

      <Divider sx={{ my: { xs: 3, md: 4 } }} />

      {/* Two Column Layout - Responsive */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 6, md: 6 },
        }}
      >
        {/* Right Column: Skills, Clients, Speaking (30% on desktop) */}
        {/* Shown first on mobile, second on desktop */}
        <Box
          sx={{
            order: { xs: 1, md: 2 },
            flex: { xs: "1", md: "0 0 33%" },
            minWidth: "320px",
          }}
        >
          <CoreCompetencies categories={data.skillCategories} />

          <Divider sx={{ my: 3 }} />

          <ClientList clients={data.clients} />

          <Divider sx={{ my: 3 }} />

          <ConferenceSpeaker content={data.speaking} />
        </Box>

        {/* Left Column: Work Experience (70% on desktop) */}
        {/* Shown second on mobile, first on desktop */}
        <Box
          sx={{
            order: { xs: 2, md: 1 },
            flex: { xs: "1", md: "1" },
          }}
        >
          <WorkExperience jobs={data.jobs} />
        </Box>
      </Box>
    </Container>
  );
}
