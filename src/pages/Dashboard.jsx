import { useState, useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";
import axios from "axios";

// Import chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

import Sidebar from "../components/Multipage/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import AddTransactionModal from "../components/Dashboard/AddTransactionModal";
import { FaPen, FaTrash } from "react-icons/fa";

// ── Register all chart.js parts we need ──
// Without this, the charts won't work
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// ── Category badge colors ──
const CATEGORY_COLORS = {
  "Food & Dining": "text-orange-400",
  Income: "text-green-400",
  Transportation: "text-blue-400",
  Entertainment: "text-purple-400",
  Shopping: "text-pink-400",
};

function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("March 2026");
  const [currentPage, setCurrentPage] = useState(1);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  // ── Chart data state ──
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [donutChartData, setDonutChartData] = useState(null);

  const handleEditClick = (tx) => {
    setTransactionToEdit(tx);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (tx) => {
    try {
      const txId = tx._id || tx.id;
      if (!txId) return;
      await axios.delete(`http://localhost:5000/api/transactions/${txId}`);
      setRecentTransactions((prev) => prev.filter((item) => item !== tx));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEditSubmit = async (updatedTx) => {
    try {
      const txId = updatedTx._id || updatedTx.id;
      if (!txId) return;

      const response = await axios.put(
        `http://localhost:5000/api/transactions/${txId}`,
        updatedTx,
      );
      let savedTx = updatedTx;
      if (response.data && response.data.data) {
        savedTx = response.data.data;
      }

      const isIncome = savedTx.type === "income";
      let iconBg = "bg-gray-500";
      if (isIncome) iconBg = "bg-green-500";
      else if (savedTx.category === "Food & Dining") iconBg = "bg-orange-500";
      else if (savedTx.category === "Transportation") iconBg = "bg-teal-500";
      else if (savedTx.category === "Entertainment") iconBg = "bg-red-500";
      else if (savedTx.category === "Shopping") iconBg = "bg-pink-500";
      else if (savedTx.category === "Bills & Utilities") iconBg = "bg-blue-500";

      const formattedTx = {
        ...savedTx,
        wallet: savedTx.paymentMethod,
        subtitle:
          savedTx.displayDate ||
          new Date(savedTx.date).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        iconBg,
        initials: savedTx.title
          .split(" ")
          .map((w) => w[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
      };

      setRecentTransactions((prev) => {
        const newList = prev.map((item) =>
          (item.id || item._id) === txId ? formattedTx : item,
        );
        return newList.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // ── Fetch recent transactions from backend ──
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/recent",
        );
        if (response.data.success) {
          const formattedTransactions = response.data.data.map((tx) => {
            const isIncome = tx.type === "income";
            let iconBg = "bg-gray-500";
            if (isIncome) iconBg = "bg-green-500";
            else if (tx.category === "Food & Dining") iconBg = "bg-orange-500";
            else if (tx.category === "Transportation") iconBg = "bg-teal-500";
            else if (tx.category === "Entertainment") iconBg = "bg-red-500";
            else if (tx.category === "Shopping") iconBg = "bg-pink-500";
            else if (tx.category === "Bills & Utilities")
              iconBg = "bg-blue-500";

            return {
              ...tx,
              wallet: tx.paymentMethod,
              subtitle:
                tx.displayDate ||
                new Date(tx.date).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }),
              iconBg,
              initials: tx.title
                .split(" ")
                .map((w) => w[0])
                .join("")
                .substring(0, 2)
                .toUpperCase(),
            };
          });
          setRecentTransactions(formattedTransactions);

          // ── Build chart data from the transactions ──
          buildChartData(formattedTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // ── This function takes transactions and builds all 3 chart datasets ──
  function buildChartData(transactions) {
    // ── 1. LINE CHART — Income vs Expense over last 6 months ──
    // Get last 6 month names (e.g. ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"])
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(d.toLocaleString("en-US", { month: "short" }));
    }

    // Add up income and expense per month
    const incomeByMonth = {};
    const expenseByMonth = {};
    months.forEach((m) => {
      incomeByMonth[m] = 0;
      expenseByMonth[m] = 0;
    });

    transactions.forEach((tx) => {
      const monthLabel = new Date(tx.date).toLocaleString("en-US", {
        month: "short",
      });
      if (months.includes(monthLabel)) {
        if (tx.type === "income") {
          incomeByMonth[monthLabel] =
            (incomeByMonth[monthLabel] || 0) + tx.amount;
        } else {
          expenseByMonth[monthLabel] =
            (expenseByMonth[monthLabel] || 0) + tx.amount;
        }
      }
    });

    setLineChartData({
      labels: months,
      datasets: [
        {
          label: "Income",
          data: months.map((m) => incomeByMonth[m]),
          borderColor: "#4ade80", // green line
          backgroundColor: "rgba(74, 222, 128, 0.1)",
          tension: 0.4, // makes the line curved
          fill: true,
          pointRadius: 3,
        },
        {
          label: "Expense",
          data: months.map((m) => expenseByMonth[m]),
          borderColor: "#f87171", // red line
          backgroundColor: "rgba(248, 113, 113, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 3,
        },
      ],
    });

    // ── 2. BAR CHART — This month's income vs expense ──
    const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
    let thisMonthIncome = 0;
    let thisMonthExpense = 0;

    transactions.forEach((tx) => {
      const txMonth = new Date(tx.date).toLocaleString("en-US", {
        month: "short",
      });
      if (txMonth === currentMonth) {
        if (tx.type === "income") thisMonthIncome += tx.amount;
        else thisMonthExpense += tx.amount;
      }
    });

    setBarChartData({
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [thisMonthIncome, thisMonthExpense],
          backgroundColor: ["#3b82f6", "#60a5fa"], // two shades of blue
          borderRadius: 6, // rounded bar tops
          borderSkipped: false,
        },
      ],
    });

    // ── 3. DONUT CHART — Spending breakdown by category ──
    const categoryTotals = {};
    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        categoryTotals[tx.category] =
          (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const categoryLabels = Object.keys(categoryTotals);
    const categoryValues = Object.values(categoryTotals);

    // One color per category
    const donutColors = [
      "#f97316", // orange
      "#a855f7", // purple
      "#3b82f6", // blue
      "#ec4899", // pink
      "#14b8a6", // teal
      "#eab308", // yellow
      "#ef4444", // red
    ];

    setDonutChartData({
      labels: categoryLabels,
      datasets: [
        {
          data: categoryValues,
          backgroundColor: donutColors.slice(0, categoryLabels.length),
          borderWidth: 0, // no border between slices
          hoverOffset: 6, // slices pop out slightly on hover
        },
      ],
    });
  }

  // ── Shared chart options to make them look dark and clean ──

  // Options for the Line chart
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // we use our own legend below the chart
      tooltip: {
        backgroundColor: "#1a1d27",
        titleColor: "#fff",
        bodyColor: "#9ca3af",
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#6b7280", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  // Options for the Bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1a1d27",
        titleColor: "#fff",
        bodyColor: "#9ca3af",
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280", font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#6b7280", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  // Options for the Donut chart
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
          font: { size: 10 },
          padding: 10,
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "#1a1d27",
        titleColor: "#fff",
        bodyColor: "#9ca3af",
      },
    },
  };

  // Pagination
  const transactionsPerPage = 6;
  const totalPages =
    Math.ceil(recentTransactions.length / transactionsPerPage) || 1;
  const visibleTransactions = recentTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage,
  );

  return (
    <div className="flex h-screen bg-[#0b0d14] text-white overflow-hidden">
      {/* ── Sidebar ── */}
      <Sidebar activePage="Dashboard" />

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Dashboard"
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <div className="flex-1 overflow-auto p-6 flex flex-col gap-5">
          {/* ── Net Worth Card ── */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6">
            <p className="text-blue-100 text-xs font-medium mb-1">
              Total Net Worth
            </p>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-white text-3xl font-bold">$2,450</h2>
              <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                +12.5%
              </span>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-blue-200 text-xs mb-0.5">Income</p>
                <p className="text-white font-semibold text-sm">$6,550</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs mb-0.5">Expense</p>
                <p className="text-white font-semibold text-sm">$4,100</p>
              </div>
            </div>
          </div>

          {/* ── Three Chart Cards ── */}
          <div className="grid grid-cols-3 gap-5">
            {/* Chart 1: Line Chart — Income vs Expense Trend */}
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
              <p className="text-white text-sm font-medium mb-4">
                Income vs Expense Trend
              </p>
              {/* Chart renders here — height is controlled by the div */}
              <div className="w-full h-36">
                {lineChartData ? (
                  <Line data={lineChartData} options={lineOptions} />
                ) : (
                  // Show a loading message until data arrives
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-600 text-xs">Loading...</p>
                  </div>
                )}
              </div>
              {/* Legend below the chart */}
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-3 h-0.5 bg-green-400 inline-block rounded"></span>
                  Income
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-3 h-0.5 bg-red-400 inline-block rounded"></span>
                  Expense
                </span>
              </div>
            </div>

            {/* Chart 2: Bar Chart — This Month */}
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
              <p className="text-white text-sm font-medium mb-4">This Month</p>
              <div className="w-full h-36">
                {barChartData ? (
                  <Bar data={barChartData} options={barOptions} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-600 text-xs">Loading...</p>
                  </div>
                )}
              </div>
              <div className="flex justify-around mt-3">
                <span className="text-xs text-gray-400">Income</span>
                <span className="text-xs text-gray-400">Expense</span>
              </div>
            </div>

            {/* Chart 3: Donut Chart — Spending by Category */}
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
              <p className="text-white text-sm font-medium mb-4">
                Spending by Category
              </p>
              <div className="w-full h-36">
                {donutChartData ? (
                  <Doughnut data={donutChartData} options={donutOptions} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-600 text-xs">Loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Recent Transactions ── */}
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
            <p className="text-white text-sm font-semibold mb-4">
              Recent Transactions
            </p>

            <div className="flex flex-col">
              {visibleTransactions.map(function (tx, index) {
                const isIncome = tx.type === "income";
                const amountText = isIncome
                  ? "+$" + tx.amount.toLocaleString()
                  : "$" + tx.amount.toLocaleString();
                const amountColor = isIncome
                  ? "text-green-400"
                  : "text-red-400";
                const catColor =
                  CATEGORY_COLORS[tx.category] || "text-gray-400";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0"
                  >
                    {/* Left: icon + title + date */}
                    <div className="flex items-center gap-3">
                      <div
                        className={
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 " +
                          tx.iconBg
                        }
                      >
                        <span className="text-white text-xs font-bold">
                          {tx.initials}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {tx.title}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {tx.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right: category + wallet + amount + actions */}
                    <div className="flex items-center gap-8">
                      <span className={"text-xs " + catColor}>
                        {tx.category}
                      </span>
                      <span className="text-gray-400 text-xs w-12 text-right">
                        {tx.wallet}
                      </span>
                      <span
                        className={
                          "text-sm font-semibold w-16 text-right " + amountColor
                        }
                      >
                        {amountText}
                      </span>
                      <div className="flex items-center gap-3 ml-2">
                        <button
                          onClick={() => handleEditClick(tx)}
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <FaPen size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tx)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={function () {
                  setCurrentPage(function (p) {
                    return Math.max(p - 1, 1);
                  });
                }}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/5 disabled:opacity-30"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, function (_, i) {
                return i + 1;
              }).map(function (page) {
                const isActive = page === currentPage;
                const btnStyle = isActive
                  ? "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-600 text-white"
                  : "w-7 h-7 rounded-full flex items-center justify-center text-xs text-gray-400 hover:bg-white/5";
                return (
                  <button
                    key={page}
                    onClick={function () {
                      setCurrentPage(page);
                    }}
                    className={btnStyle}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={function () {
                  setCurrentPage(function (p) {
                    return Math.min(p + 1, totalPages);
                  });
                }}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/5 disabled:opacity-30"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <AddTransactionModal
          onClose={() => setShowEditModal(false)}
          transactionToEdit={transactionToEdit}
          onEdit={handleEditSubmit}
          onAdd={() => {}}
        />
      )}
    </div>
  );
}

export default Dashboard;
