import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectFilters } from '@/src/components/portfolio/ProjectFilters';

describe('ProjectFilters', () => {
  /**
   * Helper function to create mock tag data for testing.
   *
   * @returns A Map of tag names to project counts
   */
  const createMockTags = (): Map<string, number> => {
    return new Map([
      ['React', 12],
      ['TypeScript', 10],
      ['Next.js', 8],
      ['Node.js', 6],
      ['Python', 4],
    ]);
  };

  describe('Rendering', () => {
    it('renders the filter group with correct heading', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByRole('group', { name: /filter projects by technology/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /filter by technology/i })).toBeInTheDocument();
    });

    it('renders all tags with counts', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByRole('checkbox', { name: /react, 12 projects/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /typescript, 10 projects/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /next\.js, 8 projects/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /node\.js, 6 projects/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /python, 4 projects/i })).toBeInTheDocument();
    });

    it('renders tags sorted by count descending', () => {
      const tags = new Map([
        ['Python', 4],
        ['React', 12],
        ['Node.js', 6],
        ['TypeScript', 10],
      ]);
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      const chips = screen.getAllByRole('checkbox');
      expect(chips[0]).toHaveAccessibleName(/react, 12 projects/i);
      expect(chips[1]).toHaveAccessibleName(/typescript, 10 projects/i);
      expect(chips[2]).toHaveAccessibleName(/node\.js, 6 projects/i);
      expect(chips[3]).toHaveAccessibleName(/python, 4 projects/i);
    });

    it('renders tags alphabetically when counts are equal', () => {
      const tags = new Map([
        ['Zebra', 5],
        ['Apple', 5],
        ['Mango', 5],
      ]);
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      const chips = screen.getAllByRole('checkbox');
      expect(chips[0]).toHaveAccessibleName(/apple, 5 projects/i);
      expect(chips[1]).toHaveAccessibleName(/mango, 5 projects/i);
      expect(chips[2]).toHaveAccessibleName(/zebra, 5 projects/i);
    });

    it('does not render when tags map is empty', () => {
      const tags = new Map();
      const onTagsChange = vi.fn();

      const { container } = render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('does not show clear button when no tags are selected', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument();
    });

    it('shows clear button when tags are selected', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React', 'TypeScript']}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByRole('button', { name: /clear all filters \(2 selected\)/i })).toBeInTheDocument();
    });
  });

  describe('Tag Selection', () => {
    it('marks selected tags with aria-checked="true"', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React', 'TypeScript']}
          onTagsChange={onTagsChange}
        />
      );

      const reactChip = screen.getByRole('checkbox', { name: /react, 12 projects, selected/i });
      const typeScriptChip = screen.getByRole('checkbox', { name: /typescript, 10 projects, selected/i });
      const nextJsChip = screen.getByRole('checkbox', { name: /next\.js, 8 projects, not selected/i });

      expect(reactChip).toHaveAttribute('aria-checked', 'true');
      expect(typeScriptChip).toHaveAttribute('aria-checked', 'true');
      expect(nextJsChip).toHaveAttribute('aria-checked', 'false');
    });

    it('calls onTagsChange with added tag when unselected tag is clicked', async () => {
      const user = userEvent.setup();
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React']}
          onTagsChange={onTagsChange}
        />
      );

      const typeScriptChip = screen.getByRole('checkbox', { name: /typescript, 10 projects/i });
      await user.click(typeScriptChip);

      expect(onTagsChange).toHaveBeenCalledWith(['React', 'TypeScript']);
      expect(onTagsChange).toHaveBeenCalledTimes(1);
    });

    it('calls onTagsChange with removed tag when selected tag is clicked', async () => {
      const user = userEvent.setup();
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React', 'TypeScript', 'Next.js']}
          onTagsChange={onTagsChange}
        />
      );

      const typeScriptChip = screen.getByRole('checkbox', { name: /typescript, 10 projects, selected/i });
      await user.click(typeScriptChip);

      expect(onTagsChange).toHaveBeenCalledWith(['React', 'Next.js']);
      expect(onTagsChange).toHaveBeenCalledTimes(1);
    });

    it('supports keyboard interaction with Space key', async () => {
      const user = userEvent.setup();
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      const reactChip = screen.getByRole('checkbox', { name: /react, 12 projects/i });
      reactChip.focus();
      await user.keyboard(' ');

      expect(onTagsChange).toHaveBeenCalledWith(['React']);
    });

    it('supports keyboard interaction with Enter key', async () => {
      const user = userEvent.setup();
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      const reactChip = screen.getByRole('checkbox', { name: /react, 12 projects/i });
      reactChip.focus();
      await user.keyboard('{Enter}');

      expect(onTagsChange).toHaveBeenCalledWith(['React']);
    });
  });

  describe('Clear All Button', () => {
    it('clears all selected tags when clear button is clicked', async () => {
      const user = userEvent.setup();
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React', 'TypeScript', 'Next.js']}
          onTagsChange={onTagsChange}
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear all filters \(3 selected\)/i });
      await user.click(clearButton);

      expect(onTagsChange).toHaveBeenCalledWith([]);
      expect(onTagsChange).toHaveBeenCalledTimes(1);
    });

    it('updates clear button label with correct count', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      const { rerender } = render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React']}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByRole('button', { name: /clear all filters \(1 selected\)/i })).toBeInTheDocument();

      rerender(
        <ProjectFilters
          tags={tags}
          selectedTags={['React', 'TypeScript', 'Next.js']}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByRole('button', { name: /clear all filters \(3 selected\)/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA group role and label', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      const group = screen.getByRole('group', { name: /filter projects by technology/i });
      expect(group).toBeInTheDocument();
    });

    it('announces selected filter count with aria-live', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React', 'TypeScript']}
          onTagsChange={onTagsChange}
        />
      );

      const announcement = screen.getByText('2 filters active');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveAttribute('aria-atomic', 'true');
    });

    it('announces singular filter count correctly', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React']}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByText('1 filter active')).toBeInTheDocument();
    });

    it('does not show filter count when no filters are selected', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.queryByText(/filter active/i)).not.toBeInTheDocument();
    });

    it('has descriptive aria-label for each chip', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={['React']}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByRole('checkbox', { name: /react, 12 projects, selected/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /typescript, 10 projects, not selected/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single tag', () => {
      const tags = new Map([['React', 1]]);
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByRole('checkbox', { name: /react, 1 projects/i })).toBeInTheDocument();
    });

    it('handles many tags (20+)', () => {
      const tags = new Map(
        Array.from({ length: 25 }, (_, i) => [`Tag${i}`, i + 1])
      );
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      const chips = screen.getAllByRole('checkbox');
      expect(chips).toHaveLength(25);
    });

    it('handles tags with special characters in names', () => {
      const tags = new Map([
        ['C++', 5],
        ['C#', 3],
        ['Vue.js', 8],
      ]);
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      expect(screen.getByRole('checkbox', { name: /c\+\+, 5 projects/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /c#, 3 projects/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /vue\.js, 8 projects/i })).toBeInTheDocument();
    });

    it('handles selecting all tags', async () => {
      const user = userEvent.setup();
      const tags = new Map([
        ['React', 5],
        ['TypeScript', 3],
      ]);
      const onTagsChange = vi.fn();

      render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
        />
      );

      const reactChip = screen.getByRole('checkbox', { name: /react/i });
      const tsChip = screen.getByRole('checkbox', { name: /typescript/i });

      await user.click(reactChip);
      expect(onTagsChange).toHaveBeenCalledWith(['React']);

      await user.click(tsChip);
      expect(onTagsChange).toHaveBeenCalledWith(['TypeScript']);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom sx prop', () => {
      const tags = createMockTags();
      const onTagsChange = vi.fn();

      const { container } = render(
        <ProjectFilters
          tags={tags}
          selectedTags={[]}
          onTagsChange={onTagsChange}
          sx={{ marginBottom: 4 }}
        />
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
    });
  });
});
