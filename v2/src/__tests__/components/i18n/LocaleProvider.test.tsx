/**
 * Unit tests for LocaleProvider component.
 *
 * Tests LocaleProvider for proper locale initialization, persistence,
 * browser detection, i18next synchronization, and error handling.
 */

/* eslint-disable jsdoc/require-jsdoc */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { LocaleProvider } from '@/src/components/i18n/LocaleProvider';
import { useLocale } from '@/src/hooks/useLocale';
import i18next from 'i18next';

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
});

// Mock i18next.changeLanguage
vi.mock('i18next', async () => {
  const actual = await vi.importActual('i18next');
  return {
    ...actual,
    default: {
      ...actual,
      changeLanguage: vi.fn(() => Promise.resolve()),
    },
  };
});

describe('LocaleProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should initialize with provided locale', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      expect(result.current.locale).toBe('en');
    });

    it('should initialize with default locale when not provided', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider>{children}</LocaleProvider>
        ),
      });

      expect(result.current.locale).toBe('en');
    });

    it('should sync initial locale with i18next', () => {
      renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="fr">{children}</LocaleProvider>
        ),
      });

      expect(i18next.changeLanguage).toHaveBeenCalledWith('fr');
    });
  });

  describe('localStorage Integration', () => {
    it('should load saved locale from localStorage', () => {
      localStorage.setItem('locale', 'fr');

      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      // Should load from localStorage, overriding initialLocale
      expect(result.current.locale).toBe('fr');
    });

    it('should persist locale changes to localStorage', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      act(() => {
        result.current.setLocale('fr');
      });

      expect(localStorage.getItem('locale')).toBe('fr');
    });

    it('should validate saved locale before using it', () => {
      localStorage.setItem('locale', 'invalid-locale');

      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      // Should ignore invalid locale and use initial or detected locale
      expect(result.current.locale).toBe('en');
    });

    it('should handle empty localStorage gracefully', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      expect(result.current.locale).toBe('en');
      expect(localStorage.getItem('locale')).toBe('en');
    });
  });

  describe('Locale Changes', () => {
    it('should change locale when setLocale is called', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      expect(result.current.locale).toBe('en');

      act(() => {
        result.current.setLocale('fr');
      });

      expect(result.current.locale).toBe('fr');
    });

    it('should sync locale changes with i18next', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      act(() => {
        result.current.setLocale('fr');
      });

      expect(i18next.changeLanguage).toHaveBeenCalledWith('fr');
    });

    it('should persist locale changes immediately', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      act(() => {
        result.current.setLocale('fr');
      });

      expect(localStorage.getItem('locale')).toBe('fr');
    });

    it('should handle multiple rapid locale changes', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      act(() => {
        result.current.setLocale('fr');
        result.current.setLocale('en');
        result.current.setLocale('fr');
      });

      expect(result.current.locale).toBe('fr');
      expect(localStorage.getItem('locale')).toBe('fr');
    });
  });

  describe('Error Handling', () => {
    it('should handle i18next initialization errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(i18next.changeLanguage).mockRejectedValueOnce(
        new Error('i18next failed')
      );

      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      // Should still render with locale despite i18next error
      expect(result.current.locale).toBe('en');

      // Wait for the async error handler to be called
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('should continue functioning after i18next error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(i18next.changeLanguage).mockRejectedValueOnce(
        new Error('i18next failed')
      );

      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      // Wait for async error handling
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      // Should still be able to change locale
      act(() => {
        result.current.setLocale('fr');
      });

      expect(result.current.locale).toBe('fr');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Context Provision', () => {
    it('should provide locale context to child components', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="fr">{children}</LocaleProvider>
        ),
      });

      expect(result.current.locale).toBe('fr');
      expect(typeof result.current.setLocale).toBe('function');
    });

    it('should allow multiple children to access locale context', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <LocaleProvider initialLocale="en">{children}</LocaleProvider>
      );

      const { result: result1 } = renderHook(() => useLocale(), { wrapper });
      const { result: result2 } = renderHook(() => useLocale(), { wrapper });

      expect(result1.current.locale).toBe(result2.current.locale);
    });
  });

  describe('Hydration Safety', () => {
    it('should not cause hydration mismatches with initial render', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      // First render should complete without errors
      expect(result.current.locale).toBe('en');
    });

    it('should use useEffect for locale updates to prevent hydration issues', () => {
      localStorage.setItem('locale', 'fr');

      const { result } = renderHook(() => useLocale(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <LocaleProvider initialLocale="en">{children}</LocaleProvider>
        ),
      });

      // Should eventually load from localStorage
      expect(result.current.locale).toBe('fr');
    });
  });
});
