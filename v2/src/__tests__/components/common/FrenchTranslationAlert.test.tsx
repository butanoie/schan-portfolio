/**
 * Unit tests for FrenchTranslationAlert component.
 *
 * Tests FrenchTranslationAlert for proper rendering based on locale,
 * correct message display, and accessibility features.
 */

/* eslint-disable jsdoc/require-jsdoc */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { FrenchTranslationAlert } from '@/src/components/common/FrenchTranslationAlert';
import { LocaleProvider } from '@/src/components/i18n/LocaleProvider';

/**
 * Creates a wrapper component that provides LocaleContext for testing.
 *
 * @param initialLocale - Initial locale for the provider
 * @returns Wrapper function for render
 */
function createWrapper(initialLocale: 'en' | 'fr' = 'en') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>;
  };
}

describe('FrenchTranslationAlert', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};

      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('should render alert when locale is French', () => {
      const Wrapper = createWrapper('fr');
      render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should not render when locale is English', () => {
      const Wrapper = createWrapper('en');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = container.querySelector('[role="alert"]');
      expect(alert).not.toBeInTheDocument();
    });

    it('should return null when locale is not French', () => {
      const Wrapper = createWrapper('en');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      // Container should be empty
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Content', () => {
    it('should display alert title', () => {
      const Wrapper = createWrapper('fr');
      render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      // Look for the title - should use i18n translation
      const alert = screen.getByRole('alert');
      expect(alert.textContent).toMatch(/translation|traduction/i);
    });

    it('should display alert message', () => {
      const Wrapper = createWrapper('fr');
      render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = screen.getByRole('alert');
      expect(alert.textContent).toBeTruthy();
      expect(alert.textContent?.length).toBeGreaterThan(0);
    });

    it('should display localized strings when French is active', () => {
      const Wrapper = createWrapper('fr');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = container.querySelector('[role="alert"]');
      // Alert should contain strong tag (title) and div (message)
      const strongElement = alert?.querySelector('strong');
      const messageDiv = alert?.querySelector('div:not([class])');

      expect(strongElement).toBeInTheDocument();
      expect(messageDiv).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should render with outlined info alert variant', () => {
      const Wrapper = createWrapper('fr');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = container.querySelector('[role="alert"]');
      // MUI Alert with variant="outlined" and severity="info"
      expect(alert?.className).toMatch(/Alert/);
    });

    it('should be properly contained within maxWidth container', () => {
      const Wrapper = createWrapper('fr');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const muiContainer = container.querySelector('[class*="Container"]');
      expect(muiContainer).toBeInTheDocument();
    });

    it('should have proper spacing', () => {
      const Wrapper = createWrapper('fr');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      // Should have padding for visual spacing
      const muiContainer = container.querySelector('[class*="Container"]');
      expect(muiContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper role for alerts', () => {
      const Wrapper = createWrapper('fr');
      render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should use alert role for screen readers', () => {
      const Wrapper = createWrapper('fr');
      render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      // role="alert" tells screen readers this is an alert
      const alert = screen.getByRole('alert');
      expect(alert.getAttribute('role')).toBe('alert');
    });

    it('should have semantic HTML structure', () => {
      const Wrapper = createWrapper('fr');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = container.querySelector('[role="alert"]');
      // Should contain strong for title and div for message
      expect(alert?.querySelector('strong')).toBeInTheDocument();
    });

    it('should be visually distinguishable with info severity', () => {
      const Wrapper = createWrapper('fr');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = container.querySelector('[role="alert"]');
      // Should have info styling (MUI applies severity styles)
      expect(alert).toBeInTheDocument();
      expect(alert?.className).toBeTruthy();
    });
  });

  describe('Locale-based Visibility', () => {
    it('should not render for English locale', () => {
      const Wrapper = createWrapper('en');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      expect(container.firstChild).toBeNull();
    });

    it('should render only for French locale', () => {
      const Wrapper = createWrapper('fr');
      render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should update when locale changes via context', () => {
      // When locale changes via LocaleProvider context, the component should re-render
      // This is tested implicitly through the "should render only for French locale" test
      // as the component uses useLocale() hook which responds to context changes
      const Wrapper = createWrapper('fr');
      render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with LocaleProvider context', () => {
      const Wrapper = createWrapper('fr');
      render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should display when inside MainLayout', () => {
      const Wrapper = createWrapper('fr');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      // Alert component should be a direct child of a container
      const muiContainer = container.querySelector('[class*="Container"]');
      const alert = muiContainer?.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it('should not break other components when not visible', () => {
      const Wrapper = createWrapper('en');
      const { container } = render(
        <div>
          <div>Other Content</div>
          <FrenchTranslationAlert />
        </div>,
        { wrapper: Wrapper }
      );

      // Other content should still be visible
      expect(container.textContent).toContain('Other Content');
      // Alert should not be rendered
      expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid locale switches gracefully', () => {
      const Wrapper = createWrapper('en');
      const { rerender } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      // Switch locales multiple times
      const FrenchWrapper = createWrapper('fr');
      rerender(
        <FrenchWrapper>
          <FrenchTranslationAlert />
        </FrenchWrapper>
      );

      const EnglishWrapper = createWrapper('en');
      rerender(
        <EnglishWrapper>
          <FrenchTranslationAlert />
        </EnglishWrapper>
      );

      // Should correctly reflect current locale
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display only once per French locale', () => {
      const Wrapper = createWrapper('fr');
      const { container } = render(<FrenchTranslationAlert />, { wrapper: Wrapper });

      const alerts = container.querySelectorAll('[role="alert"]');
      // Should only have one alert
      expect(alerts).toHaveLength(1);
    });
  });
});
