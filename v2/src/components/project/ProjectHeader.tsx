'use client';

import { Typography, SxProps, Theme } from '@mui/material';
import { BRAND_COLORS } from '../../constants';

/**
 * Props for the ProjectHeader component.
 *
 * @interface ProjectHeaderProps
 * @property {string} title - The project title
 * @property {SxProps<Theme>} [sx] - Material-UI sx prop for custom styling
 */
interface ProjectHeaderProps {
  title: string;
  sx?: SxProps<Theme>;
}

/**
 * Displays project title only.
 *
 * This component renders the title section of a project.
 * Tags and date information are now handled by the ProjectDescription component for better layout control.
 *
 * **Features:**
 * - Responsive typography sizes (smaller on mobile, larger on desktop)
 * - Semantic HTML with proper heading hierarchy (h2)
 * - Maintains color consistency via color constants
 *
 * @param {ProjectHeaderProps} props - Component props
 * @returns The rendered project header
 *
 * @example
 * <ProjectHeader title="Mobile App Design" />
 */
export function ProjectHeader({
  title,
  sx,
}: ProjectHeaderProps) {
  return (
    <Typography
      component="h2"
      variant="h4"
      sx={{
        fontFamily: 'Oswald, sans-serif',
        color: BRAND_COLORS.graphite,
        fontWeight: 600,
        mb: 3,
        ...sx,
      }}
    >
      {title}
    </Typography>
  );
}
