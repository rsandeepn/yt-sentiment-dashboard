import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./components/Dashboard";
import ThemePage from "./components/ThemePage";
import ClustersPage from "./components/ClustersPage";
import HistoryPage from "./components/HistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          {/* Protected Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Themes page */}
          <Route
            path="/themes"
            element={
              <ProtectedRoute>
                <ThemePage />
              </ProtectedRoute>
            }
          />

          {/* Clusters page */}
          <Route
            path="/clusters"
            element={
              <ProtectedRoute>
                <ClustersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
