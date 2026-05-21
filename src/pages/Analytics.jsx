import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Multipage/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

// Chart.js imports
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

const CATEGORY_COLORS = {
  "Food & Dining": "#F97316",
  Income: "#10B981",
  Transportation: "#3B82F6",
  Entertainment: "#A855F7",
  "Bills & Utilities": "#EAB308",
  Shopping: "#EC4899",
  "Health & Fitness": "#14B8A6",
  Others: "#64748B",
};

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("March 2026");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/recent",
        );
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catMap = {};
    const dailyMap = {};

    transactions.forEach((tx) => {
      const amt = parseFloat(tx.amount);
      const dateObj = new Date(tx.date);
      const day = dateObj.getDate();

      if (tx.type === "income") {
        income += amt;
      } else {
        expense += amt;
        catMap[tx.category] = (catMap[tx.category] || 0) + amt;
        dailyMap[day] = (dailyMap[day] || 0) + amt;
      }
    });

    return {
      income,
      expense,
      savings: income - expense,
      count: transactions.length,
      catMap,
      barData: {
        labels: ["Income", "Expense"],
        datasets: [
          {
            data: [income, expense],
            backgroundColor: ["#3B82F6", "#334155"],
            borderRadius: 8,
            barThickness: 60,
          },
        ],
      },
      doughnutData: {
        labels: Object.keys(catMap),
        datasets: [
          {
            data: Object.values(catMap),
            backgroundColor: Object.keys(catMap).map(
              (c) => CATEGORY_COLORS[c] || "#64748B",
            ),
            borderWidth: 0,
            hoverOffset: 15,
          },
        ],
      },
      lineData: {
        labels: Array.from({ length: 30 }, (_, i) => i + 1),
        datasets: [
          {
            fill: true,
            label: "Spending",
            data: Array.from({ length: 30 }, (_, i) => dailyMap[i + 1] || 0),
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            pointRadius: 2,
          },
        ],
      },
    };
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        grid: { color: "#ffffff05" },
        ticks: { color: "#475569", font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#475569", font: { size: 10 } },
      },
    },
  };

  if (loading)
    return (
      <div className="h-screen bg-[#0b0d14] flex items-center justify-center text-white">
        Loading Analytics...
      </div>
    );

  return (
    <div className="flex h-screen bg-[#0b0d14] text-white overflow-hidden">
      <Sidebar activePage="Analytics" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Using your exact DashboardHeader component */}
        <DashboardHeader
          title="Analytics"
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Income"
              amount={stats.income}
              color="bg-[#10B981]"
              icon={<TrendingUp size={20} />}
              growth="+8.2%"
            />
            <StatCard
              title="Total Expense"
              amount={stats.expense}
              color="bg-[#EF4444]"
              icon={<TrendingDown size={20} />}
              growth="+5.3%"
            />
            <StatCard
              title="Net Savings"
              amount={stats.savings}
              color="bg-[#3B82F6]"
              icon={<DollarSign size={20} />}
              growth="+12.1%"
            />
            <StatCard
              title="Transaction Count"
              amount={stats.count}
              color="bg-[#1e232f]"
              icon={<CreditCard size={20} />}
              growth="+3"
              isCount
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#13161f] p-6 rounded-3xl border border-white/5 h-80">
              <h3 className="text-sm font-medium text-gray-400 mb-6">
                Income vs Expense
              </h3>
              <div className="h-56">
                <Bar data={stats.barData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-[#13161f] p-6 rounded-3xl border border-white/5 h-80">
              <h3 className="text-sm font-medium text-gray-400 mb-4">
                Spending Distribution
              </h3>
              <div className="flex items-center h-56">
                <div className="w-1/2 h-full">
                  <Doughnut
                    data={stats.doughnutData}
                    options={{
                      ...chartOptions,
                      scales: { x: { display: false }, y: { display: false } },
                    }}
                  />
                </div>
                <div className="w-1/2 space-y-3 pl-6 overflow-y-auto h-full">
                  {Object.entries(stats.catMap).map(([name, val]) => (
                    <div
                      key={name}
                      className="flex justify-between items-center text-[11px]"
                    >
                      <span className="flex items-center gap-2 text-gray-400">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[name] }}
                        />{" "}
                        {name}
                      </span>
                      <span className="font-semibold">
                        ${val.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Trend Chart */}
          <div className="bg-[#13161f] p-6 rounded-3xl border border-white/5 h-96 mb-8">
            <h3 className="text-sm font-medium text-gray-400 mb-6">
              Daily Spending Trend
            </h3>
            <div className="h-72">
              <Line data={stats.lineData} options={chartOptions} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, amount, color, icon, growth, isCount }) => (
  <div
    className={`${color} p-6 rounded-[24px] shadow-lg transition-transform hover:scale-[1.02]`}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="p-2.5 bg-white/20 rounded-xl">{icon}</div>
      <div className="flex items-center text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">
        <ArrowUpRight size={12} className="mr-0.5" /> {growth}
      </div>
    </div>
    <p className="text-xs font-medium opacity-70 mb-1">{title}</p>
    <h2 className="text-2xl font-bold tracking-tight">
      {isCount
        ? amount
        : amount < 0
          ? `-$${Math.abs(amount).toLocaleString()}`
          : `$${amount.toLocaleString()}`}
    </h2>
  </div>
);

export default Analytics;
