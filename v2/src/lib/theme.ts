"use client";

import { createTheme } from "@mui/material/styles";

// Color palette from original design
const theme = createTheme({
  palette: {
    primary: {
      main: "#87CEEB", // Sky Blue
      light: "#B0E0E6", // Lighter blue
      dark: "#4682B4", // Darker blue
      contrastText: "#212121",
    },
    secondary: {
      main: "#C8E6C9", // Duck Egg (pastel green)
      light: "#E8F5E9",
      dark: "#81C784",
      contrastText: "#212121",
    },
    background: {
      default: "#FFF0F5", // Sakura (Cherry Blossom pink)
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C2C2C", // Graphite
      secondary: "#5A5A5A",
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
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Oswald", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Oswald:wght@500;600;700&family=Gochi+Hand&display=swap');
      `,
    },
  },
});

export default theme;
