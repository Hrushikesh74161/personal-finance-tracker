import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const HomePage = lazy(() => import("./pages/HomePage"));

export default function Routes() {
  const routes = useRoutes([{
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <ProtectedRoute><HomePage /></ProtectedRoute>,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "transactions",
        // element: <ProtectedRoute><TransactionsPage /></ProtectedRoute>,
      },
    ],
  }])

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      {routes}
    </Suspense>
  );
}