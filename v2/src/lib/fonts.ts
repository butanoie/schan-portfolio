/**
 * Next.js font instances for the portfolio application.
 *
 * These call `next/font/google` constructors which are build-time primitives —
 * they MUST only be imported from `layout.tsx` to avoid duplicate instantiation.
 * For font-family CSS strings, import from `./fontConstants.ts` instead.
 *
 * Uses `display: "optional"` to achieve CLS = 0: the browser uses the font
 * only if it is already cached, otherwise falls back to the system font with
 * no layout shift. On repeat visits the font will be cached and used immediately.
 */

import { Open_Sans, Oswald, Gochi_Hand } from "next/font/google";

/**
 * Body text font — Open Sans with 4 weight variants.
 *
 * Used as the default `fontFamily` in MUI theme typography.
 * Applied globally via the `--font-open-sans` CSS variable on `<html>`.
 *
 * @see {@link https://fonts.google.com/specimen/Open+Sans}
 */
export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "optional",
  variable: "--font-open-sans",
});

/**
 * Heading font — Oswald with 2 weight variants.
 *
 * Used for h1–h6 in MUI theme typography.
 * Applied globally via the `--font-oswald` CSS variable on `<html>`.
 *
 * @see {@link https://fonts.google.com/specimen/Oswald}
 */
export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "optional",
  variable: "--font-oswald",
});

/**
 * Decorative cursive font for Buta's thought bubble in the footer.
 *
 * Applied globally via the `--font-gochi-hand` CSS variable on `<html>`.
 *
 * @see {@link https://fonts.google.com/specimen/Gochi+Hand}
 */
export const gochiHand = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "optional",
  variable: "--font-gochi-hand",
});
