import { render, screen } from '../../test-utils';
import { ProjectsList } from '../../../components/project/ProjectsList';
import type { Project } from '../../../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeContextProvider } from '../../../contexts/ThemeContext';
import { LocaleProvider } from '../../../components/i18n/LocaleProvider';

/**
 * Mock useMediaQuery for consistent testing
 */
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>(
    '@mui/material'
  );
  return {
    ...actual,
    useMediaQuery: vi.fn(() => false),
  };
});

/**
 * Mock ProjectGallery to simplify testing
 */
vi.mock('../../../components/project/ProjectGallery', () => ({
  /**
   * Mock ProjectGallery component
   *
   * @returns Mock gallery element
   */
  ProjectGallery: () => <div data-testid="project-gallery">Gallery</div>,
}));

/**
 * Wrapper component that provides ThemeContext and LocaleProvider to tested components.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the theme context
 * @returns The children wrapped with LocaleProvider and ThemeContextProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider initialLocale="en">
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </LocaleProvider>
  );
}

/**
 * Test suite for ProjectsList component.
 * Verifies that the component correctly renders multiple projects.
 */
describe('ProjectsList', () => {
  /**
   * Creates a mock project for testing
   *
   * @param id - Project ID
   * @param title - Project title
   * @returns Mock project object
   */
  const createMockProject = (id: string, title: string): Project => ({
    id,
    title,
    circa: '2023-2024',
    desc: `<p>Description for ${title}</p>`,
    tags: ['Tag1', 'Tag2'],
    images: [
      {
        url: `https://example.com/${id}-1.jpg`,
        tnUrl: `https://example.com/${id}-1-tn.jpg`,
        caption: `Image 1 of ${title}`,
      },
    ],
    videos: [],
    altGrid: false,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<ProjectsList projects={[]} />, { wrapper: Wrapper });
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders empty list with no projects
   */
  it('renders empty list with no projects', () => {
    const { container } = render(<ProjectsList projects={[]} />, { wrapper: Wrapper });
    const box = container.querySelector('div');
    expect(box).toBeInTheDocument();
  });

  /**
   * Test: Renders single project
   */
  it('renders single project', () => {
    const projects = [createMockProject('project-1', 'Project One')];
    render(<ProjectsList projects={projects} />, { wrapper: Wrapper });
    expect(screen.getByText('Project One')).toBeInTheDocument();
  });

  /**
   * Test: Renders multiple projects
   */
  it('renders multiple projects', () => {
    const projects = [
      createMockProject('project-1', 'Project One'),
      createMockProject('project-2', 'Project Two'),
      createMockProject('project-3', 'Project Three'),
    ];
    render(<ProjectsList projects={projects} />, { wrapper: Wrapper });
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();
    expect(screen.getByText('Project Three')).toBeInTheDocument();
  });

  /**
   * Test: Renders all 18 projects in a large list
   */
  it('renders all 18 projects in a large list', () => {
    const projects = Array.from({ length: 18 }, (_, i) =>
      createMockProject(`project-${i + 1}`, `Project ${i + 1}`)
    );
    render(<ProjectsList projects={projects} />, { wrapper: Wrapper });

    // Verify first and last projects are rendered
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 18')).toBeInTheDocument();
  });

  /**
   * Test: Uses unique key for each project
   */
  it('uses unique key for each project', () => {
    const projects = [
      createMockProject('unique-id-1', 'Project One'),
      createMockProject('unique-id-2', 'Project Two'),
    ];
    render(<ProjectsList projects={projects} />, { wrapper: Wrapper });

    // Both projects should be rendered (keys prevent unmounting)
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();
  });

  /**
   * Test: Renders projects in order
   */
  it('renders projects in the provided order', () => {
    const projects = [
      createMockProject('third', 'Third Project'),
      createMockProject('first', 'First Project'),
      createMockProject('second', 'Second Project'),
    ];
    const { container } = render(<ProjectsList projects={projects} />, { wrapper: Wrapper });

    const headings = container.querySelectorAll('h2');
    expect(headings[0]).toHaveTextContent('Third Project');
    expect(headings[1]).toHaveTextContent('First Project');
    expect(headings[2]).toHaveTextContent('Second Project');
  });

  /**
   * Test: Each project renders in a section element
   */
  it('each project renders in a section element', () => {
    const projects = [
      createMockProject('project-1', 'Project One'),
      createMockProject('project-2', 'Project Two'),
    ];
    const { container } = render(<ProjectsList projects={projects} />, { wrapper: Wrapper });

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBe(2);
  });

  /**
   * Test: Projects with different tags render correctly
   */
  it('projects with different tags render correctly', () => {
    const project1 = createMockProject('p1', 'Project One');
    project1.tags = ['React', 'TypeScript'];

    const project2 = createMockProject('p2', 'Project Two');
    project2.tags = ['Vue', 'JavaScript', 'Tailwind'];

    render(<ProjectsList projects={[project1, project2]} />, { wrapper: Wrapper });
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
  });

  /**
   * Test: Projects with videos render video embeds
   */
  it('projects with videos render video embeds', () => {
    const projectWithVideo = createMockProject('video-project', 'Video Project');
    projectWithVideo.videos = [
      {
        type: 'vimeo',
        id: '123456789',
        width: 1280,
        height: 720,
      },
    ];

    const { container } = render(<ProjectsList projects={[projectWithVideo]} />, { wrapper: Wrapper });
    // Should have iframe for video
    expect(container.querySelector('iframe')).toBeInTheDocument();
  });

  /**
   * Test: Projects with different image counts render correctly
   */
  it('projects with different image counts render correctly', () => {
    const projectFewImages = createMockProject('few', 'Few Images');
    projectFewImages.images = [
      { url: 'img1.jpg', tnUrl: 'img1-tn.jpg', caption: 'Image 1' },
    ];

    const projectManyImages = createMockProject('many', 'Many Images');
    projectManyImages.images = Array.from({ length: 8 }, (_, i) => ({
      url: `img${i + 1}.jpg`,
      tnUrl: `img${i + 1}-tn.jpg`,
      caption: `Image ${i + 1}`,
    }));

    render(<ProjectsList projects={[projectFewImages, projectManyImages]} />, { wrapper: Wrapper });
    expect(screen.getByText('Few Images')).toBeInTheDocument();
    expect(screen.getByText('Many Images')).toBeInTheDocument();
  });

  /**
   * Test: Handles projects with special characters in title
   */
  it('handles projects with special characters in title', () => {
    const specialProject = createMockProject('special', 'App & Web (MVP) v2.0');
    render(<ProjectsList projects={[specialProject]} />, { wrapper: Wrapper });
    expect(screen.getByText('App & Web (MVP) v2.0')).toBeInTheDocument();
  });

  /**
   * Test: Handles very long project descriptions
   */
  it('handles very long project descriptions', () => {
    const longProject = createMockProject('long', 'Long Project');
    longProject.desc = `
      <p>
        This is a very long description with multiple paragraphs.
        It contains extensive information about the project and its features.
        ${Array.from({ length: 10 })
          .map(
            (_, i) =>
              `<p>Paragraph ${i + 1}: Lorem ipsum dolor sit amet.</p>`
          )
          .join('')}
      </p>
    `;
    render(<ProjectsList projects={[longProject]} />, { wrapper: Wrapper });
    expect(screen.getByText('Long Project')).toBeInTheDocument();
  });

  /**
   * Test: Renders gallery component for each project
   */
  it('renders gallery component for each project', () => {
    const projects = [
      createMockProject('project-1', 'Project One'),
      createMockProject('project-2', 'Project Two'),
    ];
    render(<ProjectsList projects={projects} />, { wrapper: Wrapper });

    const galleries = screen.getAllByTestId('project-gallery');
    expect(galleries.length).toBe(2);
  });

  /**
   * Test: Maintains proper spacing between projects
   */
  it('maintains proper spacing between projects', () => {
    const projects = [
      createMockProject('project-1', 'Project One'),
      createMockProject('project-2', 'Project Two'),
    ];
    const { container } = render(<ProjectsList projects={projects} />, { wrapper: Wrapper });

    // Each ProjectDetail has mb: 8 (64px) and a divider
    const dividers = container.querySelectorAll('hr');
    expect(dividers.length).toBe(2); // One divider per project
  });

  /**
   * Test: Handles altGrid flag differences
   */
  it('handles altGrid flag differences', () => {
    const regularProject = createMockProject('regular', 'Regular Grid');
    regularProject.altGrid = false;

    const altProject = createMockProject('alt', 'Alternate Grid');
    altProject.altGrid = true;

    render(<ProjectsList projects={[regularProject, altProject]} />, { wrapper: Wrapper });
    expect(screen.getByText('Regular Grid')).toBeInTheDocument();
    expect(screen.getByText('Alternate Grid')).toBeInTheDocument();
  });

  /**
   * Test: Renders projects with empty images array
   */
  it('renders projects with empty images array', () => {
    const noImageProject = createMockProject('no-images', 'No Images');
    noImageProject.images = [];

    render(<ProjectsList projects={[noImageProject]} />, { wrapper: Wrapper });
    expect(screen.getByText('No Images')).toBeInTheDocument();
  });
});
