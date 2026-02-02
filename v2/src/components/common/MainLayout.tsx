"use client";

import { Box, Container } from "@mui/material";
import { useState, useMemo } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ProjectLoadingProvider } from "../../contexts/ProjectLoadingContext";

/**
 * Main layout component that provides the overall page structure.
 * Includes header, footer, main content area, and a skip-to-content link for keyboard navigation accessibility.
 *
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
}) {
  // Project loading context state - shared between AsyncProjectsList and Footer
  const [projectLoadingState, setProjectLoadingState] = useState<any>(null);

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
        Skip to main content
      </Box>

      <Header />

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
 * @param props - Component props
 * @param props.children - The page children
 * @param props.onStateChange - Callback when loading state changes
 * @returns The wrapped children
 */
function LoadingStateBridge({
  children,
  onStateChange,
}: {
  children: React.ReactNode;
  onStateChange: (state: any) => void;
}) {
  // Provide a context that AsyncProjectsList can use to report its state
  return (
    <ProjectLoadingStateBridgeProvider onStateChange={onStateChange}>
      {children}
    </ProjectLoadingStateBridgeProvider>
  );
}

import { createContext, useContext, ReactNode } from "react";

/**
 * Context for communicating loading state from AsyncProjectsList to MainLayout.
 *
 * AsyncProjectsList uses this context to report its loading state to the parent
 * MainLayout, which then provides that state to Footer through ProjectLoadingContext.
 *
 * @internal Used internally for bridging component hierarchy
 */
const ProjectLoadingStateBridgeContext = createContext<{
  onStateChange: (state: any) => void;
} | null>(null);

/**
 * Provider for the loading state bridge.
 *
 * @internal Used internally by MainLayout
 */
function ProjectLoadingStateBridgeProvider({
  children,
  onStateChange,
}: {
  children: ReactNode;
  onStateChange: (state: any) => void;
}) {
  return (
    <ProjectLoadingStateBridgeContext.Provider value={{ onStateChange }}>
      {children}
    </ProjectLoadingStateBridgeContext.Provider>
  );
}

/**
 * Hook for AsyncProjectsList to report its loading state to MainLayout.
 *
 * When AsyncProjectsList mounts on the home page, it calls this hook to provide
 * its loading context to the parent MainLayout, which makes it available to Footer.
 *
 * @param state - The loading state from AsyncProjectsList
 * @internal Used internally by AsyncProjectsList
 */
export function useReportProjectLoadingState(state: any) {
  const bridge = useContext(ProjectLoadingStateBridgeContext);
  const memoizedState = useMemo(() => state, [
    state?.isHomePage,
    state?.loading,
    state?.hasMore,
    state?.allLoaded,
    state?.remainingCount,
    state?.onLoadMore,
  ]);

  if (bridge) {
    bridge.onStateChange(memoizedState);
  }
}
