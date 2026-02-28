"use client";

import { Box, Typography } from "@mui/material";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AnimationsSwitcher } from "./AnimationsSwitcher";
import { useI18n } from "@/src/hooks/useI18n";

/**
 * Configuration for each settings section displayed in the list.
 */
interface SettingsSection {
  /** Translation key for the section label */
  labelKey: string;
  /** Switcher component to render for this section */
  Component: React.ComponentType;
}

/**
 * The ordered list of settings sections shown in both SettingsButton popover
 * and HamburgerMenu drawer. Uses component references rather than JSX instances
 * so each consumer renders its own component tree.
 */
const SETTINGS_SECTIONS: SettingsSection[] = [
  { labelKey: "settings.theme", Component: ThemeSwitcher },
  { labelKey: "settings.language", Component: LanguageSwitcher },
  { labelKey: "settings.animations", Component: AnimationsSwitcher },
];

/**
 * Props for the SettingsList component.
 */
interface SettingsListProps {
  /**
   * Optional separator element rendered between sections.
   * When provided, it is placed between each pair of sections.
   * When omitted, sections are separated by a bottom margin.
   */
  separator?: React.ReactNode;
}

/**
 * Renders the theme, language, and animations settings sections.
 *
 * Used by both SettingsButton (popover) and HamburgerMenu (drawer)
 * to display the same settings controls with consistent labeling.
 *
 * @param props - Component props
 * @param props.separator - Optional element rendered between sections (e.g., Divider)
 * @returns A list of labeled settings sections
 *
 * @example
 * ```tsx
 * // In HamburgerMenu (no separator, uses spacing)
 * <SettingsList />
 *
 * // In SettingsButton popover (with dividers between sections)
 * <SettingsList separator={<Divider sx={{ my: 2 }} />} />
 * ```
 */
export function SettingsList({ separator }: SettingsListProps): React.ReactNode {
  const { t } = useI18n();

  return (
    <>
      {SETTINGS_SECTIONS.map((section, index) => {
        const isLast = index === SETTINGS_SECTIONS.length - 1;
        return (
          <Box key={section.labelKey} sx={!separator && !isLast ? { mb: 2 } : undefined}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                opacity: 0.7,
              }}
            >
              {t(section.labelKey)}
            </Typography>
            <section.Component />
            {separator && !isLast && separator}
          </Box>
        );
      })}
    </>
  );
}
