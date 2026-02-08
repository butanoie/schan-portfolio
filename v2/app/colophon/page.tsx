import type { Metadata } from "next";
import { Container } from "@mui/material";
import ColophonContent from "../../src/components/colophon/ColophonContent";
import { PAGE_METADATA, SITE_URL, OG_IMAGE } from "@/src/constants/seo";

/**
 * Metadata for the colophon page.
 *
 * Includes page-specific title, description, keywords, OpenGraph tags,
 * and canonical URL for the colophon route.
 *
 * Uses SEO constants for consistency with site-wide SEO configuration.
 */
export const metadata: Metadata = {
  title: PAGE_METADATA.colophon.title,
  description: PAGE_METADATA.colophon.description,
  keywords: PAGE_METADATA.colophon.keywords,
  alternates: {
    canonical: `${SITE_URL}/colophon`,
  },
  openGraph: {
    title: PAGE_METADATA.colophon.title,
    description: PAGE_METADATA.colophon.description,
    url: `${SITE_URL}/colophon`,
    type: "website",
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
 * Colophon page component.
 *
 * Displays information about the site, including:
 * - About section with intro image, heading, and deck paragraphs
 * - Technologies used to build the portfolio
 * - Design philosophy with color palette and typography
 * - The story of Buta, the portfolio mascot
 *
 * Content is localized via ColophonContent client component.
 *
 * @returns The complete colophon page
 */
export default function ColophonPage() {
  return (
    <Container component="main" role="article" maxWidth="lg">
      <ColophonContent />
    </Container>
  );
}
