"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navigation link configuration for the footer.
 */
interface NavLink {
  /** Display label for the link */
  label: string;
  /** URL path for the link */
  href: string;
  /** Icon component to display */
  icon: React.ReactNode;
}


/**
 * Footer component displaying navigation, Buta mascot, and copyright.
 * Styled to match the V1 portfolio footer with:
 * - Sage green background
 * - Navigation buttons (Portfolio, Résumé, Colophon)
 * - Buta mascot with thought bubble positioned on the right
 * - Copyright notice
 *
 * @returns A footer section with navigation, mascot, and copyright
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  /**
   * Navigation links for the footer.
   */
  const navLinks: NavLink[] = [
    { label: "Portfolio", href: "/", icon: <HomeIcon /> },
    { label: "Résumé", href: "/resume", icon: <DescriptionIcon /> },
    { label: "Colophon", href: "/colophon", icon: <InfoIcon /> },
  ];


  /**
   * Check if a link is the current active page.
   *
   * @param href - The link path to check
   * @returns True if the link matches the current pathname
   */
  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        pt: { xs: 30, sm: 25 },
        overflow: "hidden",
      }}
    >
      {/* Footer Container with Sage Green Background */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: "#85b09c",
          pt: 1.25,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
          }}
        >
          {/* Thought Bubble - positioned above the footer content */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 110, sm: 160 },
              right: { xs: 140, sm: 225 },
              width: { xs: 180, sm: 250 },
              height: { xs: 90, sm: 125 },
              padding: { xs: "15px 16px", sm: "25px 20px" },
              border: "2px solid #333",
              textAlign: "center",
              color: "#555555",
              backgroundColor: "#f5f9fd",
              borderRadius: "160px / 80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              // Small thought bubble circles
              "&::before": {
                content: '""',
                position: "absolute",
                zIndex: 10,
                bottom: -25,
                right: { xs: 30, sm: 52 },
                width: 17,
                height: 17,
                border: "2px solid #333",
                backgroundColor: "#f5f9fd",
                borderRadius: "50%",
                display: "block",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                zIndex: 10,
                bottom: -35,
                right: { xs: 20, sm: 35 },
                width: 8,
                height: 8,
                border: "2px solid #333",
                backgroundColor: "#f5f9fd",
                borderRadius: "50%",
                display: "block",
              },
            }}
            role="img"
            aria-label="Buta's thought bubble saying: Pork products FTW!"
          >
            <Typography
              sx={{
                fontFamily: '"Gochi Hand", cursive',
                fontSize: { xs: "1rem", sm: "1.125rem" },
                color: "#555555",
              }}
            >
              Pork products FTW!
            </Typography>
          </Box>

          {/* Buta Mascot - positioned absolutely on the right of the centered container */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: -30, sm: -56 },
              right: { xs: 12, sm: 12 },
              width: { xs: 180, sm: 300 },
              height: { xs: 125, sm: 209 },
              margin: 0,
              zIndex: 5,
            }}
          >
            <Image
              src="/images/buta/buta@2x.png"
              alt="Buta, a pig mascot wearing a business suit"
              width={300}
              height={209}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              priority={false}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Navigation Links */}
            <Box
              component="nav"
              aria-label="Footer navigation"
              sx={{
                display: "flex",
                gap: 1,
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="contained"
                  startIcon={link.icon}
                  size="medium"
                  sx={{
                    backgroundColor: isActive(link.href)
                      ? "#ae113d"
                      : "#6a8a7a",
                    color: "#ffffff",
                    fontFamily: '"Open Sans", sans-serif',
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: 1,
                    px: 2,
                    py: 0.75,
                    "&:hover": {
                      backgroundColor: isActive(link.href)
                        ? "#8B1538"
                        : "#5a7a6a",
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Copyright */}
            <Typography
              variant="body2"
              sx={{
                color: "#f1f1f1",
                fontSize: "0.8125rem",
                lineHeight: 1.4,
                py: 1.25,
              }}
            >
              2013-{currentYear} Sing Chan
              <br />
              All trademarks are the property of their respective owners.
            </Typography>
          </Box>
        </Container>
      </Container>
    </Box>
  );
}
