"use client";

import { Box } from "@mui/material";
import { useScrollAnimation, useAnimations } from "../../hooks";

/**
 * Wrapper component that applies fade-in and slide-up animations as content enters the viewport.
 *
 * Uses IntersectionObserver via useScrollAnimation to detect when the element
 * becomes visible and triggers a smooth opacity + translateY transition.
 *
 * **Animation Behavior:**
 * - Fades in from 0 to 1 opacity as it enters viewport
 * - Slides up from 20px below to final position
 * - Smooth 400ms ease-out transition
 * - Respects both user animations setting and prefers-reduced-motion
 *
 * Used by ProjectsList (for individual projects) and ColophonContent (for colophon sections).
 *
 * @param props - Component props
 * @param props.children - Content to animate on scroll
 * @returns Animated wrapper that fades in when visible in the viewport
 *
 * @example
 * <ScrollAnimatedSection>
 * <ProjectDetail project={project} />
 * </ScrollAnimatedSection>
 */
export function ScrollAnimatedSection({ children }: { children: React.ReactNode }) {
  const { ref, isInView } = useScrollAnimation();
  const { animationsEnabled } = useAnimations();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: animationsEnabled ? 'all 400ms ease-out' : 'none',
      }}
    >
      {children}
    </Box>
  );
}
