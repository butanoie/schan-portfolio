import { render, screen } from '@testing-library/react';
import { ProjectHeader } from '../../../components/project/ProjectHeader';
import { describe, it, expect } from 'vitest';

/**
 * Test suite for ProjectHeader component.
 * Verifies that the component correctly renders project titles only.
 * Tags and dates are now handled by the ProjectDescription component.
 */
describe('ProjectHeader', () => {
  const mockProps = {
    title: 'Mobile App Design',
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
