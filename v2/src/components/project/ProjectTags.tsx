'use client';

import { Box, Chip, SxProps, Theme } from '@mui/material';
import { BRAND_COLORS } from '../../constants';

/**
 * Props for the ProjectTagsContainer component.
 *
 * @interface ProjectTagsContainerProps
 * @property {string[]} [tags] - Technology/skill tags to display
 * @property {string} [circa] - Timeline or date range for the project
 * @property {SxProps<Theme>} [sx] - Material-UI sx prop for custom styling
 */
interface ProjectTagsContainerProps {
  tags?: string[];
  circa?: string;
  sx?: SxProps<Theme>;
}

/**
 * Displays project tags and circa date in a styled container.
 *
 * This component renders technology tags and project date as MUI Chips
 * with consistent styling following the ClientList pattern.
 *
 * **Features:**
 * - Flexbox layout with wrapping for responsive display
 * - Duck egg blue background container
 * - Maroon chip for the circa date
 * - Sage green chips for technology tags
 * - Responsive spacing and sizing
 * - Semantic rendering with proper chip styling
 *
 * **Styling:**
 * - Container: flex, wrap, gap 0.75, duck egg background, 2px radius, 2.5 padding
 * - Circa chip: maroon background, white text, 600 weight, 0.75rem size, 26px height
 * - Tag chips: sage background, white text, 600 weight, 0.75rem size, 26px height
 *
 * @param {ProjectTagsContainerProps} props - Component props
 * @returns The rendered tags and date container
 *
 * @example
 * <ProjectTagsContainer tags={["React", "TypeScript"]} circa="2022-2023" />
 */
export function ProjectTagsContainer({
  tags,
  circa,
  sx,
}: ProjectTagsContainerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.75,
        backgroundColor: BRAND_COLORS.duckEgg,
        borderRadius: 2,
        p: 1.5,
        ...sx,
      }}
    >
      {circa && (
        <Chip
          className='project-circa'
          label={circa}
          size="small"
          sx={{
            backgroundColor: BRAND_COLORS.maroon,
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: '26px',
            borderRadius: '3px',
            '& .MuiChip-label': {
              px: 1.25,
            },
          }}
        />
      )}
      {tags &&
        tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              backgroundColor: BRAND_COLORS.sage,
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: '26px',
              borderRadius: '3px',
              '& .MuiChip-label': {
                px: 1.25,
              },
            }}
          />
        ))}
    </Box>
  );
}
