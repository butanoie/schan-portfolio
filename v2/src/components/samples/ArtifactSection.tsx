"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { usePalette } from "../../hooks/usePalette";
import { useI18n } from "../../hooks/useI18n";
import { FONT_FAMILY_HEADING } from "@/src/lib/fontConstants";

/**
 * Resolved artifact item data for rendering.
 */
interface ArtifactItemData {
  /** Display title for the artifact */
  title: string;
  /** Description of the artifact */
  description: string;
  /** Available download formats with labels and URLs */
  formats: { label: string; href: string }[];
  /** Whether the document is available for download */
  available: boolean;
}

/**
 * Props for the ArtifactSection component.
 */
interface ArtifactSectionProps {
  /** Section heading text */
  heading: string;
  /** Section introduction paragraph */
  intro: string;
  /** Artifact items to render as cards */
  items: ArtifactItemData[];
}

/**
 * Renders a themed section of the Writing Samples page with artifact cards.
 *
 * Each section displays an h2 heading in Oswald font, an introductory paragraph,
 * and a responsive grid of artifact cards. Available artifacts show download
 * buttons for each format (PDF, Markdown); unavailable artifacts display a
 * "Coming Soon" chip with no download actions.
 *
 * @param props - Section content including heading, intro, and artifact items
 * @param props.heading - Section heading text displayed as h2
 * @param props.intro - Section introduction paragraph
 * @param props.items - Artifact items to render as cards
 * @returns A section element with heading, intro, and artifact card grid
 *
 * @example
 * ```tsx
 * <ArtifactSection
 *   heading="Defining the Vision"
 *   intro="Product strategy begins with..."
 *   items={sectionData.items}
 * />
 * ```
 */
export default function ArtifactSection({
  heading,
  intro,
  items,
}: ArtifactSectionProps) {
  const { palette } = usePalette();
  const { t } = useI18n();

  return (
    <Box component="section" aria-label={heading}>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontFamily: FONT_FAMILY_HEADING,
          fontWeight: 700,
          color: palette.text.primary,
          fontSize: { xs: "1.5rem", md: "2rem" },
          mb: 2,
        }}
      >
        {heading}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          lineHeight: 1.7,
          fontSize: { xs: "1rem", md: "1.05rem" },
          color: palette.text.secondary,
        }}
      >
        {intro}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {items.map((item) => (
          <Card
            key={item.title}
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              opacity: item.available ? 1 : 0.7,
              transition: "box-shadow 200ms ease",
              "&:hover": item.available
                ? { boxShadow: 3 }
                : undefined,
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontFamily: FONT_FAMILY_HEADING,
                    fontWeight: 600,
                    fontSize: { xs: "1.05rem", md: "1.15rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </Typography>
                {!item.available && (
                  <Chip
                    label={t("samples.labels.comingSoon", { ns: "pages" })}
                    size="small"
                    aria-label={`${item.title}: ${t("samples.labels.comingSoon", { ns: "pages" })}`}
                    sx={{ flexShrink: 0 }}
                  />
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </Typography>
            </CardContent>

            {item.available && item.formats.length > 0 && (
              <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                {item.formats.map((format) => (
                  <Button
                    key={format.label}
                    href={format.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<DownloadIcon />}
                    aria-label={t("samples.labels.viewDocument", {
                      ns: "pages",
                      title: `${item.title}, ${format.label}`,
                    })}
                    sx={{ minHeight: 44, minWidth: 44 }}
                  >
                    {format.label}
                  </Button>
                ))}
              </CardActions>
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
}
