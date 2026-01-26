import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/src/components/ThemeProvider";
import MainLayout from "@/src/components/MainLayout";

export const metadata: Metadata = {
  title: "Sing Chan - Portfolio",
  description:
    "Portfolio of Sing Chan - Product Designer, Developer, and Accessibility Advocate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
