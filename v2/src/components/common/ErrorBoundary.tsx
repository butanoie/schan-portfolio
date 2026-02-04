'use client';

import React, { ReactNode, ReactElement } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useI18n } from '@/src/hooks/useI18n';

/**
 * Error boundary for graceful error handling in React components.
 *
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a user-friendly fallback UI. Includes error logging and a retry button to
 * recover from transient errors.
 *
 * **Note:** This is implemented as a functional component wrapper around
 * React's class-based error boundary API using the experimental useErrorHandler
 * pattern. For full error boundary coverage, consider using the class component
 * version or a library like react-error-boundary.
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
 * Class-based Error Boundary implementation.
 *
 * React Error Boundaries require class components with getDerivedStateFromError()
 * and componentDidCatch() lifecycle methods. This class handles error catching
 * and state management.
 *
 * @internal Used internally by the ErrorBoundary wrapper
 */
class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps & { errorTitle: string; errorMessage: string; retryButtonText: string },
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  /**
   * Creates a new ErrorBoundaryClass instance.
   *
   * @param props - Component props
   */
  constructor(
    props: ErrorBoundaryProps & {
      errorTitle: string;
      errorMessage: string;
      retryButtonText: string;
    }
  ) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state so the next render will show the fallback UI.
   *
   * @param error - The error that was thrown
   * @returns Updated state
   */
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  /**
   * Log error details for debugging and error reporting.
   *
   * @param error - The error that was thrown
   * @param errorInfo - Error information from React
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });

    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the error boundary state to recover from the error.
   */
  resetError = (): void => {
    const { error } = this.state;
    const { onErrorRecovery } = this.props;

    if (error && onErrorRecovery && !onErrorRecovery(error)) {
      return;
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
   * @returns Child components if no error, otherwise error UI
   */
  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, errorTitle, errorMessage, retryButtonText } = this.props;

    if (hasError) {
      return (
        fallback || (
          <DefaultErrorFallback
            error={error}
            onRetry={this.resetError}
            errorTitle={errorTitle}
            errorMessage={errorMessage}
            retryButtonText={retryButtonText}
          />
        )
      );
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
 * @param props.errorTitle - Localized error title
 * @param props.errorMessage - Localized error message
 * @param props.retryButtonText - Localized retry button text
 * @returns A JSX element displaying the error UI
 */
function DefaultErrorFallback({
  error,
  onRetry,
  errorTitle,
  errorMessage,
  retryButtonText,
}: {
  error: Error | null;
  onRetry: () => void;
  errorTitle: string;
  errorMessage: string;
  retryButtonText: string;
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
          {errorTitle}
        </Typography>

        {/* Error Message */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 3,
          }}
        >
          {errorMessage}
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
          aria-label={`${retryButtonText} and reload the page`}
        >
          {retryButtonText}
        </Button>
      </Box>
    </Container>
  );
}

/**
 * Functional wrapper component that uses i18n to provide localized strings
 * to the class-based ErrorBoundary.
 *
 * This wrapper allows the error boundary to access i18n hooks while maintaining
 * the class component's error catching capabilities.
 *
 * @param props - ErrorBoundary props
 * @returns An ErrorBoundary with localized error messages
 */
export default function ErrorBoundary(props: ErrorBoundaryProps): ReactElement {
  const { t } = useI18n();

  return (
    <ErrorBoundaryClass
      {...props}
      errorTitle={t('errors.somethingWentWrong')}
      errorMessage={t('errors.unexpectedError')}
      retryButtonText={t('buttons.tryAgain')}
    />
  );
}
