/**
 * Alert component that displays when the application language is set to French.
 *
 * Informs users that all strings have been machine translated and French is present
 * as a demonstration of the localization capabilities of the web application.
 *
 * The alert is only visible when the current locale is French (fr).
 * It uses an outlined info alert style and appears below the main header.
 *
 * @returns An outlined Alert component when French is active, null otherwise
 *
 * @example
 * ```tsx
 * // Renders in MainLayout below the Header
 * <Header />
 * <FrenchTranslationAlert />
 * ```
 */

'use client';

import { Alert, Container } from '@mui/material';
import { useLocale } from '@/src/hooks/useLocale';
import { useI18n } from '@/src/hooks/useI18n';

/**
 * FrenchTranslationAlert component.
 *
 * Displays an info alert when the application locale is set to French.
 * The alert explains that all strings have been machine translated and French is
 * present only as a demonstration of the web application's localization capabilities.
 *
 * @returns An outlined Alert component with localized title and message when French is active, null otherwise
 */
export function FrenchTranslationAlert(): React.ReactNode {
  const { locale } = useLocale();
  const { t } = useI18n();

  // Only display alert when French locale is active
  if (locale !== 'fr') {
    return null;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 3, lg: 6 },
        py: 2,
      }}
    >
      <Alert
        variant="outlined"
        severity="info"
        sx={{
          borderRadius: 1,
          '& .MuiAlert-message': {
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          },
        }}
      >
        <strong>{t('frenchTranslationAlert.title', { ns: 'components' })}</strong>
        <div>{t('frenchTranslationAlert.message', { ns: 'components' })}</div>
      </Alert>
    </Container>
  );
}

export default FrenchTranslationAlert;
