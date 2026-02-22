"use client";

import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getPaletteByMode } from "../../lib/themes";
import { useI18n } from "../../hooks/useI18n";

/**
 * ProfessionalSummary displays a brief overview of the professional's career and expertise.
 *
 * Features:
 * - Section heading in responsive font
 * - Summary text with professional background
 * - Responsive layout with proper spacing
 * - Print-friendly styling
 *
 * @returns A section displaying the professional summary
 *
 * @example
 * <ProfessionalSummary />
 */
export default function ProfessionalSummary() {
  const { mode, isMounted } = useThemeContext();
  // Use light theme during SSR/hydration to match ThemeProvider
  const palette = getPaletteByMode(isMounted ? mode : "light");
  const { t } = useI18n();

  return (
    <Box
      component="section"
      aria-labelledby="professional-summary-heading"
      sx={{ mb: 4 }}
    >
      <Typography
        id="professional-summary-heading"
        variant="h2"
        sx={{
          fontWeight: 600,
          color: palette.text.primary,
          fontSize: { xs: "1.75rem", md: "2rem" },
          mb: 2,
        }}
      >
        {t('resume.professionalSummary.heading', { ns: 'pages' })}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.8,
          color: palette.text.primary,
          fontSize: { xs: "0.95rem", md: "1rem" },
          mb: 3,
        }}
      >
        {t('resume.professionalSummary.content', { ns: 'pages' })}
      </Typography>
    </Box>
  );
}
