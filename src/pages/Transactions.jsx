import { useState } from "react";
import { Search, Plus } from "lucide-react";

// Import all the components we built
import Sidebar from "../components/Multipage/Sidebar";
import TransactionsHeader from "../components/Multipage/TransactionsHeader";
import TransactionTable from "../components/Multipage/TransactionTable";
import AddTransactionModal from "../components/Dashboard/AddTransactionModal";

// This is the starting list of transactions shown on the page
const INITIAL_TRANSACTIONS = [
  {
    title: "Grocery Shopping",
    category: "Food & Dining",
    wallet: "Cash",
    amount: 125.5,
    date: "Mar 22, 2026",
    type: "expense",
  },
  {
    title: "Salary",
    category: "Income",
    wallet: "Bank",
    amount: 5700,
    date: "Mar 20, 2026",
    type: "income",
  },
  {
    title: "Uber Ride",
    category: "Transportation",
    wallet: "eSewa",
    amount: 15.75,
    date: "Mar 19, 2026",
    type: "expense",
  },
  {
    title: "Netflix Subscription",
    category: "Entertainment",
    wallet: "Bank",
    amount: 12.99,
    date: "Mar 18, 2026",
    type: "expense",
  },
  {
    title: "Freelance Project",
    category: "Income",
    wallet: "Bank",
    amount: 850,
    date: "Mar 17, 2026",
    type: "income",
  },
  {
    title: "Restaurant Dinner",
    category: "Food & Dining",
    wallet: "Khalti",
    amount: 68.25,
    date: "Mar 16, 2026",
    type: "expense",
  },
  {
    title: "Electricity Bill",
    category: "Bills & Utilities",
    wallet: "Bank",
    amount: 95,
    date: "Mar 15, 2026",
    type: "expense",
  },
  {
    title: "Online Shopping",
    category: "Shopping",
    wallet: "eSewa",
    amount: 210.5,
    date: "Mar 14, 2026",
    type: "expense",
  },
  {
    title: "Gas Station",
    category: "Transportation",
    wallet: "Cash",
    amount: 45,
    date: "Mar 13, 2026",
    type: "expense",
  },
  {
    title: "Coffee Shop",
    category: "Food & Dining",
    wallet: "Khalti",
    amount: 8.5,
    date: "Mar 12, 2026",
    type: "expense",
  },
  {
    title: "Client Payment",
    category: "Income",
    wallet: "Bank",
    amount: 1200,
    date: "Mar 11, 2026",
    type: "income",
  },
  {
    title: "Gym Membership",
    category: "Health & Fitness",
    wallet: "Bank",
    amount: 50,
    date: "Mar 10, 2026",
    type: "expense",
  },
];

function Transactions() {
  // The full list of transactions
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // What the user types in the search box
  const [searchQuery, setSearchQuery] = useState("");

  // Which month is selected in the header
  const [selectedMonth, setSelectedMonth] = useState("March 2026");

  // Whether the Add Transaction popup is open or closed
  const [showModal, setShowModal] = useState(false);

  // This runs when the user adds a new transaction in the modal
  function handleAddTransaction(newTransaction) {
    // Add the new one to the top of the list
    setTransactions(function (oldList) {
      return [newTransaction, ...oldList];
    });
  }

  // Filter the list — only show transactions whose title matches the search
  const filteredTransactions = transactions.filter(function (tx) {
    return tx.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-[#0b0d14] text-white overflow-hidden">
      {/* Sidebar on the left */}
      <Sidebar activePage="Transactions" />

      {/* Everything on the right */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <TransactionsHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* Search bar + Add button row */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
          {/* Search input */}
          <div className="flex-1 relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={function (e) {
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-[#1a1d27] border border-blue-500/40 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Month label */}
          <span className="text-sm text-gray-300 bg-[#1a1d27] border border-white/10 px-3 py-2 rounded-lg whitespace-nowrap">
            {selectedMonth}
          </span>

          {/* Add Transaction button */}
          <button
            onClick={function () {
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <Plus size={15} />
            Add Transaction
          </button>
        </div>

        {/* The transaction table */}
        <div className="flex-1 overflow-auto px-6 py-2">
          <TransactionTable transactions={filteredTransactions} />
        </div>
      </div>

      {/* The popup modal — only shows when showModal is true */}
      {showModal && (
        <AddTransactionModal
          onClose={function () {
            setShowModal(false);
          }}
          onAdd={handleAddTransaction}
        />
      )}
    </div>
  );
}

export default Transactions;
