"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from "@mui/icons-material/Launch";
import type { TechnologiesContent, Technology } from "../../types/colophon";

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
 * @param props - Component props
 * @param props.tech - Technology data to display
 * @returns A card displaying the technology information
 */
function TechnologyCard({ tech }: { tech: Technology }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f9fd",
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
            }}
          >
            {tech.name}
          </Typography>
          {tech.url && (
            <MuiLink
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${tech.name} website (opens in new tab)`}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.dark" },
              }}
            >
              <LaunchIcon sx={{ fontSize: 16 }} />
            </MuiLink>
          )}
        </Box>
        <Typography variant="body2" color="text.primary">
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
  const { intro, v2Categories, v1Technologies } = content;

  return (
    <Box
      component="section"
      aria-labelledby="technologies-heading"
      sx={{ mb: 6 }}
    >
      <Typography
        id="technologies-heading"
        variant="h2"
        component="h2"
        sx={{
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 700,
          color: "#8B1538",
          fontSize: { xs: "1.75rem", md: "2rem" },
          mb: 3,
          textAlign: "center"
        }}
      >
        Technologies
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
      {v2Categories.map((category) => (
        <Box key={category.label} sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              mb: 2,
            }}
          >
            { category.label }
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
            {category.technologies.map((tech) => (
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
              fontSize: "1.1rem",
            }}
          >
            Original V1 Technologies (Historical)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            The original portfolio site was built with these technologies:
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
            {v1Technologies.map((tech) => (
              <TechnologyCard key={tech.name} tech={tech} />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
