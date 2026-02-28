"use client";

import React, { createContext, useState, useCallback } from "react";
import { Box, Container } from "@mui/material";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { FrenchTranslationAlert } from "./FrenchTranslationAlert";
import { ProjectLoadingProvider } from "../../contexts/ProjectLoadingContext";
import { useI18n } from "@/src/hooks/useI18n";

/**
 * Represents the loading state for projects in the async list.
 *
 * This interface is used to communicate project loading state from AsyncProjectsList
 * to Footer through the MainLayout component via Context.
 */
interface ProjectLoadingState {
  /** Whether the component is rendering on the home page */
  isHomePage: boolean;
  /** Whether projects are currently being loaded */
  loading: boolean;
  /** Whether there are more projects available to load */
  hasMore: boolean;
  /** Whether all projects have been loaded */
  allLoaded: boolean;
  /** Number of projects remaining to be loaded */
  remainingCount: number;
  /** Callback function to trigger loading more projects */
  onLoadMore: () => void | Promise<void>;
}

/**
 * Context for communicating loading state from AsyncProjectsList to MainLayout.
 *
 * AsyncProjectsList uses this context to report its loading state to the parent
 * MainLayout, which then provides that state to Footer through ProjectLoadingContext.
 *
 * @internal Used internally for bridging component hierarchy
 */
export const ProjectLoadingStateBridgeContext = createContext<{
  onStateChange: (state: ProjectLoadingState | null) => void;
} | null>(null);

/**
 * Main layout component that provides the overall page structure.
 *
 * Includes header, footer, main content area, and a skip-to-content link for keyboard navigation accessibility.
 * This component also provides the ProjectLoadingContext that bridges project loading state
 * from AsyncProjectsList (home page only) to Footer (all pages). The context state is managed
 * here so both the main content and footer can access the same loading state.
 *
 * @param props - The component props
 * @param props.children - The page content to be rendered in the main content area
 * @returns A full-height layout with header, main content, and footer sections
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { t } = useI18n();
  const pathname = usePathname();

  // Project loading context state - shared between AsyncProjectsList and Footer.
  // The handleStateChange callback is a no-op on non-home pages, preventing
  // stale LoadMoreButton state from being set when navigating away from home.
  const isHome = pathname === '/';
  const [projectLoadingState, setProjectLoadingState] = useState<ProjectLoadingState | null>(null);

  /**
   * Wraps setProjectLoadingState to only allow updates on the home page.
   * On non-home pages, loading state stays null (no-op).
   */
  const handleStateChange = useCallback(
    (state: ProjectLoadingState | null) => {
      if (isHome) {
        setProjectLoadingState(state);
      }
    },
    [isHome]
  );

  // Wrap main content and footer together in the provider if needed
  // This allows Footer to access the loading context while staying outside the max-width container
  const mainContent = (
    <>
      <Container
        component="main"
        id="main-content"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        <ProjectLoadingStateBridgeContext.Provider value={{ onStateChange: handleStateChange }}>
          {children}
        </ProjectLoadingStateBridgeContext.Provider>
      </Container>
      <Footer />
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Skip to main content link for keyboard navigation */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          left: "-9999px",
          zIndex: 999,
          padding: "1em",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          textDecoration: "none",
          "&:focus": {
            left: "50%",
            transform: "translateX(-50%)",
            top: 0,
          },
        }}
      >
        {t('nav.skipToMain')}
      </Box>

      <Header />

      <FrenchTranslationAlert />

      {isHome && projectLoadingState !== null ? (
        <ProjectLoadingProvider value={projectLoadingState}>
          {mainContent}
        </ProjectLoadingProvider>
      ) : (
        mainContent
      )}
    </Box>
  );
}

