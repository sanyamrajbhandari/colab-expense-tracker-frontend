import { useState } from "react";
import { ChevronDown, User } from "lucide-react";

// The months that appear in the dropdown
const MONTHS = [
  "January 2026",
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
];

function TransactionsHeader({ selectedMonth, onMonthChange }) {
  // Controls if the dropdown list is showing or hidden
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#0f1117] border-b border-white/5">
      {/* Page title on the left */}
      <h1 className="text-white font-semibold text-lg">Transactions</h1>

      {/* Right side: month button + avatar */}
      <div className="flex items-center gap-3">
        {/* Month selector */}
        <div className="relative">
          {/* The button that shows the current month */}
          <button
            onClick={function () {
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center gap-2 bg-[#1a1d27] text-white text-sm px-3 py-1.5 rounded-lg border border-white/10"
          >
            {selectedMonth}
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* The dropdown list — only shows when dropdownOpen is true */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-[#1a1d27] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
              {MONTHS.map(function (month) {
                const isSelected = month === selectedMonth;
                const itemStyle = isSelected
                  ? "w-full text-left px-4 py-2 text-sm bg-blue-600 text-white"
                  : "w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5";

                return (
                  <button
                    key={month}
                    onClick={function () {
                      onMonthChange(month); // Tell the parent which month was picked
                      setDropdownOpen(false); // Close the dropdown
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

        {/* User avatar circle */}
        <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <User size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default TransactionsHeader;
