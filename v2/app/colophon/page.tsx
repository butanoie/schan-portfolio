import type { Metadata } from "next";
import { Container, Divider } from "@mui/material";
import {
  TechnologiesShowcase,
  DesignPhilosophy,
  ButaStory,
} from "../../src/components/colophon";
import PageDeck from "../../src/components/PageDeck";
import { getColophonData } from "../../src/data/colophon";

/**
 * Generate metadata for the colophon page.
 * Uses data from colophon.ts for consistent title and description.
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
 * @returns The complete colophon page
 */
export default function ColophonPage() {
  const data = getColophonData();

  return (
    <Container
      component="main"
      role="article"
      maxWidth="lg"
    >
      {/* About Section */}
      <PageDeck content={data.pageDeck} />

      <Divider sx={{ my: 6, mx: { xs: 0, md: 8} }} />

      {/* Technologies Section */}
      <TechnologiesShowcase content={data.technologies} />

      <Divider sx={{ my: 6, mx: { xs: 0, md: 8} }} />

      {/* Design Philosophy Section */}
      <DesignPhilosophy content={data.designPhilosophy} />
    
      <Divider sx={{ my: 6, mx: { xs: 0, md: 8} }} />

      {/* Buta Story Section */}
      <ButaStory content={data.butaStory} />
    </Container>
  );
}
