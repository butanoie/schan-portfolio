/**
 * Custom error hierarchy for the portfolio application.
 *
 * This module provides type-safe error handling with categorized error types.
 * Each error category has a specific purpose and can be caught and handled appropriately.
 *
 * **Error Categories:**
 * - ValidationError: User input or data format validation failures
 * - SecurityError: Security-related violations (XSS, injection, etc.)
 * - DataError: Data fetching or processing failures
 * - NetworkError: Network request failures
 * - AppError: Generic application errors (base class)
 *
 * **Benefits:**
 * - Type-safe error handling with instanceof checks
 * - Unique error codes for easier debugging
 * - Categorized errors for appropriate UI responses
 * - Comprehensive error context and messages
 *
 * @module utils/errors
 */

/**
 * Error category type for classifying errors.
 * Used to determine how errors should be handled and displayed to users.
 */
export type ErrorCategory =
  | 'validation'
  | 'security'
  | 'data'
  | 'network'
  | 'generic';

/**
 * Base application error class with category and code support.
 *
 * This is the parent class for all custom error types in the application.
 * It extends the native Error class and adds category and code properties
 * for better error classification and handling.
 *
 * **Properties:**
 * - category: Error classification for routing to appropriate handlers
 * - code: Unique error code for identifying specific error conditions
 * - message: Human-readable error message
 * - originalError: Original error if this wraps another error
 *
 * **Usage:**
 * ```typescript
 * try {
 *   // Some operation
 * } catch (error) {
 *   if (error instanceof AppError) {
 *     console.log(`Error ${error.code}: ${error.message}`);
 *     handleError(error.category);
 *   }
 * }
 * ```
 *
 * @class AppError
 * @extends Error
 */
export class AppError extends Error {
  /**
   * Error category for classification and routing.
   * Determines how the error should be handled and displayed.
   */
  category: ErrorCategory;

  /**
   * Unique error code for this error condition.
   * Helps identify specific errors in logging and debugging.
   * Format: CATEGORY_DESCRIPTION (e.g., VAL_001, SEC_001)
   */
  code: string;

  /**
   * Original error if this AppError wraps another error.
   * Useful for preserving the original error stack trace.
   */
  originalError?: Error;

  /**
   * Creates a new AppError instance.
   *
   * @param message - Human-readable error message
   * @param category - Error category for classification
   * @param code - Unique error code identifier
   * @param originalError - Optional original error being wrapped
   *
   * @example
   * const error = new AppError(
   *   'Invalid configuration provided',
   *   'generic',
   *   'APP_001'
   * );
   */
  constructor(
    message: string,
    category: ErrorCategory = 'generic',
    code: string = 'APP_000',
    originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
    this.category = category;
    this.code = code;
    this.originalError = originalError;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error class for input and data format violations.
 *
 * Use this error when:
 * - User input doesn't meet validation requirements
 * - Data format is invalid (e.g., wrong type, length, pattern)
 * - Type guard validation fails
 *
 * **Error Codes:**
 * - VAL_001: String length out of bounds
 * - VAL_002: Invalid URL format
 * - VAL_003: Invalid number range
 * - VAL_004: Invalid type
 * - VAL_005: Required field missing
 *
 * **Usage:**
 * ```typescript
 * if (!isValidString(value, 1, 100)) {
 *   throw new ValidationError(
 *     'Project name must be 1-100 characters',
 *     'VAL_001'
 *   );
 * }
 * ```
 *
 * @class ValidationError
 * @extends AppError
 */
export class ValidationError extends AppError {
  /**
   * Creates a new ValidationError instance.
   *
   * @param message - Description of validation failure
   * @param code - Unique error code (e.g., VAL_001)
   * @param originalError - Optional original error being wrapped
   *
   * @example
   * throw new ValidationError(
   *   'Video ID must be 8-11 digits for Vimeo',
   *   'VAL_002'
   * );
   */
  constructor(message: string, code: string = 'VAL_001', originalError?: Error) {
    super(message, 'validation', code, originalError);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Security error class for security-related violations.
 *
 * Use this error when:
 * - XSS/injection attempts detected
 * - Unauthorized access attempted
 * - Insecure data detected
 * - Protocol violations found
 *
 * **Error Codes:**
 * - SEC_001: XSS attempt detected
 * - SEC_002: Injection attempt detected
 * - SEC_003: Insecure URL protocol
 * - SEC_004: Unauthorized access
 * - SEC_005: CORS violation
 *
 * **Usage:**
 * ```typescript
 * if (!isValidUrlProtocol(url)) {
 *   throw new SecurityError(
 *     'Insecure URL protocol detected',
 *     'SEC_003'
 *   );
 * }
 * ```
 *
 * @class SecurityError
 * @extends AppError
 */
export class SecurityError extends AppError {
  /**
   * Creates a new SecurityError instance.
   *
   * @param message - Description of security violation
   * @param code - Unique error code (e.g., SEC_001)
   * @param originalError - Optional original error being wrapped
   *
   * @example
   * throw new SecurityError(
   *   'Script tag injection attempt blocked',
   *   'SEC_001'
   * );
   */
  constructor(message: string, code: string = 'SEC_001', originalError?: Error) {
    super(message, 'security', code, originalError);
    this.name = 'SecurityError';
    Object.setPrototypeOf(this, SecurityError.prototype);
  }
}

/**
 * Data error class for data fetching and processing failures.
 *
 * Use this error when:
 * - Data fetch fails
 * - Data processing fails
 * - Database operations fail
 * - File operations fail
 *
 * **Error Codes:**
 * - DATA_001: Fetch failure
 * - DATA_002: Parse failure
 * - DATA_003: Database error
 * - DATA_004: File not found
 * - DATA_005: Invalid data structure
 *
 * **Usage:**
 * ```typescript
 * try {
 *   const projects = await fetchProjects();
 * } catch (error) {
 *   throw new DataError(
 *     'Failed to load projects from API',
 *     'DATA_001',
 *     error as Error
 *   );
 * }
 * ```
 *
 * @class DataError
 * @extends AppError
 */
export class DataError extends AppError {
  /**
   * Creates a new DataError instance.
   *
   * @param message - Description of data failure
   * @param code - Unique error code (e.g., DATA_001)
   * @param originalError - Optional original error being wrapped
   *
   * @example
   * throw new DataError(
   *   'Failed to parse project JSON',
   *   'DATA_002',
   *   parseError
   * );
   */
  constructor(message: string, code: string = 'DATA_001', originalError?: Error) {
    super(message, 'data', code, originalError);
    this.name = 'DataError';
    Object.setPrototypeOf(this, DataError.prototype);
  }
}

/**
 * Network error class for network request failures.
 *
 * Use this error when:
 * - HTTP requests fail
 * - Connection timeout occurs
 * - Network unreachable
 * - Server error responses
 *
 * **Error Codes:**
 * - NET_001: Request timeout
 * - NET_002: Network unreachable
 * - NET_003: Server error (5xx)
 * - NET_004: Client error (4xx)
 * - NET_005: Connection failed
 *
 * **Usage:**
 * ```typescript
 * try {
 *   const response = await fetch(url);
 * } catch (error) {
 *   throw new NetworkError(
 *     'Failed to connect to API server',
 *     'NET_005',
 *     error as Error
 *   );
 * }
 * ```
 *
 * @class NetworkError
 * @extends AppError
 */
export class NetworkError extends AppError {
  /**
   * Creates a new NetworkError instance.
   *
   * @param message - Description of network failure
   * @param code - Unique error code (e.g., NET_001)
   * @param originalError - Optional original error being wrapped
   * @param statusCode - Optional HTTP status code
   *
   * @example
   * throw new NetworkError(
   *   'Server returned 500 Internal Server Error',
   *   'NET_003',
   *   serverError,
   *   500
   * );
   */
  statusCode?: number;

  /**
   *
   * @param message
   * @param code
   * @param originalError
   * @param statusCode
   */
  constructor(
    message: string,
    code: string = 'NET_001',
    originalError?: Error,
    statusCode?: number
  ) {
    super(message, 'network', code, originalError);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Helper function to get user-friendly error message based on error category.
 *
 * Converts technical error messages into appropriate user-facing text.
 *
 * **Mapping:**
 * - validation: "Please check your input and try again"
 * - security: "A security issue was detected"
 * - data: "Failed to load data. Please try again."
 * - network: "Network connection failed. Please check your internet."
 * - generic: "An unexpected error occurred"
 *
 * @param error - The error to get message for
 * @returns User-friendly error message
 *
 * @example
 * ```typescript
 * catch (error) {
 *   const userMessage = getUserFriendlyMessage(error);
 *   showToast(userMessage);
 * }
 * ```
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return 'Please check your input and try again';
  }
  if (error instanceof SecurityError) {
    return 'A security issue was detected';
  }
  if (error instanceof DataError) {
    return 'Failed to load data. Please try again.';
  }
  if (error instanceof NetworkError) {
    return 'Network connection failed. Please check your internet.';
  }
  if (error instanceof AppError) {
    return 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
}

/**
 * Helper function to check if error is an instance of AppError.
 *
 * Useful for type guards and error handling in catch blocks.
 *
 * @param error - The value to check
 * @returns True if error is an AppError instance
 *
 * @example
 * ```typescript
 * catch (error) {
 *   if (isAppError(error)) {
 *     console.log(`Error ${error.code}: ${error.message}`);
 *   }
 * }
 * ```
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
