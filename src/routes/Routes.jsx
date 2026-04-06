import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Wallets from "../pages/Wallets";
import BudgetsAndGoals from "../pages/BudgetsAndGoals";
import Analytics from "../pages/Analytics";
import AiInsights from "../pages/AiInsights";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import { createBrowserRouter, Navigate } from "react-router-dom";
import { Sidebar } from "lucide-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />, // start from login
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
  },

  {
    path: "/transactions",
    element: <Transactions />,
  },

  {
    path: "/wallets",
    element: <Wallets />,
  },

  {
    path: "/budgets",
    element: <BudgetsAndGoals />,
    Component: Sidebar,
  },

  {
    path: "/analytics",
    element: <Analytics />,
  },

  {
    path: "/aiInsights",
    element: <AiInsights />,
  },

  {
    path: "/settings",
    element: <Settings />,
  },
]);

export default router;
