/**
 * Tests for the ArtifactSection component.
 *
 * Verifies:
 * - Section heading renders as h2
 * - Intro paragraph renders
 * - Artifacts show download button with correct aria-label
 * - Download links have target="_blank" and rel="noopener noreferrer"
 * - Each artifact has exactly one download button
 * - Accessibility: axe-core scan passes
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import ArtifactSection from '@/src/components/samples/ArtifactSection';
import { runAxe } from '../../utils/axe-helpers';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    priority,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

/** Artifact with PDF format. */
const pdfItem = {
  title: 'Product Roadmap — Phase 3',
  description: 'SAFe-formatted roadmap with epics and features.',
  format: { label: 'PDF', href: '/documents/PHASE_3_PRODUCT_ROADMAP.pdf' },
};

/** Artifact with Markdown format. */
const markdownItem = {
  title: 'Gherkin Test Cases — Phase 3 Development',
  description: 'BDD-style acceptance criteria for the core pages phase.',
  format: { label: 'Markdown', href: '/documents/Gherkin_Test_Cases_Phase_3.md' },
};

/** Default section props for testing. */
const defaultProps = {
  heading: 'Defining the Vision',
  intro: 'Product strategy begins with a clear understanding.',
  items: [pdfItem, markdownItem],
};

describe('ArtifactSection', () => {
  it('should render the section heading as h2', () => {
    render(<ArtifactSection {...defaultProps} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Defining the Vision');
  });

  it('should render the intro paragraph', () => {
    render(<ArtifactSection {...defaultProps} />);
    expect(
      screen.getByText('Product strategy begins with a clear understanding.')
    ).toBeInTheDocument();
  });

  it('should render artifact titles as h3 headings', () => {
    render(<ArtifactSection {...defaultProps} />);
    const h3s = screen.getAllByRole('heading', { level: 3 });
    expect(h3s).toHaveLength(2);
    expect(h3s[0]).toHaveTextContent('Product Roadmap — Phase 3');
    expect(h3s[1]).toHaveTextContent('Gherkin Test Cases — Phase 3 Development');
  });

  it('should render artifact descriptions', () => {
    render(<ArtifactSection {...defaultProps} />);
    expect(
      screen.getByText('SAFe-formatted roadmap with epics and features.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('BDD-style acceptance criteria for the core pages phase.')
    ).toBeInTheDocument();
  });

  describe('download buttons', () => {
    it('should render one download button per artifact', () => {
      render(<ArtifactSection {...defaultProps} />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
    });

    it('should render the correct format label on each button', () => {
      render(<ArtifactSection {...defaultProps} />);
      expect(screen.getByText('PDF')).toBeInTheDocument();
      expect(screen.getByText('Markdown')).toBeInTheDocument();
    });

    it('should set target="_blank" and rel="noopener noreferrer" on download links', () => {
      render(<ArtifactSection {...defaultProps} />);
      const links = screen.getAllByRole('link');
      for (const link of links) {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });

    it('should have correct href values on download links', () => {
      render(<ArtifactSection {...defaultProps} />);
      const links = screen.getAllByRole('link');
      const hrefs = links.map((l) => l.getAttribute('href'));
      expect(hrefs).toContain('/documents/PHASE_3_PRODUCT_ROADMAP.pdf');
      expect(hrefs).toContain('/documents/Gherkin_Test_Cases_Phase_3.md');
    });

    it('should have descriptive aria-labels on download links', () => {
      render(<ArtifactSection {...defaultProps} />);
      const links = screen.getAllByRole('link');
      for (const link of links) {
        expect(link).toHaveAttribute('aria-label');
        const label = link.getAttribute('aria-label')!;
        expect(label.length).toBeGreaterThan(0);
      }
    });
  });

  describe('section landmark', () => {
    it('should render as a section element with aria-label', () => {
      render(<ArtifactSection {...defaultProps} />);
      const section = screen.getByRole('region', {
        name: 'Defining the Vision',
      });
      expect(section).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should pass axe accessibility tests', async () => {
      const { container } = render(<ArtifactSection {...defaultProps} />);
      await runAxe(container, {
        rules: {
          // Disable region rule since this is a partial component
          region: { enabled: false },
        },
      });
    });
  });
});
