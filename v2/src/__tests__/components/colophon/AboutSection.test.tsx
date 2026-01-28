import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutSection from '../../../components/colophon/AboutSection';
import type { AboutContent } from '../../../types/colophon';

/**
 * Tests for the AboutSection component.
 */
describe('AboutSection', () => {
  const mockContent: AboutContent = {
    name: 'Test User',
    currentRole: 'Software Engineer',
    company: 'Test Company',
    bio: 'A passionate developer.',
    responsibilities: [
      'Building features',
      'Code review',
      'Documentation',
    ],
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/test', icon: 'linkedin' },
      { label: 'GitHub', url: 'https://github.com/test', icon: 'github' },
    ],
  };

  it('should render the section heading', () => {
    render(<AboutSection content={mockContent} />);

    expect(screen.getByRole('heading', { name: /about/i, level: 2 })).toBeInTheDocument();
  });

  it('should render name and role', () => {
    render(<AboutSection content={mockContent} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer at Test Company/)).toBeInTheDocument();
  });

  it('should render bio text', () => {
    render(<AboutSection content={mockContent} />);

    expect(screen.getByText('A passionate developer.')).toBeInTheDocument();
  });

  it('should render responsibilities list', () => {
    render(<AboutSection content={mockContent} />);

    expect(screen.getByText('Building features')).toBeInTheDocument();
    expect(screen.getByText('Code review')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  it('should render social links with proper aria labels', () => {
    render(<AboutSection content={mockContent} />);

    const linkedInLink = screen.getByRole('link', { name: /linkedin.*opens in new tab/i });
    expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/in/test');
    expect(linkedInLink).toHaveAttribute('target', '_blank');
    expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');

    const githubLink = screen.getByRole('link', { name: /github.*opens in new tab/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test');
  });

  it('should have proper accessibility attributes', () => {
    render(<AboutSection content={mockContent} />);

    const section = screen.getByRole('region', { name: /about/i });
    expect(section).toBeInTheDocument();

    const responsibilitiesList = screen.getByRole('list', { name: /responsibilities/i });
    expect(responsibilitiesList).toBeInTheDocument();
  });

  it('should render without links when not provided', () => {
    const contentWithoutLinks: AboutContent = {
      ...mockContent,
      links: undefined,
    };

    render(<AboutSection content={contentWithoutLinks} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render without responsibilities when empty', () => {
    const contentWithoutResponsibilities: AboutContent = {
      ...mockContent,
      responsibilities: [],
    };

    render(<AboutSection content={contentWithoutResponsibilities} />);

    expect(screen.queryByText('Responsibilities')).not.toBeInTheDocument();
  });
});
