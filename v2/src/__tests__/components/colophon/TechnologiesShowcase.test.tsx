import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TechnologiesShowcase from '../../../components/colophon/TechnologiesShowcase';
import { ThemeContextProvider } from '../../../contexts/ThemeContext';
import type { TechnologiesContent } from '../../../types/colophon';

/**
 * Wrapper component to provide ThemeContext for testing.
 *
 * @param props - Component props
 * @param props.children - Child elements to render within the context
 * @returns The children wrapped with ThemeContextProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}

/**
 * Tests for the TechnologiesShowcase component.
 */
describe('TechnologiesShowcase', () => {
  const mockContent: TechnologiesContent = {
    intro: 'This site uses the following technologies:',
    v2Categories: [
      {
        label: 'Framework',
        technologies: [
          {
            name: 'Next.js',
            description: 'React framework',
            url: 'https://nextjs.org',
          },
          {
            name: 'React',
            description: 'UI library',
            url: 'https://react.dev',
          },
        ],
      },
      {
        label: 'Styling',
        technologies: [
          {
            name: 'MUI',
            description: 'Component library',
            url: 'https://mui.com',
          },
        ],
      },
    ],
    v1Technologies: [
      {
        name: 'jQuery',
        description: 'JavaScript library',
        url: 'https://jquery.com',
      },
      {
        name: 'PHP',
        description: 'Server-side language',
      },
    ],
  };

  it('should render the section heading', () => {
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByRole('heading', { name: /technologies/i, level: 2 })).toBeInTheDocument();
  });

  it('should render intro text', () => {
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByText('This site uses the following technologies:')).toBeInTheDocument();
  });

  it('should render V2 technology categories', () => {
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByText('Framework')).toBeInTheDocument();
    expect(screen.getByText('Styling')).toBeInTheDocument();
  });

  it('should render V2 technologies with descriptions', () => {
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('React framework')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('UI library')).toBeInTheDocument();
  });

  it('should render technology links when URL is provided', () => {
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    const nextjsLink = screen.getByRole('link', { name: /visit next\.js website/i });
    expect(nextjsLink).toHaveAttribute('href', 'https://nextjs.org');
    expect(nextjsLink).toHaveAttribute('target', '_blank');
  });

  it('should have V1 technologies in an accordion', () => {
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    expect(screen.getByText(/original v1 technologies/i)).toBeInTheDocument();
  });

  it('should expand V1 accordion and show technologies', async () => {
    const user = userEvent.setup();
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    const accordionHeader = screen.getByRole('button', {
      name: /original v1 technologies/i,
    });

    await user.click(accordionHeader);

    expect(screen.getByText('jQuery')).toBeInTheDocument();
    expect(screen.getByText('JavaScript library')).toBeInTheDocument();
    expect(screen.getByText('PHP')).toBeInTheDocument();
    expect(screen.getByText('Server-side language')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    const section = screen.getByRole('region', { name: /technologies/i });
    expect(section).toBeInTheDocument();
  });

  it('should not render link icon when URL is not provided', async () => {
    const user = userEvent.setup();
    render(<TechnologiesShowcase content={mockContent} />, { wrapper: Wrapper });

    // Expand accordion to see PHP
    const accordionHeader = screen.getByRole('button', {
      name: /original v1 technologies/i,
    });
    await user.click(accordionHeader);

    // PHP has no URL, so there should be no link for it
    const phpCard = screen.getByText('PHP').closest('div');
    expect(phpCard?.querySelector('a')).toBeNull();
  });
});
