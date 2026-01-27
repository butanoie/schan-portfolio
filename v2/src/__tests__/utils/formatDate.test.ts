import { describe, it, expect, vi } from 'vitest';
import { formatDate, formatCirca } from '@/src/utils/formatDate';

/**
 * Tests for date formatting utilities.
 *
 * These tests verify that date formatting functions handle various inputs correctly,
 * including edge cases like invalid dates and different formatting options.
 */
describe('formatDate', () => {
  it('should format a valid ISO date string to long format', () => {
    const result = formatDate('2024-01-15T12:00:00Z');
    expect(result).toBe('January 15, 2024');
  });

  it('should format a date with custom options', () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
    };
    const result = formatDate('2024-01-15', options);
    expect(result).toBe('Jan 2024');
  });

  it('should format a date with year and month only', () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };
    const result = formatDate('2024-01-15', options);
    expect(result).toBe('January 2024');
  });

  it('should handle invalid date strings gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = formatDate('invalid-date');

    // Should return the original string when date is invalid
    expect(result).toBe('invalid-date');

    // Should log an error
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error formatting date:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should handle empty string input', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = formatDate('');

    // Should return the original empty string
    expect(result).toBe('');

    // Should log an error
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should format dates from different years', () => {
    expect(formatDate('2020-06-15T12:00:00Z')).toBe('June 15, 2020');
    expect(formatDate('2025-12-31T12:00:00Z')).toBe('December 31, 2025');
    expect(formatDate('2000-01-01T12:00:00Z')).toBe('January 1, 2000');
  });
});

/**
 * Tests for circa date formatting.
 */
describe('formatCirca', () => {
  it('should return a simple circa string unchanged', () => {
    const result = formatCirca('Summer 2024');
    expect(result).toBe('Summer 2024');
  });

  it('should return a date range unchanged', () => {
    const result = formatCirca('Fall 2017 - Present');
    expect(result).toBe('Fall 2017 - Present');
  });

  it('should handle winter season', () => {
    const result = formatCirca('Winter 2025');
    expect(result).toBe('Winter 2025');
  });

  it('should handle empty string', () => {
    const result = formatCirca('');
    expect(result).toBe('');
  });

  it('should handle complex circa strings', () => {
    const result = formatCirca('Summer 2016 - Present');
    expect(result).toBe('Summer 2016 - Present');
  });
});
