/**
 * Custom test utilities for rendering React components with required providers.
 *
 * Provides a custom render function that automatically wraps components with
 * LocaleProvider and other necessary context providers to ensure tests run
 * in an environment matching the actual application.
 *
 * Also ensures i18next is initialized with all translation resources for testing.
 *
 * @module __tests__/test-utils
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { LocaleProvider } from '@/src/components/i18n/LocaleProvider';
import { type Locale } from '@/src/lib/i18n';

// Import i18next configuration to ensure it's initialized with resources
import '@/src/lib/i18next-config';

/**
 * Custom render function that wraps components with required providers.
 *
 * This function automatically wraps the component with:
 * - LocaleProvider: Provides i18n context to components using useI18n
 *
 * @param ui - The React element to render
 * @param options - Additional render options from @testing-library/react
 * @param options.initialLocale - Initial locale for LocaleProvider (default: 'en')
 * @returns Render result from @testing-library/react
 *
 * @example
 * ```tsx
 * // Instead of:
 * render(<MyComponent />);
 *
 * // Use:
 * renderWithProviders(<MyComponent />);
 *
 * // Or with custom locale:
 * renderWithProviders(<MyComponent />, { initialLocale: 'fr' });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    initialLocale = 'en' as Locale,
    ...renderOptions
  }: RenderOptions & { initialLocale?: Locale } = {}
) {
  /**
   * Wrapper component that provides all necessary contexts.
   * Wraps the component with LocaleProvider to enable i18n functionality.
   *
   * @param params - The wrapper parameters
   * @param params.children - The React node(s) to wrap with providers
   * @returns The wrapped component with all necessary providers applied
   */
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the default render with our custom one
export { renderWithProviders as render };
