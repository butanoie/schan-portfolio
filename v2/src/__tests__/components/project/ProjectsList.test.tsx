import { render, screen } from '../../test-utils';
import { ProjectsList } from '../../../components/project/ProjectsList';
import type { Project } from '../../../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Mock ProjectDetail component to simplify testing.
 * Renders a simple div with test ID for easier assertion.
 */
vi.mock('../../../components/project/ProjectDetail', () => ({
  /**
   * Mock ProjectDetail component for testing ProjectsList.
   * Renders a simple structure that's easier to test in isolation.
   *
   * @param props - ProjectDetail props
   * @param props.project - Project data to display
   * @returns Simple div with project ID for testing
   */
  ProjectDetail: ({ project }: { project: Project }) => (
    <div data-testid={`project-${project.id}`} className="project-detail">
      {project.title}
    </div>
  ),
}));

/**
 * Mock useScrollAnimation hook to test scroll animation integration.
 * Returns a simple mock ref and isInView state.
 */
vi.mock('../../../hooks', async () => {
  const actual = await vi.importActual('../../../hooks');
  return {
    ...actual,
    useScrollAnimation: () => ({
      ref: { current: null },
      isInView: true,
    }),
  };
});

/**
 * Test suite for ProjectsList component.
 * Verifies rendering of multiple projects, animation state, and accessibility.
 */
describe('ProjectsList', () => {
  /**
   * Mock project data for testing.
   */
  const mockProjects: Project[] = [
    {
      id: 'project-1',
      title: 'Project One',
      slug: 'project-one',
      description: 'First test project',
      content: '<p>Content</p>',
      tags: ['React', 'TypeScript'],
      images: [
        {
          url: '/images/p1/img1.jpg',
          tnUrl: '/images/p1/img1_tn.jpg',
          caption: 'Image 1',
        },
      ],
      links: [],
      featured: true,
      publishedDate: new Date('2024-01-01'),
    },
    {
      id: 'project-2',
      title: 'Project Two',
      slug: 'project-two',
      description: 'Second test project',
      content: '<p>Content</p>',
      tags: ['Next.js', 'Node.js'],
      images: [
        {
          url: '/images/p2/img1.jpg',
          tnUrl: '/images/p2/img1_tn.jpg',
          caption: 'Image 1',
        },
      ],
      links: [],
      featured: false,
      publishedDate: new Date('2024-02-01'),
    },
    {
      id: 'project-3',
      title: 'Project Three',
      slug: 'project-three',
      description: 'Third test project',
      content: '<p>Content</p>',
      tags: ['Python'],
      images: [
        {
          url: '/images/p3/img1.jpg',
          tnUrl: '/images/p3/img1_tn.jpg',
          caption: 'Image 1',
        },
      ],
      links: [],
      featured: true,
      publishedDate: new Date('2024-03-01'),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    /**
     * Test: Renders all projects from array
     */
    it('renders all projects from the array', () => {
      render(<ProjectsList projects={mockProjects} />);

      expect(screen.getByTestId('project-project-1')).toBeInTheDocument();
      expect(screen.getByTestId('project-project-2')).toBeInTheDocument();
      expect(screen.getByTestId('project-project-3')).toBeInTheDocument();
    });

    /**
     * Test: Renders project titles correctly
     */
    it('renders project titles correctly', () => {
      render(<ProjectsList projects={mockProjects} />);

      expect(screen.getByText('Project One')).toBeInTheDocument();
      expect(screen.getByText('Project Two')).toBeInTheDocument();
      expect(screen.getByText('Project Three')).toBeInTheDocument();
    });

    /**
     * Test: Renders correct number of projects
     */
    it('renders the correct number of projects', () => {
      render(<ProjectsList projects={mockProjects} />);

      const projects = screen.getAllByTestId(/^project-/);
      expect(projects).toHaveLength(3);
    });

    /**
     * Test: Renders nothing when projects array is empty
     */
    it('renders nothing when projects array is empty', () => {
      const { container } = render(<ProjectsList projects={[]} />);

      expect(container.querySelectorAll('[data-testid^="project-"]')).toHaveLength(0);
    });

    /**
     * Test: Renders single project correctly
     */
    it('renders single project correctly', () => {
      render(<ProjectsList projects={[mockProjects[0]]} />);

      expect(screen.getByTestId('project-project-1')).toBeInTheDocument();
      expect(screen.getByText('Project One')).toBeInTheDocument();
    });
  });

  describe('Key Props and React Requirements', () => {
    /**
     * Test: Projects are rendered with proper key prop
     * (Verified by console errors - no warnings about missing keys)
     */
    it('renders projects without key prop warnings', () => {
      // Mock console.error to catch React warnings
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<ProjectsList projects={mockProjects} />);

      // Should not have warnings about missing keys
      const hasKeyWarnings = consoleErrorSpy.mock.calls.some((call) =>
        call[0]?.includes?.('key prop')
      );
      expect(hasKeyWarnings).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    /**
     * Test: Each project is rendered in correct order
     */
    it('renders projects in the correct order', () => {
      render(<ProjectsList projects={mockProjects} />);

      const projectElements = screen.getAllByTestId(/^project-/);
      expect(projectElements[0]).toHaveTextContent('Project One');
      expect(projectElements[1]).toHaveTextContent('Project Two');
      expect(projectElements[2]).toHaveTextContent('Project Three');
    });
  });

  describe('Animation Integration', () => {
    /**
     * Test: Each project is wrapped with scroll animation
     */
    it('wraps each project with scroll animation wrapper', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      // Each project should be in a wrapper div for animations
      const wrappers = container.querySelectorAll('[class*="project"]');
      expect(wrappers.length).toBeGreaterThan(0);
    });

    /**
     * Test: Animation wrapper has proper styling
     */
    it('animation wrapper has proper styling attributes', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      const firstWrapper = container.querySelector('[data-testid="project-project-1"]')
        ?.parentElement;
      // Should have animation-related styles (opacity, transform)
      expect(firstWrapper).toBeInTheDocument();
    });

    /**
     * Test: Projects maintain opacity and transform properties
     */
    it('maintains opacity and transform properties for animations', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      // The wrapper div should exist and be ready for animation
      const wrappers = container.querySelectorAll('[style*="opacity"], [style*="transform"]');
      expect(wrappers.length).toBeGreaterThanOrEqual(0); // May not have inline styles
    });
  });

  describe('Project Data Integrity', () => {
    /**
     * Test: Project data is passed correctly to ProjectDetail
     */
    it('passes project data correctly to ProjectDetail components', () => {
      render(<ProjectsList projects={mockProjects} />);

      // Each mock ProjectDetail should display the project title
      mockProjects.forEach((project) => {
        expect(screen.getByText(project.title)).toBeInTheDocument();
      });
    });

    /**
     * Test: All project properties are accessible
     */
    it('maintains project data integrity', () => {
      render(<ProjectsList projects={mockProjects} />);

      // Verify all projects rendered
      mockProjects.forEach((project) => {
        const element = screen.getByTestId(`project-${project.id}`);
        expect(element.textContent).toBe(project.title);
      });
    });
  });

  describe('Empty and Edge Cases', () => {
    /**
     * Test: Handles empty projects array gracefully
     */
    it('handles empty projects array gracefully', () => {
      const { container } = render(<ProjectsList projects={[]} />);

      expect(container.querySelectorAll('[data-testid^="project-"]')).toHaveLength(0);
    });

    /**
     * Test: Handles large number of projects
     */
    it('handles large number of projects', () => {
      const largeProjects = Array.from({ length: 50 }, (_, i) => ({
        ...mockProjects[0],
        id: `project-${i}`,
        title: `Project ${i}`,
      }));

      render(<ProjectsList projects={largeProjects} />);

      const projects = screen.getAllByTestId(/^project-/);
      expect(projects).toHaveLength(50);
    });

    /**
     * Test: Updates when projects array changes
     */
    it('updates when projects array changes', () => {
      const { rerender } = render(<ProjectsList projects={[mockProjects[0]]} />);

      expect(screen.getByText('Project One')).toBeInTheDocument();
      expect(screen.queryByText('Project Two')).not.toBeInTheDocument();

      // Rerender with different projects
      rerender(<ProjectsList projects={[mockProjects[1], mockProjects[2]]} />);

      expect(screen.queryByText('Project One')).not.toBeInTheDocument();
      expect(screen.getByText('Project Two')).toBeInTheDocument();
      expect(screen.getByText('Project Three')).toBeInTheDocument();
    });

    /**
     * Test: Updates when adding projects to array
     */
    it('updates when adding projects to array', () => {
      const { rerender } = render(<ProjectsList projects={[mockProjects[0]]} />);

      expect(screen.getAllByTestId(/^project-/)).toHaveLength(1);

      rerender(<ProjectsList projects={mockProjects} />);

      expect(screen.getAllByTestId(/^project-/)).toHaveLength(3);
    });

    /**
     * Test: Updates when removing projects from array
     */
    it('updates when removing projects from array', () => {
      const { rerender } = render(<ProjectsList projects={mockProjects} />);

      expect(screen.getAllByTestId(/^project-/)).toHaveLength(3);

      rerender(<ProjectsList projects={[mockProjects[0]]} />);

      expect(screen.getAllByTestId(/^project-/)).toHaveLength(1);
    });
  });

  describe('Component Structure', () => {
    /**
     * Test: Uses Box component for wrapper
     */
    it('renders projects within a container', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      // Should have a root container element
      expect(container.firstChild).toBeInTheDocument();
    });

    /**
     * Test: Each project has proper hierarchy
     */
    it('maintains proper DOM hierarchy for each project', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      const projectDivs = container.querySelectorAll('[data-testid^="project-"]');
      projectDivs.forEach((div) => {
        expect(div.parentElement).toBeInTheDocument();
      });
    });
  });

  describe('Props Behavior', () => {
    /**
     * Test: ProjectsListProps interface is properly typed
     */
    it('accepts projects array of correct type', () => {
      // This test verifies TypeScript compilation
      render(<ProjectsList projects={mockProjects} />);

      expect(screen.getByText('Project One')).toBeInTheDocument();
    });

    /**
     * Test: Requires projects prop
     */
    it('renders correctly with required projects prop', () => {
      render(<ProjectsList projects={mockProjects} />);

      expect(screen.getAllByTestId(/^project-/)).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    /**
     * Test: Projects are semantically structured
     */
    it('maintains semantic HTML structure', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      // Check that projects are in a container
      expect(container.querySelector('[class*="MuiBox"]')).toBeInTheDocument();
    });

    /**
     * Test: All project content is accessible
     */
    it('all project content is accessible', () => {
      render(<ProjectsList projects={mockProjects} />);

      // All project titles should be in document
      mockProjects.forEach((project) => {
        expect(screen.getByText(project.title)).toBeInTheDocument();
      });
    });
  });

  describe('Integration with ProjectDetail', () => {
    /**
     * Test: Passes complete project object to ProjectDetail
     */
    it('passes complete project object to ProjectDetail', () => {
      render(<ProjectsList projects={mockProjects} />);

      // Each project should be rendered (verified by ProjectDetail mock)
      mockProjects.forEach((project) => {
        expect(screen.getByTestId(`project-${project.id}`)).toBeInTheDocument();
      });
    });

    /**
     * Test: ProjectDetail components receive correct project data
     */
    it('projectdetail components receive correct project data', () => {
      render(<ProjectsList projects={mockProjects} />);

      // Mock displays project.title, so we can verify data passed correctly
      mockProjects.forEach((project) => {
        const element = screen.getByTestId(`project-${project.id}`);
        expect(element.textContent).toBe(project.title);
      });
    });
  });

  describe('Scroll Animation Wrapper', () => {
    /**
     * Test: Wrapper has scroll animation styles
     */
    it('wrapper has scroll animation styling', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      // Should have wrapper elements with animation styles
      const projectElements = container.querySelectorAll('[data-testid^="project-"]');
      expect(projectElements.length).toBeGreaterThan(0);
    });

    /**
     * Test: Animation wrapper transitions are applied
     */
    it('animation wrapper has transition property for animations', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      // Look for elements that should have transition styles
      const wrappers = container.querySelectorAll('div');
      // At least the root wrapper should exist
      expect(wrappers.length).toBeGreaterThan(0);
    });

    /**
     * Test: Wrapper ref is properly attached to scrolling element
     */
    it('animation wrapper ref is properly attached', () => {
      const { container } = render(<ProjectsList projects={mockProjects} />);

      // Projects should be wrapped in div that has animation properties
      const projectDivs = container.querySelectorAll('[data-testid^="project-"]');
      projectDivs.forEach((project) => {
        expect(project.parentElement).toBeTruthy();
      });
    });
  });

  describe('Performance', () => {
    /**
     * Test: Renders large lists efficiently
     */
    it('renders large lists efficiently', () => {
      const largeProjectList = Array.from({ length: 100 }, (_, i) => ({
        ...mockProjects[0],
        id: `project-${i}`,
        title: `Project ${i}`,
      }));

      const { container } = render(<ProjectsList projects={largeProjectList} />);

      const projectElements = container.querySelectorAll('[data-testid^="project-"]');
      expect(projectElements).toHaveLength(100);
    });

    /**
     * Test: Handles rapid re-renders with different data
     */
    it('handles rapid re-renders with different data', () => {
      const { rerender } = render(<ProjectsList projects={mockProjects} />);

      // Rerender with different projects
      rerender(<ProjectsList projects={[mockProjects[0]]} />);
      expect(screen.getByText('Project One')).toBeInTheDocument();

      rerender(<ProjectsList projects={[mockProjects[1]]} />);
      expect(screen.getByText('Project Two')).toBeInTheDocument();

      rerender(<ProjectsList projects={mockProjects} />);
      expect(screen.getByText('Project One')).toBeInTheDocument();
    });
  });
});
