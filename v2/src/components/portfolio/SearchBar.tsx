'use client';

import { useState, useEffect, useId } from 'react';
import { Box, TextField, InputAdornment, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { SxProps, Theme } from '@mui/material';
import { useDebounce } from '@/src/hooks/useDebounce';
import { BRAND_COLORS } from '@/src/constants/colors';

/**
 * Props for the SearchBar component.
 */
export interface SearchBarProps {
  /** Current search query value */
  value: string;

  /** Callback invoked when the search query changes (after debounce) */
  onChange: (value: string) => void;

  /** Optional count of results matching the search (displayed below input) */
  resultsCount?: number;

  /** Optional placeholder text (default: "Search projects...") */
  placeholder?: string;

  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * A search input component with debouncing, clear button, and results count display.
 *
 * ## Features
 * - **Debounced input:** Uses 300ms debounce to avoid excessive re-renders during typing
 * - **Clear button:** X icon appears when input has text, clears on click
 * - **Results count:** Shows "Showing N of M projects" below input when resultsCount provided
 * - **Search icon:** Visual indicator for search functionality
 * - **Responsive:** Adapts to mobile and desktop layouts
 * - **Accessibility:** Full ARIA support with live region announcements
 *
 * ## Debouncing Behavior
 * - User types → Internal state updates immediately (no lag in input)
 * - After 300ms of no typing → `onChange` callback fires with debounced value
 * - This prevents excessive filtering/API calls during typing
 *
 * ## Accessibility
 * - Input has `type="search"` for semantic HTML
 * - `aria-label` describes the search purpose
 * - Results count uses `aria-live="polite"` for screen reader announcements
 * - Clear button has descriptive `aria-label`
 * - Focus indicators visible for keyboard navigation
 *
 * @param props - Component props
 * @param props.value - The current search query value (controlled component)
 * @param props.onChange - Called with new query after 300ms debounce
 * @param props.resultsCount - Optional number of results to display (e.g., 12)
 * @param props.placeholder - Optional placeholder text
 * @param props.sx - Optional Material-UI sx prop for styling
 * @returns A search input with debouncing and results display
 *
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState('');
 * const filteredProjects = projects.filter(p =>
 *   p.title.toLowerCase().includes(searchQuery.toLowerCase())
 * );
 *
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   resultsCount={filteredProjects.length}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom placeholder and styling
 * <SearchBar
 *   value={query}
 *   onChange={setQuery}
 *   placeholder="Find a project..."
 *   sx={{ mb: 3 }}
 * />
 * ```
 */
export function SearchBar({
  value,
  onChange,
  resultsCount,
  placeholder = 'Search projects...',
  sx,
}: SearchBarProps) {
  // Internal state for immediate input updates (no lag during typing)
  const [internalValue, setInternalValue] = useState(value);

  // Debounce the internal value before calling onChange
  const debouncedValue = useDebounce(internalValue, 300);

  // Generate unique IDs for ARIA relationships
  const inputId = useId();
  const resultsId = `${inputId}-results`;

  // Sync internal value with external value prop (for controlled component behavior)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Call onChange when debounced value changes
  useEffect(() => {
    // Only call onChange if the debounced value differs from the external value
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  /**
   * Handles input change events.
   * Updates internal state immediately for responsive input.
   *
   * @param event - The input change event
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value);
  };

  /**
   * Clears the search input.
   * Updates both internal state and calls onChange immediately.
   */
  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        ...sx,
      }}
    >
      {/* Search input field */}
      <TextField
        id={inputId}
        type="search"
        value={internalValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        fullWidth
        variant="outlined"
        inputProps={{
          'aria-label': 'Search projects',
          'aria-describedby': resultsCount !== undefined ? resultsId : undefined,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: BRAND_COLORS.graphite,
                  opacity: 0.6,
                }}
              />
            </InputAdornment>
          ),
          endAdornment: internalValue ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                aria-label="Clear search"
                edge="end"
                size="small"
                sx={{
                  color: BRAND_COLORS.graphite,
                  '&:hover': {
                    backgroundColor: 'rgba(44, 44, 44, 0.04)',
                  },
                  // Ensure minimum touch target on mobile
                  minWidth: { xs: 44, md: 'auto' },
                  minHeight: { xs: 44, md: 'auto' },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          // Input field styling
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: BRAND_COLORS.maroon,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: BRAND_COLORS.maroon,
              borderWidth: 2,
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: { xs: '14px 0', md: '12px 0' },
            fontSize: { xs: '1rem', md: '0.9375rem' },
          },
          // Focus indicator for keyboard navigation
          '& .MuiOutlinedInput-root.Mui-focused': {
            boxShadow: `0 0 0 2px rgba(139, 21, 56, 0.1)`,
          },
        }}
      />

      {/* Results count - only shown when resultsCount is provided */}
      {resultsCount !== undefined && (
        <Typography
          id={resultsId}
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            color: BRAND_COLORS.graphite,
            opacity: 0.8,
            fontStyle: 'italic',
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {resultsCount === 0
            ? 'No projects found'
            : resultsCount === 1
              ? 'Showing 1 project'
              : `Showing ${resultsCount} projects`}
        </Typography>
      )}
    </Box>
  );
}
