import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins/400.css"; // Regular weight
import "@fontsource/poppins/700.css"; // Bold weight
import App from "./App.jsx";
import "./index.css";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    primary: {
      main: "#ffffff", // used for variant="contained" or color="primary"
      contrastText: "#030303",
    },
    secondary: {
      main: "#ff6b6b",
      contrastText: "#030303",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
