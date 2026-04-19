import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../routes/ProtectedRoute";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RoleRoute from "../routes/RoleRoute";
import FullScreenLoader from "../components/FullScreenLoader";

export default function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <FullScreenLoader/>;

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route
          path="/login"
          element={!user ? <Auth /> : <Navigate to="/" />}
        />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* EXAMPLE RBAC ROUTE (ADMIN ONLY) */}
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["admin"]}>
              <div>Admin Panel</div>
            </RoleRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

// export default function App() {
//   const { user } = useContext(AuthContext);

//   return user ? <Dashboard /> : <Auth />;
// }