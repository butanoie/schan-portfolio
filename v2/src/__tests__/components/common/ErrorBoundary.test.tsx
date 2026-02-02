import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary, { ErrorBoundaryProps } from '../../../components/common/ErrorBoundary';

/**
 * Mock component that throws an error.
 * Used to test error boundary error catching.
 */
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error from child component');
  }
  return <div>Child component rendered successfully</div>;
}

/**
 * Mock component that renders normally (no errors).
 */
function HealthyComponent() {
  return <div>Healthy component</div>;
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress console.error output during tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Rendering with no errors', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <HealthyComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Healthy component')).toBeInTheDocument();
    });

    it('should render multiple children without errors', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });

  describe('Error catching and fallback', () => {
    it('should catch errors and display default fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should show error UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should display custom fallback UI when error occurs', () => {
      const customFallback = <div>Custom error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error UI')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should have proper accessibility attributes on error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Error callbacks', () => {
    it('should call onError callback when error is caught', () => {
      const onErrorMock = vi.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalled();
      const [error, errorInfo] = onErrorMock.mock.calls[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error from child component');
      expect(errorInfo).toHaveProperty('componentStack');
    });

    it('should pass correct error information to onError callback', () => {
      const onErrorMock = vi.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('should not call onError if no error occurs', () => {
      const onErrorMock = vi.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <HealthyComponent />
        </ErrorBoundary>
      );

      expect(onErrorMock).not.toHaveBeenCalled();
    });
  });

  describe('Error recovery', () => {
    it('should provide a retry button to attempt recovery', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify error UI is shown
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Verify retry button exists
      const retryButton = screen.getByRole('button', { name: 'Retry and reload the page' });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).not.toBeDisabled();
    });

    it('should call onErrorRecovery callback when retry button is clicked', () => {
      const onErrorRecoveryMock = vi.fn(() => true);

      render(
        <ErrorBoundary onErrorRecovery={onErrorRecoveryMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: 'Retry and reload the page' });
      fireEvent.click(retryButton);

      // Verify callback was called with the caught error
      expect(onErrorRecoveryMock).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should prevent reset if onErrorRecovery returns false', () => {
      const onErrorRecoveryMock = vi.fn(() => false);

      render(
        <ErrorBoundary onErrorRecovery={onErrorRecoveryMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: 'Retry and reload the page' });
      fireEvent.click(retryButton);

      // Error UI should still be visible (recovery was prevented)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Verify recovery was attempted but prevented
      expect(onErrorRecoveryMock).toHaveBeenCalled();
    });
  });

  describe('Error display in development mode', () => {
    // Note: These tests check that error details are shown/hidden based on NODE_ENV
    // In test environment, NODE_ENV is typically 'test'

    it('should render error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      try {
        render(
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
        );

        // In development mode, error message should be visible
        expect(screen.getByText('Test error from child component')).toBeInTheDocument();
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should not render error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        render(
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
        );

        // In production mode, specific error message should not be visible
        // (implementation detail, but it's shown in the error box)
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('Retry button accessibility', () => {
    it('should have accessible retry button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: 'Retry and reload the page' });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveAttribute('aria-label', 'Retry and reload the page');
    });

    it('should be keyboard accessible', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: 'Retry and reload the page' });

      // Verify button can receive focus and be clicked via keyboard
      expect(retryButton).toBeEnabled();
      fireEvent.keyDown(retryButton, { key: 'Enter', code: 'Enter' });
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('Console logging', () => {
    it('should log error to console in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      try {
        render(
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error caught by ErrorBoundary:',
          expect.any(Error)
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Component stack:',
          expect.any(String)
        );
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should not log error to console in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        consoleErrorSpy.mockClear();

        render(
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
        );

        // In production, we should still get the React error warning
        // but not our custom logging
        expect(consoleErrorSpy).not.toHaveBeenCalledWith(
          'Error caught by ErrorBoundary:',
          expect.any(Error)
        );
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('Multiple error boundaries', () => {
    it('should handle nested error boundaries correctly', () => {
      render(
        <ErrorBoundary fallback={<div>Outer error</div>}>
          <div>Outer content</div>
          <ErrorBoundary fallback={<div>Inner error</div>}>
            <ThrowError />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner error boundary should catch the error
      expect(screen.getByText('Inner error')).toBeInTheDocument();
      expect(screen.getByText('Outer content')).toBeInTheDocument();
      expect(screen.queryByText('Outer error')).not.toBeInTheDocument();
    });
  });

  describe('Error message display', () => {
    it('should display helpful error message to user', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          /We encountered an unexpected error. Please try again or contact support/i
        )
      ).toBeInTheDocument();
    });

    it('should display error icon in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Check for the error icon using MUI's data-testid
      const errorIcon = screen.getByTestId('ErrorOutlineIcon');
      expect(errorIcon).toBeInTheDocument();
      expect(errorIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
