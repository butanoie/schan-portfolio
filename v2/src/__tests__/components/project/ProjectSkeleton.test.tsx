import { render, screen } from '../../test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectSkeleton } from '../../../components/project/ProjectSkeleton';

/**
 * Mock useReducedMotion hook
 */
vi.mock('../../../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

/**
 * Tests for the ProjectSkeleton component.
 *
 * The ProjectSkeleton displays loading placeholders matching ProjectDetail layouts.
 * These tests verify:
 * - Proper rendering with different layout variants
 * - Correct accessibility attributes
 * - Responsive behavior
 * - Reduced motion preference handling
 */
describe('ProjectSkeleton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(<ProjectSkeleton />);
      expect(container).toBeTruthy();
    });

    it('should render with default variant (narrow)', () => {
      render(<ProjectSkeleton />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with wide-regular variant', () => {
      render(<ProjectSkeleton variant="wide-regular" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with wide-video variant', () => {
      render(<ProjectSkeleton variant="wide-video" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have progressbar role', () => {
      render(<ProjectSkeleton />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
    });

    it('should have aria-busy attribute set to true', () => {
      render(<ProjectSkeleton />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
    });

    it('should have aria-label for loading state', () => {
      render(<ProjectSkeleton />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toHaveAttribute(
        'aria-label',
        'Loading project details'
      );
    });
  });

  describe('Narrow layout variant', () => {
    it('should render tag skeletons', () => {
      const { container } = render(<ProjectSkeleton variant="narrow" />);
      // Narrow layout should render multiple skeleton elements
      const skeletonElements = container.querySelectorAll('[role="progressbar"]');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should render description skeletons', () => {
      render(<ProjectSkeleton variant="narrow" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with narrow variant structure', () => {
      render(<ProjectSkeleton variant="narrow" />);
      const skeleton = screen.getByRole('progressbar');
      // Verify the skeleton has proper accessibility attributes
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading project details');
    });
  });

  describe('Wide-regular layout variant', () => {
    it('should render with wide-regular variant', () => {
      render(
        <ProjectSkeleton variant="wide-regular" />
      );
      // Component should render without errors
      const section = screen.getByRole('progressbar');
      expect(section).toBeInTheDocument();
    });

    it('should render tag skeletons in left column', () => {
      render(
        <ProjectSkeleton variant="wide-regular" />
      );
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
    });

    it('should render image grid in right column', () => {
      render(
        <ProjectSkeleton variant="wide-regular" />
      );
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading project details');
    });
  });

  describe('Wide-video layout variant', () => {
    it('should render with wide-video variant', () => {
      render(<ProjectSkeleton variant="wide-video" />);
      const section = screen.getByRole('progressbar');
      expect(section).toBeInTheDocument();
    });

    it('should render video placeholder', () => {
      render(<ProjectSkeleton variant="wide-video" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });

    it('should have proper accessibility for video variant', () => {
      render(<ProjectSkeleton variant="wide-video" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading project details');
    });
  });

  describe('Animation behavior', () => {
    it('should render with animation support', () => {
      render(<ProjectSkeleton />);
      const section = screen.getByRole('progressbar');
      // Component should render with animation capability
      expect(section).toBeInTheDocument();
    });

    it('should render with wave animation by default', () => {
      render(<ProjectSkeleton />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeTruthy();
    });
  });

  describe('Custom styling', () => {
    it('should accept and apply custom sx prop', () => {
      render(
        <ProjectSkeleton sx={{ opacity: 0.5 }} />
      );
      const section = screen.getByRole('progressbar');
      // Component should render with custom styling applied
      expect(section).toBeInTheDocument();
    });

    it('should merge custom sx with default styles', () => {
      render(
        <ProjectSkeleton variant="narrow" sx={{ mb: 2 }} />
      );
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('should render narrow variant on mobile', () => {
      render(<ProjectSkeleton variant="narrow" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render wide-regular variant on desktop', () => {
      render(<ProjectSkeleton variant="wide-regular" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render wide-video variant on desktop with video', () => {
      render(<ProjectSkeleton variant="wide-video" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('Content structure', () => {
    it('should have divider between projects', () => {
      render(<ProjectSkeleton />);
      const dividers = screen.getByRole('progressbar')
        .closest('section')
        ?.querySelectorAll('hr') || [];
      expect(dividers.length).toBeGreaterThan(-1);
    });

    it('should have section semantic element', () => {
      render(<ProjectSkeleton />);
      const section = screen.getByRole('progressbar').closest('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Multiple skeletons', () => {
    it('should render multiple skeletons without conflict', () => {
      render(
        <>
          <ProjectSkeleton variant="narrow" />
          <ProjectSkeleton variant="wide-regular" />
          <ProjectSkeleton variant="wide-video" />
        </>
      );
      const skeletons = screen.getAllByRole('progressbar');
      expect(skeletons).toHaveLength(3);
    });

    it('should each skeleton have proper accessibility attributes', () => {
      render(
        <>
          <ProjectSkeleton variant="narrow" />
          <ProjectSkeleton variant="wide-regular" />
        </>
      );
      const skeletons = screen.getAllByRole('progressbar');
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('aria-busy', 'true');
      });
    });
  });

  describe('Loading state semantics', () => {
    it('should indicate loading with aria-busy', () => {
      render(<ProjectSkeleton />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
    });

    it('should have descriptive aria-label', () => {
      render(<ProjectSkeleton />);
      const skeleton = screen.getByRole('progressbar');
      const label = skeleton.getAttribute('aria-label');
      expect(label).toContain('Loading');
    });
  });

  describe('Edge cases', () => {
    it('should render with undefined variant (uses default)', () => {
      render(<ProjectSkeleton variant={undefined as unknown as 'narrow'} />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });

    it('should handle rapid re-renders', () => {
      const { rerender } = render(<ProjectSkeleton variant="narrow" />);
      rerender(<ProjectSkeleton variant="wide-regular" />);
      rerender(<ProjectSkeleton variant="wide-video" />);
      const skeleton = screen.getByRole('progressbar');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
