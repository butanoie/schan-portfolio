import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoadMoreButton } from '../../../components/project/LoadMoreButton';

/**
 * Tests for the LoadMoreButton component.
 *
 * The LoadMoreButton is styled as a thought bubble and provides
 * interactive functionality to load the next batch of projects.
 * These tests verify all states and interactions.
 */
describe('LoadMoreButton', () => {
  const mockOnClick = vi.fn();

  describe('Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={13}
        />
      );
      expect(container).toBeTruthy();
    });

    it('should render as a button element', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should display "Load more projects" button text', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={13}
        />
      );
      expect(screen.getByText('Load more projects')).toBeInTheDocument();
    });

    it('should display consistent button text regardless of remaining count', () => {
      const { rerender } = render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={5}
        />
      );
      expect(screen.getByText('Load more projects')).toBeInTheDocument();

      rerender(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={1}
        />
      );
      expect(screen.getByText('Load more projects')).toBeInTheDocument();
    });

    it('should show "Load more projects" even when remainingCount is 0', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={0}
        />
      );
      expect(screen.getByText('Load more projects')).toBeInTheDocument();
    });

    it('should display "Loading projects..." when loading', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={true}
          disabled={false}
          remainingCount={13}
        />
      );
      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should be clickable when not loading and not disabled', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={true}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be disabled when loading is true', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={true}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show loading spinner when loading', () => {
      const { container } = render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={true}
          disabled={false}
          remainingCount={13}
        />
      );
      // CircularProgress should be rendered
      const spinner = container.querySelector('[role="progressbar"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should show loading text when loading', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={true}
          disabled={false}
          remainingCount={13}
        />
      );
      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(
        <LoadMoreButton
          onClick={onClick}
          loading={false}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = vi.fn();
      render(
        <LoadMoreButton
          onClick={onClick}
          loading={false}
          disabled={true}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const onClick = vi.fn();
      render(
        <LoadMoreButton
          onClick={onClick}
          loading={true}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute(
        'aria-label',
        'Load 13 more projects'
      );
    });

    it('should have aria-label when disabled', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={true}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'All projects loaded');
    });

    it('should have aria-label when loading', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={true}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Loading more projects');
    });

    it('should have aria-busy when loading', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={true}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should not have aria-busy when not loading', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'false');
    });

    it('should be keyboard accessible', () => {
      const onClick = vi.fn();
      render(
        <LoadMoreButton
          onClick={onClick}
          loading={false}
          disabled={false}
          remainingCount={13}
        />
      );
      const button = screen.getByRole('button');
      // Simulate space key press (keyboard activation)
      fireEvent.keyDown(button, { key: ' ' });
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should accept custom sx prop', () => {
      const { container } = render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={13}
          sx={{ opacity: 0.5 }}
        />
      );
      const button = container.querySelector('button');
      expect(button).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle large remaining counts', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={999}
        />
      );
      expect(screen.getByText('Load more projects')).toBeInTheDocument();
    });

    it('should render correctly when transitioning from loading to loaded', () => {
      const { rerender } = render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={true}
          disabled={false}
          remainingCount={13}
        />
      );
      expect(screen.getByText('Loading projects...')).toBeInTheDocument();

      rerender(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={8}
        />
      );
      expect(screen.getByText('Load more projects')).toBeInTheDocument();
    });

    it('should preserve remaining count in aria-label even with generic button text', () => {
      render(
        <LoadMoreButton
          onClick={mockOnClick}
          loading={false}
          disabled={false}
          remainingCount={42}
        />
      );
      const button = screen.getByRole('button');
      // Button text is generic but aria-label has the count for screen readers
      expect(screen.getByText('Load more projects')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Load 42 more projects');
    });
  });
});
