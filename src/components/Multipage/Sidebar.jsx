import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Target,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  Briefcase,
} from "lucide-react";

import { Link } from "react-router-dom";

const items = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    route: "/dashboard",
  },
  {
    label: "Transactions",
    icon: <ArrowLeftRight size={20} />,
    route: "/transactions",
  },
  { label: "Wallets", icon: <Wallet size={20} />, route: "/wallets" },
  { label: "Budgets & Goals", icon: <Target size={20} />, route: "/budgets" },
  { label: "Analytics", icon: <BarChart3 size={20} />, route: "/analytics" },
  { label: "AI Insights", icon: <Sparkles size={20} />, route: "/aiInsights" },
  { label: "Settings", icon: <Settings size={20} />, route: "/settings" },
];

function Sidebar() {
  const listItems = items.map((item) => (
    <Link to={item.route}>
      <li key={item.label}>
        {item.icon} &nbsp;
        <b>{item.label}</b>
      </li>
    </Link>
  ));

  return (
    <span className="left-board">
      <div className="logo">
        <div className="logo-icon">
          <Wallet size={20} />
        </div>
        <span className="logo-text">SpendWise</span>
      </div>

      <ul className="list-items">{listItems}</ul>

      <div className="sidebar-bottom">
        <div className="collapse-btn">
          <ChevronLeft size={18} /> Collapse
        </div>
      </div>
    </span>
  );
}

export default Sidebar;
