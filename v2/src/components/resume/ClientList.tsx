import { Box, Typography, Chip } from '@mui/material';
import { getHcContainerSx, getHcChipSx } from '../../utils/highContrastStyles';

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
 * ClientList displays enterprise clients in a multi-column grid.
 *
 * Features:
 * - Client names displayed as MUI Chip components
 * - Sage green background for chips
 * - Chips wrap to fit within sidebar width
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

        {/* Client Chips */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
          }}
        >
          {clients.map((client, index) => (
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
