import { render, screen } from '@testing-library/react';
import { ProjectTagsContainer } from '../../../components/project/ProjectTags';
import { ThemeContextProvider } from '../../../contexts/ThemeContext';
import { describe, it, expect } from 'vitest';

/**
 * Wrapper providing ThemeContext for ProjectTagsContainer tests.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the theme context
 * @returns The children wrapped with ThemeContextProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}

/**
 * Test suite for ProjectTagsContainer component.
 * Verifies that the component correctly renders tags and circa date chips.
 */
describe('ProjectTagsContainer', () => {
  /**
   * Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(
      <Wrapper>
        <ProjectTagsContainer />
      </Wrapper>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders tags
   */
  it('renders tags', () => {
    const tags = ['React', 'TypeScript', 'MUI'];
    render(
      <Wrapper>
        <ProjectTagsContainer tags={tags} />
      </Wrapper>
    );
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  /**
   * Test: Renders circa chip
   */
  it('renders circa chip', () => {
    const circa = '2022-2023';
    render(
      <Wrapper>
        <ProjectTagsContainer circa={circa} />
      </Wrapper>
    );
    expect(screen.getByText(circa)).toBeInTheDocument();
  });

  /**
   * Test: Renders tags and circa together
   */
  it('renders tags and circa together', () => {
    const tags = ['React', 'TypeScript'];
    const circa = '2022-2023';
    render(
      <Wrapper>
        <ProjectTagsContainer tags={tags} circa={circa} />
      </Wrapper>
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText(circa)).toBeInTheDocument();
  });

  /**
   * Test: Renders empty container when no tags or circa
   */
  it('renders empty container when no tags or circa', () => {
    const { container } = render(
      <Wrapper>
        <ProjectTagsContainer />
      </Wrapper>
    );
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  /**
   * Test: Accepts custom sx prop
   */
  it('accepts custom sx prop for styling', () => {
    const { container } = render(
      <Wrapper>
        <ProjectTagsContainer sx={{ mb: 2 }} />
      </Wrapper>
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders with single tag
   */
  it('renders with single tag', () => {
    const tags = ['React'];
    render(
      <Wrapper>
        <ProjectTagsContainer tags={tags} />
      </Wrapper>
    );
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  /**
   * Test: Renders with empty tags array
   */
  it('renders with empty tags array', () => {
    const { container } = render(
      <Wrapper>
        <ProjectTagsContainer tags={[]} />
      </Wrapper>
    );
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
    render(
      <Wrapper>
        <ProjectTagsContainer tags={tags} />
      </Wrapper>
    );
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
      <Wrapper>
        <ProjectTagsContainer tags={tags} circa={circa} />
      </Wrapper>
    );

    const chips = container.querySelectorAll('.MuiChip-root');
    // First chip should be the circa chip
    expect(chips[0]).toHaveTextContent(circa);
  });
});
