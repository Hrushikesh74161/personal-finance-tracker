import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AccountsPage = lazy(() => import("./pages/AccountsPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const RegularPaymentsPage = lazy(() => import("./pages/RegularPaymentsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

export default function Routes() {
  const routes = useRoutes([
    // Public routes (no layout)
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    // Protected routes with layout
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "accounts",
          element: <AccountsPage />,
        },
        {
          path: "transactions",
          element: <TransactionsPage />,
        },
        {
          path: "budgets",
          element: <BudgetPage />,
        },
        {
          path: "categories",
          element: <CategoriesPage />,
        },
        {
          path: "reports",
          element: <ReportsPage />,
        },
        {
          path: "regular-payments",
          element: <RegularPaymentsPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
      ],
    },
  ])

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