import "../css/Dashboard.css";
import { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  BarChart3,
  Sparkles,
  Settings,
} from "lucide-react";
import Sidebar from "../components/Multipage/Sidebar";
import Topbar from "../components/Multipage/Topbar";
import TransactionList from "../components/Dashboard/TransactionList";

// for left side bar


function Dashboard({ allTransactions }) {
  const [income, setIncome] = useState(6550);
  const [expense, setExpense] = useState(4110);

  const netWorth = income - expense;

  return (
    <div className="app">
      {/* Sidebar component */}
      <Sidebar  />

      <span className="right-board">
        {/* Topbar component */}
        <Topbar title="Dashboard" />

        <div className="scrollable-content">
          {/* Net Worth Card */}
          <div className="net-worth">
            <p>Total Net Worth</p>
            <div className="net-amount">
              <p className="amount-net">${netWorth.toLocaleString()}</p>
            </div>
            <div>
              <p className="income">Income</p>
              <p className="inc-amount">${income.toLocaleString()}</p>
            </div>
            <div>
              <p className="income">Expense</p>
              <p className="inc-amount">${expense.toLocaleString()}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="charts">
            <div className="line-graph"></div>
            <div className="bar-graph"></div>
            <div className="donut-graph"></div>
          </div>

          {/* Transaction List component */}
          <TransactionList allTransactions={allTransactions} />
        </div>
      </span>
    </div>
  );
}

export default Dashboard;
