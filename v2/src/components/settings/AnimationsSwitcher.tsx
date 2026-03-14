'use client';

/**
 * Animations switcher component with toggle for enabling/disabling animations.
 *
 * Displays a toggle switch that allows users to enable or disable animations
 * throughout the application. The state is persisted to localStorage.
 *
 * Accessibility features:
 * - Keyboard accessible toggle
 * - ARIA labels describing the toggle state
 * - Focus visible indicator on keyboard navigation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AnimationsSwitcher />
 *
 * // With callback when animations toggle changes
 * <AnimationsSwitcher onChange={(enabled) => {
 *   console.log('Animations', enabled ? 'enabled' : 'disabled');
 * }} />
 * ```
 */

import { Box, Switch, FormControlLabel, Typography } from '@mui/material';
import { useAnimations } from '@/src/hooks/useAnimations';
import { useI18n } from '@/src/hooks/useI18n';
import { usePalette } from '@/src/hooks/usePalette';
import { BRAND_COLORS } from '@/src/constants';

/**
 * Props for the AnimationsSwitcher component.
 */
interface AnimationsSwitcherProps {
  /**
   * Optional callback fired when animations are toggled.
   * Useful for tracking changes or updating parent state.
   *
   * @param enabled - Whether animations are now enabled
   */
  onChange?: (enabled: boolean) => void;

  /**
   * Optional CSS class name for styling.
   *
   * @default undefined
   */
  className?: string;
}

/**
 * Animations switcher component.
 *
 * Renders a toggle switch with label for enabling/disabling animations.
 * Clicking the switch toggles animations and triggers optional callback.
 *
 * @param props - Component props
 * @param props.onChange - Optional callback when animations toggle
 * @param props.className - Optional CSS class name
 * @returns A toggle switch for animations control
 */
export function AnimationsSwitcher({
  onChange,
  className,
}: AnimationsSwitcherProps): React.ReactNode {
  const { animationsEnabled, setAnimationsEnabled } = useAnimations();
  const { t } = useI18n();
  const { mode } = usePalette();
  const isHighContrast = mode === 'highContrast';

  /**
   * Handle animations toggle change.
   * Updates the animations state and triggers the optional callback.
   *
   * @param event - The change event from the switch
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newEnabled = event.target.checked;
    setAnimationsEnabled(newEnabled);
    onChange?.(newEnabled);
  };

  return (
    <Box className={className}>
      <FormControlLabel
        control={
          <Switch
            checked={animationsEnabled}
            onChange={handleChange}
            aria-label={t('settings.animationsToggle')}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: isHighContrast ? '#FFFFFF' : BRAND_COLORS.sage,
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: isHighContrast
                  ? '#FFFFFF'
                  : BRAND_COLORS.sage,
                opacity: isHighContrast ? 1 : undefined,
              },
              ...(isHighContrast && {
                '& .MuiSwitch-track': {
                  backgroundColor: '#767676',
                  border: '1px solid #FFFFFF',
                },
              }),
            }}
          />
        }
        label={
          <Typography variant="body2">
            {animationsEnabled
              ? t('settings.animationsEnabled')
              : t('settings.animationsDisabled')}
          </Typography>
        }
        sx={{
          display: 'flex',
          width: '100%',
          m: 0,
        }}
      />
    </Box>
  );
}
