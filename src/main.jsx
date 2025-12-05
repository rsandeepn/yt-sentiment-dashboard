import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext";
import { AnalysisProvider } from "./context/AnalysisContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AnalysisProvider>
        <App />
      </AnalysisProvider>
    </AuthProvider>
  </StrictMode>
);
