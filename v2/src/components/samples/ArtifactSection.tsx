'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { usePalette } from '../../hooks/usePalette';
import { useI18n } from '../../hooks/useI18n';
import { FONT_FAMILY_HEADING } from '@/src/lib/fontConstants';
import { BRAND_COLORS, NAV_COLORS } from '@/src/constants';
import type { ResolvedArtifactItem } from '@/src/data/samples';

/**
 * Props for the ArtifactSection component.
 */
interface ArtifactSectionProps {
  /** Section heading text */
  heading: string;
  /** Section introduction paragraph */
  intro: string;
  /** Artifact items to render as cards */
  items: ResolvedArtifactItem[];
}

/**
 * Renders a themed section of the Writing Samples page with artifact cards.
 *
 * Each section displays an h2 heading in Oswald font, an introductory paragraph,
 * and a responsive grid of artifact cards. Each card shows the artifact title,
 * description, and a download button for the document's format (PDF or Markdown).
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
  const { palette, isHighContrast } = usePalette();
  const { t } = useI18n();

  return (
    <Box component="section" aria-label={heading}>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontFamily: FONT_FAMILY_HEADING,
          fontWeight: 700,
          color: palette.secondary,
          fontSize: { xs: '1.5rem', md: '2rem' },
          textAlign: 'center',
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
          fontSize: { xs: '1rem', md: '1.05rem' },
          color: palette.text.secondary,
        }}
      >
        {intro}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {items.map((item) => (
          <Card
            key={item.format?.href ?? item.title}
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: palette.card.background,
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontFamily: FONT_FAMILY_HEADING,
                  fontWeight: 600,
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                  lineHeight: 1.3,
                  mb: 1,
                  color: palette.card.heading,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: palette.card.text,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </Typography>
            </CardContent>

            {item.format && (
              <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                  href={item.format.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  startIcon={<DownloadIcon />}
                  aria-label={t('samples.labels.viewDocument', {
                    ns: 'pages',
                    title: `${item.title}, ${item.format.label}`,
                  })}
                  variant="contained"
                  sx={{
                    minHeight: 44,
                    width: 120,
                    backgroundColor: isHighContrast
                      ? '#000000'
                      : BRAND_COLORS.sage,
                    color: isHighContrast ? '#FFFFFF' : NAV_COLORS.text,
                    border: isHighContrast ? '1px solid #FFFFFF' : 'none',
                    boxShadow: 0,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: isHighContrast
                        ? '#FFFFFF'
                        : NAV_COLORS.inactiveHover,
                      borderColor: isHighContrast ? '#000000' : undefined,
                      color: isHighContrast ? '#000000' : undefined,
                      boxShadow: 0,
                    },
                  }}
                >
                  {item.format.label}
                </Button>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
}
