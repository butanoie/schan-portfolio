"use client";

import { Divider } from "@mui/material";
import { getLocalizedColophonData } from "../../data/colophon";
import { useI18n } from "../../hooks/useI18n";
import PageDeck from "../common/PageDeck";
import { ScrollAnimatedSection } from "../common/ScrollAnimatedSection";
import TechnologiesShowcase from "./TechnologiesShowcase";
import DesignPhilosophy from "./DesignPhilosophy";
import ButaStory from "./ButaStory";

/**
 * ColophonContent renders the localized colophon page content.
 *
 * This client component uses i18n to retrieve translated content for all
 * colophon sections (about, technologies, design philosophy, buta story).
 * Each section has scroll-triggered fade-in animations as it enters the viewport.
 *
 * @returns The colophon page content with localized text and scroll animations
 */
export default function ColophonContent() {
  const { t, locale } = useI18n();
  const data = getLocalizedColophonData(t, locale);

  return (
    <>
      {/* About Section */}
      <PageDeck content={data.pageDeck} />

      <Divider sx={{ my: 6, mx: { xs: 0, md: 8 } }} />

      {/* Technologies Section */}
      <ScrollAnimatedSection>
        <TechnologiesShowcase content={data.technologies} />
      </ScrollAnimatedSection>

      <Divider sx={{ my: 6, mx: { xs: 0, md: 8 } }} />

      {/* Design Philosophy Section */}
      <ScrollAnimatedSection>
        <DesignPhilosophy content={data.designPhilosophy} />
      </ScrollAnimatedSection>

      <Divider sx={{ my: 6, mx: { xs: 0, md: 8 } }} />

      {/* Buta Story Section */}
      <ScrollAnimatedSection>
        <ButaStory content={data.butaStory} />
      </ScrollAnimatedSection>
    </>
  );
}
