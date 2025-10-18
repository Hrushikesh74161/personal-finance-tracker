import { Box } from "@mui/material";
import { lazy } from "react";
import { Outlet, useRoutes } from "react-router-dom";
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));

export default function Routes() {
  const routes = useRoutes([{
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        // element: <SignupPage />,
      },
      {
        path: "transactions",
        // element: <ProtectedRoute><TransactionsPage /></ProtectedRoute>,
      },
    ],
  }])
  return <Box sx={{ width: "100%", height: "100%" }}>{routes}</Box>
}