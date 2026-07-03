import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HomePage from "../pages/home/HomePage";
import Dashboard from "../pages/Dashboard";
import { Navigate } from "react-router-dom";

export default function HomeRouter() {
  const { user } = useContext(AuthContext);

  // 1. If not logged in, show the Guest Home Page
  if (!user) {
    return <HomePage />;
  }

  // 2. If logged in as Admin, redirect them to the Admin dashboard route
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // 3. If logged in as a normal user, show the standard User Dashboard
  return <Dashboard />;
}