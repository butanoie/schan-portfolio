"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import { useState } from "react";
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
  // Project loading context state - shared between AsyncProjectsList and Footer
  const [projectLoadingState, setProjectLoadingState] = useState<ProjectLoadingState | null>(null);

  // Provide the context if state is set (i.e., on home page with AsyncProjectsList)
  // Otherwise Footer will render normally without Load More button
  const shouldWrapWithProvider = projectLoadingState !== null;

  // Create a wrapper component that can update the loading state
  // This allows AsyncProjectsList to communicate with Footer through context
  const childrenWithLoadingBridge = (
    <LoadingStateBridge onStateChange={setProjectLoadingState}>
      {children}
    </LoadingStateBridge>
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
        {childrenWithLoadingBridge}
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

      {shouldWrapWithProvider ? (
        <ProjectLoadingProvider value={projectLoadingState}>
          {mainContent}
        </ProjectLoadingProvider>
      ) : (
        mainContent
      )}
    </Box>
  );
}

/**
 * Bridge component that connects AsyncProjectsList to Footer through loading state.
 *
 * This component wraps the page children and provides a mechanism for AsyncProjectsList
 * to communicate its loading state to the Footer component, which is rendered at the
 * layout level. It uses Context to pass this information.
 *
 * When navigating to non-home pages, this component clears the loading state so Footer
 * displays the normal thought bubble instead of retaining stale home page context.
 *
 * @param props - Component props
 * @param props.children - The page children
 * @param props.onStateChange - Callback invoked when loading state changes
 * @returns The wrapped children with loading state bridge provider
 */
function LoadingStateBridge({
  children,
  onStateChange,
}: {
  children: React.ReactNode;
  onStateChange: (state: ProjectLoadingState | null) => void;
}): React.ReactNode {
  const pathname = usePathname();

  /**
   * Clear loading state when navigating away from home page.
   * This ensures Footer displays the normal thought bubble on non-home pages
   * instead of showing stale LoadMoreButton state from previous home page visits.
   */
  useEffect(() => {
    if (pathname !== '/') {
      onStateChange(null);
    }
  }, [pathname, onStateChange]);

  // Provide a context that AsyncProjectsList can use to report its state
  return (
    <ProjectLoadingStateBridgeProvider onStateChange={onStateChange}>
      {children}
    </ProjectLoadingStateBridgeProvider>
  );
}

import { createContext, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

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
 * Provider for the loading state bridge.
 *
 * Wraps components and provides a context that allows child components to report
 * their loading state to the parent MainLayout through the ProjectLoadingStateBridgeContext.
 *
 * @param props - Provider props
 * @param props.children - Child components to wrap
 * @param props.onStateChange - Callback invoked when child components report state changes
 * @returns The context provider wrapping the children
 *
 * @internal Used internally by MainLayout
 */
function ProjectLoadingStateBridgeProvider({
  children,
  onStateChange,
}: {
  children: ReactNode;
  onStateChange: (state: ProjectLoadingState | null) => void;
}): React.ReactElement {
  return (
    <ProjectLoadingStateBridgeContext.Provider value={{ onStateChange }}>
      {children}
    </ProjectLoadingStateBridgeContext.Provider>
  );
}

