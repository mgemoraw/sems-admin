import { createBrowserRouter }
from "react-router-dom";

import AuthLayout from
"../pages/auth/AuthLayout";

import LoginPage from
"../pages/auth/LoginPage";

import RegisterPage from "../pages/auth/RegisterPage";

import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

export const router =
createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },

      {
        path: "forgot-password",
        element:
          <ForgotPasswordPage />,
      },

      {
        path:
          "reset-password/:token",
        element:
          <ResetPasswordPage />,
      },
    ],
  },
]);