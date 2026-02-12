"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Link as MuiLink,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import type { DesignPhilosophyContent, ColorSwatch, TypographyEntry } from "../../types/colophon";
import { BRAND_COLORS } from "../../constants";
import { getPaletteByMode } from "../../lib/themes";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useI18n } from "../../hooks/useI18n";

/**
 * Props for the DesignPhilosophy component.
 */
export interface DesignPhilosophyProps {
  /** Content data for the design philosophy section */
  content: DesignPhilosophyContent;
}

/**
 * Determines appropriate text color for contrast against a background color.
 * Uses relative luminance calculation to decide between white and dark text.
 *
 * @param hexColor - Hex color code (e.g., "#FFF0F5")
 * @returns Text color that provides sufficient contrast
 */
function getContrastTextColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, dark for light backgrounds
  return luminance > 0.5 ? BRAND_COLORS.graphite : "#FFFFFF";
}

/**
 * Renders a single color swatch with name, hex code, and description.
 *
 * @param props - Component props
 * @param props.color - Color swatch data to display
 * @returns A card displaying the color swatch
 */
function ColorSwatchCard({ color }: { color: ColorSwatch }) {
  const textColor = getContrastTextColor(color.hex);
  const { mode } = useThemeContext();
  const palette = getPaletteByMode(mode);

  return (
    <Card
      className="color-card"
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: palette.card.background,
      }}
    >
      <Box
        className="color-swatch-display"
        sx={{
          backgroundColor: color.hex,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: textColor,
          "--swatch-color": color.hex,
        } as React.CSSProperties}
        aria-hidden="true"
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            fontWeight: 600,
            letterSpacing: 1,
            fontSize: "1rem",
          }}
        >
          {color.hex}
        </Typography>
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 1.5 }}>
        <Typography
          variant="subtitle2"
          component="h4"
          sx={{
            fontFamily: '"Oswald", sans-serif',
            fontWeight: 600,
            mb: 0.5,
            fontSize: "1rem",
            color: palette.card.heading,
          }}
        >
          {color.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: palette.card.text,
          }}
        >
          {color.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

/**
 * Renders a single typography sample with font name, usage, and sample text.
 *
 * @param props - Component props
 * @param props.font - Typography entry data to display
 * @returns A card displaying the typography sample
 */
function TypographySampleCard({ font }: { font: TypographyEntry }) {
  const { mode } = useThemeContext();
  const palette = getPaletteByMode(mode);
  const { t } = useI18n();

  return (
    <Card
      className="typography-card"
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: palette.card.background,
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            component="h4"
            sx={{
              fontFamily: '"Oswald", sans-serif',
              fontWeight: 600,
              fontSize: "1rem",
              color: palette.card.heading,
            }}
          >
            {font.name}
          </Typography>
          {font.url && (
            <MuiLink
              href={font.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("colophon.designPhilosophy.googleFontsAriaLabel", { variables: { name: font.name }, ns: "pages" })}
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
            mb: 2,
            flexGrow: 1,
          }}
        >
          {font.usage}
        </Typography>

        <Box
          className="typography-sample"
          sx={{
            p: 2,
            backgroundColor: "background.default",
            borderRadius: 1,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 80,
          }}
          aria-label={`Sample of ${font.name} font`}
        >
          <Typography
            sx={{
              fontFamily: font.fontFamily,
              fontWeight: font.fontWeight || 400,
              fontSize: font.sampleFontSize || "1rem",
              lineHeight: 1.4,
            }}
          >
            {font.sample}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * DesignPhilosophy displays the color palette and typography of the portfolio.
 *
 * Features:
 * - Color swatches with hex codes and usage descriptions
 * - Typography samples with actual font rendering
 * - Links to Google Fonts for each typeface
 * - Responsive grid layout
 *
 * @param props - Component props containing design philosophy content
 * @param props.content - Content data for the design philosophy section
 * @returns A section displaying design system information
 *
 * @example
 * <DesignPhilosophy content={colophonData.designPhilosophy} />
 */
export default function DesignPhilosophy({ content }: DesignPhilosophyProps) {
  const { intro, colors, colorDescription, typography, typographyIntro } = content;
  const { mode } = useThemeContext();
  const palette = getPaletteByMode(mode);
  const { t } = useI18n();

  return (
    <Box
      id="design-philosophy"
      component="section"
      aria-labelledby="design-heading"
      sx={{ 
        mb: 6,
        pb: 1
      }}
    >
      <Typography
        id="design-heading"
        className="section-heading"
        variant="h2"
        sx={{
          color: palette.secondary,
          fontSize: "2rem",
          mt: 0,
          mb: 3,
          textAlign: "center",
        }}
      >
        {t("colophon.designPhilosophy.heading", { ns: "pages" })}
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

      {/* Color Palette */}
      <Box
        className="design-category"
        sx={{ mb: 5 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Oswald", sans-serif',
            fontWeight: 600,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 2,
          }}
        >
          {t("colophon.designPhilosophy.colorPaletteHeading", { ns: "pages" })}
        </Typography>

        <Box
          className="color-palette-grid"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
              md: "repeat(6, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {colors.map((color) => (
            <ColorSwatchCard key={color.name} color={color} />
          ))}
        </Box>

        <Typography
          variant="body1"
        >
          {colorDescription}
        </Typography>
      </Box>

      {/* Typography */}
      <Box
        className="design-category"
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Oswald", sans-serif',
            fontWeight: 600,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 2,
          }}
        >
          {t("colophon.designPhilosophy.typographyHeading", { ns: "pages" })}
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 3, maxWidth: "65ch" }}
        >
          {typographyIntro}
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
          {typography.map((font) => (
            <TypographySampleCard key={font.name} font={font} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
