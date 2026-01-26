"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/src/lib/theme";

/**
 * Theme provider component that wraps the application with Material UI theming.
 * Applies the custom theme configuration and CSS baseline for consistent styling.
 *
 * @param props - The component props
 * @param props.children - The application content to be wrapped with theme context
 * @returns The application wrapped with Material UI theme provider and CSS baseline
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
