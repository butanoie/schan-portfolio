'use client';

import { Box, Chip, Button, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { BRAND_COLORS } from '@/src/constants/colors';

/**
 * Props for the ProjectFilters component.
 */
export interface ProjectFiltersProps {
  /** Map of tag names to their occurrence counts across all projects */
  tags: Map<string, number>;

  /** Array of currently selected tag names */
  selectedTags: string[];

  /** Callback invoked when the selected tags change */
  onTagsChange: (tags: string[]) => void;

  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * A tag filtering component that displays technology tags as interactive chips.
 *
 * ## Features
 * - **Multi-select filtering:** Click tags to filter projects by technology
 * - **Count badges:** Shows number of projects for each tag
 * - **Visual feedback:** Selected tags have maroon background, unselected are outlined
 * - **Clear all:** Button appears when tags are selected to reset filters
 * - **Responsive layout:** Tags wrap naturally on all screen sizes
 * - **Accessibility:** Full ARIA support with role="checkbox" for each tag
 *
 * ## Accessibility
 * - Group has `role="group"` with descriptive `aria-label`
 * - Each chip has `role="checkbox"` and `aria-checked` state
 * - Keyboard navigation: Tab to chips, Space/Enter to toggle
 * - Screen reader announces tag name, count, and selection state
 *
 * @param props - Component props
 * @param props.tags - Map of tag names to counts (e.g., Map([["React", 12], ["TypeScript", 8]]))
 * @param props.selectedTags - Array of selected tag names (e.g., ["React", "Next.js"])
 * @param props.onTagsChange - Called with new array when tags are toggled
 * @param props.sx - Optional Material-UI sx prop for styling
 * @returns A visually interactive tag filter component
 *
 * @example
 * ```tsx
 * const [selectedTags, setSelectedTags] = useState<string[]>([]);
 * const tagCounts = new Map([
 *   ["React", 12],
 *   ["TypeScript", 10],
 *   ["Next.js", 8]
 * ]);
 *
 * <ProjectFilters
 *   tags={tagCounts}
 *   selectedTags={selectedTags}
 *   onTagsChange={setSelectedTags}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <ProjectFilters
 *   tags={tagCounts}
 *   selectedTags={selectedTags}
 *   onTagsChange={setSelectedTags}
 *   sx={{ mb: 4, px: 2 }}
 * />
 * ```
 */
export function ProjectFilters({
  tags,
  selectedTags,
  onTagsChange,
  sx,
}: ProjectFiltersProps) {
  /**
   * Toggles a tag in the selection.
   * If the tag is currently selected, removes it; otherwise, adds it.
   *
   * @param tag - The tag name to toggle
   */
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag from selection
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      // Add tag to selection
      onTagsChange([...selectedTags, tag]);
    }
  };

  /**
   * Clears all selected tags.
   */
  const handleClearAll = () => {
    onTagsChange([]);
  };

  // Convert Map to array and sort by count (descending) then alphabetically
  const sortedTags = Array.from(tags.entries()).sort((a, b) => {
    // First sort by count (descending)
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }
    // Then alphabetically by tag name
    return a[0].localeCompare(b[0]);
  });

  // If no tags are available, don't render anything
  if (sortedTags.length === 0) {
    return null;
  }

  return (
    <Box
      role="group"
      aria-label="Filter projects by technology"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ...sx,
      }}
    >
      {/* Header with title and clear button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            fontWeight: 600,
            color: BRAND_COLORS.graphite,
          }}
        >
          Filter by Technology
        </Typography>

        {/* Clear all button - only shown when tags are selected */}
        {selectedTags.length > 0 && (
          <Button
            variant="text"
            size="small"
            onClick={handleClearAll}
            aria-label={`Clear all filters (${selectedTags.length} selected)`}
            sx={{
              color: BRAND_COLORS.maroon,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              minHeight: 'auto',
              padding: '4px 8px',
              '&:hover': {
                backgroundColor: 'rgba(139, 21, 56, 0.04)',
              },
            }}
          >
            Clear all ({selectedTags.length})
          </Button>
        )}
      </Box>

      {/* Tag chips */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          // Ensure readable layout on mobile
          justifyContent: { xs: 'flex-start', md: 'flex-start' },
        }}
      >
        {sortedTags.map(([tag, count]) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <Chip
              key={tag}
              label={`${tag} (${count})`}
              onClick={() => handleTagToggle(tag)}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`${tag}, ${count} projects, ${isSelected ? 'selected' : 'not selected'}`}
              clickable
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                // Selected state: filled with maroon background
                ...(isSelected && {
                  backgroundColor: BRAND_COLORS.maroon,
                  color: '#FFFFFF',
                  borderColor: BRAND_COLORS.maroon,
                  '&:hover': {
                    backgroundColor: BRAND_COLORS.maroonDark,
                    borderColor: BRAND_COLORS.maroonDark,
                  },
                  '&:focus': {
                    backgroundColor: BRAND_COLORS.maroon,
                    borderColor: BRAND_COLORS.maroon,
                  },
                }),
                // Unselected state: outlined
                ...(!isSelected && {
                  borderColor: BRAND_COLORS.graphite,
                  color: BRAND_COLORS.graphite,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(44, 44, 44, 0.04)',
                    borderColor: BRAND_COLORS.maroon,
                  },
                }),
                // Consistent sizing
                fontSize: '0.875rem',
                fontWeight: 500,
                height: 'auto',
                padding: '6px 12px',
                // Focus indicator for keyboard navigation
                '&:focus-visible': {
                  outline: `2px solid ${BRAND_COLORS.maroon}`,
                  outlineOffset: 2,
                },
                // Ensure minimum touch target (44x44px) on mobile
                minHeight: { xs: 44, md: 'auto' },
                // Smooth transitions
                transition: 'all 150ms ease-in-out',
              }}
            />
          );
        })}
      </Box>

      {/* Selected count announcement for screen readers */}
      {selectedTags.length > 0 && (
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            color: BRAND_COLORS.graphite,
            fontStyle: 'italic',
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {selectedTags.length} {selectedTags.length === 1 ? 'filter' : 'filters'} active
        </Typography>
      )}
    </Box>
  );
}
