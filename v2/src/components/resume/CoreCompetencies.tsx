import { Box, Typography, Chip } from '@mui/material';
import type { SkillCategory } from '../../types/resume';
import { getHcContainerSx, getHcChipSx } from '../../utils/highContrastStyles';

/**
 * Props for the CoreCompetencies component.
 */
export interface CoreCompetenciesProps {
  /** Array of skill categories to display */
  categories: SkillCategory[];

  /** Theme-aware text color for card content, sourced from parent's palette.card.text */
  cardTextColor: string;

  /** Whether high-contrast mode is active */
  isHighContrast?: boolean;
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
 * @param props.cardTextColor - Theme-aware text color from parent's palette
 * @param props.isHighContrast - Whether high-contrast mode is active
 * @returns A section displaying categorized skills
 *
 * @example
 * <CoreCompetencies categories={resumeData.skillCategories} cardTextColor={palette.card.text} />
 */
export default function CoreCompetencies({
  categories,
  cardTextColor,
  isHighContrast = false,
}: CoreCompetenciesProps) {
  return (
    <Box component="section" aria-labelledby="skills-heading">
      {categories.map((category, categoryIndex) => (
        <Box
          key={categoryIndex}
          sx={{
            mb: 3,
            ...getHcContainerSx(isHighContrast),
            p: 2.5,
          }}
        >
          {/* Category Heading */}
          <Typography
            variant="h3"
            id={
              categoryIndex === 0
                ? 'skills-heading'
                : `skills-${category.label.toLowerCase().replace(/\s+/g, '-')}`
            }
            sx={{
              fontWeight: 600,
              color: isHighContrast ? '#FFFFFF' : cardTextColor,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              mb: 1.5,
            }}
          >
            {category.label}
          </Typography>

          {/* Skills as Chips */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
            }}
          >
            {category.skills.map((skill, skillIndex) => (
              <Chip
                key={skillIndex}
                label={skill}
                size="small"
                sx={{
                  ...getHcChipSx(isHighContrast),
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  height: '28px',
                  '& .MuiChip-label': {
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
