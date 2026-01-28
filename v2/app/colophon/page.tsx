import type { Metadata } from "next";
import { Container, Divider, Box } from "@mui/material";
import {
  AboutSection,
  TechnologiesShowcase,
  DesignPhilosophy,
  ButaStory,
} from "../../src/components/colophon";
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
 * Displays information about the site creator, including:
 * - About section with bio and current role
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
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 6 },
      }}
    >
      <Box
        component="article"
        sx={{
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {/* About Section */}
        <AboutSection content={data.about} />

        <Divider sx={{ my: 4 }} />

        {/* Technologies Section */}
        <TechnologiesShowcase content={data.technologies} />

        <Divider sx={{ my: 4 }} />

        {/* Design Philosophy Section */}
        <DesignPhilosophy content={data.designPhilosophy} />

        <Divider sx={{ my: 4 }} />

        {/* Buta Story Section */}
        <ButaStory content={data.butaStory} />
      </Box>
    </Container>
  );
}
