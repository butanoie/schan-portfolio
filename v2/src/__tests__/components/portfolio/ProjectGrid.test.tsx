import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ProjectGrid } from '@/src/components/portfolio/ProjectGrid';
import type { Project } from '@/src/types/project';

/**
 * Mock Next.js Image component.
 * Renders a simple img tag for testing purposes.
 *
 * @param props - Image component props
 * @param props.src - Image source URL
 * @param props.alt - Image alt text
 * @param props.priority - Whether to prioritize loading
 * @param props.onError - Error handler
 * @param props.onClick - Click handler
 * @returns A simple img element for testing
 */
vi.mock('next/image', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  default: ({
    src,
    alt,
    priority,
    onError,
    onClick,
    ...props
  }: {
    src: string;
    alt: string;
    priority?: boolean;
    onError?: () => void;
    onClick?: () => void;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-priority={priority ? 'true' : 'false'}
      onError={onError}
      onClick={onClick}
      {...props}
    />
  ),
}));

/**
 * Mock Next.js Link component.
 * Renders a simple anchor tag for testing purposes.
 *
 * @param props - Link component props
 * @param props.href - Link destination URL
 * @param props.children - Link children
 * @param props.onClick - Click handler
 * @returns A simple anchor element for testing
 */
vi.mock('next/link', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  default: ({
    href,
    children,
    onClick,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
  }) => (
    <a
      href={href}
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  ),
}));

/**
 * Mock useInView hook.
 */
vi.mock('@/src/hooks/useInView', () => ({
  useInView: vi.fn(() => [vi.fn(), true, true]),
}));

/**
 * Mock useReducedMotion hook.
 */
vi.mock('@/src/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe('ProjectGrid', () => {
  /**
   * Creates a mock project for testing.
   *
   * @param id - Project ID
   * @returns A mock Project object
   */
  const createMockProject = (id: string): Project => ({
    id,
    title: `Project ${id}`,
    desc: `<p>Description for ${id}</p>`,
    circa: 'Winter 2025',
    tags: ['React', 'TypeScript', 'Next.js'],
    images: [
      {
        url: `/images/${id}/full.jpg`,
        tnUrl: `/images/${id}/thumb.jpg`,
        caption: `${id} image`,
      },
    ],
    videos: [],
    altGrid: false,
  });

  /**
   * Creates an array of mock projects.
   *
   * @param count - Number of projects to create
   * @returns Array of mock projects
   */
  const createMockProjects = (count: number): Project[] =>
    Array.from({ length: count }, (_, i) => createMockProject(`project-${i + 1}`));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders skeleton cards when loading', () => {
      render(
        <ProjectGrid projects={[]} loading={true} onProjectClick={vi.fn()} />
      );

      const container = screen.getByRole('list');
      expect(container).toHaveAttribute('aria-busy', 'true');
      expect(container).toHaveAttribute('aria-label', 'Loading projects');
    });

    it('renders 6 skeleton cards in loading state', () => {
      render(
        <ProjectGrid projects={[]} loading={true} onProjectClick={vi.fn()} />
      );

      const skeletons = screen.getAllByRole('listitem');
      expect(skeletons).toHaveLength(6);
    });

    it('does not render project cards when loading', () => {
      const projects = createMockProjects(3);

      render(
        <ProjectGrid projects={projects} loading={true} onProjectClick={vi.fn()} />
      );

      expect(screen.queryByText('Project project-1')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders empty state message when no projects', () => {
      render(
        <ProjectGrid projects={[]} loading={false} onProjectClick={vi.fn()} />
      );

      expect(screen.getByText('No projects found')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Try adjusting your filters or search query to see more results.'
        )
      ).toBeInTheDocument();
    });

    it('has proper ARIA attributes for empty state', () => {
      render(
        <ProjectGrid projects={[]} loading={false} onProjectClick={vi.fn()} />
      );

      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });

    it('does not render skeleton cards in empty state', () => {
      render(
        <ProjectGrid projects={[]} loading={false} onProjectClick={vi.fn()} />
      );

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  describe('Loaded State', () => {
    it('renders project cards when projects are provided', () => {
      const projects = createMockProjects(3);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      expect(screen.getByText('Project project-1')).toBeInTheDocument();
      expect(screen.getByText('Project project-2')).toBeInTheDocument();
      expect(screen.getByText('Project project-3')).toBeInTheDocument();
    });

    it('renders correct number of project cards', () => {
      const projects = createMockProjects(5);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      const cards = screen.getAllByRole('listitem');
      expect(cards).toHaveLength(5);
    });

    it('has proper ARIA attributes for loaded state', () => {
      const projects = createMockProjects(3);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      const container = screen.getByRole('list');
      expect(container).toHaveAttribute('aria-label', 'Projects');
      expect(container).not.toHaveAttribute('aria-busy');
    });

    it('passes priority to first 3 cards only', () => {
      const projects = createMockProjects(6);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      // All 6 cards should be rendered
      const cards = screen.getAllByRole('listitem');
      expect(cards).toHaveLength(6);
    });

    it('calls onProjectClick when a card is clicked', async () => {
      const projects = createMockProjects(3);
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={handleClick}
        />
      );

      const firstCard = screen.getAllByRole('listitem')[0];
      await user.click(firstCard);

      expect(handleClick).toHaveBeenCalledWith('project-1');
    });
  });

  describe('Grid Layout', () => {
    it('renders as a CSS grid container', () => {
      const projects = createMockProjects(3);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      const container = screen.getByRole('list');
      expect(container).toBeInTheDocument();
    });

    it('applies custom sx styles', () => {
      const projects = createMockProjects(3);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
          sx={{ backgroundColor: 'red' }}
        />
      );

      const container = screen.getByRole('list');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single project', () => {
      const projects = createMockProjects(1);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      expect(screen.getByText('Project project-1')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });

    it('handles many projects', () => {
      const projects = createMockProjects(50);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(50);
    });

    it('handles loading state change', () => {
      const projects = createMockProjects(3);

      const { rerender } = render(
        <ProjectGrid projects={projects} loading={true} onProjectClick={vi.fn()} />
      );

      // Should show loading skeletons
      expect(screen.getByLabelText('Loading projects')).toBeInTheDocument();

      // Change to loaded state
      rerender(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      // Should show actual projects
      expect(screen.getByText('Project project-1')).toBeInTheDocument();
      expect(screen.queryByLabelText('Loading projects')).not.toBeInTheDocument();
    });

    it('handles empty to loaded state transition', () => {
      const { rerender } = render(
        <ProjectGrid projects={[]} loading={false} onProjectClick={vi.fn()} />
      );

      // Should show empty state
      expect(screen.getByText('No projects found')).toBeInTheDocument();

      // Add projects
      const projects = createMockProjects(3);
      rerender(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      // Should show projects
      expect(screen.getByText('Project project-1')).toBeInTheDocument();
      expect(screen.queryByText('No projects found')).not.toBeInTheDocument();
    });

    it('handles projects with different data', () => {
      const projects: Project[] = [
        createMockProject('short'),
        {
          ...createMockProject('long'),
          title: 'Very Long Project Title That Should Truncate',
          tags: ['A', 'B', 'C', 'D', 'E'],
        },
        {
          ...createMockProject('no-images'),
          images: [],
        },
      ];

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('passes each project ID to onProjectClick correctly', async () => {
      const projects = createMockProjects(3);
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={handleClick}
        />
      );

      const cards = screen.getAllByRole('listitem');

      await user.click(cards[0]);
      expect(handleClick).toHaveBeenLastCalledWith('project-1');

      await user.click(cards[1]);
      expect(handleClick).toHaveBeenLastCalledWith('project-2');

      await user.click(cards[2]);
      expect(handleClick).toHaveBeenLastCalledWith('project-3');

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has correct role for list container', () => {
      const projects = createMockProjects(3);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      const container = screen.getByRole('list');
      expect(container).toBeInTheDocument();
    });

    it('has correct role for list items', () => {
      const projects = createMockProjects(3);

      render(
        <ProjectGrid
          projects={projects}
          loading={false}
          onProjectClick={vi.fn()}
        />
      );

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
    });

    it('provides loading feedback with aria-busy', () => {
      render(
        <ProjectGrid projects={[]} loading={true} onProjectClick={vi.fn()} />
      );

      const container = screen.getByRole('list');
      expect(container).toHaveAttribute('aria-busy', 'true');
    });

    it('provides empty state feedback with aria-live', () => {
      render(
        <ProjectGrid projects={[]} loading={false} onProjectClick={vi.fn()} />
      );

      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });
  });
});
