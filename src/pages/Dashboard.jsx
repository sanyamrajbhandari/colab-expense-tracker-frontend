import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import axios from "axios";

import Sidebar from "../components/Multipage/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import AddTransactionModal from "../components/Dashboard/AddTransactionModal";
import { FaPen, FaTrash } from "react-icons/fa";

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

  // Which page of recent transactions we are on
  const [currentPage, setCurrentPage] = useState(1);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Edit and Delete state
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

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
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Show 6 transactions per page
  const transactionsPerPage = 6;
  const totalPages =
    Math.ceil(recentTransactions.length / transactionsPerPage) || 1;

  // Slice the array to only show current page items
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
        {/* Top header */}
        <DashboardHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* Scrollable page body */}
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-5">
          {/* ── Net Worth Card (blue banner) ── */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6">
            {/* Label */}
            <p className="text-blue-100 text-xs font-medium mb-1">
              Total Net Worth
            </p>

            {/* Big amount + growth badge */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-white text-3xl font-bold">$2,450</h2>
              <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                +12.5%
              </span>
            </div>

            {/* Income and Expense summary */}
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

          {/* ── Three chart cards row ── */}
          <div className="grid grid-cols-3 gap-5">
            {/* Chart 1: Income vs Expense Trend */}
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
              <p className="text-white text-sm font-medium mb-4">
                Income vs Expense Trend
              </p>
              {/* 
                ✏️ YOU WILL ADD YOUR CHART.JS LINE CHART HERE LATER
                The box below is just a placeholder so you can see the layout
              */}
              <div className="w-full h-36 rounded-lg bg-white/5 flex items-center justify-center">
                <p className="text-gray-600 text-xs">Line Chart goes here</p>
              </div>
              {/* Legend */}
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

            {/* Chart 2: This Month (Bar Chart) */}
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
              <p className="text-white text-sm font-medium mb-4">This Month</p>
              {/* 
                ✏️ YOU WILL ADD YOUR CHART.JS BAR CHART HERE LATER
              */}
              <div className="w-full h-36 rounded-lg bg-white/5 flex items-center justify-center">
                <p className="text-gray-600 text-xs">Bar Chart goes here</p>
              </div>
              {/* Labels */}
              <div className="flex justify-around mt-3">
                <span className="text-xs text-gray-400">Income</span>
                <span className="text-xs text-gray-400">Expense</span>
              </div>
            </div>

            {/* Chart 3: Spending by Category (Donut Chart) */}
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
              <p className="text-white text-sm font-medium mb-4">
                Spending by Category
              </p>
              {/* 
                ✏️ YOU WILL ADD YOUR CHART.JS DOUGHNUT CHART HERE LATER
              */}
              <div className="w-full h-36 rounded-lg bg-white/5 flex items-center justify-center">
                <p className="text-gray-600 text-xs">Donut Chart goes here</p>
              </div>
            </div>
          </div>

          {/* ── Recent Transactions card ── */}
          <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4">
            {/* Card heading */}
            <p className="text-white text-sm font-semibold mb-4">
              Recent Transactions
            </p>

            {/* List of transactions */}
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
                      {/* Colored icon square */}
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

                    {/* Right: category + wallet + amount */}
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
                      {/* Edit & Delete Actions */}
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

            {/* ── Pagination ── */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {/* Previous button */}
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

              {/* Page number buttons */}
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

              {/* Next button */}
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
