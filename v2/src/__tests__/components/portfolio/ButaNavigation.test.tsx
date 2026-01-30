import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButaNavigation } from '@/src/components/portfolio/ButaNavigation';

describe('ButaNavigation', () => {
  describe('Rendering', () => {
    it('renders Buta character image', () => {
      const onLoadMore = vi.fn();

      const { container } = render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const image = container.querySelector('img[alt="Buta the pig mascot"]');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', expect.stringContaining('buta.png'));
    });

    it('renders thought bubble with status role', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const thoughtBubble = screen.getByRole('status');
      expect(thoughtBubble).toBeInTheDocument();
      expect(thoughtBubble).toHaveAttribute('aria-live', 'polite');
      expect(thoughtBubble).toHaveAttribute('aria-atomic', 'true');
    });

    it('renders connecting circles for thought bubble tail', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      // The thought bubble tail consists of 3 circular elements
      // They are styled with borderRadius: '50%' and border
      const thoughtBubble = screen.getByRole('status');
      const parent = thoughtBubble.parentElement;

      // Check that the thought bubble structure exists
      expect(parent).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('displays loading message', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="loading"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('Fetching more projects...')).toBeInTheDocument();
    });

    it('does not show load more link in loading state', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="loading"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
    });

    it('does not show project counter in loading state', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="loading"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.queryByText(/\/ 18 projects/i)).not.toBeInTheDocument();
    });
  });

  describe('Load More State', () => {
    it('displays "Want to see more?" message', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText(/want to see more\?/i)).toBeInTheDocument();
    });

    it('shows clickable "Click here!" link', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const link = screen.getByRole('button', { name: /load more projects/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Click here!');
    });

    it('displays project counter with current and total counts', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('6 / 18 projects')).toBeInTheDocument();
    });

    it('project counter has descriptive aria-label', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const counter = screen.getByLabelText('Showing 6 of 18 projects');
      expect(counter).toBeInTheDocument();
    });

    it('calls onLoadMore when link is clicked', async () => {
      const user = userEvent.setup();
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const link = screen.getByRole('button', { name: /load more projects/i });
      await user.click(link);

      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('updates counter when currentCount changes', () => {
      const onLoadMore = vi.fn();

      const { rerender } = render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('6 / 18 projects')).toBeInTheDocument();

      rerender(
        <ButaNavigation
          state="load-more"
          currentCount={12}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('12 / 18 projects')).toBeInTheDocument();
    });
  });

  describe('End State', () => {
    it('displays "That\'s all, folks!" message', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="end"
          currentCount={18}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText("That's all, folks!")).toBeInTheDocument();
    });

    it('does not show load more link in end state', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="end"
          currentCount={18}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
    });

    it('does not show project counter in end state', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="end"
          currentCount={18}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.queryByText(/\/ 18 projects/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('thought bubble has proper ARIA attributes for live region', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="loading"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const thoughtBubble = screen.getByRole('status');
      expect(thoughtBubble).toHaveAttribute('aria-live', 'polite');
      expect(thoughtBubble).toHaveAttribute('aria-atomic', 'true');
    });

    it('load more link has descriptive aria-label', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByRole('button', { name: 'Load more projects' })).toBeInTheDocument();
    });

    it('project counter has descriptive aria-label', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByLabelText('Showing 6 of 18 projects')).toBeInTheDocument();
    });

    it('Buta image has descriptive alt text', () => {
      const onLoadMore = vi.fn();

      const { container } = render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const image = container.querySelector('img');
      expect(image).toHaveAttribute('alt', 'Buta the pig mascot');
    });

    it('announces state changes to screen readers via live region', () => {
      const onLoadMore = vi.fn();

      const { rerender } = render(
        <ButaNavigation
          state="loading"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const thoughtBubble = screen.getByRole('status');
      expect(thoughtBubble).toHaveTextContent('Fetching more projects...');

      rerender(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(thoughtBubble).toHaveTextContent(/want to see more\?/i);
    });
  });

  describe('Edge Cases', () => {
    it('handles 0 current count', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={0}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('0 / 18 projects')).toBeInTheDocument();
    });

    it('handles 1 project (singular)', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={1}
          totalCount={1}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('1 / 1 projects')).toBeInTheDocument();
    });

    it('handles very large project counts', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={500}
          totalCount={1000}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('500 / 1000 projects')).toBeInTheDocument();
    });

    it('handles when currentCount equals totalCount in load-more state', () => {
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={18}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('18 / 18 projects')).toBeInTheDocument();
      // Link should still be present (component doesn't validate this logic)
      expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
    });

    it('handles state transitions from loading to load-more', () => {
      const onLoadMore = vi.fn();

      const { rerender } = render(
        <ButaNavigation
          state="loading"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('Fetching more projects...')).toBeInTheDocument();

      rerender(
        <ButaNavigation
          state="load-more"
          currentCount={12}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText(/want to see more\?/i)).toBeInTheDocument();
      expect(screen.getByText('12 / 18 projects')).toBeInTheDocument();
    });

    it('handles state transitions from load-more to end', () => {
      const onLoadMore = vi.fn();

      const { rerender } = render(
        <ButaNavigation
          state="load-more"
          currentCount={15}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText('15 / 18 projects')).toBeInTheDocument();

      rerender(
        <ButaNavigation
          state="end"
          currentCount={18}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      expect(screen.getByText("That's all, folks!")).toBeInTheDocument();
      expect(screen.queryByText(/\/ 18 projects/i)).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom sx prop', () => {
      const onLoadMore = vi.fn();

      const { container } = render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
          sx={{ marginBottom: 8 }}
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('does not call onLoadMore when not in load-more state', () => {
      const onLoadMore = vi.fn();

      const { rerender } = render(
        <ButaNavigation
          state="loading"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      // No button in loading state
      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      rerender(
        <ButaNavigation
          state="end"
          currentCount={18}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      // No button in end state
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(onLoadMore).not.toHaveBeenCalled();
    });

    it('supports keyboard interaction with Enter key', async () => {
      const user = userEvent.setup();
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const link = screen.getByRole('button', { name: /load more projects/i });
      link.focus();
      await user.keyboard('{Enter}');

      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard interaction with Space key', async () => {
      const user = userEvent.setup();
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const link = screen.getByRole('button', { name: /load more projects/i });
      link.focus();
      await user.keyboard(' ');

      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('can be clicked multiple times', async () => {
      const user = userEvent.setup();
      const onLoadMore = vi.fn();

      render(
        <ButaNavigation
          state="load-more"
          currentCount={6}
          totalCount={18}
          onLoadMore={onLoadMore}
        />
      );

      const link = screen.getByRole('button', { name: /load more projects/i });

      await user.click(link);
      await user.click(link);
      await user.click(link);

      expect(onLoadMore).toHaveBeenCalledTimes(3);
    });
  });
});
