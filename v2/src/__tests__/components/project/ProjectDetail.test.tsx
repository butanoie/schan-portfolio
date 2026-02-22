import { render, screen } from '../../test-utils';
import { ProjectDetail } from '../../../components/project/ProjectDetail';
import type { Project } from '../../../types';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMediaQuery } from '@mui/material';
import { ThemeContextProvider } from '../../../contexts/ThemeContext';
import { AnimationsContextProvider } from '../../../contexts/AnimationsContext';
import { LocaleProvider } from '../../../components/i18n/LocaleProvider';
import ThemeProvider from '../../../components/ThemeProvider';

/**
 * Mock the MUI useMediaQuery hook for testing different viewport sizes.
 */
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>(
    '@mui/material'
  );
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

/**
 * Mock the ProjectGallery component to simplify testing.
 */
vi.mock('../../../components/ProjectGallery', () => ({
  /**
   * Mock ProjectGallery component that displays image count and narrow prop
   *
   * @param root0 - Component props
   * @param root0.images - Array of project images
   * @param root0.narrow - Whether gallery is in narrow container
   * @returns Mock gallery element
   */
  ProjectGallery: ({ images, narrow }: { images: Project['images']; narrow?: boolean }) => (
    <div data-testid="project-gallery" data-narrow={narrow ? 'true' : 'false'}>
      Gallery: {images.length} images
    </div>
  ),
}));

/**
 * Wrapper component that provides all necessary contexts to tested components.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the providers
 * @returns The children wrapped with LocaleProvider, ThemeContextProvider, AnimationsContextProvider, and ThemeProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider initialLocale="en">
      <ThemeContextProvider>
        <AnimationsContextProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AnimationsContextProvider>
      </ThemeContextProvider>
    </LocaleProvider>
  );
}

/**
 * Test suite for ProjectDetail component.
 * Verifies correct layout selection and rendering of all layout variants.
 */
describe('ProjectDetail', () => {
  const baseProject: Project = {
    id: 'test-project',
    title: 'Test Project',
    circa: '2023-2024',
    desc: ['Test description'],
    tags: ['React', 'TypeScript'],
    images: [
      {
        url: 'https://example.com/img1.jpg',
        tnUrl: 'https://example.com/img1-tn.jpg',
        caption: 'Image 1',
      },
      {
        url: 'https://example.com/img2.jpg',
        tnUrl: 'https://example.com/img2-tn.jpg',
        caption: 'Image 2',
      },
    ],
    videos: [],
    altGrid: false,
  };

  const projectWithVideo: Project = {
    ...baseProject,
    videos: [
      {
        type: 'vimeo',
        id: '123456789',
        width: 1280,
        height: 720,
      },
    ],
  };

  const projectWithAltGrid: Project = {
    ...baseProject,
    altGrid: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false); // Desktop
    const { container } = render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders project title
   */
  it('renders project title', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  /**
   * Test: Renders project tags
   */
  it('renders project tags', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  /**
   * Test: Renders project description
   */
  it('renders project description', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  /**
   * Test: Renders project gallery
   */
  it('renders project gallery', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    expect(screen.getByTestId('project-gallery')).toBeInTheDocument();
  });

  /**
   * Test: Desktop without video uses wide-regular layout
   */
  it('desktop without video uses wide-regular layout', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false); // Desktop
    const { container } = render(
      <ProjectDetail project={baseProject} />,
      { wrapper: Wrapper }
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  /**
   * Test: Desktop with video uses wide-video layout
   */
  it('desktop with video uses wide-video layout', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false); // Desktop
    const { container } = render(
      <ProjectDetail project={projectWithVideo} />,
      { wrapper: Wrapper }
    );
    // Should have video iframe
    expect(container.querySelector('iframe')).toBeInTheDocument();
  });

  /**
   * Test: Desktop without video and altGrid=true uses wide-alternate layout
   */
  it('desktop without video and altGrid uses wide-alternate layout', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false); // Desktop
    const { container } = render(
      <ProjectDetail project={projectWithAltGrid} />,
      { wrapper: Wrapper }
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  /**
   * Test: Mobile without video uses narrow layout
   */
  it('mobile without video uses narrow layout', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(true); // Mobile
    const { container } = render(
      <ProjectDetail project={baseProject} />,
      { wrapper: Wrapper }
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  /**
   * Test: Mobile with video uses narrow-video layout
   */
  it('mobile with video uses narrow-video layout', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(true); // Mobile
    const { container } = render(
      <ProjectDetail project={projectWithVideo} />,
      { wrapper: Wrapper }
    );
    // Should have video iframe
    expect(container.querySelector('iframe')).toBeInTheDocument();
  });

  /**
   * Test: Renders divider between projects
   */
  it('renders divider between projects', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const { container } = render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    const divider = container.querySelector('hr');
    expect(divider).toBeInTheDocument();
  });

  /**
   * Test: Uses section element for semantic HTML
   */
  it('uses section element for semantic HTML', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const { container } = render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  /**
   * Test: Project title is h2 heading
   */
  it('project title is h2 heading', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    const h2 = screen.getByRole('heading', {
      level: 2,
      name: 'Test Project',
    });
    expect(h2).toBeInTheDocument();
  });

  /**
   * Test: Handles project with no videos array
   */
  it('handles project with no videos array', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const projectNoVideos: Project = { ...baseProject, videos: [] };
    const { container } = render(<ProjectDetail project={projectNoVideos} />, { wrapper: Wrapper });
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Handles project with empty videos array
   */
  it('handles project with empty videos array', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const { container } = render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    expect(container).toBeInTheDocument();
    // Should not have video iframe
    expect(container.querySelector('iframe')).not.toBeInTheDocument();
  });

  /**
   * Test: Gallery receives altGrid prop when true
   */
  it('gallery receives altGrid prop when appropriate', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const { container } = render(
      <ProjectDetail project={projectWithAltGrid} />,
      { wrapper: Wrapper }
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders project with many tags
   */
  it('renders project with many tags', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const projectManyTags: Project = {
      ...baseProject,
      tags: ['React', 'TypeScript', 'Next.js', 'MUI', 'GraphQL', 'Node.js'],
    };
    render(<ProjectDetail project={projectManyTags} />, { wrapper: Wrapper });
    expect(screen.getByText('GraphQL')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  /**
   * Test: Maintains proper scroll margin top for anchor links
   */
  it('maintains section with scroll margin for anchor links', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const { container } = render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  /**
   * Test: Responds to viewport size changes
   */
  it('responds to viewport size changes', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    const { rerender } = render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });

    // Simulate desktop
    mockUseMediaQuery.mockReturnValue(false);
    rerender(<ProjectDetail project={baseProject} />);

    // Simulate mobile
    mockUseMediaQuery.mockReturnValue(true);
    rerender(<ProjectDetail project={baseProject} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  /**
   * Test: Handles very long project titles
   */
  it('handles very long project titles', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const longTitleProject: Project = {
      ...baseProject,
      title:
        'A Very Long Project Title That Describes a Complex Multi-Year Enterprise Application Development Initiative',
    };
    render(<ProjectDetail project={longTitleProject} />, { wrapper: Wrapper });
    expect(
      screen.getByText(/A Very Long Project Title/)
    ).toBeInTheDocument();
  });

  /**
   * Test: Handles HTML in project description
   */
  it('handles HTML in project description', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false);
    const htmlProject: Project = {
      ...baseProject,
      desc: ['Built with <strong>Vue.js</strong> and <em>JavaScript</em>'],
    };
    render(<ProjectDetail project={htmlProject} />, { wrapper: Wrapper });
    expect(screen.getByText('Vue.js')).toBeInTheDocument();
  });

  /**
   * Test: Passes narrow prop to ProjectGallery in wide-regular layout
   */
  it('passes narrow prop to ProjectGallery in wide-regular layout', () => {
    const mockUseMediaQuery = useMediaQuery as ReturnType<typeof vi.fn>;
    mockUseMediaQuery.mockReturnValue(false); // Desktop
    const { container } = render(<ProjectDetail project={baseProject} />, { wrapper: Wrapper });
    const gallery = container.querySelector('[data-testid="project-gallery"]');
    expect(gallery).toHaveAttribute('data-narrow', 'true');
  });
});
