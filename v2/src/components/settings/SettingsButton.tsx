/**
 * Settings button component that opens a popover with theme, language, and animations controls.
 *
 * Displays a gear icon button. Clicking opens a popover below the button
 * containing theme, language, and animations controls. The popover remains open while
 * adjusting settings and only closes when the gear button is toggled,
 * Escape is pressed, or clicking outside the popover.
 *
 * Accessibility features:
 * - Fully keyboard accessible: Tab to focus, Enter/Space to open
 * - Escape key closes popover
 * - Click outside closes popover (MUI built-in)
 * - Focus returns to button when popover closes (MUI built-in)
 * - ARIA attributes for expanded state and popover relationship
 * - Screen reader announces button purpose and expanded state
 * - Respects prefers-reduced-motion for transitions
 * - Focus visible outline on keyboard navigation
 *
 * @example
 * ```tsx
 * // Basic usage in header
 * <SettingsButton size="small" />
 *
 * // With custom size
 * <SettingsButton size="large" />
 * ```
 */

"use client";

import { useState } from "react";
import {
  IconButton,
  Popover,
  Tooltip,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AnimationsSwitcher } from "./AnimationsSwitcher";
import { useTheme } from "@/src/hooks/useTheme";
import { useI18n } from "@/src/hooks/useI18n";
import { useAnimations } from "@/src/hooks/useAnimations";
import { getPaletteByMode } from "@/src/lib/themes";
import { BRAND_COLORS } from "@/src/constants";

/**
 * Props for the SettingsButton component.
 */
interface SettingsButtonProps {
  /**
   * Size of the icon button.
   *
   * Passed directly to MUI IconButton.
   *
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";

  /**
   * Optional CSS class name for styling.
   *
   * @default undefined
   */
  className?: string;

  /**
   * Whether the button is disabled.
   *
   * When disabled, the button cannot be clicked and is visually dimmed.
   *
   * @default false
   */
  disabled?: boolean;
}

/**
 * Settings button with popover component.
 *
 * Renders a gear icon button that opens a popover containing theme, language, and animations controls.
 * The button uses the same styling as other utility buttons in the header.
 * The popover is anchored to the button and positions below and to the right.
 *
 * State management:
 * - `anchorEl`: HTMLElement that the popover is anchored to (the button)
 * - `open`: Boolean indicating if popover is visible
 *
 * Event handling:
 * - Click button: toggles popover open/closed
 * - Click outside or Escape: closes popover
 * - Theme, language, or animations selection: keeps popover open (allows multiple adjustments)
 *
 * @param props - Component props
 * @param props.size - Icon button size (default: 'medium')
 * @param props.className - Optional CSS class name
 * @param props.disabled - Whether the button is disabled (default: false)
 * @returns Settings button with popover containing theme, language, and animations controls
 */
export function SettingsButton({
  size = "medium",
  className,
  disabled = false,
}: SettingsButtonProps): React.ReactNode {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const { theme } = useTheme();
  const { t } = useI18n();
  const { animationsEnabled } = useAnimations();
  const palette = getPaletteByMode(theme);

  /**
   * Open the settings popover.
   * Sets the anchor element to the clicked button.
   *
   * @param event - The click event from the settings button
   */
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Close the settings popover.
   * Called by:
   * - Clicking outside the popover (MUI built-in)
   * - Pressing Escape (MUI built-in)
   * - Clicking the settings button to toggle it closed
   */
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const popoverId = open ? "settings-popover" : undefined;

  return (
    <>
      {/* Settings Icon Button */}
      <Tooltip title={t("settings.openSettings")}>
        <IconButton
          onClick={handleOpen}
          aria-label={t("settings.openSettings")}
          aria-expanded={open}
          aria-controls={popoverId}
          disabled={disabled}
          size={size}
          className={className}
          sx={{
            color: palette.text.primary,
            transition: animationsEnabled ? "color 150ms ease-in-out" : "none",
            "&:hover": {
              color: BRAND_COLORS.maroon,
            },
            "@media (prefers-reduced-motion: reduce)": {
              transition: "none",
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      {/* Settings Popover */}
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              p: 2,
              minWidth: 280,
              borderRadius: 1,
            },
          },
        }}
      >
        {/* Popover Header */}
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          {t("settings.title")}
        </Typography>

        {/* Theme Switcher Component */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: "0.875rem",
              opacity: 0.7,
            }}
          >
            {t("settings.theme")}
          </Typography>
          <ThemeSwitcher />
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 2 }} />

        {/* Language Switcher Component */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: "0.875rem",
              opacity: 0.7,
            }}
          >
            {t("settings.language")}
          </Typography>
          <LanguageSwitcher />
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 2 }} />

        {/* Animations Switcher Component */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: "0.875rem",
              opacity: 0.7,
            }}
          >
            {t("settings.animations")}
          </Typography>
          <AnimationsSwitcher />
        </Box>
      </Popover>
    </>
  );
}

export default SettingsButton;
