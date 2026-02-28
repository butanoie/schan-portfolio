'use client';

import { Button, Box, CircularProgress } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NAV_COLORS, BRAND_COLORS } from '../../constants';
import { useI18n, useAnimations } from '../../hooks';

/**
 * Props for the LoadMoreButton component.
 *
 * @interface LoadMoreButtonProps
 * @property {() => void} onClick - Callback function when button is clicked
 * @property {boolean} loading - Whether currently loading next batch
 * @property {boolean} disabled - Whether button should be disabled
 * @property {number} remainingCount - Number of projects remaining to load
 * @property {SxProps<Theme>} [sx] - Additional MUI sx styles
 */
interface LoadMoreButtonProps {
  /** Callback triggered when user clicks the button */
  onClick: () => void;

  /** True while fetching the next batch of projects */
  loading: boolean;

  /** True if no more projects to load or another condition requires disabling */
  disabled: boolean;

  /** Number of projects not yet loaded (used for "Load X more" text) */
  remainingCount: number;

  /** Optional additional MUI sx styles */
  sx?: SxProps<Theme>;
}

/**
 * Button component for loading more projects within the Footer thought bubble.
 *
 * This button is rendered inside the Footer's thought bubble container on the
 * home page. It displays a loading spinner while fetching projects and shows
 * the count of remaining projects to load. Styled as a nav button matching
 * the Header and Footer navigation items.
 *
 * **Visual Design:**
 * - Sage green background with white text (matching nav items)
 * - Open Sans font, 600 weight
 * - Rounded corners with padding
 * - Expand icon on the left side of text
 * - Darker green hover state for user feedback
 *
 * **States:**
 * 1. **Idle**: Shows expand icon with "Load X more" text, clickable with sage green background
 * 2. **Loading**: Shows rotating CircularProgress spinner instead of icon, text changes to "Loading projects..."
 * 3. **Disabled**: Reduced opacity (60%), not clickable
 * 4. **Hover**: Darker green background for visual feedback
 *
 * **Icon Behavior:**
 * - Idle: Displays ExpandMoreIcon before the text
 * - Loading: Replaces icon with white rotating spinner
 * - Icon and spinner are 20px-24px in size with consistent spacing
 *
 * **Accessibility:**
 * - Semantic button element for keyboard and screen reader support
 * - ARIA labels describing the action, loading state, or completion
 * - Proper disabled state handling
 * - Focus visible outline for keyboard navigation
 * - Loading state announced via aria-busy attribute
 *
 * **Usage Example:**
 * ```typescript
 * <LoadMoreButton
 *   onClick={handleLoadMore}
 *   loading={false}
 *   disabled={false}
 *   remainingCount={13}
 * />
 * ```
 *
 * @param props - Component props
 * @param props.onClick - Callback function triggered when the button is clicked
 * @param props.loading - Whether the button is currently in a loading state
 * @param props.disabled - Whether the button should be disabled
 * @param props.remainingCount - Number of projects remaining to load
 * @param props.sx - Optional MUI sx styles to merge with button styling
 * @returns A button component with loading indicator and expand icon
 *
 * @example
 * // Idle state showing remaining count
 * <LoadMoreButton onClick={handleLoadMore} loading={false} disabled={false} remainingCount={13} />
 *
 * @example
 * // Loading state with spinner
 * <LoadMoreButton onClick={handleLoadMore} loading={true} disabled={true} remainingCount={13} />
 */
export function LoadMoreButton({
  onClick,
  loading,
  disabled,
  remainingCount,
  sx,
}: LoadMoreButtonProps) {
  const { shouldAnimate } = useAnimations();
  const { t } = useI18n();

  // Button text based on state
  const buttonText = loading
    ? t('loadMoreButton.loading', { ns: 'components' })
    : t('loadMoreButton.loadMore', { ns: 'components' });

  // ARIA label with additional context
  const ariaLabel = disabled
    ? t('loadMoreButton.allLoaded', { ns: 'components' })
    : loading
      ? t('loadMoreButton.loadingAria', { ns: 'components' })
      : t('loadMoreButton.loadMoreCountAria', {
          ns: 'components',
          remainingCount,
        });

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      variant="contained"
      sx={{
        // Nav button styling
        backgroundColor: NAV_COLORS.active,
        color: NAV_COLORS.text,
        fontFamily: '"Open Sans", sans-serif',
        fontSize: { xs: "8pt", md: "10pt" },
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 1,
        boxShadow: 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        px: { xs: 0.5, '@media (min-width: 760px)': 2 } as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        py: { xs: 0.5, '@media (min-width: 760px)': 1 } as any,
        minWidth: "95%",
        minHeight: 'unset',

        // Transition effects
        transition: shouldAnimate
          ? 'background-color 0.2s ease-in-out'
          : 'none',

        // Hover and focus states
        '&:hover:not(:disabled)': {
          backgroundColor: NAV_COLORS.activeHover,
          boxShadow: 0,
        },

        '&:focus-visible': {
          outline: `2px solid ${NAV_COLORS.text}`,
          outlineOffset: '2px',
        },

        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          backgroundColor: BRAND_COLORS.sage,
          color: "#010101",
        },

        ...sx,
      }}
    >
      {/* Icon or spinner with text label */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* Icon or spinner - hidden on mobile (under 760px) */}
        <Box
          sx={{
            display: 'none',
            alignItems: 'center',
            '@media (min-width: 760px)': {
              display: 'flex',
            },
          }}
        >
          {loading ? (
            <CircularProgress
              size={20}
              thickness={4}
              sx={{
                color: "#111111",
              }}
            />
          ) : (
            <ExpandMoreIcon
              sx={{
                fontSize: '1.25rem',
              }}
            />
          )}
        </Box>
        {/* Button text */}
        {buttonText}
      </Box>
    </Button>
  );
}
