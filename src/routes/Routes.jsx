import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Wallets from "../pages/Wallets";
import BudgetsAndGoals from "../pages/BudgetsAndGoals"; 
import Analytics from "../pages/Analytics";
import AiInsights from "../pages/AiInsights";
import Settings from "../pages/Settings";
import { createBrowserRouter, Navigate } from "react-router-dom";

const Routes = createBrowserRouter([{
    path: "/",
    element: <Navigate to="/dashboard" replace/>
},
{
    path:"/dashboard",
    element: Dashboard
},
{
    path:"/transactions",
    element:Transactions,
},

{
    path:"/wallets",
    element:Wallets,
},

{
    path:"/budgets",
    element:BudgetsAndGoals,
},
{
    path:"/analytics",
    element:Analytics
},

{
    path:"/aiInsights",
    element:AiInsights
},

{
    path:"/settings",
    element:Settings
},
]);
export default Routes;