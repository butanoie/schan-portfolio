'use client';

import { Box, SxProps, Theme, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { sanitizeDescriptionHtml } from '../../utils/sanitization';
import { BRAND_COLORS } from '../../constants';
import { ProjectTagsContainer } from './ProjectTags';

/**
 * Props for the ProjectDescription component.
 *
 * @interface ProjectDescriptionProps
 * @property {string | string[]} paragraphs - Project description as either a single HTML string (deprecated, for backward compatibility) or an array of paragraph strings, each may contain safe HTML markup
 * @property {string[]} [tags] - Technology/skill tags to display with the description
 * @property {string} [circa] - Timeline or date range for the project
 * @property {boolean} [floatTags] - Whether to float tags to the right of description (default: false)
 * @property {SxProps<Theme>} [floatedTagsMaxWidth] - Max-width for floated tags container (only used when floatTags is true)
 * @property {SxProps<Theme>} [sx] - Material-UI sx prop for custom styling
 */
interface ProjectDescriptionProps {
  paragraphs: string | string[];
  tags?: string[];
  circa?: string;
  floatTags?: boolean;
  floatedTagsMaxWidth?: SxProps<Theme>;
  sx?: SxProps<Theme>;
}

/**
 * Creates theme-aware styles for project description content.
 * Adapts link and strong tag colors based on the current theme mode.
 *
 * @param theme - MUI theme object containing palette information
 * @returns SxProps object with theme-aware styling
 */
function getDescriptionSx(theme: Theme): SxProps<Theme> {
  return {
    '& p': {
      margin: '0 0 1rem 0',
      '&:last-child': {
        marginBottom: 0,
      },
    },
    '& a': {
      color: BRAND_COLORS.maroon,
      textDecoration: 'underline',
      '&:hover': {
        color: BRAND_COLORS.maroonDark,
      },
    },
    '& strong': {
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    '& em': {
      fontStyle: 'italic',
    },
    '& ul, & ol': {
      marginLeft: 0,
      marginBottom: '1rem',
      '&:last-child': {
        marginBottom: 0,
      },
    },
    '& li': {
      marginBottom: '0.2rem',
      '&:last-child': {
        marginBottom: 0,
      },
    },
  };
}


/**
 * Renders project description with multiple paragraphs, optional tags, and HTML sanitization.
 *
 * This component safely renders project descriptions as an array of paragraphs.
 * Each paragraph may contain safe HTML markup (links, emphasis, lists).
 * The component uses `isomorphic-dompurify` to sanitize the HTML, removing any potentially
 * dangerous content while preserving safe formatting elements.
 *
 * Tags and date can be rendered in two layouts:
 * - **Stacked (default)**: Tags and date displayed above the description
 * - **Floated**: Tags and date float to the right side, wrapping with description text (for wide-regular layout)
 *
 * **Security:**
 * - All HTML is sanitized before rendering each paragraph
 * - Only safe tags are allowed: a, strong, em, ul, ol, li, br
 * - Only safe attributes are allowed: href, title
 * - XSS prevention through DOMPurify library
 *
 * **Features:**
 * - Supports both string (legacy) and string[] (new) paragraph formats
 * - Responsive typography (smaller on mobile, larger on desktop)
 * - Dark gray text color from color constants
 * - Proper line height and spacing for readability
 * - Technology tags with sage green styling
 * - Circa date displayed with tags using ClientList styling pattern
 * - Memoized sanitization to avoid unnecessary re-sanitizing
 * - Semantic HTML structure with proper link handling
 * - Automatic paragraph spacing with proper margins
 *
 * @param {ProjectDescriptionProps} props - Component props
 * @returns The rendered description with optional tags, date, and sanitized paragraphs
 *
 * @example
 * // Single paragraph (legacy format)
 * <ProjectDescription paragraphs="This is a great project!" />
 *
 * @example
 * // Multiple paragraphs (new format)
 * <ProjectDescription
 *   paragraphs={[
 *     "First paragraph with context",
 *     "Second paragraph with more <em>details</em>"
 *   ]}
 *   tags={["React", "TypeScript"]}
 *   circa="2022-2023"
 * />
 *
 * @example
 * // With floating tags
 * <ProjectDescription
 *   paragraphs={["Built with React", "Modern architecture"]}
 *   tags={["React", "TypeScript"]}
 *   circa="2022-2023"
 *   floatTags
 * />
 */
export function ProjectDescription({
  paragraphs,
  tags,
  circa,
  floatTags = false,
  floatedTagsMaxWidth,
  sx,
}: ProjectDescriptionProps) {
  const theme = useTheme();

  /**
   * Convert single string to array for consistent handling
   */
  const paragraphArray = useMemo(
    () => (Array.isArray(paragraphs) ? paragraphs : [paragraphs]),
    [paragraphs]
  );

  /**
   * Memoize the sanitized paragraphs to avoid re-sanitizing on every render.
   * This uses a centralized sanitization utility that ensures consistent
   * security measures across all components that handle user-provided HTML.
   */
  const sanitizedParagraphs = useMemo(
    () => paragraphArray.map(p => sanitizeDescriptionHtml(p)),
    [paragraphArray]
  );

  /**
   * Memoize the description styles to avoid recalculating on every render.
   * Uses the current theme to provide colors with proper contrast in all modes.
   */
  const descriptionSx = useMemo(
    () => getDescriptionSx(theme),
    [theme]
  );

  /**
   * Helper function to render a single sanitized paragraph.
   *
   * @param {string} html - Sanitized HTML string to render
   * @param {number} index - Index of the paragraph in the array
   * @returns A Box component with the sanitized HTML content
   */
  const renderParagraph = (html: string, index: number) => (
    <Box
      key={index}
      sx={{
        mb: index === sanitizedParagraphs.length - 1 ? 0 : '1rem',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  /**
   * Helper function to render all description paragraphs.
   *
   * @returns A Box component with all sanitized paragraphs
   */
  const renderDescription = () => (
    <Box sx={descriptionSx}>
      {sanitizedParagraphs.map(renderParagraph)}
    </Box>
  );

  // Render tags in stacked layout (above description)
  if (!floatTags && (tags?.length || circa)) {
    return (
      <Box sx={sx}>
        {/* Tags and Date */}
        <ProjectTagsContainer tags={tags} circa={circa} sx={{mb:2}} />

        {/* Description */}
        {renderDescription()}
      </Box>
    );
  }

  // Render tags in floated layout (right side, wrapping with text)
  if (floatTags && (tags?.length || circa)) {
    return (
      <Box sx={sx}>
        {/* Floated tags and date container */}
        <Box
          sx={{
            float: 'right',
            ml: { xs: 1, sm: 2, md: 2 },
            mb: 1,
            ...floatedTagsMaxWidth,
          }}
        >
          <ProjectTagsContainer tags={tags} circa={circa} />
        </Box>

        {/* Description */}
        {renderDescription()}

        {/* Clear float after content */}
        <Box sx={{ clear: 'both' }} />
      </Box>
    );
  }

  // Render description only (no tags)
  return renderDescription();
}
