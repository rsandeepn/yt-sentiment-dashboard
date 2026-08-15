import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Dashboard from "./components/Dashboard";
import ThemePage from "./components/ThemePage";
import ClustersPage from "./components/ClustersPage";
import HistoryPage from "./components/HistoryPage";
import SuggestionsPage from "./components/SuggestionsPage";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import PublicInfoPage from "./pages/PublicInfoPage";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<PublicInfoPage page="about" />} />
        <Route path="/privacy" element={<PublicInfoPage page="privacy" />} />
        <Route path="/terms" element={<PublicInfoPage page="terms" />} />
        <Route path="/contact" element={<PublicInfoPage page="contact" />} />
        <Route path="/analyze" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
        <Route path="/themes" element={<ProtectedPage><ThemePage /></ProtectedPage>} />
        <Route path="/clusters" element={<ProtectedPage><ClustersPage /></ProtectedPage>} />
        <Route path="/history" element={<ProtectedPage><HistoryPage /></ProtectedPage>} />
        <Route path="/suggestions" element={<ProtectedPage><SuggestionsPage /></ProtectedPage>} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
