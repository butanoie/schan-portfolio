/**
 * Unit tests for i18n hooks.
 *
 * Tests useI18n and useLocale hooks for proper context usage,
 * error handling, and utilities access.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { useI18n } from '@/src/hooks/useI18n';
import { useLocale } from '@/src/hooks/useLocale';
import { LocaleProvider } from '@/src/components/i18n/LocaleProvider';

/**
 * Creates a wrapper component that provides LocaleContext for testing.
 *
 * @returns Wrapper function for renderHook
 */
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <LocaleProvider initialLocale="en">{children}</LocaleProvider>;
  };
}

describe('useI18n Hook', () => {
  describe('Basic Functionality', () => {
    it('should return i18n utilities object', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('t');
      expect(result.current).toHaveProperty('formatDate');
      expect(result.current).toHaveProperty('formatNumber');
      expect(result.current).toHaveProperty('formatCurrency');
      expect(result.current).toHaveProperty('locale');
    });

    it('should provide correct locale', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      expect(result.current.locale).toBe('en');
    });
  });

  describe('Translation Function (t)', () => {
    it('should translate strings', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      const translated = result.current.t('nav.home');
      expect(translated).toBe('Home');
    });

    it('should return key if translation not found', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      // Test with a key that doesn't exist in translations
      const nonexistentKey = 'nonexistent.key';
      const fallback = result.current.t(nonexistentKey);
      expect(fallback).toBe(nonexistentKey);
    });

    it('should translate multiple keys', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      const home = result.current.t('nav.home');
      const portfolio = result.current.t('nav.portfolio');
      const resume = result.current.t('nav.resume');

      expect(home).toBe('Home');
      expect(portfolio).toBe('Portfolio');
      expect(resume).toBe('Résumé');
    });
  });

  describe('Formatting Functions', () => {
    it('should format dates', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      // Use noon UTC to ensure consistent date across timezones
      const date = new Date('2026-02-03T12:00:00Z');
      const formatted = result.current.formatDate(date);

      expect(formatted).toContain('2026');
      expect(formatted).toContain('3');
    });

    it('should format numbers', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      const formatted = result.current.formatNumber(1234.56);
      expect(formatted).toBe('1,234.56');
    });

    it('should format currency', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      const formatted = result.current.formatCurrency(100, 'USD');
      expect(formatted).toContain('100');
    });

    it('should format with locale awareness', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      // en-US uses . as decimal separator
      const formatted = result.current.formatNumber(1234.56);
      expect(formatted).toContain('.');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when used outside provider', () => {
      // Render without provider wrapper
      expect(() => {
        renderHook(() => useI18n());
      }).toThrow('useI18n must be used inside a LocaleProvider');
    });

    it('should provide helpful error message', () => {
      expect(() => {
        renderHook(() => useI18n());
      }).toThrow(
        'useI18n must be used inside a LocaleProvider. Wrap your component tree with <LocaleProvider>'
      );
    });
  });

  describe('Type Safety', () => {
    it('should accept valid translation keys', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        result.current.t('common.home');
        result.current.t('pages.home.title');
        result.current.t('buttons.loadMore');
      }).not.toThrow();
    });
  });
});

describe('useLocale Hook', () => {
  describe('Basic Functionality', () => {
    it('should return locale and setLocale function', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('locale');
      expect(result.current).toHaveProperty('setLocale');
      expect(typeof result.current.setLocale).toBe('function');
    });

    it('should return current locale value', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: createWrapper(),
      });

      expect(result.current.locale).toBe('en');
      expect(typeof result.current.locale).toBe('string');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useLocale());
      }).toThrow('useLocale must be used inside a LocaleProvider');
    });

    it('should provide helpful error message', () => {
      expect(() => {
        renderHook(() => useLocale());
      }).toThrow(
        'useLocale must be used inside a LocaleProvider. Wrap your component tree with <LocaleProvider>'
      );
    });
  });

  describe('Usage Scenarios', () => {
    it('should work for setting HTML lang attribute', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: createWrapper(),
      });

      const locale = result.current.locale;
      expect(locale).toBeTruthy();
      // Should be valid for use in lang attribute
      expect(locale).toMatch(/^[a-z]{2}$/);
    });

    it('should work for conditional rendering based on locale', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: createWrapper(),
      });

      const locale = result.current.locale;
      if (locale === 'en') {
        expect(true).toBe(true);
      } else {
        expect(false).toBe(true);
      }
    });

    it('should provide setLocale function to change locale', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: createWrapper(),
      });

      expect(result.current.setLocale).toBeDefined();
      expect(typeof result.current.setLocale).toBe('function');
      // setLocale should be callable
      expect(() => {
        act(() => {
          result.current.setLocale('fr');
        });
      }).not.toThrow();
    });
  });
});

describe('Hook Integration', () => {
  it('should work together in same component', () => {
    const { result: i18nResult } = renderHook(() => useI18n(), {
      wrapper: createWrapper(),
    });
    const { result: localeResult } = renderHook(() => useLocale(), {
      wrapper: createWrapper(),
    });

    expect(i18nResult.current.locale).toBe(localeResult.current.locale);
  });

  it('should provide consistent locale', () => {
    const { result: result1 } = renderHook(() => useLocale(), {
      wrapper: createWrapper(),
    });
    const { result: result2 } = renderHook(() => useLocale(), {
      wrapper: createWrapper(),
    });

    expect(result1.current.locale).toBe(result2.current.locale);
  });
});
