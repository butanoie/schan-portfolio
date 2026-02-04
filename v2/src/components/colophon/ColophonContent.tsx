"use client";

import { Divider } from "@mui/material";
import { getLocalizedColophonData } from "../../data/colophon";
import { useI18n } from "../../hooks/useI18n";
import PageDeck from "../common/PageDeck";
import TechnologiesShowcase from "./TechnologiesShowcase";
import DesignPhilosophy from "./DesignPhilosophy";
import ButaStory from "./ButaStory";

/**
 * ColophonContent renders the localized colophon page content.
 *
 * This client component uses i18n to retrieve translated content for all
 * colophon sections (about, technologies, design philosophy, buta story).
 *
 * @returns The colophon page content with localized text
 */
export default function ColophonContent() {
  const { t } = useI18n();
  const data = getLocalizedColophonData(t);

  return (
    <>
      {/* About Section */}
      <PageDeck content={data.pageDeck} />

      <Divider sx={{ my: 6, mx: { xs: 0, md: 8 } }} />

      {/* Technologies Section */}
      <TechnologiesShowcase content={data.technologies} />

      <Divider sx={{ my: 6, mx: { xs: 0, md: 8 } }} />

      {/* Design Philosophy Section */}
      <DesignPhilosophy content={data.designPhilosophy} />

      <Divider sx={{ my: 6, mx: { xs: 0, md: 8 } }} />

      {/* Buta Story Section */}
      <ButaStory content={data.butaStory} />
    </>
  );
}
