"use client";

import { Box, Typography, Chip } from "@mui/material";
import { BRAND_COLORS } from "../../constants";

/**
 * Props for the ClientList component.
 */
export interface ClientListProps {
  /** Array of client names to display */
  clients: string[];
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
 * @returns A section displaying the client list
 *
 * @example
 * <ClientList clients={resumeData.clients} />
 */
export default function ClientList({ clients }: ClientListProps) {
  return (
    <Box component="section" aria-labelledby="clients-heading">
      <Box
        sx={{
          backgroundColor: BRAND_COLORS.duckEgg,
          borderRadius: 2,
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
            color: BRAND_COLORS.graphite,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 1.5,
          }}
        >
          Clients
        </Typography>

        {/* Client Chips */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
          }}
        >
          {clients.map((client, index) => (
            <Chip
              key={index}
              label={client}
              size="small"
              sx={{
                backgroundColor: BRAND_COLORS.sage,
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "26px",
                borderRadius: "3px",
                "& .MuiChip-label": {
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
