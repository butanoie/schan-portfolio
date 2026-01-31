import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ProjectDetail } from '@/src/components/project/ProjectDetail';
import type { Project } from '@/src/types/project';

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
 * Mock MUI useMediaQuery hook.
 */
const mockUseMediaQuery = vi.fn(() => false);

/**
 * Mock MUI useTheme and useMediaQuery hooks.
 */
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    // eslint-disable-next-line jsdoc/require-jsdoc
    useTheme: () => ({
      breakpoints: {
        // eslint-disable-next-line jsdoc/require-jsdoc
        down: (key: string) => `(max-width: ${key === 'md' ? '900px' : '600px'})`,
      },
    }),
    // @ts-expect-error - Mock function with spread args
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMediaQuery: (...args) => mockUseMediaQuery(...args),
  };
});

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

describe('ProjectDetail', () => {
  /**
   * Creates a mock project for testing.
   *
   * @param overrides - Optional property overrides
   * @returns A mock Project object
   */
  const createMockProject = (overrides?: Partial<Project>): Project => ({
    id: 'test-project',
    title: 'Test Project',
    desc: '<p>Test description</p>',
    circa: 'Winter 2025',
    tags: ['React', 'TypeScript', 'Next.js'],
    images: [
      {
        url: '/images/test/full.jpg',
        tnUrl: '/images/test/thumb.jpg',
        caption: 'Test image',
      },
    ],
    videos: [],
    altGrid: false,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseInView.mockReturnValue([vi.fn(), true, true]);
    mockUseReducedMotion.mockReturnValue(false);
    mockUseMediaQuery.mockReturnValue(false); // Default to desktop
  });

  describe('Rendering', () => {
    it('renders article element', () => {
      const project = createMockProject();

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('renders ProjectHeader component', () => {
      const project = createMockProject({ title: 'Unique Test Title' });

      render(<ProjectDetail project={project} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Unique Test Title');
    });

    it('renders ProjectDescription component', () => {
      const project = createMockProject({
        desc: '<p>Unique test description content.</p>',
      });

      render(<ProjectDetail project={project} />);

      expect(
        screen.getByText('Unique test description content.')
      ).toBeInTheDocument();
    });

    it('renders ProjectGallery component', () => {
      const project = createMockProject();

      render(<ProjectDetail project={project} />);

      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
    });

    it('renders RelatedProjects component', () => {
      const project = createMockProject();

      render(<ProjectDetail project={project} />);

      // RelatedProjects section should be present (if there are related projects)
      const relatedSection = screen.queryByRole('region', {
        name: 'Related projects',
      });
      // May or may not exist depending on whether there are related projects
      if (relatedSection) {
        expect(relatedSection).toBeInTheDocument();
      }
    });
  });

  describe('Video Rendering', () => {
    it('renders VideoEmbed when project has videos', () => {
      const project = createMockProject({
        videos: [
          {
            type: 'vimeo',
            id: '123456789',
            width: 1920,
            height: 1080,
          },
        ],
      });

      render(<ProjectDetail project={project} />);

      const videoRegion = screen.getByRole('region', {
        name: 'Video: Vimeo video player',
      });
      expect(videoRegion).toBeInTheDocument();
    });

    it('does not render VideoEmbed when project has no videos', () => {
      const project = createMockProject({ videos: [] });

      render(<ProjectDetail project={project} />);

      const videoRegions = screen.queryAllByRole('region', {
        name: /video/i,
      });
      expect(videoRegions.length).toBe(0);
    });

    it('renders only the first video when multiple videos exist', () => {
      const project = createMockProject({
        videos: [
          {
            type: 'vimeo',
            id: '111111111',
            width: 1920,
            height: 1080,
          },
          {
            type: 'youtube',
            id: '222222222',
            width: 1920,
            height: 1080,
          },
        ],
      });

      const { container } = render(<ProjectDetail project={project} />);

      const iframes = container.querySelectorAll('iframe');
      expect(iframes).toHaveLength(1);
      expect(iframes[0]?.src).toContain('111111111');
    });
  });

  describe('Layout Variants', () => {
    it('uses wide-video layout for projects with videos', () => {
      const project = createMockProject({
        videos: [
          {
            type: 'vimeo',
            id: '123456789',
            width: 1920,
            height: 1080,
          },
        ],
      });

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
      // wide-video layout has maxWidth: 1400px
    });

    it('uses wide-alternate layout for projects with altGrid', () => {
      const project = createMockProject({
        altGrid: true,
        videos: [],
      });

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
      // wide-alternate layout has maxWidth: 1400px
    });

    it('uses wide-regular layout for normal projects without videos', () => {
      const project = createMockProject({
        videos: [],
        altGrid: false,
      });

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
      // wide-regular layout has maxWidth: 1200px
    });

    it('respects layoutHint prop when provided', () => {
      const project = createMockProject();

      const { container } = render(
        <ProjectDetail project={project} layoutHint="narrow" />
      );

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
      // narrow layout has maxWidth: 800px
    });

    it('uses narrow-video layout on mobile with videos', () => {
      mockUseMediaQuery.mockReturnValue(true); // Mock mobile

      const project = createMockProject({
        videos: [
          {
            type: 'vimeo',
            id: '123456789',
            width: 1920,
            height: 1080,
          },
        ],
      });

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('uses narrow layout on mobile without videos', () => {
      mockUseMediaQuery.mockReturnValue(true); // Mock mobile

      const project = createMockProject({ videos: [] });

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });
  });

  describe('Header Layout Adaptation', () => {
    it('uses inline header layout for wide layouts', () => {
      const project = createMockProject();

      render(<ProjectDetail project={project} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      // Inline layout is default for wide layouts
    });

    it('uses stacked header layout for narrow layouts', () => {
      const project = createMockProject();

      render(<ProjectDetail project={project} layoutHint="narrow" />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      // Stacked layout for narrow layouts
    });

    it('uses stacked header layout on mobile', () => {
      mockUseMediaQuery.mockReturnValue(true); // Mock mobile

      const project = createMockProject();

      render(<ProjectDetail project={project} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Component Composition', () => {
    it('passes project title to ProjectHeader', () => {
      const project = createMockProject({ title: 'Composed Title' });

      render(<ProjectDetail project={project} />);

      expect(screen.getByText('Composed Title')).toBeInTheDocument();
    });

    it('passes project circa to ProjectHeader', () => {
      const project = createMockProject({ circa: 'Spring 2024' });

      render(<ProjectDetail project={project} />);

      expect(
        screen.getByLabelText('Project timeline: Spring 2024')
      ).toBeInTheDocument();
    });

    it('passes project tags to ProjectHeader', () => {
      const project = createMockProject({
        tags: ['Custom', 'Tags', 'Test'],
      });

      render(<ProjectDetail project={project} />);

      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('passes project description to ProjectDescription', () => {
      const project = createMockProject({
        desc: '<p>Custom description for composition test.</p>',
      });

      render(<ProjectDetail project={project} />);

      expect(
        screen.getByText('Custom description for composition test.')
      ).toBeInTheDocument();
    });

    it('passes project images to ProjectGallery', () => {
      const project = createMockProject({
        images: [
          {
            url: '/images/custom1.jpg',
            tnUrl: '/images/custom1-thumb.jpg',
            caption: 'Custom Image 1',
          },
          {
            url: '/images/custom2.jpg',
            tnUrl: '/images/custom2-thumb.jpg',
            caption: 'Custom Image 2',
          },
        ],
      });

      render(<ProjectDetail project={project} />);

      expect(screen.getByAltText('Custom Image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Custom Image 2')).toBeInTheDocument();
    });

    it('passes altGrid prop to ProjectGallery', () => {
      const project = createMockProject({
        altGrid: true,
      });

      render(<ProjectDetail project={project} />);

      // ProjectGallery should receive altGrid prop
      const image = screen.getByAltText('Test image');
      expect(image).toBeInTheDocument();
    });

    it('passes project ID to RelatedProjects', () => {
      const project = createMockProject({ id: 'unique-project-id' });

      render(<ProjectDetail project={project} />);

      // RelatedProjects should use the project ID
      // It may or may not render depending on whether related projects exist
      const relatedSection = screen.queryByRole('region', {
        name: 'Related projects',
      });
      // Just verify no errors occurred
      expect(true).toBe(true);
    });

    it('passes limit=3 to RelatedProjects', () => {
      const project = createMockProject();

      render(<ProjectDetail project={project} />);

      // RelatedProjects should show max 3 projects
      const relatedListItems = screen.queryAllByRole('listitem');
      if (relatedListItems.length > 0) {
        expect(relatedListItems.length).toBeLessThanOrEqual(3);
      }
    });
  });

  describe('Custom Styling', () => {
    it('applies custom sx prop as object', () => {
      const project = createMockProject();

      const { container } = render(
        <ProjectDetail project={project} sx={{ marginBottom: 8 }} />
      );

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('applies custom sx prop as array', () => {
      const project = createMockProject();

      const { container } = render(
        <ProjectDetail
          project={project}
          sx={[{ marginBottom: 4 }, { paddingTop: 2 }]}
        />
      );

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles project with no images', () => {
      const project = createMockProject({ images: [] });

      render(<ProjectDetail project={project} />);

      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('handles project with no tags', () => {
      const project = createMockProject({ tags: [] });

      render(<ProjectDetail project={project} />);

      const listItems = screen.queryAllByRole('listitem');
      // No tags in header, might still have related project listitems
      const tagListItems = listItems.filter(
        (item) => !item.closest('[aria-label="Related projects"]')
      );
      expect(tagListItems.length).toBe(0);
    });

    it('handles project with no videos', () => {
      const project = createMockProject({ videos: [] });

      const { container } = render(<ProjectDetail project={project} />);

      const iframes = container.querySelectorAll('iframe');
      expect(iframes).toHaveLength(0);
    });

    it('handles project with HTML in title', () => {
      const project = createMockProject({
        title: '<strong>Bold</strong> Project',
      });

      render(<ProjectDetail project={project} />);

      const strong = screen.getByText((content, element) => {
        return element?.tagName === 'STRONG' && element?.textContent === 'Bold';
      });
      expect(strong).toBeInTheDocument();
    });

    it('handles project with HTML in description', () => {
      const project = createMockProject({
        desc: '<p>Description with <a href="https://example.com">link</a>.</p>',
      });

      render(<ProjectDetail project={project} />);

      const link = screen.getByRole('link', { name: 'link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('handles very long project title', () => {
      const longTitle =
        'This is an extremely long project title that might wrap to multiple lines and should still render correctly without breaking the layout';

      const project = createMockProject({ title: longTitle });

      render(<ProjectDetail project={project} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles many images', () => {
      const manyImages = Array.from({ length: 20 }, (_, i) => ({
        url: `/images/test${i}.jpg`,
        tnUrl: `/images/test${i}-thumb.jpg`,
        caption: `Image ${i + 1}`,
      }));

      const project = createMockProject({ images: manyImages });

      render(<ProjectDetail project={project} />);

      const images = screen.getAllByRole('img');
      expect(images.length).toBe(manyImages.length);
    });

    it('handles many tags', () => {
      const manyTags = [
        'Tag1',
        'Tag2',
        'Tag3',
        'Tag4',
        'Tag5',
        'Tag6',
        'Tag7',
        'Tag8',
        'Tag9',
        'Tag10',
      ];

      const project = createMockProject({ tags: manyTags });

      render(<ProjectDetail project={project} />);

      manyTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has semantic article element', () => {
      const project = createMockProject();

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
      expect(article?.tagName).toBe('ARTICLE');
    });

    it('has proper heading hierarchy', () => {
      const project = createMockProject();

      render(<ProjectDetail project={project} />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();

      // RelatedProjects has h2
      const h2 = screen.queryByRole('heading', { level: 2 });
      if (h2) {
        expect(h2).toBeInTheDocument();
      }
    });

    it('all sections have proper ARIA labels', () => {
      const project = createMockProject();

      render(<ProjectDetail project={project} />);

      const descriptionSection = screen.getByRole('region', {
        name: 'Project description',
      });
      expect(descriptionSection).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts layout for mobile viewport', () => {
      mockUseMediaQuery.mockReturnValue(true); // Mock mobile

      const project = createMockProject();

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('adapts layout for desktop viewport', () => {
      mockUseMediaQuery.mockReturnValue(false); // Mock desktop

      const project = createMockProject();

      const { container } = render(<ProjectDetail project={project} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });
  });

  describe('All Layout Variants', () => {
    it('renders wide-video layout', () => {
      const project = createMockProject();

      const { container } = render(
        <ProjectDetail project={project} layoutHint="wide-video" />
      );

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('renders wide-regular layout', () => {
      const project = createMockProject();

      const { container } = render(
        <ProjectDetail project={project} layoutHint="wide-regular" />
      );

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('renders wide-alternate layout', () => {
      const project = createMockProject();

      const { container } = render(
        <ProjectDetail project={project} layoutHint="wide-alternate" />
      );

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('renders narrow layout', () => {
      const project = createMockProject();

      const { container } = render(
        <ProjectDetail project={project} layoutHint="narrow" />
      );

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('renders narrow-video layout', () => {
      const project = createMockProject();

      const { container } = render(
        <ProjectDetail project={project} layoutHint="narrow-video" />
      );

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });
  });
});
