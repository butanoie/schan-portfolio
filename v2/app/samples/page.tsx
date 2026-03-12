import type { Metadata } from 'next';
import { Container } from '@mui/material';
import SamplesContent from '../../src/components/samples/SamplesContent';
import { PAGE_METADATA, SITE_URL, OG_IMAGE } from '@/src/constants/seo';

/**
 * Metadata for the Writing Samples page.
 *
 * Includes page-specific title, description, keywords, OpenGraph tags,
 * and canonical URL for the /samples route.
 *
 * Uses SEO constants for consistency with site-wide SEO configuration.
 */
export const metadata: Metadata = {
  title: PAGE_METADATA.samples.title,
  description: PAGE_METADATA.samples.description,
  keywords: PAGE_METADATA.samples.keywords,
  alternates: {
    canonical: `${SITE_URL}/samples`,
  },
  openGraph: {
    title: PAGE_METADATA.samples.title,
    description: PAGE_METADATA.samples.description,
    url: `${SITE_URL}/samples`,
    type: 'website',
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },
};

/**
 * Writing Samples page component.
 *
 * Displays professional documentation artifacts organized into five
 * themed sections: product strategy, UX design, technical evaluation,
 * process operations, and cost savings.
 *
 * Content is localized via SamplesContent client component.
 *
 * @returns The complete Writing Samples page
 */
export default function SamplesPage() {
  return (
    <Container component="main" role="article" maxWidth="lg">
      <SamplesContent />
    </Container>
  );
}
