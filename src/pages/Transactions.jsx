import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Sidebar from "../components/Multipage/Sidebar";
import TransactionsHeader from "../components/Multipage/TransactionsHeader";
import TransactionTable from "../components/Multipage/TransactionTable";
import AddTransactionModal from "../components/Dashboard/AddTransactionModal";
import api from "../utils/api";
import { syncAllExternalWallets } from "../utils/walletSync";
import LoadingSpinner from "../components/Multipage/LoadingSpinner";
import { checkBudgetAndNotify } from "../utils/budgetCheck";

import { ALL_OPTION, buildMonthOptions, parseMonthFilter } from "../utils/dateUtils";

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
  paymentMethod: tx.paymentMethod || tx.wallet?.name,
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [txToDelete, setTxToDelete] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const TRANSACTIONS_PER_PAGE = 10;
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
    const syncAndFetch = async () => {
      setIsLoading(true);
      await syncAllExternalWallets();
      fetchTransactions();
    };
    syncAndFetch();
  }, [fetchTransactions]);

  const handleEditClick = (tx) => {
    setTransactionToEdit(tx);
    setShowModal(true);
  };

  const handleDeleteClick = (tx) => {
    setTxToDelete(tx);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!txToDelete) return;
    try {
      const txId = txToDelete._id || txToDelete.id;
      if (!txId) return;
      await api.delete(`/transactions/${txId}`);
      setTransactions((prev) => prev.filter((item) => item !== txToDelete));
      toast.success("Transaction deleted");
      setShowDeleteConfirm(false);
      setTxToDelete(null);
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
      await checkBudgetAndNotify(savedTx);
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
      await checkBudgetAndNotify(savedTx);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding transaction");
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * TRANSACTIONS_PER_PAGE,
    currentPage * TRANSACTIONS_PER_PAGE,
  );

  // Reset to page 1 whenever search or month filter changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-[#0b0d14] text-white overflow-hidden">
      <Sidebar activePage="Transactions" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TransactionsHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          monthOptions={monthOptions}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/5">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 bg-[#0f1117] rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
          />

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 bg-[#1a1d27] border border-white/10 px-3 py-2 rounded-lg whitespace-nowrap flex-1 sm:flex-initial text-center">
              {isLoading ? "Loading..." : selectedMonth}
            </span>

            <button
              onClick={() => {
                setTransactionToEdit(null);
                setShowModal(true);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap cursor-pointer"
            >
              <Plus size={15} />
              Add Transaction
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 sm:px-6 py-2">
          {isLoading ? (
            <LoadingSpinner message="Updating transaction history..." />
          ) : (
            <>
              <TransactionTable
                transactions={paginatedTransactions}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/5 disabled:opacity-30 text-lg"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/5 disabled:opacity-30 text-lg"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
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

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && txToDelete && (
        <div
          onClick={() => setShowDeleteConfirm(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#151f2e] rounded-2xl p-6 sm:p-8 w-full max-w-[380px] mx-4 border border-white/[0.08] text-center"
          >
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <FaTrash
                size={22}
                className="text-red-500"
              />
            </div>

            <h3 className="text-white text-lg font-bold mb-2">
              Delete Transaction
            </h3>

            <p className="text-[#8a9bbf] text-sm mb-7 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                "{txToDelete.title}"
              </span>
              ?
              <br />
              <span className="text-[11px]">This action cannot be undone.</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-full bg-[#1e2a3a] border border-white/10 text-[#8a9bbf] text-sm hover:bg-[#263347] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-full bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
