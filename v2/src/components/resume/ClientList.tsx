import { useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { getHcContainerSx, getHcChipSx } from '../../utils/highContrastStyles';

/**
 * Estimates the rendered pixel width of a chip based on its label text.
 *
 * Uses average character width for the chip font (0.75rem/600 weight) plus
 * horizontal padding (px: 1.25 = 10px each side) and chip border.
 *
 * @param label - The chip label text
 * @returns Estimated width in pixels
 */
function estimateChipWidth(label: string): number {
  const AVG_CHAR_WIDTH = 6.8;
  const CHIP_HORIZONTAL_PADDING = 24;
  return label.length * AVG_CHAR_WIDTH + CHIP_HORIZONTAL_PADDING;
}

/**
 * Reorders items using first-fit-decreasing bin packing to minimize
 * wasted horizontal space in a flex-wrap layout.
 *
 * Sorts items by estimated width (descending), then greedily assigns each
 * item to the first row that has enough remaining space. The result is a
 * flat array ordered by row, producing denser rows when rendered in a
 * flex-wrap container.
 *
 * @param items - Array of string labels to pack
 * @param containerWidth - Estimated container width in pixels
 * @param gap - Gap between items in pixels
 * @returns Reordered array of labels optimized for row density
 */
function packForDensity(
  items: string[],
  containerWidth: number,
  gap: number
): string[] {
  const measured = items.map((name) => ({
    name,
    width: estimateChipWidth(name),
  }));

  measured.sort((a, b) => b.width - a.width);

  const rows: { items: typeof measured; remaining: number }[] = [];

  for (const item of measured) {
    let placed = false;
    for (const row of rows) {
      const needed = row.items.length > 0 ? item.width + gap : item.width;
      if (row.remaining >= needed) {
        row.items.push(item);
        row.remaining -= needed;
        placed = true;
        break;
      }
    }
    if (!placed) {
      rows.push({
        items: [item],
        remaining: containerWidth - item.width,
      });
    }
  }

  return rows.flatMap((row) => row.items.map((i) => i.name));
}

/**
 * Props for the ClientList component.
 */
export interface ClientListProps {
  /** Array of client names to display */
  clients: string[];

  /** Theme-aware text color for card content, sourced from parent's cardTextColor */
  cardTextColor: string;

  /** Pre-translated section heading text (e.g., "Enterprise Clients") */
  sectionHeading: string;

  /** Whether high-contrast mode is active */
  isHighContrast?: boolean;
}

/**
 * ClientList displays enterprise clients as chips with bin-packed ordering.
 *
 * Features:
 * - Client names displayed as MUI Chip components
 * - First-fit-decreasing bin packing reorders chips to minimize wasted
 * horizontal space in the flex-wrap layout (like a Tetris puzzle)
 * - Sage green background for chips
 * - Compact spacing for efficient display
 * - Print-friendly layout
 *
 * @param props - Component props containing clients array
 * @param props.clients - Array of client company names
 * @param props.cardTextColor - Theme-aware text color from parent's palette
 * @param props.sectionHeading - Pre-translated heading text
 * @param props.isHighContrast - Whether high-contrast mode is active
 * @returns A section displaying the client list
 *
 * @example
 * <ClientList clients={resumeData.clients} cardTextColor={palette.card.text} sectionHeading={t('resume.clients.heading', { ns: 'pages' })} />
 */
export default function ClientList({
  clients,
  cardTextColor,
  sectionHeading,
  isHighContrast = false,
}: ClientListProps) {
  /** Estimated card inner width in px after p:2.5 padding */
  const CONTAINER_WIDTH_PX = 280;
  /** Matches gap: 0.75 (MUI spacing × 8 = 6px) */
  const CHIP_GAP_PX = 6;

  const packedClients = useMemo(
    () => packForDensity(clients, CONTAINER_WIDTH_PX, CHIP_GAP_PX),
    [clients]
  );

  return (
    <Box component="section" aria-labelledby="clients-heading">
      <Box
        sx={{
          ...getHcContainerSx(isHighContrast),
          p: 2.5,
        }}
      >
        {/* Section Heading */}
        <Typography
          id="clients-heading"
          variant="h3"
          component="h3"
          sx={{
            fontWeight: 600,
            color: isHighContrast ? '#FFFFFF' : cardTextColor,
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            mb: 1.5,
          }}
        >
          {sectionHeading}
        </Typography>

        {/* Client Chips — bin-packed for row density */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
          }}
        >
          {packedClients.map((client, index) => (
            <Chip
              key={index}
              label={client}
              size="small"
              sx={{
                ...getHcChipSx(isHighContrast),
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '26px',
                '& .MuiChip-label': {
                  px: 1.25,
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
