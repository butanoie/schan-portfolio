'use client';

import { Button, Box, CircularProgress } from '@mui/material';
import { UI_COLORS } from '../../constants';
import { useReducedMotion } from '../../hooks';

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
  sx?: any;
}

/**
 * Button component styled as a thought bubble to replace Buta's thought bubble.
 *
 * This button replaces the original "Pork products FTW!" thought bubble above Buta
 * when displaying the Load More functionality on the home page. It maintains the
 * exact visual styling of the thought bubble while providing interactive button behavior.
 *
 * **Visual Design:**
 * - Elliptical shape matching the original thought bubble
 * - Light blue background (`#f5f9fd`) matching the original color
 * - Two circular thought dots (::before, ::after pseudo-elements)
 * - Uses "Gochi Hand" cursive font for handwritten appearance
 * - Responsive sizing: smaller on mobile, larger on desktop
 * - Dark border and text matching original bubble styling
 *
 * **States:**
 * 1. **Idle**: Shows "Load X more" text, clickable
 * 2. **Loading**: Shows CircularProgress spinner instead of text
 * 3. **Disabled**: Grayed out appearance, not clickable
 * 4. **Hover**: Subtle shadow and opacity change for feedback
 *
 * **Positioning:**
 * This component should be positioned absolutely to appear where the thought
 * bubble would be. It's typically rendered within the footer's positioning container.
 *
 * **Accessibility:**
 * - Semantic button element for keyboard and screen reader support
 * - ARIA labels describing the action and number of projects
 * - Proper disabled state handling
 * - Focus visible for keyboard navigation
 * - Loading state announced via aria-busy attribute
 *
 * **Responsive Behavior:**
 * - Mobile (xs): Smaller dimensions (180x90px)
 * - Desktop (md+): Larger dimensions (250x125px)
 * - Maintains proper positioning at all breakpoints
 *
 * **Usage Example:**
 * ```typescript
 * function ProjectLoadingFooter() {
 *   const [loading, setLoading] = useState(false);
 *   const { remainingCount, hasMore, loadMore } = useProjectLoader(
 *     initialProjects
 *   );
 *
 *   const handleLoadMore = async () => {
 *     setLoading(true);
 *     try {
 *       await loadMore();
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *
 *   return (
 *     <LoadMoreButton
 *       onClick={handleLoadMore}
 *       loading={loading}
 *       disabled={!hasMore}
 *       remainingCount={remainingCount}
 *       sx={{ position: 'absolute', bottom: 230, right: 145 }}
 *     />
 *   );
 * }
 * ```
 *
 * @param props - Component props
 * @returns A button styled as a thought bubble with loading indicator
 *
 * @example
 * <LoadMoreButton
 *   onClick={handleLoadMore}
 *   loading={false}
 *   disabled={false}
 *   remainingCount={13}
 * />
 *
 * @example
 * // During loading with spinner
 * <LoadMoreButton
 *   onClick={handleLoadMore}
 *   loading={true}
 *   disabled={true}
 *   remainingCount={13}
 * />
 */
export function LoadMoreButton({
  onClick,
  loading,
  disabled,
  remainingCount,
  sx,
}: LoadMoreButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  // Button text based on remaining count
  const buttonText = remainingCount > 0 ? `Load ${remainingCount} more` : 'Load more';

  // ARIA label with additional context
  const ariaLabel = disabled
    ? 'All projects loaded'
    : `Load ${remainingCount} more projects`;

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      sx={{
        // Thought bubble shape and positioning
        position: 'absolute',
        bottom: 230,
        right: 145,
        width: 180,
        height: 90,
        padding: '15px 16px',
        minWidth: 'unset',
        minHeight: 'unset',

        // Bubble styling
        border: `2px solid ${UI_COLORS.border}`,
        borderRadius: '160px / 80px',
        backgroundColor: UI_COLORS.cardBackground,
        color: UI_COLORS.secondaryText,
        fontFamily: '"Gochi Hand", cursive',
        fontSize: '1rem',
        fontWeight: 400,
        textTransform: 'none',
        zIndex: 10,
        pointerEvents: 'auto',

        // Desktop breakpoint at 760px
        '@media (min-width: 760px)': {
          bottom: 165,
          right: 225,
          width: 250,
          height: 125,
          padding: '25px 20px',
          fontSize: '1.125rem',
        },

        // Transition effects
        transition: prefersReducedMotion
          ? 'none'
          : 'all 0.2s ease-in-out',

        // Hover and focus states
        '&:hover:not(:disabled)': {
          opacity: 0.85,
          boxShadow: 1,
          backgroundColor: UI_COLORS.cardBackground,
          borderColor: UI_COLORS.border,
        },

        '&:focus-visible': {
          outline: `2px solid ${UI_COLORS.border}`,
          outlineOffset: '2px',
        },

        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          backgroundColor: UI_COLORS.cardBackground,
          borderColor: UI_COLORS.border,
          color: UI_COLORS.secondaryText,
        },

        // Thought dot - large circle
        '&::before': {
          content: '""',
          position: 'absolute',
          zIndex: 10,
          bottom: -25,
          right: 30,
          width: 17,
          height: 17,
          border: `2px solid ${UI_COLORS.border}`,
          backgroundColor: UI_COLORS.cardBackground,
          borderRadius: '50%',
          display: 'block',
          '@media (min-width: 760px)': {
            right: 52,
          },
        },

        // Thought dot - small circle
        '&::after': {
          content: '""',
          position: 'absolute',
          zIndex: 10,
          bottom: -35,
          right: 20,
          width: 8,
          height: 8,
          border: `2px solid ${UI_COLORS.border}`,
          backgroundColor: UI_COLORS.cardBackground,
          borderRadius: '50%',
          display: 'block',
          '@media (min-width: 760px)': {
            right: 35,
          },
        },

        ...sx,
      }}
    >
      {/* Show spinner during loading, text otherwise */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <CircularProgress
            size={24}
            thickness={4}
            sx={{
              color: UI_COLORS.secondaryText,
            }}
          />
        </Box>
      ) : (
        buttonText
      )}
    </Button>
  );
}
