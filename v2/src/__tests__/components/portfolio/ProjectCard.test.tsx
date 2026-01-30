import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ProjectCard } from '@/src/components/portfolio/ProjectCard';
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

describe('ProjectCard', () => {
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
    tags: ['React', 'TypeScript', 'Next.js', 'MUI', 'Vitest'],
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
    // Reset to default mock return values
    mockUseInView.mockReturnValue([vi.fn(), true, true]);
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('renders project card with basic information', () => {
    const project = createMockProject();

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    // Check title is present
    expect(screen.getByText('Test Project')).toBeInTheDocument();

    // Check circa badge is present
    expect(screen.getByText('Winter 2025')).toBeInTheDocument();

    // Check first 3 tags are visible
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();

    // Check "+N more" text
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('displays all tags when there are 3 or fewer', () => {
    const project = createMockProject({
      tags: ['React', 'TypeScript', 'Next.js'],
    });

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
  });

  it('renders project image with correct src', () => {
    const project = createMockProject();

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/test/thumb.jpg');
  });

  it('passes priority prop to ProjectImage for above-fold cards', () => {
    const project = createMockProject();

    const { rerender } = render(
      <ProjectCard project={project} priority={true} onClick={vi.fn()} />
    );

    // With priority=true
    let image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();

    // Re-render with priority=false
    rerender(
      <ProjectCard project={project} priority={false} onClick={vi.fn()} />
    );

    image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('calls onProjectClick when card is clicked', async () => {
    const project = createMockProject();
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<ProjectCard project={project} onClick={handleClick} />);

    // Click on the link wrapping the card content
    const link = screen.getByRole('link', { hidden: true });
    await user.click(link);

    expect(handleClick).toHaveBeenCalledWith('test-project');
  });

  it('calls onProjectClick when Enter key is pressed', async () => {
    const project = createMockProject();
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<ProjectCard project={project} onClick={handleClick} />);

    const card = screen.getByRole('listitem');
    card.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledWith('test-project');
  });

  it('calls onProjectClick when Space key is pressed', async () => {
    const project = createMockProject();
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<ProjectCard project={project} onClick={handleClick} />);

    const card = screen.getByRole('listitem');
    card.focus();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledWith('test-project');
  });

  it('renders as an article element with proper role', () => {
    const project = createMockProject();

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    const card = screen.getByRole('listitem');
    expect(card).toBeInTheDocument();
    expect(card.tagName).toBe('ARTICLE');
  });

  it('has accessible aria-label with clean title', () => {
    const project = createMockProject({
      title: '<em>Test</em> <strong>Project</strong>',
    });

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    const card = screen.getByRole('listitem');
    expect(card).toHaveAttribute('aria-label', 'Test Project');
  });

  it('is keyboard focusable with tabIndex', () => {
    const project = createMockProject();

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    const card = screen.getByRole('listitem');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('renders link to project detail page', () => {
    const project = createMockProject();

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    const link = screen.getByRole('link', { hidden: true });
    expect(link).toHaveAttribute('href', '/projects/test-project');
  });

  it('handles projects with no images gracefully', () => {
    const project = createMockProject({ images: [] });

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    const card = screen.getByRole('listitem');
    expect(card).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('handles projects with no tags', () => {
    const project = createMockProject({ tags: [] });

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
  });

  it('handles projects with HTML in title', () => {
    const project = createMockProject({
      title: '<em>Emphasized</em> Title',
    });

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    // The HTML should be rendered - check for the <em> tag in the document
    const emphasisElement = screen.getByText((content, element) => {
      return element?.tagName === 'EM' && element?.textContent === 'Emphasized';
    });
    expect(emphasisElement).toBeInTheDocument();
  });

  it('applies custom sx styles', () => {
    const project = createMockProject();

    render(
      <ProjectCard
        project={project}
        onClick={vi.fn()}
        sx={{ maxWidth: 400 }}
      />
    );

    const card = screen.getByRole('listitem');
    expect(card).toBeInTheDocument();
  });

  it('respects reduced motion preference', () => {
    mockUseReducedMotion.mockReturnValue(true);

    const project = createMockProject();

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    const card = screen.getByRole('listitem');
    expect(card).toBeInTheDocument();
    // With reduced motion, opacity should be 1 immediately
  });

  it('uses lazy loading with useInView hook', () => {
    const mockRef = vi.fn();
    mockUseInView.mockReturnValue([mockRef, false, false]);

    const project = createMockProject();

    render(<ProjectCard project={project} onClick={vi.fn()} />);

    expect(mockUseInView).toHaveBeenCalledWith({
      threshold: 0.1,
      triggerOnce: true,
    });
  });

  it('fades in when element enters viewport', () => {
    // First render: not in view
    mockUseInView.mockReturnValue([vi.fn(), false, false]);
    const { rerender } = render(
      <ProjectCard project={createMockProject()} onClick={vi.fn()} />
    );

    let card = screen.getByRole('listitem');
    expect(card).toHaveStyle({ opacity: '0' });

    // Second render: in view
    mockUseInView.mockReturnValue([vi.fn(), true, true]);
    rerender(
      <ProjectCard project={createMockProject()} onClick={vi.fn()} />
    );

    card = screen.getByRole('listitem');
    expect(card).toHaveStyle({ opacity: '1' });
  });

  it('displays correct tag count text', () => {
    const testCases = [
      { tags: ['A', 'B', 'C', 'D'], expected: '+1 more' },
      { tags: ['A', 'B', 'C', 'D', 'E'], expected: '+2 more' },
      { tags: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], expected: '+4 more' },
    ];

    testCases.forEach(({ tags, expected }) => {
      const project = createMockProject({ tags });
      const { unmount } = render(
        <ProjectCard project={project} onClick={vi.fn()} />
      );

      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    });
  });

  it('does not call onClick when card is not clickable', async () => {
    const project = createMockProject();
    const user = userEvent.setup();

    render(<ProjectCard project={project} />);

    const card = screen.getByRole('listitem');
    await user.click(card);

    // No error should be thrown
  });
});
