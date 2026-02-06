/**
 * Unit tests for LanguageSwitcher component.
 *
 * Tests LanguageSwitcher for proper rendering, language selection,
 * callbacks, and accessibility features.
 */

/* eslint-disable jsdoc/require-jsdoc */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { LanguageSwitcher } from '@/src/components/settings/LanguageSwitcher';
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

describe('LanguageSwitcher', () => {
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
    it('should render language switcher component', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      // Should find the toggle button group by aria-label
      const toggleGroup = screen.getByRole('group', { name: /language/i });
      expect(toggleGroup).toBeInTheDocument();
    });

    it('should render English button', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const englishButton = screen.getByRole('button', { name: /english/i });
      expect(englishButton).toBeInTheDocument();
    });

    it('should render French button', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });
      expect(frenchButton).toBeInTheDocument();
    });

    it('should display all language options', () => {
      const Wrapper = createWrapper('en');
      const { container } = render(<LanguageSwitcher />, { wrapper: Wrapper });

      const buttons = container.querySelectorAll('button');
      // Should have at least 2 language buttons
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Language Selection', () => {
    it('should display current language as selected', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const englishButton = screen.getByRole('button', { name: /english/i });
      // In MUI ToggleButton, the selected button should have aria-pressed="true"
      expect(englishButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should update selected language when button clicked', async () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });

      // Click French button
      await act(async () => {
        fireEvent.click(frenchButton);
      });

      await waitFor(() => {
        expect(frenchButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should highlight French when French is active', async () => {
      const Wrapper = createWrapper('fr');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });

      await waitFor(
        () => {
          expect(frenchButton).toHaveAttribute('aria-pressed', 'true');
        },
        { timeout: 1000 }
      );
    });

    it('should only allow one language to be selected at a time', async () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const englishButton = screen.getByRole('button', { name: /english/i });
      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });

      // Initially English is selected
      expect(englishButton).toHaveAttribute('aria-pressed', 'true');
      expect(frenchButton).toHaveAttribute('aria-pressed', 'false');

      // Click French
      await act(async () => {
        fireEvent.click(frenchButton);
      });

      await waitFor(() => {
        expect(englishButton).toHaveAttribute('aria-pressed', 'false');
        expect(frenchButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('Callbacks', () => {
    it('should call onChange callback when language changes', async () => {
      const onChangeMock = vi.fn();
      const Wrapper = createWrapper('en');

      render(<LanguageSwitcher onChange={onChangeMock} />, { wrapper: Wrapper });

      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });
      await act(async () => {
        fireEvent.click(frenchButton);
      });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalled();
      });
    });

    it('should not call onChange callback if not provided', async () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });

      // Should not throw error
      expect(() => {
        fireEvent.click(frenchButton);
      }).not.toThrow();
    });

    it('should call onChange only once per click', async () => {
      const onChangeMock = vi.fn();
      const Wrapper = createWrapper('en');

      render(<LanguageSwitcher onChange={onChangeMock} />, { wrapper: Wrapper });

      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });
      await act(async () => {
        fireEvent.click(frenchButton);
      });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on toggle group', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const toggleGroup = screen.getByRole('group', { name: /language/i });
      expect(toggleGroup).toHaveAttribute('aria-label');
    });

    it('should have descriptive aria-labels on buttons', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const englishButton = screen.getByRole('button', { name: /english/i });
      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });

      expect(englishButton).toHaveAttribute('aria-label');
      expect(frenchButton).toHaveAttribute('aria-label');
    });

    it('should announce selected state to screen readers', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const englishButton = screen.getByRole('button', { name: /english/i });
      // aria-pressed="true" indicates selected state
      expect(englishButton).toHaveAttribute('aria-pressed');
    });

    it('should be keyboard navigable', () => {
      const Wrapper = createWrapper('en');
      const { container } = render(<LanguageSwitcher />, { wrapper: Wrapper });

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        // All buttons should be keyboard accessible (tabindex=0 or naturally focusable)
        expect(button).toBeVisible();
      });
    });

    it('should work with Tab key navigation', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const englishButton = screen.getByRole('button', { name: /english/i });
      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });

      // Buttons should be focusable
      act(() => {
        englishButton.focus();
      });
      expect(document.activeElement).toBe(englishButton);

      act(() => {
        frenchButton.focus();
      });
      expect(document.activeElement).toBe(frenchButton);
    });
  });

  describe('Props', () => {
    it('should accept and apply className prop', () => {
      const Wrapper = createWrapper('en');
      const { container } = render(<LanguageSwitcher className="custom-class" />, {
        wrapper: Wrapper,
      });

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should work without optional props', () => {
      const Wrapper = createWrapper('en');
      const { container } = render(<LanguageSwitcher />, { wrapper: Wrapper });

      expect(container).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with LocaleProvider context', () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const englishButton = screen.getByRole('button', { name: /english/i });
      expect(englishButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should reflect context changes', async () => {
      const Wrapper = createWrapper('en');
      render(<LanguageSwitcher />, { wrapper: Wrapper });

      const frenchButton = screen.getByRole('button', { name: /fran[çc]ais/i });
      fireEvent.click(frenchButton);

      await waitFor(() => {
        expect(frenchButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });
});
