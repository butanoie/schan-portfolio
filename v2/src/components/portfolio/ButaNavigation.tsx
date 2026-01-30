'use client';

import { Box, Button, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import Image from 'next/image';
import { UI_COLORS, BRAND_COLORS } from '@/src/constants/colors';

/**
 * Props for the ButaNavigation component.
 */
export interface ButaNavigationProps {
  /** Current state of the pagination ('loading' | 'load-more' | 'end') */
  state: 'loading' | 'load-more' | 'end';

  /** Number of projects currently displayed */
  currentCount: number;

  /** Total number of projects available */
  totalCount: number;

  /** Callback invoked when the user clicks "Load More" */
  onLoadMore: () => void;

  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * A pagination component featuring Buta the pig character with a thought bubble.
 *
 * ## Features
 * - **Character-driven UX:** Buta provides friendly feedback for pagination
 * - **Three states:** loading (fetching), load-more (with link), end (no more items)
 * - **Thought bubble:** Comic-style speech bubble with connecting circles
 * - **Responsive design:** Adjusts image and text size for mobile/desktop
 * - **Accessibility:** Live region announcements and proper ARIA labels
 *
 * ## States
 * - **loading:** "Fetching more projects..." (no interaction)
 * - **load-more:** "Want to see more?" with clickable link + progress counter
 * - **end:** "That's all, folks!" (no more projects to load)
 *
 * ## Accessibility
 * - Thought bubble uses `role="status"` with `aria-live="polite"` for screen reader announcements
 * - Load more link has 44px minimum touch target on mobile
 * - Progress counter has descriptive `aria-label`
 *
 * @param props - Component props
 * @param props.state - Current pagination state
 * @param props.currentCount - Number of projects currently shown
 * @param props.totalCount - Total number of projects available
 * @param props.onLoadMore - Callback for load more action
 * @param props.sx - Optional Material-UI sx prop for styling
 * @returns A character-driven pagination component
 *
 * @example
 * ```tsx
 * <ButaNavigation
 *   state="load-more"
 *   currentCount={6}
 *   totalCount={18}
 *   onLoadMore={() => setPage(prev => prev + 1)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Loading state
 * <ButaNavigation
 *   state="loading"
 *   currentCount={6}
 *   totalCount={18}
 *   onLoadMore={() => {}}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // End state
 * <ButaNavigation
 *   state="end"
 *   currentCount={18}
 *   totalCount={18}
 *   onLoadMore={() => {}}
 * />
 * ```
 */
export function ButaNavigation({
  state,
  currentCount,
  totalCount,
  onLoadMore,
  sx,
}: ButaNavigationProps) {
  /**
   * Gets the thought bubble message based on current state.
   *
   * @returns JSX element containing the appropriate message
   */
  const getMessage = () => {
    switch (state) {
      case 'loading':
        return (
          <Typography
            component="span"
            sx={{
              fontFamily: '"Gochi Hand", cursive',
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: UI_COLORS.secondaryText,
            }}
          >
            Fetching more projects...
          </Typography>
        );

      case 'load-more':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              component="span"
              sx={{
                fontFamily: '"Gochi Hand", cursive',
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: UI_COLORS.secondaryText,
              }}
            >
              Want to see more?{' '}
              <Button
                onClick={onLoadMore}
                variant="text"
                aria-label="Load more projects"
                sx={{
                  fontFamily: '"Gochi Hand", cursive',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: BRAND_COLORS.maroon,
                  textTransform: 'none',
                  textDecoration: 'underline',
                  padding: 0,
                  minWidth: 'auto',
                  minHeight: { xs: 44, md: 'auto' },
                  verticalAlign: 'baseline',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                    color: BRAND_COLORS.maroonDark,
                  },
                }}
              >
                Click here!
              </Button>
            </Typography>
            <Typography
              component="span"
              aria-label={`Showing ${currentCount} of ${totalCount} projects`}
              sx={{
                fontFamily: '"Gochi Hand", cursive',
                fontSize: { xs: '0.875rem', md: '1rem' },
                color: UI_COLORS.secondaryText,
                opacity: 0.8,
              }}
            >
              {currentCount} / {totalCount} projects
            </Typography>
          </Box>
        );

      case 'end':
        return (
          <Typography
            component="span"
            sx={{
              fontFamily: '"Gochi Hand", cursive',
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: UI_COLORS.secondaryText,
            }}
          >
            That&apos;s all, folks!
          </Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        minHeight: { xs: 180, md: 280 },
        marginTop: 4,
        marginBottom: 2,
        ...sx,
      }}
    >
      {/* Buta character image */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: 180, md: 300 },
          height: { xs: 125, md: 209 },
        }}
      >
        <Image
          src="/images/buta/buta.png"
          alt="Buta the pig mascot"
          fill
          style={{ objectFit: 'contain' }}
          priority={false}
        />
      </Box>

      {/* Thought bubble */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          top: { xs: 0, md: 20 },
          left: { xs: 10, md: 40 },
          maxWidth: { xs: '60%', md: '50%' },
          backgroundColor: UI_COLORS.cardBackground,
          border: `2px solid ${UI_COLORS.border}`,
          borderRadius: '50%',
          padding: { xs: '15px 16px', md: '25px 20px' },
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {getMessage()}

        {/* Connecting circles (comic book style tail) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: -25, md: -35 },
            right: { xs: 15, md: 25 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 0.5, md: 0.75 },
          }}
        >
          {/* Large circle */}
          <Box
            sx={{
              width: { xs: 14, md: 18 },
              height: { xs: 14, md: 18 },
              backgroundColor: UI_COLORS.cardBackground,
              border: `2px solid ${UI_COLORS.border}`,
              borderRadius: '50%',
              marginLeft: 'auto',
            }}
          />
          {/* Medium circle */}
          <Box
            sx={{
              width: { xs: 10, md: 12 },
              height: { xs: 10, md: 12 },
              backgroundColor: UI_COLORS.cardBackground,
              border: `2px solid ${UI_COLORS.border}`,
              borderRadius: '50%',
              marginLeft: 'auto',
              marginRight: { xs: 2, md: 3 },
            }}
          />
          {/* Small circle */}
          <Box
            sx={{
              width: { xs: 6, md: 8 },
              height: { xs: 6, md: 8 },
              backgroundColor: UI_COLORS.cardBackground,
              border: `2px solid ${UI_COLORS.border}`,
              borderRadius: '50%',
              marginLeft: 'auto',
              marginRight: { xs: 4, md: 5 },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
