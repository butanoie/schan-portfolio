/**
 * Language switcher component with toggle buttons for each supported language.
 *
 * Displays two buttons (English, Français) in a toggle group.
 * Current language is highlighted. Clicking a button changes the language.
 * Users can also navigate between languages using keyboard (Tab, Arrow keys).
 *
 * Accessibility features:
 * - Keyboard navigation with Tab and Arrow keys
 * - Enter/Space to select language
 * - ARIA labels on all buttons describing the language
 * - Selected state announced to screen readers
 * - Focus visible indicator on keyboard navigation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LanguageSwitcher />
 *
 * // With callback when language changes
 * <LanguageSwitcher onChange={() => {
 *   console.log('Language changed');
 *   closePopover();
 * }} />
 * ```
 */

'use client';

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useLocale } from '@/src/hooks/useLocale';
import { useI18n } from '@/src/hooks/useI18n';
import { type Locale } from '@/src/lib/i18n';
import { TOGGLE_BORDER_COLOR, TOGGLE_BUTTON_SX } from './toggleStyles';

/**
 * Props for the LanguageSwitcher component.
 */
interface LanguageSwitcherProps {
  /**
   * Optional callback fired when a language is selected.
   * Useful for closing parent popover after selection.
   */
  onChange?: () => void;

  /**
   * Optional CSS class name for styling.
   *
   * @default undefined
   */
  className?: string;
}

/**
 * Configuration for each language toggle option.
 * Each entry maps a Locale value to its display label translation key.
 */
const LANGUAGE_OPTIONS: Array<{
  value: Locale;
  labelKey: string;
}> = [
  { value: 'en', labelKey: 'settings.english' },
  { value: 'fr', labelKey: 'settings.french' },
];

/**
 * Language switcher component.
 *
 * Renders a toggle button group with language options.
 * The currently active language is highlighted.
 * Clicking a button changes the language and triggers optional callback.
 *
 * @param props - Component props
 * @param props.onChange - Optional callback when language changes
 * @param props.className - Optional CSS class name
 * @returns A language selector with toggle buttons
 */
export function LanguageSwitcher({
  onChange,
  className,
}: LanguageSwitcherProps): React.ReactNode {
  const { locale, setLocale } = useLocale();
  const { t } = useI18n();

  /**
   * Handle language selection change.
   * Updates the locale and triggers the optional callback.
   *
   * @param _event - The click event (unused)
   * @param newLocale - The newly selected locale, or null if deselected
   */
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLocale: Locale | null
  ): void => {
    // Only update if a language is selected (not null)
    // MUI ToggleButtonGroup can return null in non-exclusive mode,
    // but this component uses exclusive mode so null means user clicked same button
    if (newLocale !== null) {
      setLocale(newLocale);
      onChange?.();
    }
  };

  return (
    <Box className={className}>
      <ToggleButtonGroup
        value={locale}
        exclusive
        onChange={handleChange}
        aria-label={t('settings.language')}
        sx={{
          display: 'flex',
          width: '100%',
          border: `1px solid ${TOGGLE_BORDER_COLOR}`,
        }}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={t(option.labelKey)}
            sx={TOGGLE_BUTTON_SX}
          >
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              {t(option.labelKey)}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
