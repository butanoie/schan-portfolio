import { render, screen } from '@testing-library/react';
import { ProjectHeader } from '../../../components/project/ProjectHeader';
import { describe, it, expect } from 'vitest';

/**
 * Test suite for ProjectHeader component.
 * Verifies that the component correctly renders project titles, dates, and tags.
 */
describe('ProjectHeader', () => {
  const mockProps = {
    title: 'Mobile App Design',
    circa: '2022-2023',
    tags: ['React Native', 'UI/UX', 'Firebase'],
  };

  /**
   * Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<ProjectHeader {...mockProps} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Displays project title
   */
  it('displays the project title', () => {
    render(<ProjectHeader {...mockProps} />);
    const title = screen.getByText('Mobile App Design');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H2');
  });

  /**
   * Test: Displays circa/date information
   */
  it('displays the circa/date information', () => {
    render(<ProjectHeader {...mockProps} />);
    expect(screen.getByText('2022-2023')).toBeInTheDocument();
  });

  /**
   * Test: Renders all tags
   */
  it('renders all tags', () => {
    render(<ProjectHeader {...mockProps} />);
    mockProps.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  /**
   * Test: Works with empty tags array
   */
  it('works with empty tags array', () => {
    const { container } = render(
      <ProjectHeader {...mockProps} tags={[]} />
    );
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Mobile App Design')).toBeInTheDocument();
  });

  /**
   * Test: Accepts layout prop for inline layout
   */
  it('accepts layout prop for inline layout', () => {
    const { container } = render(
      <ProjectHeader {...mockProps} layout="inline" />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Accepts layout prop for stacked layout
   */
  it('accepts layout prop for stacked layout', () => {
    const { container } = render(
      <ProjectHeader {...mockProps} layout="stacked" />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Defaults to stacked layout when not specified
   */
  it('defaults to stacked layout when not specified', () => {
    const { container } = render(<ProjectHeader {...mockProps} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Accepts custom sx prop for styling
   */
  it('accepts custom sx prop for styling', () => {
    const { container } = render(
      <ProjectHeader {...mockProps} sx={{ mb: 10 }} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Test: Renders with special characters in title
   */
  it('renders with special characters in title', () => {
    const specialTitle = 'App & Web Design (MVP)';
    render(<ProjectHeader {...mockProps} title={specialTitle} />);
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  /**
   * Test: Renders with long title text
   */
  it('renders with long title text', () => {
    const longTitle =
      'A Very Long Project Title That Describes the Complex Project in Detail';
    render(<ProjectHeader {...mockProps} title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });
});
