"use client";

import { Box, Container } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      <Container
        component="main"
        id="main-content"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        {children}
      </Container>

      <Footer />
    </Box>
  );
}
