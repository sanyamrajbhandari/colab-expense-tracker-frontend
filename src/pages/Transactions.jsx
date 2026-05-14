import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../components/Multipage/Sidebar";
import TransactionsHeader from "../components/Multipage/TransactionsHeader";
import TransactionTable from "../components/Multipage/TransactionTable";
import AddTransactionModal from "../components/Dashboard/AddTransactionModal";
import api from "../utils/api";

const ALL_OPTION = "All";

const buildMonthOptions = () => {
  const options = [ALL_OPTION];
  const now = new Date();
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
    );
    options.push(
      date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    );
  }
  return options;
};

const parseMonthFilter = (monthLabel) => {
  if (!monthLabel || monthLabel === ALL_OPTION) return null;
  const [monthName, yearString] = monthLabel.split(" ");
  const month = new Date(`${monthName} 1, ${yearString}`).getMonth() + 1;
  const year = Number(yearString);
  if (!month || Number.isNaN(year)) return null;
  return { month, year };
};

const toDisplayDate = (date) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const normalizeTransaction = (tx) => ({
  ...tx,
  wallet: tx.paymentMethod,
  date: toDisplayDate(tx.date),
});

const sanitizeTransactionPayload = (tx) => ({
  title: tx.title,
  amount: Number(tx.amount),
  type: tx.type,
  category: tx.category,
  paymentMethod: tx.paymentMethod || tx.wallet,
  date: tx.date ? new Date(tx.date).toISOString() : undefined,
});

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(ALL_OPTION);
  const [showModal, setShowModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const monthOptions = useMemo(() => buildMonthOptions(), []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const monthlyFilter = parseMonthFilter(selectedMonth);
      const response = monthlyFilter
        ? await api.get("/transactions/monthly", { params: monthlyFilter })
        : await api.get("/transactions");

      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      setTransactions(list.map(normalizeTransaction));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch transactions",
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleEditClick = (tx) => {
    setTransactionToEdit(tx);
    setShowModal(true);
  };

  const handleDeleteClick = async (tx) => {
    try {
      const txId = tx._id || tx.id;
      if (!txId) return;
      await api.delete(`/transactions/${txId}`);
      setTransactions((prev) => prev.filter((item) => item !== tx));
      toast.success("Transaction deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting transaction",
      );
    }
  };

  const handleEditSubmit = async (updatedTx) => {
    try {
      const txId = updatedTx._id || updatedTx.id;
      if (!txId) return;
      const response = await api.put(
        `/transactions/${txId}`,
        sanitizeTransactionPayload(updatedTx),
      );
      const savedTx = response.data?.data || updatedTx;
      const formattedTx = normalizeTransaction(savedTx);

      setTransactions((prev) => {
        const newList = prev.map((item) =>
          (item.id || item._id) === txId ? formattedTx : item,
        );
        return newList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      });
      setShowModal(false);
      toast.success("Transaction updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating transaction",
      );
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    try {
      const response = await api.post(
        "/transactions",
        sanitizeTransactionPayload(newTransaction),
      );
      const savedTx = response.data?.data || newTransaction;
      const formattedTx = normalizeTransaction(savedTx);

      setTransactions((oldList) => {
        const newList = [formattedTx, ...oldList];
        return newList.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      });
      toast.success("Transaction added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding transaction");
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-[#0b0d14] text-white overflow-hidden">
      <Sidebar activePage="Transactions" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TransactionsHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          monthOptions={monthOptions}
        />

        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
          <div className="flex-1 relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1d27] border border-blue-500/40 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <span className="text-sm text-gray-300 bg-[#1a1d27] border border-white/10 px-3 py-2 rounded-lg whitespace-nowrap">
            {isLoading ? "Loading..." : selectedMonth}
          </span>

          <button
            onClick={() => {
              setTransactionToEdit(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <Plus size={15} />
            Add Transaction
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-2">
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTransaction}
          transactionToEdit={transactionToEdit}
          onEdit={handleEditSubmit}
        />
      )}
    </div>
  );
}

export default Transactions;
