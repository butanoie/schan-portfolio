import type { Metadata } from "next";
import "./globals.css";
import { ThemeContextProvider } from "@/src/contexts/ThemeContext";
import { AnimationsContextProvider } from "@/src/contexts/AnimationsContext";
import ThemeProvider from "@/src/components/ThemeProvider";
import MainLayout from "@/src/components/common/MainLayout";
import { LocaleProvider } from "@/src/components/i18n/LocaleProvider";
import LocaleProviderErrorFallback from "@/src/components/i18n/LocaleProviderErrorFallback";

export const metadata: Metadata = {
  title: "Sing Chan - Portfolio",
  description:
    "Portfolio of Sing Chan - Product Designer, Developer, and Accessibility Advocate",
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
 *
 * @param props - The component props
 * @param props.children - The page content to be rendered within the layout
 * @returns The complete HTML structure with locale, theme, animations, and layout providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
