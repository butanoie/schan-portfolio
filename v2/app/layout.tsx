import type { Metadata } from "next";
import "./globals.css";
import { ThemeContextProvider } from "@/src/contexts/ThemeContext";
import { AnimationsContextProvider } from "@/src/contexts/AnimationsContext";
import ThemeProvider from "@/src/components/ThemeProvider";
import MainLayout from "@/src/components/common/MainLayout";
import { LocaleProvider } from "@/src/components/i18n/LocaleProvider";
import LocaleProviderErrorFallback from "@/src/components/i18n/LocaleProviderErrorFallback";
import {
  SITE_METADATA,
  SITE_URL,
  OG_IMAGE,
} from "@/src/constants/seo";
import { getPersonSchema } from "@/src/lib/seo";

/**
 * Comprehensive metadata export for the entire application.
 *
 * Includes:
 * - Basic metadata (title, description, keywords)
 * - OpenGraph tags for social media previews (Facebook, LinkedIn, etc.)
 * - Canonical URL for duplicate content prevention
 * - Robots directives for search engine crawling
 * - metadataBase for automatic canonical URL generation
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  keywords: SITE_METADATA.keywords,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_METADATA.title,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
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
 * Root layout component that wraps the entire application.
 *
 * Provides theme context, animations context, locale/i18n context, MUI theme provider,
 * and main layout structure for all pages.
 *
 * Features:
 * - LocaleProvider: Manages application locale and language
 * - ThemeContextProvider: Manages theme state and persistence
 * - AnimationsContextProvider: Manages animations enabled/disabled state
 * - EnhancedThemeProvider: Applies MUI theme based on current mode
 * - MainLayout: Global navigation and structure
 * - JSON-LD Person schema for search engine understanding of site author
 *
 * @param props - The component props
 * @param props.children - The page content to be rendered within the layout
 * @returns The complete HTML structure with locale, theme, animations, layout providers,
 * and structured data
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate Person schema for author/creator information
  const personSchema = getPersonSchema();

  return (
    <html lang="en">
      <body>
        {/* JSON-LD structured data for Person schema - helps search engines understand site author */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />

        <LocaleProviderErrorFallback>
          <LocaleProvider initialLocale="en">
            <ThemeContextProvider>
              <AnimationsContextProvider>
                <ThemeProvider>
                  <MainLayout>{children}</MainLayout>
                </ThemeProvider>
              </AnimationsContextProvider>
            </ThemeContextProvider>
          </LocaleProvider>
        </LocaleProviderErrorFallback>
      </body>
    </html>
  );
}
