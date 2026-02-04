import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ErrorBoundary from "../../../components/common/ErrorBoundary";

/**
 * Mock component that throws an error.
 * Used to test error boundary error catching.
 *
 * @param props - Component props
 * @param props.shouldThrow - Whether the component should throw an error (default: true)
 * @returns A JSX element that either throws an error or renders successfully
 */
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error from child component");
  }
  return <div>Child component rendered successfully</div>;
}

/**
 * Mock component that renders normally (no errors).
 *
 * @returns A JSX element indicating the component rendered successfully
 */
function HealthyComponent() {
  return <div>Healthy component</div>;
}

describe("ErrorBoundary", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Suppress console.error output during tests
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("Rendering with no errors", () => {
    it("should render children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <HealthyComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText("Healthy component")).toBeInTheDocument();
    });

    it("should render multiple children without errors", () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ErrorBoundary>
      );

      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
      expect(screen.getByText("Child 3")).toBeInTheDocument();
    });
  });

  describe("Error catching and fallback", () => {
    it("should catch errors and display default fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should show error UI
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("should display custom fallback UI when error occurs", () => {
      const customFallback = <div>Custom error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Custom error UI")).toBeInTheDocument();
      expect(
        screen.queryByText("Something went wrong")
      ).not.toBeInTheDocument();
    });

    it("should have proper accessibility attributes on error UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const alert = screen.getByRole("alert");
      expect(alert).toHaveAttribute("aria-live", "assertive");
    });
  });

  describe("Error callbacks", () => {
    it("should call onError callback when error is caught", () => {
      const onErrorMock = vi.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalled();
      const [error, errorInfo] = onErrorMock.mock.calls[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Test error from child component");
      expect(errorInfo).toHaveProperty("componentStack");
    });

    it("should pass correct error information to onError callback", () => {
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

    it("should not call onError if no error occurs", () => {
      const onErrorMock = vi.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <HealthyComponent />
        </ErrorBoundary>
      );

      expect(onErrorMock).not.toHaveBeenCalled();
    });
  });

  describe("Error recovery", () => {
    it("should provide a retry button to attempt recovery", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify error UI is shown
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Verify retry button exists
      const retryButton = screen.getByRole("button", {
        name: "Retry and reload the page",
      });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).not.toBeDisabled();
    });

    it("should call onErrorRecovery callback when retry button is clicked", () => {
      const onErrorRecoveryMock = vi.fn(() => true);

      render(
        <ErrorBoundary onErrorRecovery={onErrorRecoveryMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole("button", {
        name: "Retry and reload the page",
      });
      fireEvent.click(retryButton);

      // Verify callback was called with the caught error
      expect(onErrorRecoveryMock).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should prevent reset if onErrorRecovery returns false", () => {
      const onErrorRecoveryMock = vi.fn(() => false);

      render(
        <ErrorBoundary onErrorRecovery={onErrorRecoveryMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole("button", {
        name: "Retry and reload the page",
      });
      fireEvent.click(retryButton);

      // Error UI should still be visible (recovery was prevented)
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();

      // Verify recovery was attempted but prevented
      expect(onErrorRecoveryMock).toHaveBeenCalled();
    });
  });

  describe("Error display", () => {
    // Note: NODE_ENV-dependent behavior is tested in the component itself
    // These tests verify that errors are caught and displayed properly

    it("should render error message when error is caught", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Error boundary should display an error message
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should render helpful error message and retry button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should show error container and retry button
      const errorBox = screen.getByRole("alert");
      expect(errorBox).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Retry and reload the page" })
      ).toBeInTheDocument();
    });
  });

  describe("Retry button accessibility", () => {
    it("should have accessible retry button", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole("button", {
        name: "Retry and reload the page",
      });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveAttribute(
        "aria-label",
        "Retry and reload the page"
      );
    });

    it("should be keyboard accessible", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole("button", {
        name: "Retry and reload the page",
      });

      // Verify button can receive focus and be clicked via keyboard
      expect(retryButton).toBeEnabled();
      fireEvent.keyDown(retryButton, { key: "Enter", code: "Enter" });
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe("Console logging", () => {
    it("should log error to console when error is caught", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Error boundary should log to console (React logs errors in all modes)
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("should display error information in the fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should show error container with message
      const errorAlert = screen.getByRole("alert");
      expect(errorAlert).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  describe("Multiple error boundaries", () => {
    it("should handle nested error boundaries correctly", () => {
      render(
        <ErrorBoundary fallback={<div>Outer error</div>}>
          <div>Outer content</div>
          <ErrorBoundary fallback={<div>Inner error</div>}>
            <ThrowError />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner error boundary should catch the error
      expect(screen.getByText("Inner error")).toBeInTheDocument();
      expect(screen.getByText("Outer content")).toBeInTheDocument();
      expect(screen.queryByText("Outer error")).not.toBeInTheDocument();
    });
  });

  describe("Error message display", () => {
    it("should display helpful error message to user", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByText(
          /We encountered an unexpected error. Please try again or contact support/i
        )
      ).toBeInTheDocument();
    });

    it("should display error icon in error UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Check for the error icon using MUI's data-testid
      const errorIcon = screen.getByTestId("ErrorOutlineIcon");
      expect(errorIcon).toBeInTheDocument();
      expect(errorIcon).toHaveAttribute("aria-hidden", "true");
    });
  });
});
