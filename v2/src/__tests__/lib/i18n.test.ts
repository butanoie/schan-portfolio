/**
 * Unit tests for i18n utilities.
 *
 * Tests date formatting, number formatting, currency formatting,
 * locale detection, and RTL checking.
 *
 * Note: Translation lookup is now handled by i18next and is tested
 * in the useI18n hook tests instead.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatDate,
  formatNumber,
  formatCurrency,
  detectLocale,
  isRTL,
  LOCALES,
  DEFAULT_LOCALE,
  type Locale,
} from '@/src/lib/i18n';

describe('i18n Library', () => {
  describe('Constants', () => {
    it('should have en as default locale', () => {
      expect(DEFAULT_LOCALE).toBe('en');
    });

    it('should include en in supported locales', () => {
      expect(LOCALES).toContain('en');
    });

    it('should include fr in supported locales', () => {
      expect(LOCALES).toContain('fr');
    });
  });

  describe('formatDate()', () => {
    const testDate = new Date('2026-02-03T00:00:00Z');

    it('should format date in en-US locale', () => {
      const result = formatDate(testDate, 'en-US');
      // Check for key components instead of exact format
      // Intl.DateTimeFormat produces different formats in different environments
      expect(result).toContain('2026');
      expect(result).toMatch(/3|February|Feb/);
    });

    it('should format date in de-DE locale', () => {
      const result = formatDate(testDate, 'de-DE');
      // German format: "3. Februar 2026" or similar
      expect(result).toContain('2026');
    });

    it('should use en-US as default locale', () => {
      const result = formatDate(testDate);
      // Check for key components instead of exact format
      expect(result).toContain('2026');
      expect(result).toMatch(/3|February|Feb/);
    });

    it('should handle current date', () => {
      const today = new Date();
      const result = formatDate(today);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle edge dates', () => {
      // Use noon UTC to ensure date is consistent across timezones
      const newYear = new Date('2026-01-01T12:00:00Z');
      const result = formatDate(newYear, 'en-US');
      expect(result).toContain('2026');
      expect(result).toMatch(/1|January|Jan/);
    });
  });

  describe('formatNumber()', () => {
    it('should format number in en-US locale', () => {
      const result = formatNumber(1234.56, 'en-US');
      expect(result).toBe('1,234.56');
    });

    it('should format number in de-DE locale', () => {
      const result = formatNumber(1234.56, 'de-DE');
      expect(result).toBe('1.234,56');
    });

    it('should use en-US as default locale', () => {
      const result = formatNumber(1000);
      expect(result).toBe('1,000');
    });

    it('should handle large numbers', () => {
      const result = formatNumber(1000000, 'en-US');
      expect(result).toContain(',');
    });

    it('should handle negative numbers', () => {
      const result = formatNumber(-1234.56, 'en-US');
      expect(result).toContain('-');
    });

    it('should handle zero', () => {
      const result = formatNumber(0, 'en-US');
      expect(result).toBe('0');
    });

    it('should support custom options', () => {
      const result = formatNumber(0.5, 'en-US', {
        style: 'percent',
      });
      expect(result).toContain('%');
    });

    it('should handle decimal places option', () => {
      const result = formatNumber(1234.567, 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result).toBe('1,234.57');
    });
  });

  describe('formatCurrency()', () => {
    it('should format USD in en-US locale', () => {
      const result = formatCurrency(1234.56, 'USD', 'en-US');
      expect(result).toMatch(/\$1,234\.56|USD 1,234\.56/);
    });

    it('should format EUR in de-DE locale', () => {
      const result = formatCurrency(1234.56, 'EUR', 'de-DE');
      expect(result).toContain('1');
    });

    it('should use USD as default currency', () => {
      const result = formatCurrency(100);
      expect(result).toContain('100');
    });

    it('should use en-US as default locale', () => {
      const result = formatCurrency(100, 'USD');
      expect(result).toMatch(/\$100\.00|USD 100\.00/);
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(-100, 'USD', 'en-US');
      expect(result).toContain('100');
    });

    it('should handle zero amount', () => {
      const result = formatCurrency(0, 'USD', 'en-US');
      expect(result).toContain('0');
    });

    it('should handle different currencies', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
      currencies.forEach((currency) => {
        const result = formatCurrency(100, currency, 'en-US');
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });
    });
  });

  describe('detectLocale()', () => {
    beforeEach(() => {
      // Reset navigator mock
      vi.resetAllMocks();
    });

    it('should detect en locale from en-US navigator language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });
      const result = detectLocale();
      expect(result).toBe('en');
    });

    it('should detect en locale from en-GB navigator language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'en-GB',
        configurable: true,
      });
      const result = detectLocale();
      expect(result).toBe('en');
    });

    it('should handle server-side rendering', () => {
      // When window is undefined, should return default locale
      const originalWindow = global.window;
      // @ts-expect-error Testing server-side
      global.window = undefined;
      const result = detectLocale();
      expect(result).toBe('en');
      global.window = originalWindow;
    });

    it('should return DEFAULT_LOCALE for unsupported language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'ja-JP',
        configurable: true,
      });
      const result = detectLocale();
      expect(result).toBe(DEFAULT_LOCALE);
    });

    it('should extract language code from full locale', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'en-US-x-twain',
        configurable: true,
      });
      const result = detectLocale();
      expect(result).toBe('en');
    });
  });

  describe('isRTL()', () => {
    it('should return false for en locale', () => {
      const result = isRTL('en');
      expect(result).toBe(false);
    });

    it('should use default locale when not specified', () => {
      const result = isRTL();
      expect(result).toBe(false);
    });

    it('should always return false with current locales', () => {
      // Since only en is supported, all should be LTR
      LOCALES.forEach((locale) => {
        expect(isRTL(locale)).toBe(false);
      });
    });
  });

  describe('Type Safety', () => {
    it('should have Locale type for valid locales', () => {
      const validLocale: Locale = 'en';
      expect(validLocale).toBe('en');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const result = formatNumber(999999999999, 'en-US');
      expect(result).toBeTruthy();
      expect(result).toContain(',');
    });

    it('should handle very small numbers', () => {
      const result = formatNumber(0.0001, 'en-US');
      expect(result).toBeTruthy();
    });

    it('should handle date at year boundaries', () => {
      // Use noon UTC to ensure dates are consistent across timezones
      const dec31 = new Date('2025-12-31T12:00:00Z');
      const result = formatDate(dec31, 'en-US');
      expect(result).toContain('2025');

      const jan1 = new Date('2026-01-01T12:00:00Z');
      const result2 = formatDate(jan1, 'en-US');
      expect(result2).toContain('2026');
    });
  });

  describe('Consistency', () => {
    it('should format same number consistently', () => {
      const number = 1234.56;
      const result1 = formatNumber(number, 'en-US');
      const result2 = formatNumber(number, 'en-US');
      expect(result1).toBe(result2);
    });

    it('should format same date consistently', () => {
      const date = new Date('2026-02-03');
      const result1 = formatDate(date, 'en-US');
      const result2 = formatDate(date, 'en-US');
      expect(result1).toBe(result2);
    });
  });
});
