// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./auth/ProtectedRoute";

// import Login from "./auth/Login";
// import Register from "./auth/Register";
// import Dashboard from "./components/Dashboard";
// import ExploreComments from "./components/ExploreComments";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/explore" element={<ExploreComments />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./components/Dashboard";
import ThemePage from "./components/ThemePage";
import ClustersPage from "./components/ClustersPage";

export default function App() {
  return (
    <AuthProvider>
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

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
