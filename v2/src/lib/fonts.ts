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
  display: "swap",
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
  display: "swap",
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
  display: "swap",
  variable: "--font-gochi-hand",
});
