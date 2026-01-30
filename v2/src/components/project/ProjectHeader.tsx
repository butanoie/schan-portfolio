'use client';

import { Box, Chip, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import DOMPurify from 'isomorphic-dompurify';
import { BRAND_COLORS, UI_COLORS } from '@/src/constants/colors';

/**
 * Props for the ProjectHeader component.
 */
export interface ProjectHeaderProps {
  /** Project title (may contain HTML for styling) */
  title: string;

  /** Timeline/date range for the project (e.g., "Fall 2017 - Present") */
  circa: string;

  /** Array of technology and skill tags */
  tags: string[];

  /** Layout variant for different page contexts */
  layout?: 'inline' | 'stacked' | 'floating';

  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * Header component for displaying project metadata.
 *
 * ## Features
 * - **Sanitized HTML Title:** Safely renders HTML in project titles
 * - **Circa Badge:** Displays timeline/date in a styled chip
 * - **Technology Tags:** Shows all project tags with color-coded styling
 * - **Responsive Layout:** Adapts to different screen sizes
 * - **Layout Variants:** Supports inline, stacked, and floating layouts
 *
 * ## Layout Variants
 * - **inline:** Title, circa, and tags in a single flowing layout (default)
 * - **stacked:** Vertical stacking with clear separation
 * - **floating:** Positioned layout for overlay effects
 *
 * ## Security
 * - HTML in titles is sanitized using DOMPurify to prevent XSS attacks
 * - Only allows safe HTML tags: strong, em, span
 *
 * @param props - Component props
 * @param props.title - Project title with optional HTML markup
 * @param props.circa - Timeline/date range text
 * @param props.tags - Array of technology tags
 * @param props.layout - Layout variant (default: 'inline')
 * @param props.sx - Optional styling overrides
 * @returns A header section with project title, date, and tags
 *
 * @example
 * ```tsx
 * <ProjectHeader
 *   title="My <strong>Awesome</strong> Project"
 *   circa="Fall 2017 - Present"
 *   tags={['React', 'TypeScript', 'Node.js']}
 *   layout="inline"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Stacked layout for mobile-friendly display
 * <ProjectHeader
 *   title="Portfolio Redesign"
 *   circa="Winter 2025"
 *   tags={['Next.js', 'MUI', 'Vitest']}
 *   layout="stacked"
 * />
 * ```
 */
export function ProjectHeader({
  title,
  circa,
  tags,
  layout = 'inline',
  sx,
}: ProjectHeaderProps) {
  /**
   * Sanitizes HTML content in the title to prevent XSS attacks.
   * Only allows safe formatting tags.
   *
   * @param html - Raw HTML string
   * @returns Sanitized HTML string
   */
  const sanitizeTitle = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'span'],
      ALLOWED_ATTR: [],
    });
  };

  /**
   * Gets the layout-specific container styles.
   *
   * @returns SxProps for the container based on layout variant
   */
  const getContainerStyles = (): SxProps<Theme> => {
    const baseStyles: SxProps<Theme> = {
      display: 'flex',
      gap: 2,
      marginBottom: 3,
    };

    switch (layout) {
      case 'stacked':
        return {
          ...baseStyles,
          flexDirection: 'column',
          gap: 2,
        };

      case 'floating':
        return {
          ...baseStyles,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: 3,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 1,
        };

      case 'inline':
      default:
        return {
          ...baseStyles,
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          flexWrap: 'wrap',
        };
    }
  };

  return (
    <Box
      component="header"
      sx={[
        getContainerStyles(),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Project Title */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
          fontWeight: 700,
          color: BRAND_COLORS.maroon,
          lineHeight: 1.2,
          flex: layout === 'inline' ? '1 1 auto' : undefined,
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeTitle(title) }}
      />

      {/* Circa Badge */}
      <Chip
        label={circa}
        sx={{
          backgroundColor: UI_COLORS.cardBackground,
          border: `1px solid ${UI_COLORS.border}`,
          color: UI_COLORS.secondaryText,
          fontSize: { xs: '0.875rem', md: '1rem' },
          fontWeight: 500,
          height: 'auto',
          padding: '6px 12px',
          '& .MuiChip-label': {
            padding: 0,
          },
        }}
        aria-label={`Project timeline: ${circa}`}
      />

      {/* Technology Tags */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          width: layout === 'stacked' ? '100%' : 'auto',
        }}
        role="list"
        aria-label="Technology tags"
      >
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              backgroundColor: BRAND_COLORS.duckEgg,
              color: BRAND_COLORS.maroon,
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              fontWeight: 500,
              '&:hover': {
                backgroundColor: BRAND_COLORS.maroon,
                color: '#fff',
              },
            }}
            role="listitem"
          />
        ))}
      </Box>
    </Box>
  );
}
