import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext";
import { AnalysisProvider } from "./context/AnalysisContext";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#e6213c", dark: "#c51630", contrastText: "#ffffff" },
    secondary: { main: "#18181b" },
    success: { main: "#168a45" },
    warning: { main: "#d97706" },
    error: { main: "#d92d45" },
    background: { default: "#f6f6f4", paper: "#ffffff" },
    text: { primary: "#18181b", secondary: "#68686f" },
    divider: "#e7e7e4",
  },
  typography: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 750, lineHeight: 1.04, letterSpacing: "-0.055em" },
    h2: { fontSize: "clamp(2rem, 3.6vw, 3.25rem)", fontWeight: 740, lineHeight: 1.08, letterSpacing: "-0.045em" },
    h3: { fontSize: "clamp(1.65rem, 2.5vw, 2.25rem)", fontWeight: 720, lineHeight: 1.15, letterSpacing: "-0.035em" },
    h4: { fontSize: "1.55rem", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.025em" },
    h5: { fontSize: "1.2rem", fontWeight: 680, lineHeight: 1.3, letterSpacing: "-0.015em" },
    h6: { fontSize: "1rem", fontWeight: 680, lineHeight: 1.4 },
    button: { fontWeight: 650, textTransform: "none", letterSpacing: "-0.01em" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, padding: "10px 18px" },
        containedPrimary: { boxShadow: "0 6px 18px rgba(230, 33, 60, 0.2)" },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: "none", border: "1px solid #e7e7e4" } },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { backgroundColor: "#ffffff", borderRadius: 10 } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 650 } } },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AnalysisProvider>
          <App />
        </AnalysisProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
