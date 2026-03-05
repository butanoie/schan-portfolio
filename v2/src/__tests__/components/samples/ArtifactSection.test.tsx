/**
 * Tests for the ArtifactSection component.
 *
 * Verifies:
 * - Section heading renders as h2
 * - Intro paragraph renders
 * - Available artifacts show download buttons with correct aria-labels
 * - Coming-soon artifacts show "Coming Soon" chip, no download buttons
 * - Download links have target="_blank" and rel="noopener noreferrer"
 * - PDF-only artifacts show only one download button
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

/** Available artifact with PDF and Markdown formats. */
const availableItem = {
  title: 'Product Roadmap — Phase 3',
  description: 'SAFe-formatted roadmap with epics and features.',
  formats: [
    { label: 'PDF', href: '/documents/PHASE_3_PRODUCT_ROADMAP.pdf' },
    { label: 'Markdown', href: '/documents/PHASE_3_PRODUCT_ROADMAP.md' },
  ],
  available: true,
};

/** PDF-only available artifact. */
const pdfOnlyItem = {
  title: 'Additional Cost Savings Roadmap',
  description: 'Strategic presentation outlining cost optimization.',
  formats: [{ label: 'PDF', href: '/documents/Additional_Cost_Savings_Roadmap.pdf' }],
  available: true,
};

/** Coming-soon artifact with no downloads. */
const comingSoonItem = {
  title: 'Elasticsearch Scale-Down Runbook',
  description: 'Step-by-step operational runbook.',
  formats: [
    { label: 'PDF', href: '/documents/Elasticsearch_Scale_Down_Runbook.pdf' },
    { label: 'Markdown', href: '/documents/Elasticsearch_Scale_Down_Runbook.md' },
  ],
  available: false,
};

/** Default section props for testing. */
const defaultProps = {
  heading: 'Defining the Vision',
  intro: 'Product strategy begins with a clear understanding.',
  items: [availableItem, comingSoonItem],
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
    expect(h3s[1]).toHaveTextContent('Elasticsearch Scale-Down Runbook');
  });

  it('should render artifact descriptions', () => {
    render(<ArtifactSection {...defaultProps} />);
    expect(
      screen.getByText('SAFe-formatted roadmap with epics and features.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Step-by-step operational runbook.')
    ).toBeInTheDocument();
  });

  describe('available artifacts', () => {
    it('should render download buttons for each format', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[availableItem]}
        />
      );
      expect(screen.getByText('PDF')).toBeInTheDocument();
      expect(screen.getByText('Markdown')).toBeInTheDocument();
    });

    it('should set target="_blank" and rel="noopener noreferrer" on download links', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[availableItem]}
        />
      );
      const links = screen.getAllByRole('link');
      for (const link of links) {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });

    it('should have correct href values on download links', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[availableItem]}
        />
      );
      const links = screen.getAllByRole('link');
      const hrefs = links.map((l) => l.getAttribute('href'));
      expect(hrefs).toContain('/documents/PHASE_3_PRODUCT_ROADMAP.pdf');
      expect(hrefs).toContain('/documents/PHASE_3_PRODUCT_ROADMAP.md');
    });

    it('should have descriptive aria-labels on download links', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[availableItem]}
        />
      );
      const links = screen.getAllByRole('link');
      for (const link of links) {
        expect(link).toHaveAttribute('aria-label');
        const label = link.getAttribute('aria-label')!;
        expect(label).toContain('Product Roadmap');
      }
    });

    it('should not show "Coming Soon" chip for available artifacts', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[availableItem]}
        />
      );
      expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
    });
  });

  describe('PDF-only artifacts', () => {
    it('should render only one download button', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[pdfOnlyItem]}
        />
      );
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute(
        'href',
        '/documents/Additional_Cost_Savings_Roadmap.pdf'
      );
    });
  });

  describe('coming-soon artifacts', () => {
    it('should show "Coming Soon" chip', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[comingSoonItem]}
        />
      );
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('should have aria-label on "Coming Soon" chip', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[comingSoonItem]}
        />
      );
      const chip = screen.getByText('Coming Soon').closest('.MuiChip-root');
      expect(chip).toHaveAttribute('aria-label');
      expect(chip!.getAttribute('aria-label')).toContain('Elasticsearch');
      expect(chip!.getAttribute('aria-label')).toContain('Coming Soon');
    });

    it('should not render download buttons for coming-soon artifacts', () => {
      render(
        <ArtifactSection
          heading="Test"
          intro="Intro"
          items={[comingSoonItem]}
        />
      );
      expect(screen.queryAllByRole('link')).toHaveLength(0);
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
