"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@/src/hooks/useTheme";
import { getThemeByMode } from "@/src/lib/themes";

/**
 * Enhanced theme provider component that manages dynamic theme switching.
 *
 * Features:
 * - Applies theme from custom theme context
 * - Supports light, dark, and high-contrast modes
 * - Respects system color scheme preferences
 * - Prevents flash of unstyled content (FOUC) during hydration
 * - Applies CSS baseline for consistent styling
 *
 * This component should be used within a ThemeContextProvider.
 *
 * @param props - The component props
 * @param props.children - The application content to be wrapped with theme context
 * @returns The application wrapped with MUI theme provider
 *
 * @example
 * ```tsx
 * <ThemeContextProvider>
 *   <EnhancedThemeProvider>
 *     <App />
 *   </EnhancedThemeProvider>
 * </ThemeContextProvider>
 * ```
 */
export default function EnhancedThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme: themeMode, isMounted } = useTheme();

  // During SSR or before hydration, use light theme to prevent mismatch
  const muiTheme = getThemeByMode(isMounted ? themeMode : "light");

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
