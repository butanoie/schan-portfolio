/**
 * Font-family CSS string constants (single source of truth).
 *
 * These reference CSS custom properties set by `next/font` in layout.tsx.
 * Separated from `fonts.ts` to avoid triggering `next/font/google` constructor
 * side-effects when components only need the CSS variable strings.
 *
 * @see {@link ./fonts.ts} for the `next/font` instances (layout-only)
 */

/** Font-family stack for body text (Open Sans via CSS variable). */
export const FONT_FAMILY_BODY =
  'var(--font-open-sans), "Helvetica", "Arial", sans-serif';

/** Font-family stack for headings (Oswald via CSS variable). */
export const FONT_FAMILY_HEADING =
  'var(--font-oswald), "Helvetica", "Arial", sans-serif';

/** Font-family stack for decorative / cursive text (Gochi Hand via CSS variable). */
export const FONT_FAMILY_CURSIVE = 'var(--font-gochi-hand), cursive';
