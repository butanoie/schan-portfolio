'use client';

import { Box, SxProps, Theme } from '@mui/material';
import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { BRAND_COLORS } from '../../constants';

/**
 * Props for the ProjectDescription component.
 *
 * @interface ProjectDescriptionProps
 * @property {string} html - Raw HTML description content to render
 * @property {SxProps<Theme>} [sx] - Material-UI sx prop for custom styling
 */
interface ProjectDescriptionProps {
  html: string;
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
 * Renders HTML project description with sanitization for security.
 *
 * This component safely renders project descriptions that contain HTML content.
 * It uses `isomorphic-dompurify` to sanitize the HTML, removing any potentially
 * dangerous content while preserving safe formatting elements.
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
 * - Memoized sanitization to avoid unnecessary re-sanitizing
 * - Semantic HTML structure with proper link handling
 *
 * @param {ProjectDescriptionProps} props - Component props
 * @returns The rendered sanitized HTML description
 *
 * @example
 * <ProjectDescription html="<p>This is a <strong>great</strong> project!</p>" />
 *
 * @example
 * <ProjectDescription
 *   html="<p>Built with React</p><ul><li>Feature 1</li><li>Feature 2</li></ul>"
 * />
 */
export function ProjectDescription({
  html,
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
