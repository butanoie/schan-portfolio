import { render, screen } from '@testing-library/react';
import { ProjectTagsContainer } from '../../../components/project/ProjectTags';
import { describe, it, expect } from 'vitest';

/**
 * Test suite for ProjectTagsContainer component.
 * Verifies that the component correctly renders tags and circa date chips.
 */
describe('ProjectTagsContainer', () => {
  /**
   * Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<ProjectTagsContainer />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders tags
   */
  it('renders tags', () => {
    const tags = ['React', 'TypeScript', 'MUI'];
    render(<ProjectTagsContainer tags={tags} />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  /**
   * Test: Renders circa chip
   */
  it('renders circa chip', () => {
    const circa = '2022-2023';
    render(<ProjectTagsContainer circa={circa} />);
    expect(screen.getByText(circa)).toBeInTheDocument();
  });

  /**
   * Test: Renders tags and circa together
   */
  it('renders tags and circa together', () => {
    const tags = ['React', 'TypeScript'];
    const circa = '2022-2023';
    render(<ProjectTagsContainer tags={tags} circa={circa} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText(circa)).toBeInTheDocument();
  });

  /**
   * Test: Renders empty container when no tags or circa
   */
  it('renders empty container when no tags or circa', () => {
    const { container } = render(<ProjectTagsContainer />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  /**
   * Test: Accepts custom sx prop
   */
  it('accepts custom sx prop for styling', () => {
    const { container } = render(<ProjectTagsContainer sx={{ mb: 2 }} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders with single tag
   */
  it('renders with single tag', () => {
    const tags = ['React'];
    render(<ProjectTagsContainer tags={tags} />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  /**
   * Test: Renders with empty tags array
   */
  it('renders with empty tags array', () => {
    const { container } = render(<ProjectTagsContainer tags={[]} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders with many tags
   */
  it('renders with many tags', () => {
    const tags = [
      'React',
      'TypeScript',
      'MUI',
      'Node.js',
      'PostgreSQL',
      'Docker',
    ];
    render(<ProjectTagsContainer tags={tags} />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  /**
   * Test: Circa appears before tags in render order
   */
  it('renders circa chip before tag chips', () => {
    const tags = ['React', 'TypeScript'];
    const circa = '2022-2023';
    const { container } = render(
      <ProjectTagsContainer tags={tags} circa={circa} />
    );

    const chips = container.querySelectorAll('.MuiChip-root');
    // First chip should be the circa chip
    expect(chips[0]).toHaveTextContent(circa);
  });
});
