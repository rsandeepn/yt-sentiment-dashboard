import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./components/Dashboard";
import ThemePage from "./components/ThemePage";
import ClustersPage from "./components/ClustersPage";
import HistoryPage from "./components/HistoryPage";
import AppLayout from "./layout/AppLayout";

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
          {/* Protected Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedPage><Dashboard /></ProtectedPage>
            }
          />

          {/* Themes page */}
          <Route
            path="/themes"
            element={
              <ProtectedPage><ThemePage /></ProtectedPage>
            }
          />

          {/* Clusters page */}
          <Route
            path="/clusters"
            element={
              <ProtectedPage><ClustersPage /></ProtectedPage>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedPage><HistoryPage /></ProtectedPage>
            }
          />

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
