"use client";

import { createTheme } from "@mui/material/styles";

const sharedTypography = {
  fontFamily: "var(--font-inter), var(--font-geist-sans), Arial, Helvetica, sans-serif",
  h1: {
    fontSize: "3rem",
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontSize: "2.25rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },
  h3: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: "1.125rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.6,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.6,
  },
};

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none" as const,
        fontWeight: 600,
        borderRadius: "0.375rem",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        },
      },
      sizeLarge: {
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
      },
      sizeMedium: {
        padding: "0.5rem 1.25rem",
        fontSize: "0.875rem",
      },
      sizeSmall: {
        padding: "0.375rem 1rem",
        fontSize: "0.8125rem",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "0.75rem",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      light: "#3b82f6",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#7c3aed",
      light: "#8b5cf6",
      dark: "#6d28d9",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#4b5563",
    },
    divider: "#e5e7eb",
  },
  typography: sharedTypography,
  shape: { borderRadius: 8 },
  components: sharedComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
    secondary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    background: {
      default: "#0a0a0a",
      paper: "#141414",
    },
    text: {
      primary: "#f3f4f6",
      secondary: "#9ca3af",
    },
    divider: "#1f2937",
  },
  typography: sharedTypography,
  shape: { borderRadius: 8 },
  components: sharedComponents,
});
