import { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";

import ProtectedRoute from "../router/ProtectedRoute";
import RoleRoute from "../router/RoleRoute";
import HomeRouter from "../router/HomeRouter";

import FullScreenLoader from "../components/FullScreenLoader";

import AuthLayout from "../pages/auth/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/home/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import DashboardLayout from "../layouts/DashboardLayout";
import AppLayout from "../layouts/AppLayout";

export default function App() {
  const { user, loading } =
    useContext(AuthContext);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<HomeRouter />} />
        {/* AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? (<LoginPage />) : (<Navigate to="/" replace />)}/>

          <Route
            path="/register"
            element={
              !user ? (
                <RegisterPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/forgot-password"
            element={
              <ForgotPasswordPage />
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <ResetPasswordPage />
            }
          />
        </Route>

        {/* USER DASHBOARD */}
        {/* <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? "/"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}