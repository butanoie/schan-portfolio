import type { Metadata } from "next";
import "./globals.css";
import { ThemeContextProvider } from "@/src/contexts/ThemeContext";
import ThemeProvider from "@/src/components/ThemeProvider";
import MainLayout from "@/src/components/common/MainLayout";

export const metadata: Metadata = {
  title: "Sing Chan - Portfolio",
  description:
    "Portfolio of Sing Chan - Product Designer, Developer, and Accessibility Advocate",
};

/**
 * Root layout component that wraps the entire application.
 *
 * Provides theme context, MUI theme provider, and main layout structure for all pages.
 *
 * Features:
 * - ThemeContextProvider: Manages theme state and persistence
 * - EnhancedThemeProvider: Applies MUI theme based on current mode
 * - MainLayout: Global navigation and structure
 *
 * @param props - The component props
 * @param props.children - The page content to be rendered within the layout
 * @returns The complete HTML structure with theme and layout providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>
          <ThemeProvider>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
