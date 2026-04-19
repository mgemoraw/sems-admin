// src/routes/ProtectedRoute.tsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import FullScreenLoader from "../components/FullScreenLoader";

export default function ProtectedRoute({ children }: any) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  if (loading) return <FullScreenLoader/>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}