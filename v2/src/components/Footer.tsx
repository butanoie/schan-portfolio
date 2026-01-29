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
        pt: 25,
        overflow: "hidden",
        "@media (min-width: 720px)": {
          pt: 23,
        },
      }}
    >
      {/* Buta Mascot - positioned in the padding area, behind the green footer on mobile */}
      <Box
        sx={{
          position: "absolute",
          bottom: 80,
          right: 12,
          width: 180,
          height: 125,
          margin: 0,
          zIndex: 0,
          "@media (min-width: 720px)": {
            bottom: -56,
            right: 12,
            width: 300,
            height: 209,
            zIndex: 5,
          },
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

      {/* Thought Bubble - positioned above Buta */}
      <Box
        sx={{
          position: "absolute",
          bottom: 220,
          right: 145,
          width: 180,
          height: 90,
          padding: "15px 16px",
          border: "2px solid #333",
          textAlign: "center",
          color: "#555555",
          backgroundColor: "#f5f9fd",
          borderRadius: "160px / 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          "@media (min-width: 720px)": {
            bottom: 160,
            right: 225,
            width: 250,
            height: 125,
            padding: "25px 20px",
          },
          // Small thought bubble circles
          "&::before": {
            content: '""',
            position: "absolute",
            zIndex: 10,
            bottom: -25,
            right: 30,
            width: 17,
            height: 17,
            border: "2px solid #333",
            backgroundColor: "#f5f9fd",
            borderRadius: "50%",
            display: "block",
            "@media (min-width: 720px)": {
              right: 52,
            },
          },
          "&::after": {
            content: '""',
            position: "absolute",
            zIndex: 10,
            bottom: -35,
            right: 20,
            width: 8,
            height: 8,
            border: "2px solid #333",
            backgroundColor: "#f5f9fd",
            borderRadius: "50%",
            display: "block",
            "@media (min-width: 720px)": {
              right: 35,
            },
          },
        }}
        role="img"
        aria-label="Buta's thought bubble saying: Pork products FTW!"
      >
        <Typography
          sx={{
            fontFamily: '"Gochi Hand", cursive',
            fontSize: "1rem",
            color: "#555555",
            "@media (min-width: 720px)": {
              fontSize: "1.125rem",
            },
          }}
        >
          Pork products FTW!
        </Typography>
      </Box>

      {/* Footer Container with Sage Green Background */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: "#85b09c",
          pt: 1.25,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
          }}
        >
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
