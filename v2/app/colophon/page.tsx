import type { Metadata } from "next";
import { Container } from "@mui/material";
import ColophonContent from "../../src/components/colophon/ColophonContent";

/**
 * Generate metadata for the colophon page.
 * Uses hardcoded values in English as metadata must be generated on the server
 * and cannot access i18n translation functions.
 */
export const metadata: Metadata = {
  title: "Colophon | Sing Chan's Portfolio",
  description:
    "About Sing Chan, the technologies behind this portfolio site, design philosophy, and the story of Buta the mascot.",
};

/**
 * Colophon page component.
 *
 * Displays information about the site, including:
 * - About section with intro image, heading, and deck paragraphs
 * - Technologies used to build the portfolio
 * - Design philosophy with color palette and typography
 * - The story of Buta, the portfolio mascot
 *
 * Content is localized via ColophonContent client component.
 *
 * @returns The complete colophon page
 */
export default function ColophonPage() {
  return (
    <Container component="main" role="article" maxWidth="lg">
      <ColophonContent />
    </Container>
  );
}
