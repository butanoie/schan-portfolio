"use client";

import { Box, Container, Typography, Link } from "@mui/material";

/**
 * Footer component displaying copyright information and footer navigation links.
 * Includes links to Portfolio, Resume, and Colophon pages with accessible navigation.
 *
 * @returns A footer section with copyright notice and navigation links
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Sing Chan. All rights reserved.
          </Typography>
          <Box component="nav" aria-label="Footer navigation">
            <Link
              href="/"
              color="text.secondary"
              sx={{ mx: 1 }}
              underline="hover"
            >
              Portfolio
            </Link>
            <Link
              href="/resume"
              color="text.secondary"
              sx={{ mx: 1 }}
              underline="hover"
            >
              Resume
            </Link>
            <Link
              href="/colophon"
              color="text.secondary"
              sx={{ mx: 1 }}
              underline="hover"
            >
              Colophon
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
