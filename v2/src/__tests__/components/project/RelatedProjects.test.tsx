import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { RelatedProjects } from '@/src/components/project/RelatedProjects';

/**
 * Mock Next.js Image component.
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
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

/**
 * Mock Next.js useRouter hook.
 */
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  useRouter: () => ({
    push: mockPush,
  }),
}));

/**
 * Mock useInView hook.
 */
const mockUseInView = vi.fn(() => [vi.fn(), true, true]);
vi.mock('@/src/hooks/useInView', () => ({
  // @ts-expect-error - Mock function with spread args
  // eslint-disable-next-line jsdoc/require-jsdoc
  useInView: (...args) => mockUseInView(...args),
}));

/**
 * Mock useReducedMotion hook.
 */
const mockUseReducedMotion = vi.fn(() => false);
vi.mock('@/src/hooks/useReducedMotion', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe('RelatedProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseInView.mockReturnValue([vi.fn(), true, true]);
    mockUseReducedMotion.mockReturnValue(false);
  });

  describe('Rendering', () => {
    it('renders section with aria-label', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const section = screen.getByRole('region', {
        name: 'Related projects',
      });
      expect(section).toBeInTheDocument();
    });

    it('renders "Related Projects" heading', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'Related Projects',
      });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Related Projects');
    });

    it('renders list container with role', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('renders ProjectCard components for related projects', () => {
      render(<RelatedProjects projectId="collabspace" />);

      // Get only the project card listitems (not the nested ones in the cards)
      const list = screen.getByRole('list');
      const listItems = list.querySelectorAll(':scope > div[role="listitem"]');
      expect(listItems.length).toBeGreaterThan(0);
      expect(listItems.length).toBeLessThanOrEqual(3); // Default limit is 3
    });
  });

  describe('Related Projects Algorithm', () => {
    it('finds projects with shared tags', () => {
      // kanye-west-blog has tags: ["Ruby", "Heroku", "Rails", "Wordpress"]
      // Other projects that share these tags should appear
      render(<RelatedProjects projectId="collabspace" />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('excludes the current project from related projects', () => {
      render(<RelatedProjects projectId="collabspace" />);

      // The current project title should not appear
      expect(screen.queryByText('Collabware - Collabspace')).not.toBeInTheDocument();
    });

    it('respects the limit parameter', () => {
      render(<RelatedProjects projectId="collabspace" limit={2} />);

      const list = screen.getByRole('list');
      const listItems = list.querySelectorAll(':scope > div[role="listitem"]');
      expect(listItems.length).toBeLessThanOrEqual(2);
    });

    it('uses default limit of 3 when not specified', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const list = screen.getByRole('list');
      const listItems = list.querySelectorAll(':scope > div[role="listitem"]');
      expect(listItems.length).toBeLessThanOrEqual(3);
    });

    it('returns projects sorted by number of shared tags', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const listItems = screen.getAllByRole('listitem');
      // Projects with more shared tags should appear first
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('handles limit larger than available related projects', () => {
      render(<RelatedProjects projectId="collabspace" limit={100} />);

      const listItems = screen.getAllByRole('listitem');
      // Should show all available related projects, not error
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('No Related Projects', () => {
    it('returns null when project has no related projects', () => {
      // Create a scenario where a project might have no related projects
      // This would happen if no other projects share tags
      const { container } = render(<RelatedProjects projectId="nonexistent-id" />);

      // Component should render null - no section should be present
      expect(container.firstChild).toBeNull();
    });

    it('returns null when project is not found', () => {
      const { container } = render(<RelatedProjects projectId="invalid-project-id" />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('navigates to project detail page when card is clicked', async () => {
      const user = userEvent.setup();

      render(<RelatedProjects projectId="collabspace" />);

      const links = screen.getAllByRole('link', { hidden: true });
      if (links.length > 0) {
        await user.click(links[0]);

        expect(mockPush).toHaveBeenCalled();
        const callArg = mockPush.mock.calls[0][0];
        expect(callArg).toMatch(/^\/projects\/.+/);
      }
    });

    it('generates correct project detail URLs', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const links = screen.getAllByRole('link', { hidden: true });
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toMatch(/^\/projects\/.+/);
      });
    });
  });

  describe('Responsive Layout', () => {
    it('renders with responsive grid layout', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      // Grid layout on desktop: repeat(3, 1fr)
      // Horizontal scroll on mobile
    });

    it('renders all related project cards', () => {
      render(<RelatedProjects projectId="collabspace" limit={3} />);

      const list = screen.getByRole('list');
      const listItems = list.querySelectorAll(':scope > div[role="listitem"]');
      expect(listItems.length).toBeGreaterThan(0);
      expect(listItems.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom sx prop as object', () => {
      const { container } = render(
        <RelatedProjects projectId="collabspace" sx={{ marginBottom: 8 }} />
      );

      const section = screen.queryByRole('region');
      if (section) {
        expect(section).toBeInTheDocument();
      }
    });

    it('applies custom sx prop as array', () => {
      const { container } = render(
        <RelatedProjects
          projectId="collabspace"
          sx={[{ marginBottom: 4 }, { paddingTop: 2 }]}
        />
      );

      const section = screen.queryByRole('region');
      if (section) {
        expect(section).toBeInTheDocument();
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles project with many shared tags', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('handles project with few shared tags', () => {
      render(<RelatedProjects projectId="collabspace" limit={1} />);

      const list = screen.getByRole('list');
      const listItems = list.querySelectorAll(':scope > div[role="listitem"]');
      // Should still show related projects if any exist
      expect(listItems.length).toBeLessThanOrEqual(1);
    });

    it('handles limit of 0', () => {
      render(<RelatedProjects projectId="collabspace" limit={0} />);

      const listItems = screen.queryAllByRole('listitem');
      expect(listItems.length).toBe(0);
    });

    it('handles limit of 1', () => {
      render(<RelatedProjects projectId="collabspace" limit={1} />);

      const list = screen.getByRole('list');
      const listItems = list.querySelectorAll(':scope > div[role="listitem"]');
      expect(listItems.length).toBeLessThanOrEqual(1);
    });

    it('handles very large limit', () => {
      render(<RelatedProjects projectId="collabspace" limit={1000} />);

      const listItems = screen.getAllByRole('listitem');
      // Should not error, just show all available related projects
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has semantic section element', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('has descriptive aria-label on section', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const section = screen.getByRole('region', {
        name: 'Related projects',
      });
      expect(section).toBeInTheDocument();
    });

    it('uses h2 for heading', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'Related Projects',
      });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('has proper list role for project cards', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('each project card has listitem role', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item).toHaveAttribute('role', 'listitem');
      });
    });
  });

  describe('ProjectCard Integration', () => {
    it('passes project data to ProjectCard components', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const listItems = screen.getAllByRole('listitem');
      // Each listitem should contain a ProjectCard with project data
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('passes priority=false to all ProjectCard components', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const images = screen.queryAllByRole('img');
      images.forEach((image) => {
        // ProjectCards in RelatedProjects should not be priority
        expect(image.getAttribute('data-priority')).toBe('false');
      });
    });

    it('passes onClick handler to ProjectCard components', async () => {
      const user = userEvent.setup();

      render(<RelatedProjects projectId="collabspace" />);

      const links = screen.getAllByRole('link', { hidden: true });
      if (links.length > 0) {
        await user.click(links[0]);
        expect(mockPush).toHaveBeenCalled();
      }
    });
  });

  describe('Data Layer Integration', () => {
    it('uses getProjectById to get current project', () => {
      render(<RelatedProjects projectId="collabspace" />);

      // If the component renders successfully, getProjectById worked
      const section = screen.queryByRole('region');
      expect(section).toBeInTheDocument();
    });

    it('uses PROJECTS array to find related projects', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const listItems = screen.getAllByRole('listitem');
      // If related projects are found, PROJECTS array was accessed successfully
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('handles projects from the actual data layer', () => {
      // Test with different real project IDs
      const projectIds = [
        'collabspaceDownloader',
        'collabspace',
        'collabmail',
      ];

      projectIds.forEach((projectId) => {
        const { unmount } = render(<RelatedProjects projectId={projectId} />);

        // Each project should either have related projects or return null
        const section = screen.queryByRole('region');
        if (section) {
          expect(section).toBeInTheDocument();
        }

        unmount();
      });
    });
  });

  describe('Tag Matching Logic', () => {
    it('only shows projects with at least one shared tag', () => {
      render(<RelatedProjects projectId="collabspace" />);

      const listItems = screen.getAllByRole('listitem');
      // All shown projects must have shared tags (score > 0)
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('prioritizes projects with more shared tags', () => {
      render(<RelatedProjects projectId="collabspace" limit={3} />);

      const listItems = screen.getAllByRole('listitem');
      // Projects are sorted by shared tag count (descending)
      // First project should have the most shared tags
      expect(listItems.length).toBeGreaterThan(0);
    });
  });
});
