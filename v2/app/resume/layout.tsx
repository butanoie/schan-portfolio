import type { Metadata } from "next";
import { PAGE_METADATA, SITE_URL, OG_IMAGE } from "@/src/constants/seo";

/**
 * Metadata for the resume page.
 *
 * Since the resume page component is a client component ("use client"),
 * it cannot export metadata directly. This layout provides metadata
 * for the resume route without requiring the page component to be converted
 * to a server component.
 *
 * Includes page-specific title, description, keywords, OpenGraph tags,
 * and canonical URL for the resume route.
 */
export const metadata: Metadata = {
  title: PAGE_METADATA.resume.title,
  description: PAGE_METADATA.resume.description,
  keywords: PAGE_METADATA.resume.keywords,
  alternates: {
    canonical: `${SITE_URL}/resume`,
  },
  openGraph: {
    title: PAGE_METADATA.resume.title,
    description: PAGE_METADATA.resume.description,
    url: `${SITE_URL}/resume`,
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
 * Layout component for the resume page.
 *
 * Acts as a metadata provider for the client component resume page.
 * The actual resume content is rendered by the page component in this route.
 *
 * @param props - Layout props
 * @param props.children - Resume page content (page.tsx)
 * @returns Layout wrapper with metadata
 */
export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
