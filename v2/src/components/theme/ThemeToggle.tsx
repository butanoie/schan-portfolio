/**
 * Theme toggle button component.
 *
 * Allows users to cycle through available themes (light, dark, high-contrast).
 * Shows current theme mode with an icon and tooltip.
 * Fully accessible with keyboard navigation and ARIA labels.
 */

"use client";

import { IconButton, Tooltip } from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Contrast as ContrastIcon,
} from "@mui/icons-material";
import { useTheme } from "@/src/hooks/useTheme";
import { ThemeMode } from "@/src/types/theme";

/**
 * Props for the ThemeToggle component.
 */
interface ThemeToggleProps {
  /**
   * Size of the icon button.
   *
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";

  /**
   * Optional CSS class name for styling.
   */
  className?: string;

  /**
   * Optional callback when theme changes.
   */
  onChange?: (newTheme: ThemeMode) => void;
}

/**
 * Button component for cycling through theme modes.
 *
 * Cycles through: Light → Dark → High Contrast → Light
 *
 * Accessibility features:
 * - aria-label describing current theme and action
 * - Keyboard accessible: Tab to focus, Enter/Space to activate
 * - Tooltip shows current theme name
 * - Clear visual icon indicating current mode
 * - Respects prefers-reduced-motion for transitions
 *
 * @param props - Component props
 * @param props.size - Size of the icon button (default: 'medium')
 * @param props.className - Optional CSS class name for styling
 * @param props.onChange - Optional callback when theme changes
 * @returns Theme toggle button element
 *
 * @example
 * ```tsx
 * function Header() {
 *   return (
 *     <div>
 *       <h1>My App</h1>
 *       <ThemeToggle />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With callback
 * <ThemeToggle
 *   size="large"
 *   onChange={(newTheme) => {
 *     console.log('Theme changed to:', newTheme);
 *   }}
 * />
 * ```
 */
export function ThemeToggle({
  size = "medium",
  className,
  onChange,
}: ThemeToggleProps) {
  const { theme, getNextTheme, setTheme } = useTheme();

  /**
   * Handle theme toggle click.
   * Cycles to the next theme mode and triggers callback if provided.
   */
  const handleToggle = () => {
    const nextTheme = getNextTheme();
    setTheme(nextTheme);
    onChange?.(nextTheme);
  };

  /**
   * Map theme modes to display labels.
   */
  const themeLabels: Record<ThemeMode, string> = {
    light: "Light theme",
    dark: "Dark theme",
    highContrast: "High contrast theme",
  };

  /**
   * Map theme modes to display icons.
   */
  const themeIcons: Record<ThemeMode, React.ReactNode> = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
    highContrast: <ContrastIcon />,
  };

  const currentLabel = themeLabels[theme];
  const icon = themeIcons[theme];

  return (
    <Tooltip title={`${currentLabel} (click to change)`}>
      <IconButton
        onClick={handleToggle}
        aria-label={`Toggle theme (currently: ${currentLabel})`}
        aria-pressed="false"
        size={size}
        className={className}
        sx={{
          transition: "color 150ms ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
