"use client";

import { Box, Divider } from "@mui/material";
import { getLocalizedColophonData } from "../../data/colophon";
import { useI18n } from "../../hooks/useI18n";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import PageDeck from "../common/PageDeck";
import TechnologiesShowcase from "./TechnologiesShowcase";
import DesignPhilosophy from "./DesignPhilosophy";
import ButaStory from "./ButaStory";

/**
 * Wrapper component that applies fade-in and slide-up animations to colophon sections.
 *
 * This component uses the useScrollAnimation hook to detect when a section enters
 * the viewport and triggers an animation. Each section fades in and slides up
 * from below as the user scrolls down the page.
 *
 * **Animation Behavior:**
 * - Fades in from 0 to 1 opacity as it enters viewport
 * - Slides up from 20px below to final position
 * - Smooth 400ms ease-out transition
 * - Respects prefers-reduced-motion for accessibility
 *
 * @param props - Component props
 * @param props.children - Section content to animate
 * @returns Animated section wrapper
 *
 * @example
 * <ScrollAnimatedSection>
 * <TechnologiesShowcase {...props} />
 * </ScrollAnimatedSection>
 */
function ScrollAnimatedSection({ children }: { children: React.ReactNode }) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 400ms ease-out',
      }}
    >
      {children}
    </Box>
  );
}

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
  const { t } = useI18n();
  const data = getLocalizedColophonData(t);

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
