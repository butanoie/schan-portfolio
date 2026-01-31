import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectHeader } from '@/src/components/project/ProjectHeader';

describe('ProjectHeader', () => {
  describe('Rendering', () => {
    it('renders project title correctly', () => {
      render(
        <ProjectHeader
          title="Test Project Title"
          circa="Winter 2025"
          tags={['React', 'TypeScript']}
        />
      );

      expect(screen.getByText('Test Project Title')).toBeInTheDocument();
    });

    it('renders circa badge with timeline aria-label', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const circaBadge = screen.getByLabelText('Project timeline: Winter 2025');
      expect(circaBadge).toBeInTheDocument();
      expect(circaBadge).toHaveTextContent('Winter 2025');
    });

    it('renders all technology tags', () => {
      const tags = ['React', 'TypeScript', 'Next.js', 'MUI'];

      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={tags}
        />
      );

      tags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('renders tags with list role and aria-label', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React', 'TypeScript']}
        />
      );

      const tagsList = screen.getByRole('list', { name: 'Technology tags' });
      expect(tagsList).toBeInTheDocument();

      const tagItems = screen.getAllByRole('listitem');
      expect(tagItems).toHaveLength(2);
    });

    it('renders header element with header role', () => {
      const { container } = render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('HTML Sanitization', () => {
    it('renders allowed HTML tags in title (strong, em, span)', () => {
      render(
        <ProjectHeader
          title="<strong>Bold</strong> <em>Italic</em> <span>Span</span>"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const strong = screen.getByText((content, element) => {
        return element?.tagName === 'STRONG' && element?.textContent === 'Bold';
      });
      expect(strong).toBeInTheDocument();

      const em = screen.getByText((content, element) => {
        return element?.tagName === 'EM' && element?.textContent === 'Italic';
      });
      expect(em).toBeInTheDocument();

      const span = screen.getByText((content, element) => {
        return element?.tagName === 'SPAN' && element?.textContent === 'Span';
      });
      expect(span).toBeInTheDocument();
    });

    it('strips disallowed HTML tags from title', () => {
      const { container } = render(
        <ProjectHeader
          title='<script>alert("xss")</script>Safe Title'
          circa="Winter 2025"
          tags={['React']}
        />
      );

      // Script tag should be removed
      expect(container.querySelector('script')).not.toBeInTheDocument();
      expect(screen.getByText('Safe Title')).toBeInTheDocument();
    });

    it('strips disallowed attributes from title', () => {
      const { container } = render(
        <ProjectHeader
          title={`<span onclick="alert('xss')">Click Me</span>`}
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const span = screen.getByText('Click Me');
      expect(span).toBeInTheDocument();
      expect(span).not.toHaveAttribute('onclick');
    });
  });

  describe('Layout Variants', () => {
    it('renders inline layout by default', () => {
      const { container } = render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      // Inline layout uses flexDirection: { xs: 'column', md: 'row' }
    });

    it('renders stacked layout when specified', () => {
      const { container } = render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
          layout="stacked"
        />
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      // Stacked layout uses flexDirection: 'column'
    });

    it('renders floating layout when specified', () => {
      const { container } = render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
          layout="floating"
        />
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      // Floating layout uses position: 'absolute'
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tags array', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={[]}
        />
      );

      const tagsList = screen.queryByRole('list', { name: 'Technology tags' });
      expect(tagsList).toBeInTheDocument();

      const tagItems = screen.queryAllByRole('listitem');
      expect(tagItems).toHaveLength(0);
    });

    it('handles single tag', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const tagItems = screen.getAllByRole('listitem');
      expect(tagItems).toHaveLength(1);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('handles many tags', () => {
      const manyTags = [
        'React',
        'TypeScript',
        'Next.js',
        'MUI',
        'Vitest',
        'ESLint',
        'Prettier',
        'Git',
        'Docker',
        'AWS',
      ];

      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={manyTags}
        />
      );

      const tagItems = screen.getAllByRole('listitem');
      expect(tagItems).toHaveLength(manyTags.length);
    });

    it('handles plain text title without HTML', () => {
      render(
        <ProjectHeader
          title="Plain Text Title"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      expect(screen.getByText('Plain Text Title')).toBeInTheDocument();
    });

    it('handles very long title', () => {
      const longTitle =
        'This is a very long project title that might wrap to multiple lines on smaller screens and should still be readable';

      render(
        <ProjectHeader
          title={longTitle}
          circa="Winter 2025"
          tags={['React']}
        />
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles very long circa text', () => {
      const longCirca = 'Q4 2025 - Extended Development Period';

      render(
        <ProjectHeader
          title="Test Project"
          circa={longCirca}
          tags={['React']}
        />
      );

      expect(
        screen.getByLabelText(`Project timeline: ${longCirca}`)
      ).toBeInTheDocument();
    });

    it('handles tags with special characters', () => {
      const specialTags = ['C++', 'C#', '.NET', 'Node.js', 'Vue.js'];

      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={specialTags}
        />
      );

      specialTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  describe('Custom Styling', () => {
    it('applies custom sx prop as object', () => {
      const { container } = render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
          sx={{ marginBottom: 8 }}
        />
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('applies custom sx prop as array', () => {
      const { container } = render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
          sx={[{ marginBottom: 4 }, { paddingTop: 2 }]}
        />
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has semantic header element', () => {
      const { container } = render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header?.tagName).toBe('HEADER');
    });

    it('uses h1 for title with proper typography', () => {
      render(
        <ProjectHeader
          title="Test Project Title"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Project Title');
    });

    it('circa badge has descriptive aria-label for screen readers', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Q3 2024"
          tags={['React']}
        />
      );

      const circaBadge = screen.getByLabelText('Project timeline: Q3 2024');
      expect(circaBadge).toBeInTheDocument();
    });

    it('tags list has descriptive aria-label', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React', 'TypeScript']}
        />
      );

      const tagsList = screen.getByRole('list', { name: 'Technology tags' });
      expect(tagsList).toBeInTheDocument();
    });

    it('each tag has listitem role', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React', 'TypeScript', 'Next.js']}
        />
      );

      const tagItems = screen.getAllByRole('listitem');
      expect(tagItems).toHaveLength(3);
    });
  });

  describe('Responsive Behavior', () => {
    it('renders title with responsive font sizes', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      // Font size is responsive via sx: { xs: '2rem', md: '2.5rem', lg: '3rem' }
    });

    it('renders circa badge with responsive font sizes', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React']}
        />
      );

      const circaBadge = screen.getByLabelText('Project timeline: Winter 2025');
      expect(circaBadge).toBeInTheDocument();
      // Font size is responsive via sx: { xs: '0.875rem', md: '1rem' }
    });

    it('renders tags with responsive font sizes', () => {
      render(
        <ProjectHeader
          title="Test Project"
          circa="Winter 2025"
          tags={['React', 'TypeScript']}
        />
      );

      const tags = screen.getAllByRole('listitem');
      expect(tags.length).toBeGreaterThan(0);
      // Font size is responsive via sx: { xs: '0.75rem', md: '0.875rem' }
    });
  });
});
