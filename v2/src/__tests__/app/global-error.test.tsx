/**
 * Tests for the root-level global error boundary.
 *
 * Verifies:
 * - Error message and recovery button are rendered
 * - Error is reported to Sentry via captureException
 * - Clicking "Try again" calls the reset function
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock @sentry/nextjs before importing the component
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

import * as Sentry from '@sentry/nextjs';
import GlobalError from '@/app/global-error';

describe('GlobalError', () => {
  const mockReset = vi.fn();
  const testError = new Error('Test explosion');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the error message and try-again button', () => {
    render(<GlobalError error={testError} reset={mockReset} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  it('should report the error to Sentry', () => {
    render(<GlobalError error={testError} reset={mockReset} />);

    expect(Sentry.captureException).toHaveBeenCalledOnce();
    expect(Sentry.captureException).toHaveBeenCalledWith(testError);
  });

  it('should call reset when the try-again button is clicked', async () => {
    const user = userEvent.setup();
    render(<GlobalError error={testError} reset={mockReset} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(mockReset).toHaveBeenCalledOnce();
  });
});
