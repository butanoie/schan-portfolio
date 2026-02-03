'use client';

import React, { ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Error boundary for graceful error handling in React components.
 *
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a user-friendly fallback UI. Includes error logging and a retry button to
 * recover from transient errors.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * @example With custom error handler:
 * ```tsx
 * <ErrorBoundary
 *   fallback={<CustomErrorUI />}
 *   onError={(error, errorInfo) => {
 *     console.error('Custom error handler:', error, errorInfo);
 *   }}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */

/**
 * Props for the ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /** Child components to wrap with error boundary */
  children: ReactNode;

  /** Optional custom fallback UI to display when an error occurs */
  fallback?: ReactNode;

  /** Optional callback fired when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;

  /** Optional callback to determine if error should be re-thrown */
  onErrorRecovery?: (error: Error) => boolean;
}

/**
 * Internal state for the ErrorBoundary component.
 *
 * Tracks error state and provides information about caught errors
 * for display and debugging purposes.
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;

  /** The error object that was caught */
  error: Error | null;

  /** Error information from React */
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary class component for catching and handling React errors.
 *
 * React Error Boundaries are class components that implement lifecycle methods
 * `getDerivedStateFromError()` and `componentDidCatch()`. Currently, there is
 * no Hook equivalent, so class components must be used.
 *
 * This error boundary catches errors in:
 * - Render methods
 * - Lifecycle methods
 * - Constructors of child components
 *
 * It does NOT catch errors in:
 * - Event handlers (use try/catch instead)
 * - Asynchronous code (setTimeout, promises)
 * - Server-side rendering
 * - Errors thrown in the error boundary itself
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Creates a new ErrorBoundary instance.
   *
   * @param props - Component props containing children and optional callbacks
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state so the next render will show the fallback UI.
   * Called after an error has been thrown by a descendant component.
   *
   * @param error - The error that was thrown
   * @returns Updated state
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * Log error details for debugging and error reporting.
   * Called after an error has been thrown by a descendant component.
   *
   * @param error - The error that was thrown
   * @param errorInfo - Object with `componentStack` property containing stack trace
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Store error info for display/debugging
    this.setState({ errorInfo });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Call optional error handler prop
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Could also send to error reporting service here
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  /**
   * Reset the error boundary state to recover from the error.
   * This attempts to render the child component again.
   */
  resetError = (): void => {
    const { error } = this.state;
    const { onErrorRecovery } = this.props;

    // Allow custom recovery logic
    if (error && onErrorRecovery && !onErrorRecovery(error)) {
      return; // Recovery handler can prevent reset
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Renders the component or error fallback UI.
   *
   * @returns Child components if no error, otherwise renders fallback error UI
   */
  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    // If error occurred, show fallback or default error UI
    if (hasError) {
      return fallback || <DefaultErrorFallback error={error} onRetry={this.resetError} />;
    }

    return children;
  }
}

/**
 * Default error UI displayed when no custom fallback is provided.
 *
 * Features:
 * - Clear error message with icon
 * - Developer-friendly error details (dev mode only)
 * - Retry button to recover from error
 * - Accessible focus management
 *
 * @param props - Component props
 * @param props.error - The error that was caught
 * @param props.onRetry - Callback to attempt recovery
 * @returns A JSX element displaying the error UI
 */
function DefaultErrorFallback({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}): ReactNode {
  return (
    <Container
      maxWidth="md"
      role="alert"
      aria-live="assertive"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        py: 4,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          p: 4,
          borderRadius: '8px',
          backgroundColor: 'action.hover',
          border: '2px solid',
          borderColor: 'error.light',
        }}
      >
        {/* Error Icon */}
        <ErrorOutlineIcon
          sx={{
            fontSize: 64,
            color: 'error.main',
            mb: 2,
          }}
          aria-hidden="true"
        />

        {/* Error Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: 'error.main',
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          Something went wrong
        </Typography>

        {/* Error Message */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 3,
          }}
        >
          We encountered an unexpected error. Please try again or contact support if the problem
          persists.
        </Typography>

        {/* Error Details (Development Mode Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: 'background.paper',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'left',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              sx={{
                color: 'error.main',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {error.message}
            </Typography>
          </Box>
        )}

        {/* Retry Button */}
        <Button
          variant="contained"
          color="error"
          onClick={onRetry}
          sx={{
            mt: 3,
            px: 3,
            py: 1.5,
            fontSize: '1rem',
          }}
          aria-label="Retry and reload the page"
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
}

export default ErrorBoundary;
