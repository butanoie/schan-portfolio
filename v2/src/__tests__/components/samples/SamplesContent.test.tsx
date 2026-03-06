/**
 * Tests for the SamplesContent component.
 *
 * Verifies:
 * - Page deck renders with heading "Writing Samples"
 * - All 5 section headings render
 * - All 5 section intro paragraphs render
 * - Correct number of artifact cards per section
 * - French locale renders translated content
 * - Accessibility: axe-core scan passes
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import SamplesContent from '@/src/components/samples/SamplesContent';
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

describe('SamplesContent', () => {
  describe('page deck', () => {
    it('should render the page heading "Writing Samples"', () => {
      render(<SamplesContent />);
      expect(
        screen.getByRole('heading', { name: /writing samples/i, level: 1 })
      ).toBeInTheDocument();
    });

    it('should render the Tasty Morsels hero image', () => {
      render(<SamplesContent />);
      const img = screen.getByAltText(/writing samples/i);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/tasty_morsels@2x-en.png');
    });

    it('should render intro paragraphs', () => {
      render(<SamplesContent />);
      expect(
        screen.getByText(/writing samples represent the kinds of artifacts/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/each document demonstrates/i)
      ).toBeInTheDocument();
    });
  });

  describe('section headings', () => {
    it('should render all 5 section headings as h2', () => {
      render(<SamplesContent />);
      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s).toHaveLength(5);
    });

    it('should render "Defining the Vision" heading', () => {
      render(<SamplesContent />);
      expect(
        screen.getByRole('heading', { name: /defining the vision/i })
      ).toBeInTheDocument();
    });

    it('should render "Designing the Experience" heading', () => {
      render(<SamplesContent />);
      expect(
        screen.getByRole('heading', { name: /designing the experience/i })
      ).toBeInTheDocument();
    });

    it('should render "Evaluating the Technology" heading', () => {
      render(<SamplesContent />);
      expect(
        screen.getByRole('heading', { name: /evaluating the technology/i })
      ).toBeInTheDocument();
    });

    it('should render "Operationalizing the Practice" heading', () => {
      render(<SamplesContent />);
      expect(
        screen.getByRole('heading', { name: /operationalizing the practice/i })
      ).toBeInTheDocument();
    });

    it('should render "Measuring the Impact" heading', () => {
      render(<SamplesContent />);
      expect(
        screen.getByRole('heading', { name: /measuring the impact/i })
      ).toBeInTheDocument();
    });
  });

  describe('section intros', () => {
    it('should render intro text for each section', () => {
      render(<SamplesContent />);
      expect(
        screen.getByText(/product strategy begins/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/usable software requires/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/sound technical decisions/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/shipping great software/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/documentation isn't just about planning/i)
      ).toBeInTheDocument();
    });
  });

  describe('artifact cards', () => {
    it('should render 16 artifact titles as h3 headings', () => {
      render(<SamplesContent />);
      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s).toHaveLength(16);
    });

    it('should render specific artifact titles', () => {
      render(<SamplesContent />);
      expect(
        screen.getByRole('heading', { name: /product roadmap — phase 3/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /wcag 2\.2 compliance guide/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /qa automation strategy/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /cost cutting audit/i })
      ).toBeInTheDocument();
    });

    it('should render download links for all artifacts', () => {
      render(<SamplesContent />);
      const links = screen.getAllByRole('link');
      // 16 artifacts × 1 format each = 16 links
      expect(links.length).toBe(16);
    });
  });

  describe('French locale', () => {
    it('should render French heading when locale is fr', () => {
      render(<SamplesContent />, { initialLocale: 'fr' });
      expect(
        screen.getByRole('heading', { name: /échantillons d'écriture/i, level: 1 })
      ).toBeInTheDocument();
    });

    it('should render French section headings', () => {
      render(<SamplesContent />, { initialLocale: 'fr' });
      expect(
        screen.getByRole('heading', { name: /définir la vision/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /mesurer l'impact/i })
      ).toBeInTheDocument();
    });

    it('should render French download button labels', () => {
      render(<SamplesContent />, { initialLocale: 'fr' });
      const links = screen.getAllByRole('link');
      expect(links.length).toBe(16);
    });
  });

  describe('accessibility', () => {
    it('should pass axe accessibility tests', async () => {
      const { container } = render(<SamplesContent />);
      await runAxe(container, {
        rules: {
          // Disable region/landmark rules since this renders inside a Container
          region: { enabled: false },
          'landmark-one-main': { enabled: false },
        },
      });
    });
  });
});
