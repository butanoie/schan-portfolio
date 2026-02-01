'use client';

import { Box, SxProps, Theme } from '@mui/material';
import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { BRAND_COLORS } from '../../constants';
import { ProjectTagsContainer } from './ProjectTagsContainer';

/**
 * Props for the ProjectDescription component.
 *
 * @interface ProjectDescriptionProps
 * @property {string} html - Raw HTML description content to render
 * @property {string[]} [tags] - Technology/skill tags to display with the description
 * @property {string} [circa] - Timeline or date range for the project
 * @property {boolean} [floatTags] - Whether to float tags to the right of description (default: false)
 * @property {SxProps<Theme>} [floatedTagsMaxWidth] - Max-width for floated tags container (only used when floatTags is true)
 * @property {SxProps<Theme>} [sx] - Material-UI sx prop for custom styling
 */
interface ProjectDescriptionProps {
  html: string;
  tags?: string[];
  circa?: string;
  floatTags?: boolean;
  floatedTagsMaxWidth?: SxProps<Theme>;
  sx?: SxProps<Theme>;
}

/**
 * Configuration for HTML sanitization.
 * Defines which HTML tags and attributes are allowed for security.
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'br'],
  ALLOWED_ATTR: ['href', 'title'],
  KEEP_CONTENT: true,
};

/**
 * Renders HTML project description with optional tags, circa date, and sanitization.
 *
 * This component safely renders project descriptions that contain HTML content.
 * It uses `isomorphic-dompurify` to sanitize the HTML, removing any potentially
 * dangerous content while preserving safe formatting elements.
 *
 * Tags and date can be rendered in two layouts:
 * - **Stacked (default)**: Tags and date displayed above the description
 * - **Floated**: Tags and date float to the right side, wrapping with description text (for wide-regular layout)
 *
 * **Security:**
 * - All HTML is sanitized before rendering
 * - Only safe tags are allowed: p, a, strong, em, ul, ol, li, br
 * - Only safe attributes are allowed: href, title
 * - XSS prevention through DOMPurify library
 *
 * **Features:**
 * - Responsive typography (smaller on mobile, larger on desktop)
 * - Dark gray text color from color constants
 * - Proper line height and spacing for readability
 * - Technology tags with sage green styling
 * - Circa date displayed with tags using ClientList styling pattern
 * - Memoized sanitization to avoid unnecessary re-sanitizing
 * - Semantic HTML structure with proper link handling
 *
 * @param {ProjectDescriptionProps} props - Component props
 * @returns The rendered description with optional tags, date, and sanitized HTML
 *
 * @example
 * <ProjectDescription html="<p>This is a <strong>great</strong> project!</p>" />
 *
 * @example
 * <ProjectDescription
 *   html="<p>Built with React</p>"
 *   tags={["React", "TypeScript"]}
 *   circa="2022-2023"
 * />
 *
 * @example
 * <ProjectDescription
 *   html="<p>Built with React</p>"
 *   tags={["React", "TypeScript"]}
 *   circa="2022-2023"
 *   floatTags
 * />
 */
export function ProjectDescription({
  html,
  tags,
  circa,
  floatTags = false,
  floatedTagsMaxWidth,
  sx,
}: ProjectDescriptionProps) {
  /**
   * Memoize the sanitized HTML to avoid re-sanitizing on every render.
   * DOMPurify sanitization is an expensive operation.
   */
  const sanitizedHtml = useMemo(
    () => DOMPurify.sanitize(html, SANITIZE_CONFIG),
    [html]
  );


  // Render tags in stacked layout (above description)
  if (!floatTags && (tags?.length || circa)) {
    return (
      <Box sx={sx}>
        {/* Tags and Date */}
        <ProjectTagsContainer tags={tags} circa={circa} />

        {/* Description */}
        <Box
          sx={{
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
            lineHeight: 1.7,
            color: BRAND_COLORS.graphite,
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
              color: BRAND_COLORS.graphite,
            },
            '& em': {
              fontStyle: 'italic',
            },
            '& ul, & ol': {
              marginLeft: '1.5rem',
              marginBottom: '1rem',
              '&:last-child': {
                marginBottom: 0,
              },
            },
            '& li': {
              marginBottom: '0.5rem',
              '&:last-child': {
                marginBottom: 0,
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
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

        {/* Description with floated tags and date */}
        <Box
          sx={{
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
            lineHeight: 1.7,
            color: BRAND_COLORS.graphite,
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
              color: BRAND_COLORS.graphite,
            },
            '& em': {
              fontStyle: 'italic',
            },
            '& ul, & ol': {
              marginLeft: '1.5rem',
              marginBottom: '1rem',
              '&:last-child': {
                marginBottom: 0,
              },
            },
            '& li': {
              marginBottom: '0.5rem',
              '&:last-child': {
                marginBottom: 0,
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
        {/* Clear float after content */}
        <Box sx={{ clear: 'both' }} />
      </Box>
    );
  }

  // Render description only (no tags)
  return (
    <Box
      sx={{
        fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
        lineHeight: 1.7,
        color: BRAND_COLORS.graphite,
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
          color: BRAND_COLORS.graphite,
        },
        '& em': {
          fontStyle: 'italic',
        },
        '& ul, & ol': {
          marginLeft: '1.5rem',
          marginBottom: '1rem',
          '&:last-child': {
            marginBottom: 0,
          },
        },
        '& li': {
          marginBottom: '0.5rem',
          '&:last-child': {
            marginBottom: 0,
          },
        },
        ...sx,
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
