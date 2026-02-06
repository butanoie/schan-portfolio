"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from "@mui/icons-material/Launch";
import type { TechnologiesContent, Technology } from "../../types/colophon";
import { BRAND_COLORS } from "../../constants";
import { getPaletteByMode } from "../../lib/themes";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useI18n } from "../../hooks/useI18n";

/**
 * Props for the TechnologiesShowcase component.
 */
export interface TechnologiesShowcaseProps {
  /** Content data for the technologies section */
  content: TechnologiesContent;
}

/**
 * Renders a single technology item with name, description, and optional link.
 *
 * Uses theme-aware card styling to ensure proper contrast and readability
 * across all themes (light, dark, and high-contrast).
 *
 * @param props - Component props
 * @param props.tech - Technology data to display
 * @returns A card displaying the technology information
 *
 * @example
 * ```tsx
 * const tech = {
 *   name: 'React',
 *   description: 'A JavaScript library for building user interfaces with components',
 *   url: 'https://react.dev'
 * };
 * <TechnologyCard tech={tech} />
 * ```
 */
function TechnologyCard({ tech }: { tech: Technology }) {
  const { mode } = useThemeContext();
  const palette = getPaletteByMode(mode);
  const { t } = useI18n();

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: palette.card.background,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            component="h4"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: "1rem",
              color: palette.card.heading,
            }}
          >
            {tech.name}
          </Typography>
          {tech.url && (
            <MuiLink
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("colophon.technologies.visitWebsiteAriaLabel", { name: tech.name, ns: "pages" })}
              sx={{
                color: palette.card.text,
                "&:hover": {
                  color: mode === "highContrast" ? "#000000" : BRAND_COLORS.maroon,
                },
              }}
            >
              <LaunchIcon sx={{ fontSize: 16 }} />
            </MuiLink>
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: palette.card.text,
          }}
        >
          {tech.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

/**
 * TechnologiesShowcase displays the technologies used in the portfolio site.
 *
 * Features:
 * - V2 (current) technologies organized by category
 * - V1 (original) technologies in collapsible section for historical context
 * - Links to technology websites
 * - Responsive grid layout
 *
 * @param props - Component props containing technologies content
 * @param props.content - Content data for the technologies section
 * @returns A section displaying technology stacks
 *
 * @example
 * <TechnologiesShowcase content={colophonData.technologies} />
 */
export default function TechnologiesShowcase({
  content,
}: TechnologiesShowcaseProps) {
  const { intro, categories, v1 } = content;
  const { mode } = useThemeContext();
  const palette = getPaletteByMode(mode);
  const { t } = useI18n(); // Used in TechnologyCard and V1 section headers


  return (
    <Box
      component="section"
      aria-labelledby="technologies-heading"
      sx={{
        mb: 6,
        pb: 1
      }}
    >
      <Typography
        id="technologies-heading"
        variant="h2"
        component="h2"
        sx={{
          color: palette.secondary,
          fontSize: "2rem",
          mt: 0,
          mb: 2,
          textAlign: "center"
        }}
      >
        {t("colophon.technologies.heading", { ns: "pages" })}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          lineHeight: 1.7
        }}
      >
        {intro}
      </Typography>

      {/* V2 Technologies by Category */}
      {categories.map((category) => (
        <Box key={category.label} sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: "1.25rem",
              mb: 2,
            }}
          >
            {category.label}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {category.items.map((tech) => (
              <TechnologyCard key={tech.name} tech={tech} />
            ))}
          </Box>
        </Box>
      ))}

      {/* V1 Technologies (Historical) */}
      <Accordion
        sx={{
          mt: 4,
          backgroundColor: "background.paper",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="v1-technologies-content"
          id="v1-technologies-header"
        >
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: "1.25rem",
            }}
          >
            {t("colophon.technologies.v1.heading", { ns: "pages" })}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {t("colophon.technologies.v1.description", { ns: "pages" })}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {v1.items.map((tech) => (
              <TechnologyCard key={tech.name} tech={tech} />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
