"use client";

import { createTheme } from "@mui/material/styles";
import { BRAND_COLORS, THEME_COLORS } from "../constants";

/**
 * MUI theme configuration for the portfolio site.
 * Uses centralized color constants from constants/colors.ts.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: THEME_COLORS.primary.main,
      light: THEME_COLORS.primary.light,
      dark: THEME_COLORS.primary.dark,
      contrastText: THEME_COLORS.text.contrast,
    },
    secondary: {
      main: BRAND_COLORS.duckEgg,
      light: THEME_COLORS.secondary.light,
      dark: THEME_COLORS.secondary.dark,
      contrastText: THEME_COLORS.text.contrast,
    },
    background: {
      default: THEME_COLORS.background.default,
      paper: THEME_COLORS.background.paper,
    },
    text: {
      primary: BRAND_COLORS.graphite,
      secondary: THEME_COLORS.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
    h4: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
    h5: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
  },
});

export default theme;
