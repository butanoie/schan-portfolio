'use client';

import React, { ReactNode, ReactElement } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Props for LocaleProviderErrorFallback component.
 */
interface LocaleProviderErrorFallbackProps {
  /** Child components to wrap with error boundary */
  children: ReactNode;
}

/**
 * Class-based Error Boundary for LocaleProvider initialization.
 *
 * This error boundary is specifically designed to catch errors during
 * LocaleProvider initialization without depending on i18n hooks.
 * It provides a fallback UI with hardcoded English messages.
 *
 * @internal Used internally to wrap LocaleProvider
 */
class LocaleProviderErrorBoundaryClass extends React.Component<
  LocaleProviderErrorFallbackProps,
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  /**
   * Creates a new LocaleProviderErrorBoundaryClass instance.
   *
   * @param props - Component props
   */
  constructor(props: LocaleProviderErrorFallbackProps) {
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
      console.error('LocaleProvider Error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  /**
   * Reset the error boundary state to recover from the error.
   */
  resetError = (): void => {
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
    const { children } = this.props;

    if (hasError) {
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
              Localization Error
            </Typography>

            {/* Error Message */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 3,
              }}
            >
              Failed to load localization settings. Some features may not work correctly.
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
              onClick={this.resetError}
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

    return children;
  }
}

/**
 * Error boundary for LocaleProvider initialization.
 *
 * Catches and handles errors during locale initialization without depending
 * on i18n hooks. Provides a fallback UI with hardcoded English messages.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap
 * @returns An error boundary with error handling
 */
export default function LocaleProviderErrorFallback(
  props: LocaleProviderErrorFallbackProps
): ReactElement {
  return <LocaleProviderErrorBoundaryClass {...props} />;
}
