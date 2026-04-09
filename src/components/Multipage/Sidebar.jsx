import { Link } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  BarChart2,
  Sparkles,
  Settings,
  Code2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// These are all the links that appear in the sidebar
const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
  { label: "Wallets", icon: Wallet, path: "/wallets" },
  { label: "Budgets & Goals", icon: Target, path: "/budgets" },
  { label: "Analytics", icon: BarChart2, path: "/analytics" },
  { label: "AI Insights", icon: Sparkles, path: "/aiInsights" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar({ activePage }) {
  // This controls whether the sidebar is wide or narrow
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{ width: collapsed ? "68px" : "190px" }}
      className="flex flex-col h-screen bg-[#0f1117] border-r border-white/5 transition-all duration-300 shrink-0"
    >
      {/* Logo at the top */}
      <div className="flex items-center gap-3 px-4 py-5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <Wallet size={16} className="text-white" />
        </div>
        {collapsed === false && (
          <span className="text-white font-semibold text-sm whitespace-nowrap">
            SpendWise
          </span>
        )}
      </div>

      {/* Navigation links */}
      <div className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map(function (item) {
          const isActive = item.label === activePage;

          const linkStyle = isActive
            ? "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white"
            : "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5";

          return (
            <Link to={item.path} key={item.label} className={linkStyle}>
              <item.icon size={17} className="shrink-0" />
              {collapsed === false && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom buttons */}
      <div className="px-2 pb-4 flex flex-col gap-1">
        {/* Collapse button — clicking it toggles the sidebar width */}
        <button
          onClick={function () {
            setCollapsed(!collapsed);
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 w-full"
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          {collapsed === false && (
            <span className="whitespace-nowrap">Collapse</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
