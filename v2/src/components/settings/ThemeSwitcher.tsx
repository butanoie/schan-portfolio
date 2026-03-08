"use client";

/**
 * Theme switcher component with toggle buttons for each theme mode.
 *
 * Displays three buttons (Light, Dark, High Contrast) in a toggle group.
 * Current theme is highlighted. Clicking a button changes the theme.
 * Users can also navigate between themes using keyboard (Tab, Arrow keys).
 *
 * Accessibility features:
 * - Keyboard navigation with Tab and Arrow keys
 * - Enter/Space to select theme
 * - ARIA labels on all buttons describing the theme
 * - Selected state announced to screen readers
 * - Focus visible indicator on keyboard navigation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeSwitcher />
 *
 * // With callback when theme changes
 * <ThemeSwitcher onChange={(newTheme) => {
 *   console.log('Theme changed to:', newTheme);
 *   closePopover();
 * }} />
 * ```
 */

import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Contrast as ContrastIcon,
} from "@mui/icons-material";
import { useTheme } from "@/src/hooks/useTheme";
import { useI18n } from "@/src/hooks/useI18n";
import { ThemeMode } from "@/src/types/theme";
import { TOGGLE_BORDER_COLOR, TOGGLE_BUTTON_SX } from "./toggleStyles";

/**
 * Props for the ThemeSwitcher component.
 */
interface ThemeSwitcherProps {
  /**
   * Optional callback fired when a theme is selected.
   * Useful for closing parent popover after selection.
   *
   * @param newTheme - The newly selected theme mode
   */
  onChange?: (newTheme: ThemeMode) => void;

  /**
   * Optional CSS class name for styling.
   *
   * @default undefined
   */
  className?: string;
}

/**
 * Configuration for each theme toggle option.
 * Each entry maps a ThemeMode to its icon, ARIA label key, and display label key.
 */
const THEME_OPTIONS: Array<{
  value: ThemeMode;
  icon: React.ReactNode;
  ariaKey: string;
  labelKey: string;
}> = [
  { value: "light", icon: <LightModeIcon />, ariaKey: "theme.lightAria", labelKey: "theme.lightLabel" },
  { value: "dark", icon: <DarkModeIcon />, ariaKey: "theme.darkAria", labelKey: "theme.darkLabel" },
  { value: "highContrast", icon: <ContrastIcon />, ariaKey: "theme.highContrastAria", labelKey: "theme.highContrastLabel" },
];

/**
 * Theme switcher component.
 *
 * Renders a toggle button group with three theme options.
 * The currently active theme is highlighted.
 * Clicking a button changes the theme and triggers optional callback.
 *
 * @param props - Component props
 * @param props.onChange - Optional callback when theme changes
 * @param props.className - Optional CSS class name
 * @returns A theme selector with toggle buttons
 */
export function ThemeSwitcher({
  onChange,
  className,
}: ThemeSwitcherProps): React.ReactNode {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  /**
   * Handle theme selection change.
   * Updates the theme and triggers the optional callback.
   *
   * @param _event - The click event (unused)
   * @param newTheme - The newly selected theme mode, or null if deselected
   */
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTheme: ThemeMode | null
  ): void => {
    // Only update if a theme is selected (not null)
    // MUI ToggleButtonGroup can return null in non-exclusive mode,
    // but this component uses exclusive mode so null means user clicked same button
    if (newTheme !== null) {
      setTheme(newTheme);
      onChange?.(newTheme);
    }
  };

  return (
    <Box className={className}>
      <ToggleButtonGroup
        value={theme}
        exclusive
        onChange={handleChange}
        aria-label={t("theme.selectTheme")}
        sx={{
          display: "flex",
          width: "100%",
          border: `1px solid ${TOGGLE_BORDER_COLOR}`,
        }}
      >
        {THEME_OPTIONS.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={t(option.ariaKey)}
            sx={TOGGLE_BUTTON_SX}
          >
            {option.icon}
            <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
              {t(option.labelKey)}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
