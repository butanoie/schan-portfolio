"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { AboutContent, SocialLink } from "../../types/colophon";

/**
 * Props for the AboutSection component.
 */
export interface AboutSectionProps {
  /** Content data for the about section */
  content: AboutContent;
}

/**
 * Maps icon identifiers to MUI icon components.
 *
 * @param icon - The icon identifier string
 * @returns The corresponding MUI icon component
 */
function getIconComponent(icon: SocialLink["icon"]) {
  switch (icon) {
    case "linkedin":
      return <LinkedInIcon />;
    case "github":
      return <GitHubIcon />;
    case "email":
      return <EmailIcon />;
    case "website":
      return <LanguageIcon />;
    default:
      return <LanguageIcon />;
  }
}

/**
 * AboutSection displays biographical information and current role details.
 *
 * Features:
 * - Name and current position with company
 * - Brief biography
 * - List of responsibilities
 * - Optional social/contact links
 *
 * @param props - Component props containing about content
 * @param props.content - Content data for the about section
 * @returns A section displaying bio and role information
 *
 * @example
 * <AboutSection content={colophonData.about} />
 */
export default function AboutSection({ content }: AboutSectionProps) {
  const { name, currentRole, company, bio, responsibilities, links } = content;

  return (
    <Box
      component="section"
      aria-labelledby="about-heading"
      sx={{ mb: 6 }}
    >
      <Typography
        id="about-heading"
        variant="h2"
        component="h2"
        sx={{
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 700,
          color: "#8B1538",
          fontSize: { xs: "1.75rem", md: "2rem" },
          mb: 3,
        }}
      >
        About
      </Typography>

      <Typography
        variant="h3"
        component="p"
        sx={{
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 600,
          fontSize: { xs: "1.25rem", md: "1.5rem" },
          mb: 1,
        }}
      >
        {name}
      </Typography>

      <Typography
        variant="subtitle1"
        component="p"
        sx={{
          color: "text.secondary",
          mb: 2,
          fontSize: "1.1rem",
        }}
      >
        {currentRole} at {company}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 3,
          lineHeight: 1.7,
          maxWidth: "65ch",
        }}
      >
        {bio}
      </Typography>

      {responsibilities.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h3"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: "1.1rem",
              mb: 1.5,
            }}
          >
            Responsibilities
          </Typography>
          <List
            dense
            sx={{ pl: 0 }}
            aria-label="List of current responsibilities"
          >
            {responsibilities.map((responsibility, index) => (
              <ListItem key={index} sx={{ pl: 0, alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 18, color: "secondary.dark" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={responsibility}
                  primaryTypographyProps={{
                    variant: "body2",
                    sx: { lineHeight: 1.6 },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {links && links.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
          aria-label="Social and contact links"
        >
          {links.map((link) => (
            <Tooltip key={link.url} title={link.label}>
              <IconButton
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (opens in new tab)`}
                sx={{
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.dark",
                    backgroundColor: "primary.light",
                  },
                }}
              >
                {getIconComponent(link.icon)}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )}
    </Box>
  );
}
