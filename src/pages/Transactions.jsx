import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import axios from "axios";

// Import all the components we built
import Sidebar from "../components/Multipage/Sidebar";
import TransactionsHeader from "../components/Multipage/TransactionsHeader";
import TransactionTable from "../components/Multipage/TransactionTable";
import AddTransactionModal from "../components/Dashboard/AddTransactionModal";

function Transactions() {
  // The full list of transactions
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/recent",
        );
        if (response.data.success) {
          const formattedTransactions = response.data.data.map((tx) => ({
            ...tx,
            wallet: tx.paymentMethod,
            date:
              tx.displayDate ||
              new Date(tx.date).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
          }));
          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // What the user types in the search box
  const [searchQuery, setSearchQuery] = useState("");

  // Which month is selected in the header
  const [selectedMonth, setSelectedMonth] = useState("March 2026");

  // Whether the Add Transaction popup is open or closed
  const [showModal, setShowModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const handleEditClick = (tx) => {
    setTransactionToEdit(tx);
    setShowModal(true);
  };

  const handleDeleteClick = async (tx) => {
    try {
      const txId = tx._id || tx.id;
      if (!txId) return;
      await axios.delete(`http://localhost:5000/api/transactions/${txId}`);
      setTransactions((prev) => prev.filter((item) => item !== tx));
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

      const formattedTx = {
        ...savedTx,
        wallet: savedTx.paymentMethod || updatedTx.paymentMethod,
        date:
          savedTx.displayDate ||
          new Date(savedTx.date || updatedTx.date).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
      };

      setTransactions((prev) => {
        const newList = prev.map((item) =>
          (item.id || item._id) === txId ? formattedTx : item,
        );
        return newList.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // This runs when the user adds a new transaction in the modal
  async function handleAddTransaction(newTransaction) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/transactions",
        newTransaction,
      );

      let savedTx = newTransaction;
      if (response.data && response.data.data) {
        savedTx = response.data.data;
      }

      const formattedTx = {
        ...savedTx,
        wallet: savedTx.paymentMethod || newTransaction.paymentMethod,
        date:
          savedTx.displayDate ||
          new Date(savedTx.date || newTransaction.date).toLocaleString(
            "en-US",
            {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            },
          ),
      };

      setTransactions(function (oldList) {
        const newList = [formattedTx, ...oldList];
        return newList.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
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
              setTransactionToEdit(null); // Ensure we are in add mode
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
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* The popup modal — only shows when showModal is true */}
      {showModal && (
        <AddTransactionModal
          onClose={function () {
            setShowModal(false);
          }}
          onAdd={handleAddTransaction}
          transactionToEdit={transactionToEdit}
          onEdit={handleEditSubmit}
        />
      )}
    </div>
  );
}

export default Transactions;
