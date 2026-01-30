'use client';

import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import DOMPurify from 'isomorphic-dompurify';
import { BRAND_COLORS } from '@/src/constants/colors';

/**
 * Props for the ProjectDescription component.
 */
export interface ProjectDescriptionProps {
  /** Project description in HTML format */
  html: string;

  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * Renders a sanitized HTML project description with styled formatting.
 *
 * ## Features
 * - **HTML Sanitization:** Prevents XSS attacks using DOMPurify
 * - **Rich Text Support:** Allows paragraphs, lists, links, and emphasis
 * - **Styled Links:** Brand-colored links with hover effects
 * - **Responsive Typography:** Adapts text size to screen size
 * - **Semantic HTML:** Preserves document structure for accessibility
 *
 * ## Allowed HTML Tags
 * - Text formatting: `<strong>`, `<em>`, `<br>`
 * - Structure: `<p>`, `<ul>`, `<ol>`, `<li>`
 * - Links: `<a>` (with href, target, rel attributes)
 *
 * ## Security
 * All HTML is sanitized using DOMPurify to prevent XSS attacks. Only safe
 * tags and attributes are allowed.
 *
 * @param props - Component props
 * @param props.html - Raw HTML string containing project description
 * @param props.sx - Optional styling overrides
 * @returns A div containing the sanitized and styled HTML content
 *
 * @example
 * ```tsx
 * <ProjectDescription
 *   html="<p>This is a <strong>great</strong> project with <a href='https://example.com'>a link</a>.</p>"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Description with lists
 * <ProjectDescription
 *   html={`
 *     <p>Key features include:</p>
 *     <ul>
 *       <li>Feature 1</li>
 *       <li>Feature 2</li>
 *     </ul>
 *   `}
 * />
 * ```
 */
export function ProjectDescription({ html, sx }: ProjectDescriptionProps) {
  /**
   * Sanitizes HTML content to prevent XSS attacks.
   * Only allows safe formatting and structural tags.
   *
   * @param rawHtml - Raw HTML string
   * @returns Sanitized HTML string safe for rendering
   */
  const sanitizeHtml = (rawHtml: string): string => {
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'br'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      // Ensure external links open in new tab with security
      ADD_ATTR: ['target', 'rel'],
    });
  };

  return (
    <Box
      component="section"
      aria-label="Project description"
      sx={{
        fontSize: { xs: '1rem', md: '1.125rem' },
        lineHeight: 1.7,
        color: BRAND_COLORS.graphite,
        marginBottom: 4,

        // Paragraph spacing
        '& p': {
          marginBottom: 2,
          '&:last-child': {
            marginBottom: 0,
          },
        },

        // Link styling
        '& a': {
          color: BRAND_COLORS.maroon,
          textDecoration: 'none',
          borderBottom: `1px solid transparent`,
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderBottom: `1px solid ${BRAND_COLORS.maroon}`,
          },
          '&:focus': {
            outline: `2px solid ${BRAND_COLORS.maroon}`,
            outlineOffset: 2,
          },
        },

        // List styling
        '& ul, & ol': {
          marginBottom: 2,
          paddingLeft: 3,
        },

        '& li': {
          marginBottom: 0.5,
        },

        // Text formatting
        '& strong': {
          fontWeight: 700,
          color: BRAND_COLORS.graphite,
        },

        '& em': {
          fontStyle: 'italic',
        },

        ...sx,
      }}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
