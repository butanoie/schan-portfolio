'use client';

import { Box, Chip, Typography, SxProps, Theme } from '@mui/material';
import { BRAND_COLORS } from '../../constants';

/**
 * Props for the ProjectHeader component.
 *
 * @interface ProjectHeaderProps
 * @property {string} title - The project title
 * @property {string} circa - Timeline or date range for the project
 * @property {string[]} tags - Technology/skill tags for the project
 * @property {'inline' | 'stacked'} [layout='stacked'] - How to arrange tags relative to title
 * @property {SxProps<Theme>} [sx] - Material-UI sx prop for custom styling
 */
interface ProjectHeaderProps {
  title: string;
  circa: string;
  tags: string[];
  layout?: 'inline' | 'stacked';
  sx?: SxProps<Theme>;
}

/**
 * Displays project title, circa (date range), and tags.
 *
 * This component renders the header section of a project with the title, timeline,
 * and technology tags. The layout can be inline (tags beside title) or stacked
 * (tags below title), typically chosen based on viewport size.
 *
 * **Layout variants:**
 * - `inline`: Tags displayed inline with the title on wider screens
 * - `stacked`: Tags displayed below the title on mobile/narrow screens
 *
 * **Features:**
 * - Responsive typography sizes (smaller on mobile, larger on desktop)
 * - Semantic HTML with proper heading hierarchy (h2)
 * - Technology tags using MUI Chip components with sage green color
 * - Circa badge with maroon background
 * - Maintains color consistency via color constants
 *
 * @param {ProjectHeaderProps} props - Component props
 * @returns The rendered project header
 *
 * @example
 * <ProjectHeader
 *   title="Mobile App Design"
 *   circa="2022-2023"
 *   tags={["React Native", "UI/UX", "Firebase"]}
 *   layout="inline"
 * />
 */
export function ProjectHeader({
  title,
  circa,
  tags,
  layout = 'stacked',
  sx,
}: ProjectHeaderProps) {
  const isInline = layout === 'inline';

  return (
    <Box
      sx={{
        mb: 3,
        ...sx,
      }}
    >
      {/* Title and Circa */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: isInline ? 0 : 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          component="h2"
          variant="h3"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            fontFamily: 'Oswald, sans-serif',
            color: BRAND_COLORS.maroon,
            fontWeight: 600,
            margin: 0,
          }}
        >
          {title}
        </Typography>

        <Chip
          label={circa}
          sx={{
            backgroundColor: BRAND_COLORS.maroon,
            color: '#ffffff',
            fontWeight: 500,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            height: { xs: 24, sm: 28 },
          }}
        />
      </Box>

      {/* Tags */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          mt: isInline ? 0 : 2,
          alignItems: 'center',
        }}
      >
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              backgroundColor: BRAND_COLORS.sage,
              color: BRAND_COLORS.graphite,
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
