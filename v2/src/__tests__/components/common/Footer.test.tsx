import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../../../components/common/Footer';

/**
 * Mock Next.js Image component for testing.
 *
 * @param props - Image props
 * @param props.src - Image source URL
 * @param props.alt - Image alt text
 * @returns An img element
 */
vi.mock('next/image', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

/**
 * Mock next/navigation for testing.
 * Returns '/colophon' as the current pathname.
 *
 * @returns Object with usePathname function
 */
vi.mock('next/navigation', () => ({
  // eslint-disable-next-line jsdoc/require-jsdoc
  usePathname: () => '/colophon',
}));

/**
 * Tests for the Footer component.
 *
 * The Footer includes:
 * - Navigation links (Portfolio, Résumé, Colophon)
 * - Buta mascot with thought bubble
 * - Copyright notice
 */
describe('Footer', () => {
  it('should render navigation links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /résumé/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /colophon/i })).toBeInTheDocument();
  });

  it('should render copyright information', () => {
    render(<Footer />);

    expect(screen.getByText(/2013-\d{4} Sing Chan/)).toBeInTheDocument();
    expect(
      screen.getByText(/all trademarks are the property/i)
    ).toBeInTheDocument();
  });

  it('should render the Buta mascot image', () => {
    render(<Footer />);

    const butaImg = screen.getByAltText(/buta.*pig mascot/i);
    expect(butaImg).toBeInTheDocument();
    expect(butaImg).toHaveAttribute('src', '/images/buta/buta@2x.png');
  });

  it('should render the thought bubble', () => {
    render(<Footer />);

    const thoughtBubble = screen.getByRole('img', {
      name: /buta's thought bubble/i,
    });
    expect(thoughtBubble).toBeInTheDocument();
    expect(screen.getByText('Pork products FTW!')).toBeInTheDocument();
  });

  it('should have proper footer navigation accessibility', () => {
    render(<Footer />);

    const footerNav = screen.getByRole('navigation', {
      name: /footer navigation/i,
    });
    expect(footerNav).toBeInTheDocument();
  });

  it('should highlight the active page link', () => {
    render(<Footer />);

    // The mock returns '/colophon' as the pathname
    const colophonLink = screen.getByRole('link', { name: /colophon/i });
    expect(colophonLink).toBeInTheDocument();

    // The active link should have the maroon background color
    // We check that it's a button with the correct styling applied
    expect(colophonLink).toHaveClass('MuiButton-contained');
  });

  it('should render navigation links with correct href attributes', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute(
      'href',
      '/resume'
    );
    expect(screen.getByRole('link', { name: /colophon/i })).toHaveAttribute(
      'href',
      '/colophon'
    );
  });
});
