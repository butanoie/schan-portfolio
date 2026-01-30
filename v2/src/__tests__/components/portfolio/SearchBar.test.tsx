import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchBar } from '@/src/components/portfolio/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders search input with default placeholder', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      expect(screen.getByRole('searchbox', { name: /search projects/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search projects...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      const onChange = vi.fn();

      render(
        <SearchBar
          value=""
          onChange={onChange}
          placeholder="Find a project..."
        />
      );

      expect(screen.getByPlaceholderText('Find a project...')).toBeInTheDocument();
    });

    it('displays current value in input', () => {
      const onChange = vi.fn();

      render(<SearchBar value="React" onChange={onChange} />);

      expect(screen.getByRole('searchbox')).toHaveValue('React');
    });

    it('renders search icon', () => {
      const onChange = vi.fn();

      const { container } = render(<SearchBar value="" onChange={onChange} />);

      // MUI SearchIcon renders as an SVG
      const searchIcon = container.querySelector('svg[data-testid="SearchIcon"]');
      expect(searchIcon).toBeInTheDocument();
    });

    it('does not show clear button when input is empty', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });

    it('shows clear button when input has text', () => {
      const onChange = vi.fn();

      render(<SearchBar value="React" onChange={onChange} />);

      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });
  });

  describe('Results Count', () => {
    it('does not show results count when not provided', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      expect(screen.queryByText(/showing/i)).not.toBeInTheDocument();
    });

    it('shows results count when provided', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} resultsCount={12} />);

      expect(screen.getByText('Showing 12 projects')).toBeInTheDocument();
    });

    it('shows singular form for 1 project', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} resultsCount={1} />);

      expect(screen.getByText('Showing 1 project')).toBeInTheDocument();
    });

    it('shows "No projects found" for 0 results', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} resultsCount={0} />);

      expect(screen.getByText('No projects found')).toBeInTheDocument();
    });

    it('results count has aria-live for screen reader announcements', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} resultsCount={5} />);

      const resultsText = screen.getByText('Showing 5 projects');
      expect(resultsText).toHaveAttribute('aria-live', 'polite');
      expect(resultsText).toHaveAttribute('aria-atomic', 'true');
    });

    it('updates results count when it changes', () => {
      const onChange = vi.fn();

      const { rerender } = render(
        <SearchBar value="" onChange={onChange} resultsCount={10} />
      );

      expect(screen.getByText('Showing 10 projects')).toBeInTheDocument();

      rerender(<SearchBar value="" onChange={onChange} resultsCount={3} />);

      expect(screen.getByText('Showing 3 projects')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('updates input value immediately when typing', async () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');

      // Use fireEvent for immediate changes (no async delays)
      fireEvent.change(input, { target: { value: 'React' } });

      // Input should update immediately (no debounce lag)
      expect(input).toHaveValue('React');
    });

    it('calls onChange after debounce delay (300ms)', async () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'React' } });

      // onChange should not be called immediately
      expect(onChange).not.toHaveBeenCalled();

      // Fast-forward time by 300ms
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Now onChange should be called with debounced value
      expect(onChange).toHaveBeenCalledWith('React');
    });

    it('debounces multiple rapid keystrokes', async () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');

      // Type "R"
      fireEvent.change(input, { target: { value: 'R' } });
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Type "Re"
      fireEvent.change(input, { target: { value: 'Re' } });
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Type "Rea"
      fireEvent.change(input, { target: { value: 'Rea' } });
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Type "Reac"
      fireEvent.change(input, { target: { value: 'Reac' } });
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Type "React"
      fireEvent.change(input, { target: { value: 'React' } });

      // onChange should not have been called yet (timer resets with each keystroke)
      expect(onChange).not.toHaveBeenCalled();

      // Fast-forward final 300ms
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Now onChange should be called once with final value
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('React');
    });

    it('clears input when clear button is clicked', async () => {
      const onChange = vi.fn();

      render(<SearchBar value="React" onChange={onChange} />);

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);

      // Input should be cleared immediately
      const input = screen.getByRole('searchbox');
      expect(input).toHaveValue('');

      // onChange should be called immediately (no debounce on clear)
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('syncs internal state with external value prop', () => {
      const onChange = vi.fn();

      const { rerender } = render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveValue('');

      // External value changes (e.g., from parent state)
      rerender(<SearchBar value="TypeScript" onChange={onChange} />);

      expect(input).toHaveValue('TypeScript');
    });
  });

  describe('Accessibility', () => {
    it('has type="search" for semantic HTML', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('has aria-label for screen readers', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      expect(screen.getByRole('searchbox', { name: /search projects/i })).toBeInTheDocument();
    });

    it('has aria-describedby linking to results count', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} resultsCount={5} />);

      const input = screen.getByRole('searchbox');
      const describedById = input.getAttribute('aria-describedby');

      expect(describedById).toBeTruthy();

      const resultsText = screen.getByText('Showing 5 projects');
      expect(resultsText).toHaveAttribute('id', describedById);
    });

    it('does not have aria-describedby when results count is not provided', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('clear button has descriptive aria-label', () => {
      const onChange = vi.fn();

      render(<SearchBar value="React" onChange={onChange} />);

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveValue('');
    });

    it('handles very long search queries', async () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const longQuery = 'This is a very long search query that contains many words and characters';
      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: longQuery } });

      expect(input).toHaveValue(longQuery);

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(onChange).toHaveBeenCalledWith(longQuery);
    });

    it('handles special characters in search query', async () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'C++ & C#' } });

      expect(input).toHaveValue('C++ & C#');

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(onChange).toHaveBeenCalledWith('C++ & C#');
    });

    it('handles rapid clear and type sequence', async () => {
      const onChange = vi.fn();

      render(<SearchBar value="React" onChange={onChange} />);

      // Clear
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);

      // Type new value
      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'Vue' } });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(onChange).toHaveBeenCalledWith('');
      expect(onChange).toHaveBeenCalledWith('Vue');
    });

    it('handles value prop changing while user is typing', async () => {
      const onChange = vi.fn();

      const { rerender } = render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'React' } });

      // External value changes before debounce completes
      rerender(<SearchBar value="TypeScript" onChange={onChange} />);

      expect(input).toHaveValue('TypeScript');
    });

    it('handles resultsCount of 0 correctly', () => {
      const onChange = vi.fn();

      render(<SearchBar value="xyz" onChange={onChange} resultsCount={0} />);

      expect(screen.getByText('No projects found')).toBeInTheDocument();
    });

    it('handles very large resultsCount', () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} resultsCount={999} />);

      expect(screen.getByText('Showing 999 projects')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom sx prop', () => {
      const onChange = vi.fn();

      const { container } = render(
        <SearchBar value="" onChange={onChange} sx={{ marginBottom: 4 }} />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Debounce Cleanup', () => {
    it('cleans up debounce timer on unmount', async () => {
      const onChange = vi.fn();

      const { unmount } = render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'React' } });

      // Unmount before debounce completes
      unmount();

      vi.advanceTimersByTime(300);

      // onChange should not be called after unmount
      expect(onChange).not.toHaveBeenCalled();
    });

    it('cancels previous debounce timer when typing continues', async () => {
      const onChange = vi.fn();

      render(<SearchBar value="" onChange={onChange} />);

      const input = screen.getByRole('searchbox');

      // Type "React"
      fireEvent.change(input, { target: { value: 'React' } });
      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      // Type more (should reset timer)
      fireEvent.change(input, { target: { value: 'React Hooks' } });
      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      // Still no call (timer was reset)
      expect(onChange).not.toHaveBeenCalled();

      // Complete the debounce
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('React Hooks');
    });
  });
});
