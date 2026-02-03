import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  SecurityError,
  DataError,
  NetworkError,
  getUserFriendlyMessage,
  isAppError,
} from '../../utils/errors';

/**
 * Test suite for custom error hierarchy.
 * Verifies error class functionality, categorization, and handling.
 */
describe('Error Hierarchy', () => {
  /**
   * AppError Base Class Tests
   */
  describe('AppError', () => {
    /**
     * Test: AppError creates correctly with all properties
     */
    it('creates error with all properties', () => {
      const error = new AppError('Test error', 'generic', 'APP_001');
      expect(error.message).toBe('Test error');
      expect(error.category).toBe('generic');
      expect(error.code).toBe('APP_001');
      expect(error.name).toBe('AppError');
      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    /**
     * Test: AppError preserves original error
     */
    it('preserves original error when wrapping', () => {
      const originalError = new Error('Original error');
      const appError = new AppError('Wrapped error', 'generic', 'APP_001', originalError);
      expect(appError.originalError).toBe(originalError);
      expect(appError.originalError?.message).toBe('Original error');
    });

    /**
     * Test: AppError uses defaults when not specified
     */
    it('uses default category and code when not provided', () => {
      const error = new AppError('Test error');
      expect(error.category).toBe('generic');
      expect(error.code).toBe('APP_000');
    });

    /**
     * Test: AppError can be caught with try-catch
     */
    it('can be caught and rethrown', () => {
      expect(() => {
        try {
          throw new AppError('Test error', 'generic', 'APP_001');
        } catch (error) {
          if (error instanceof AppError) {
            expect(error.code).toBe('APP_001');
            throw error;
          }
        }
      }).toThrow(AppError);
    });
  });

  /**
   * ValidationError Tests
   */
  describe('ValidationError', () => {
    /**
     * Test: ValidationError has correct category and type
     */
    it('has validation category', () => {
      const error = new ValidationError('Invalid input', 'VAL_001');
      expect(error.category).toBe('validation');
      expect(error.code).toBe('VAL_001');
      expect(error instanceof ValidationError).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    /**
     * Test: ValidationError uses default code
     */
    it('uses default code VAL_001 when not specified', () => {
      const error = new ValidationError('Invalid input');
      expect(error.code).toBe('VAL_001');
    });

    /**
     * Test: ValidationError can wrap original error
     */
    it('can wrap original validation error', () => {
      const original = new Error('Validation failed');
      const error = new ValidationError('Invalid format', 'VAL_002', original);
      expect(error.originalError).toBe(original);
    });

    /**
     * Test: ValidationError has correct name
     */
    it('has correct error name', () => {
      const error = new ValidationError('Invalid input');
      expect(error.name).toBe('ValidationError');
    });
  });

  /**
   * SecurityError Tests
   */
  describe('SecurityError', () => {
    /**
     * Test: SecurityError has correct category and type
     */
    it('has security category', () => {
      const error = new SecurityError('XSS attempt', 'SEC_001');
      expect(error.category).toBe('security');
      expect(error.code).toBe('SEC_001');
      expect(error instanceof SecurityError).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    /**
     * Test: SecurityError uses default code
     */
    it('uses default code SEC_001 when not specified', () => {
      const error = new SecurityError('Security violation');
      expect(error.code).toBe('SEC_001');
    });

    /**
     * Test: SecurityError error codes are distinct
     */
    it('supports different security error codes', () => {
      const errors = [
        new SecurityError('XSS', 'SEC_001'),
        new SecurityError('Injection', 'SEC_002'),
        new SecurityError('Protocol', 'SEC_003'),
        new SecurityError('Access', 'SEC_004'),
      ];
      expect(errors.map(e => e.code)).toEqual(['SEC_001', 'SEC_002', 'SEC_003', 'SEC_004']);
    });

    /**
     * Test: SecurityError has correct name
     */
    it('has correct error name', () => {
      const error = new SecurityError('Security issue');
      expect(error.name).toBe('SecurityError');
    });
  });

  /**
   * DataError Tests
   */
  describe('DataError', () => {
    /**
     * Test: DataError has correct category and type
     */
    it('has data category', () => {
      const error = new DataError('Fetch failed', 'DATA_001');
      expect(error.category).toBe('data');
      expect(error.code).toBe('DATA_001');
      expect(error instanceof DataError).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    /**
     * Test: DataError uses default code
     */
    it('uses default code DATA_001 when not specified', () => {
      const error = new DataError('Data error');
      expect(error.code).toBe('DATA_001');
    });

    /**
     * Test: DataError wraps original fetch error
     */
    it('can wrap original fetch error', () => {
      const original = new Error('Network timeout');
      const error = new DataError('Failed to load projects', 'DATA_001', original);
      expect(error.originalError?.message).toBe('Network timeout');
    });

    /**
     * Test: DataError supports error codes
     */
    it('supports different data error codes', () => {
      const errors = [
        new DataError('Fetch failed', 'DATA_001'),
        new DataError('Parse failed', 'DATA_002'),
        new DataError('Database error', 'DATA_003'),
        new DataError('File not found', 'DATA_004'),
      ];
      expect(errors.map(e => e.code)).toEqual(['DATA_001', 'DATA_002', 'DATA_003', 'DATA_004']);
    });

    /**
     * Test: DataError has correct name
     */
    it('has correct error name', () => {
      const error = new DataError('Data issue');
      expect(error.name).toBe('DataError');
    });
  });

  /**
   * NetworkError Tests
   */
  describe('NetworkError', () => {
    /**
     * Test: NetworkError has correct category and type
     */
    it('has network category', () => {
      const error = new NetworkError('Connection failed', 'NET_001');
      expect(error.category).toBe('network');
      expect(error.code).toBe('NET_001');
      expect(error instanceof NetworkError).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    /**
     * Test: NetworkError uses default code
     */
    it('uses default code NET_001 when not specified', () => {
      const error = new NetworkError('Network error');
      expect(error.code).toBe('NET_001');
    });

    /**
     * Test: NetworkError can store HTTP status code
     */
    it('can store HTTP status code', () => {
      const error = new NetworkError('Server error', 'NET_003', undefined, 500);
      expect(error.statusCode).toBe(500);
    });

    /**
     * Test: NetworkError with different status codes
     */
    it('supports different HTTP status codes', () => {
      const error404 = new NetworkError('Not found', 'NET_004', undefined, 404);
      const error500 = new NetworkError('Server error', 'NET_003', undefined, 500);
      expect(error404.statusCode).toBe(404);
      expect(error500.statusCode).toBe(500);
    });

    /**
     * Test: NetworkError wraps original fetch error
     */
    it('can wrap original network error', () => {
      const original = new Error('FETCH_FAILED');
      const error = new NetworkError('Request timeout', 'NET_001', original);
      expect(error.originalError?.message).toBe('FETCH_FAILED');
    });

    /**
     * Test: NetworkError has correct name
     */
    it('has correct error name', () => {
      const error = new NetworkError('Network issue');
      expect(error.name).toBe('NetworkError');
    });
  });

  /**
   * Error Hierarchy and Inheritance Tests
   */
  describe('Error Hierarchy', () => {
    /**
     * Test: All custom errors extend AppError
     */
    it('all custom errors extend AppError', () => {
      const errors = [
        new ValidationError('test'),
        new SecurityError('test'),
        new DataError('test'),
        new NetworkError('test'),
      ];
      errors.forEach(error => {
        expect(error instanceof AppError).toBe(true);
        expect(error instanceof Error).toBe(true);
      });
    });

    /**
     * Test: Different error types can be distinguished
     */
    it('different error types can be distinguished with instanceof', () => {
      const valError = new ValidationError('Invalid');
      const secError = new SecurityError('Security');
      const dataError = new DataError('Data');
      const netError = new NetworkError('Network');

      expect(valError instanceof ValidationError).toBe(true);
      expect(valError instanceof SecurityError).toBe(false);

      expect(secError instanceof SecurityError).toBe(true);
      expect(secError instanceof ValidationError).toBe(false);

      expect(dataError instanceof DataError).toBe(true);
      expect(dataError instanceof NetworkError).toBe(false);

      expect(netError instanceof NetworkError).toBe(true);
      expect(netError instanceof DataError).toBe(false);
    });

    /**
     * Test: Error categories match error types
     */
    it('error categories match error types', () => {
      expect(new ValidationError('test').category).toBe('validation');
      expect(new SecurityError('test').category).toBe('security');
      expect(new DataError('test').category).toBe('data');
      expect(new NetworkError('test').category).toBe('network');
    });
  });

  /**
   * getUserFriendlyMessage Helper Function Tests
   */
  describe('getUserFriendlyMessage', () => {
    /**
     * Test: Returns validation message for ValidationError
     */
    it('returns validation message for ValidationError', () => {
      const error = new ValidationError('Invalid input');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('Please check your input and try again');
    });

    /**
     * Test: Returns security message for SecurityError
     */
    it('returns security message for SecurityError', () => {
      const error = new SecurityError('XSS attempt');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('A security issue was detected');
    });

    /**
     * Test: Returns data message for DataError
     */
    it('returns data message for DataError', () => {
      const error = new DataError('Fetch failed');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('Failed to load data. Please try again.');
    });

    /**
     * Test: Returns network message for NetworkError
     */
    it('returns network message for NetworkError', () => {
      const error = new NetworkError('Connection failed');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('Network connection failed. Please check your internet.');
    });

    /**
     * Test: Returns generic message for AppError
     */
    it('returns generic message for AppError', () => {
      const error = new AppError('Unknown error');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('An unexpected error occurred');
    });

    /**
     * Test: Returns generic message for unknown error types
     */
    it('returns generic message for unknown error types', () => {
      const error = new Error('Regular error');
      const message = getUserFriendlyMessage(error);
      expect(message).toBe('An unexpected error occurred');
    });

    /**
     * Test: Handles null/undefined gracefully
     */
    it('handles null and undefined gracefully', () => {
      expect(getUserFriendlyMessage(null)).toBe('An unexpected error occurred');
      expect(getUserFriendlyMessage(undefined)).toBe('An unexpected error occurred');
      expect(getUserFriendlyMessage('string')).toBe('An unexpected error occurred');
    });
  });

  /**
   * isAppError Type Guard Tests
   */
  describe('isAppError', () => {
    /**
     * Test: Returns true for AppError instances
     */
    it('returns true for AppError instances', () => {
      const error = new AppError('test');
      expect(isAppError(error)).toBe(true);
    });

    /**
     * Test: Returns true for subclass instances
     */
    it('returns true for subclass instances', () => {
      expect(isAppError(new ValidationError('test'))).toBe(true);
      expect(isAppError(new SecurityError('test'))).toBe(true);
      expect(isAppError(new DataError('test'))).toBe(true);
      expect(isAppError(new NetworkError('test'))).toBe(true);
    });

    /**
     * Test: Returns false for regular Error instances
     */
    it('returns false for regular Error instances', () => {
      const error = new Error('test');
      expect(isAppError(error)).toBe(false);
    });

    /**
     * Test: Returns false for non-Error values
     */
    it('returns false for non-Error values', () => {
      expect(isAppError('error')).toBe(false);
      expect(isAppError(null)).toBe(false);
      expect(isAppError(undefined)).toBe(false);
      expect(isAppError(42)).toBe(false);
      expect(isAppError({})).toBe(false);
    });

    /**
     * Test: Can be used in type guards
     */
    it('can be used as type guard in conditional', () => {
      const error: unknown = new ValidationError('test');
      if (isAppError(error)) {
        expect(error.category).toBe('validation');
        expect(error.code).toBe('VAL_001');
      }
    });
  });

  /**
   * Error Stack Trace Tests
   */
  describe('Error Stack Traces', () => {
    /**
     * Test: Custom errors maintain stack trace information
     */
    it('maintains stack trace information', () => {
      const error = new ValidationError('Invalid input', 'VAL_001');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ValidationError');
    });

    /**
     * Test: Stack trace includes error message
     */
    it('stack trace includes error message', () => {
      const error = new SecurityError('XSS detected', 'SEC_001');
      expect(error.toString()).toContain('SecurityError');
      expect(error.toString()).toContain('XSS detected');
    });
  });

  /**
   * Real-world Usage Pattern Tests
   */
  describe('Real-world Usage Patterns', () => {
    /**
     * Test: Video ID validation error handling
     */
    it('handles video ID validation errors', () => {
      /**
       * Validates that video ID is in correct format (8-11 digits).
       *
       * @param id - The video ID to validate
       */
      const validateVideoId = (id: string): void => {
        if (!/^\d{8,11}$/.test(id)) {
          throw new ValidationError(
            'Video ID must be 8-11 digits',
            'VAL_002'
          );
        }
      };

      expect(() => validateVideoId('123')).toThrow(ValidationError);
      expect(() => validateVideoId('12345678')).not.toThrow();
    });

    /**
     * Test: Security validation error handling
     */
    it('handles security validation errors', () => {
      /**
       * Validates that URL does not contain insecure protocols.
       *
       * @param url - The URL to validate
       */
      const validateUrl = (url: string): void => {
        if (url.includes('javascript:')) {
          throw new SecurityError(
            'Insecure protocol detected',
            'SEC_003'
          );
        }
      };

      expect(() => validateUrl('javascript:alert(1)')).toThrow(SecurityError);
      expect(() => validateUrl('https://example.com')).not.toThrow();
    });

    /**
     * Test: Data loading error handling
     */
    it('handles data loading errors', async () => {
      /**
       * Simulates loading projects from an API that throws an error.
       */
      const loadProjects = async (): Promise<void> => {
        try {
          throw new Error('API timeout');
        } catch (error) {
          throw new DataError(
            'Failed to load projects',
            'DATA_001',
            error as Error
          );
        }
      };

      await expect(loadProjects()).rejects.toThrow(DataError);
    });

    /**
     * Test: Catch block with error categorization
     */
    it('handles errors by category in catch block', () => {
      /**
       * Categorizes errors and returns appropriate error type string.
       *
       * @param error - The error to categorize
       * @returns The error category as a string
       */
      const handleError = (error: unknown): string => {
        if (error instanceof ValidationError) {
          return 'validation_failed';
        }
        if (error instanceof SecurityError) {
          return 'security_violation';
        }
        if (error instanceof DataError) {
          return 'data_error';
        }
        if (error instanceof NetworkError) {
          return 'network_error';
        }
        return 'unknown_error';
      };

      expect(handleError(new ValidationError('test'))).toBe('validation_failed');
      expect(handleError(new SecurityError('test'))).toBe('security_violation');
      expect(handleError(new DataError('test'))).toBe('data_error');
      expect(handleError(new NetworkError('test'))).toBe('network_error');
      expect(handleError(new Error('test'))).toBe('unknown_error');
    });
  });
});
