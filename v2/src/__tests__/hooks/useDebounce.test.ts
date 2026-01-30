import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebounce } from '@/src/hooks/useDebounce';

describe('useDebounce', () => {
  it('returns the initial value immediately on first render', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));

    expect(result.current).toBe('initial');
  });

  it('debounces value changes with the specified delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    // Initial value should be returned immediately
    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 300 });

    // Value should not update immediately
    expect(result.current).toBe('initial');

    // Wait for debounce delay to pass
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 500 }
    );
  });

  it('cancels previous timer when value changes before delay expires', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'first' },
      }
    );

    expect(result.current).toBe('first');

    // Update value multiple times rapidly
    rerender({ value: 'second' });
    rerender({ value: 'third' });
    rerender({ value: 'fourth' });

    // Value should still be the initial value
    expect(result.current).toBe('first');

    // Wait for debounce delay
    await waitFor(
      () => {
        // Should only update to the final value, not intermediate values
        expect(result.current).toBe('fourth');
      },
      { timeout: 500 }
    );
  });

  it('uses default delay of 300ms when no delay is specified', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });

    // Should not update before 300ms
    expect(result.current).toBe('initial');

    // Should update after 300ms
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 500 }
    );
  });

  it('handles different delay values correctly', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 100 },
      }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 100 });

    // Should not update immediately
    expect(result.current).toBe('initial');

    // Should update after 100ms (shorter delay)
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 }
    );
  });

  it('handles changing the delay value', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Update value with a different delay
    rerender({ value: 'updated', delay: 100 });

    // Should use the new delay value (100ms)
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 }
    );
  });

  it('cleans up pending timers on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'initial' },
      }
    );

    // Update value to create a pending timer
    rerender({ value: 'updated' });

    // Unmount before timer expires
    unmount();

    // clearTimeout should have been called during cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('works with different data types', async () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: 0 },
      }
    );

    numberRerender({ value: 42 });

    await waitFor(() => {
      expect(numberResult.current).toBe(42);
    });

    // Test with objects
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: { count: 0 } },
      }
    );

    const newObj = { count: 1 };
    objectRerender({ value: newObj });

    await waitFor(() => {
      expect(objectResult.current).toBe(newObj);
    });

    // Test with arrays
    const { result: arrayResult, rerender: arrayRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: [] as number[] },
      }
    );

    const newArray = [1, 2, 3];
    arrayRerender({ value: newArray });

    await waitFor(() => {
      expect(arrayResult.current).toBe(newArray);
    });
  });

  it('handles null and undefined values', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: null as string | null },
      }
    );

    expect(result.current).toBeNull();

    rerender({ value: 'not null' });

    await waitFor(() => {
      expect(result.current).toBe('not null');
    });

    rerender({ value: null });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });
});
