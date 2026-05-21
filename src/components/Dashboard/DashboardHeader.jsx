import { useState, useEffect } from "react";
import { ChevronDown, User, Menu } from "lucide-react";
import api from "../../utils/api";

const DEFAULT_MONTH_OPTIONS = ["All"];

function DashboardHeader({
  selectedMonth,
  onMonthChange,
  title,
  monthOptions = DEFAULT_MONTH_OPTIONS,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        if (response.data?.success) {
          setUserName(response.data.data.fullName);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#0f1117] border-b border-white/5">
      {/* Page title with mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar"))}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a1d27] md:hidden cursor-pointer flex items-center justify-center"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
      </div>

      {/* Right side: month picker + avatar */}
      <div className="flex items-center gap-3">
        {/* Month dropdown */}
        <div className="relative">
          <button
            onClick={function () {
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center gap-2 bg-[#1a1d27] text-white text-sm px-3 py-1.5 rounded-lg border border-white/10"
          >
            {selectedMonth}
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Dropdown list */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-[#1a1d27] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
              {monthOptions.map(function (month) {
                const isSelected = month === selectedMonth;
                const itemStyle = isSelected
                  ? "w-full text-left px-4 py-2 text-sm bg-blue-600 text-white"
                  : "w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5";
                return (
                  <button
                    key={month}
                    onClick={function () {
                      onMonthChange(month);
                      setDropdownOpen(false);
                    }}
                    className={itemStyle}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          {userName && <span className="text-sm font-medium text-slate-300">{userName}</span>}
          <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;