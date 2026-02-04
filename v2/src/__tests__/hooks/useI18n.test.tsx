/**
 * Unit tests for i18n hooks.
 *
 * Tests useI18n and useLocale hooks for proper context usage,
 * error handling, and utilities access.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { useI18n } from '@/src/hooks/useI18n';
import { useLocale } from '@/src/hooks/useLocale';
import { LocaleProvider } from '@/src/components/i18n/LocaleProvider';
import { type TranslationKey } from '@/src/lib/i18n';

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

      const translated = result.current.t('common.home');
      expect(translated).toBe('Home');
    });

    it('should return key if translation not found', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      // Test with a key that doesn't exist in translations
      const nonexistentKey = 'nonexistent.key' as const;
      const fallback = result.current.t(nonexistentKey as unknown as TranslationKey);
      expect(fallback).toBe(nonexistentKey);
    });

    it('should translate multiple keys', () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: createWrapper(),
      });

      const home = result.current.t('common.home');
      const portfolio = result.current.t('common.portfolio');
      const resume = result.current.t('common.resume');

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
    it('should return current locale', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBe('en');
    });

    it('should return string type', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current).toBe('string');
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

      const locale = result.current;
      expect(locale).toBeTruthy();
      // Should be valid for use in lang attribute
      expect(locale).toMatch(/^[a-z]{2}$/);
    });

    it('should work for conditional rendering based on locale', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: createWrapper(),
      });

      const locale = result.current;
      if (locale === 'en') {
        expect(true).toBe(true);
      } else {
        expect(false).toBe(true);
      }
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

    expect(i18nResult.current.locale).toBe(localeResult.current);
  });

  it('should provide consistent locale', () => {
    const { result: result1 } = renderHook(() => useLocale(), {
      wrapper: createWrapper(),
    });
    const { result: result2 } = renderHook(() => useLocale(), {
      wrapper: createWrapper(),
    });

    expect(result1.current).toBe(result2.current);
  });
});
