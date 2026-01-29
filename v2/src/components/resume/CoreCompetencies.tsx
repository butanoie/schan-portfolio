"use client";

import { Box, Typography, Chip } from "@mui/material";
import type { SkillCategory } from "../../types/resume";
import { BRAND_COLORS } from "../../constants";

/**
 * Props for the CoreCompetencies component.
 */
export interface CoreCompetenciesProps {
  /** Array of skill categories to display */
  categories: SkillCategory[];
}

/**
 * CoreCompetencies displays skills organized by category as chips.
 *
 * Features:
 * - Multiple skill categories (Core Competencies, Everyday Tools, etc.)
 * - Skills displayed as MUI Chip components
 * - Sage green background for chips
 * - Chips wrap to multiple rows for responsive layout
 * - Compact spacing for sidebar display
 *
 * @param props - Component props containing skill categories
 * @param props.categories - Array of skill categories with labels and skill lists
 * @returns A section displaying categorized skills
 *
 * @example
 * <CoreCompetencies categories={resumeData.skillCategories} />
 */
export default function CoreCompetencies({
  categories,
}: CoreCompetenciesProps) {
  return (
    <Box component="section" aria-labelledby="skills-heading">
      {categories.map((category, categoryIndex) => (
        <Box
          key={categoryIndex}
          sx={{
            mb: 3,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          {/* Category Heading */}
          <Typography
            variant="h3"
            component="h3"
            id={
              categoryIndex === 0
                ? "skills-heading"
                : `skills-${category.label.toLowerCase().replace(/\s+/g, "-")}`
            }
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              color: BRAND_COLORS.maroon,
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              mb: 1.5,
            }}
          >
            {category.label}
          </Typography>

          {/* Skills as Chips */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
            }}
          >
            {category.skills.map((skill, skillIndex) => (
              <Chip
                key={skillIndex}
                label={skill}
                size="small"
                sx={{
                  backgroundColor: BRAND_COLORS.sage,
                  color: "#ffffff",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  height: "28px",
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
