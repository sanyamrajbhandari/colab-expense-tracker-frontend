import { useState } from "react";
import { X } from "lucide-react";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Bills & Utilities",
  "Shopping",
  "Health & Fitness",
  "Income",
  "Other",
];

const WALLETS = [
  "Personal Checking (...4290)",
  "Cash",
  "eSewa",
  "Khalti",
  "Bank",
];

function AddTransactionModal({ onClose, onAdd }) {
  // One state variable for each form field
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [wallet, setWallet] = useState("Personal Checking (...4290)");
  const [date, setDate] = useState("05/24/2024");
  const [time, setTime] = useState("02:30 PM");

  // This runs when the user clicks "Add Transaction"
  function handleSubmit() {
    // Don't do anything if title or amount is empty
    if (!title.trim() || !amount) return;

    // Send the new transaction back to the parent component
    onAdd({
      title: title,
      amount: parseFloat(amount),
      category: category,
      wallet: wallet,
      date: date,
      type: type,
    });

    onClose(); // Close the modal
  }

  return (
    // Dark background behind the modal — clicking it closes the modal
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* The white card in the middle — clicking here does NOT close the modal */}
      <div
        className="bg-[#12141c] border border-white/10 rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl"
        onClick={function (e) {
          e.stopPropagation();
        }}
      >
        {/* Top row: title + close button */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-base">
              Add New Transaction
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Record your latest activity to keep your budgets accurate.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white ml-4"
          >
            <X size={18} />
          </button>
        </div>

        {/* Expense / Income toggle */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">
            Transaction Type
          </p>
          <div className="flex bg-[#1a1d27] rounded-full p-1 gap-1">
            <button
              onClick={function () {
                setType("expense");
              }}
              className={
                type === "expense"
                  ? "flex-1 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white"
                  : "flex-1 py-1.5 rounded-full text-sm font-medium text-gray-400 hover:text-white"
              }
            >
              Expense
            </button>

            <button
              onClick={function () {
                setType("income");
              }}
              className={
                type === "income"
                  ? "flex-1 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white"
                  : "flex-1 py-1.5 rounded-full text-sm font-medium text-gray-400 hover:text-white"
              }
            >
              Income
            </button>
          </div>
        </div>

        {/* Title field */}
        <div className="mb-3">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">
            Title
          </p>
          <input
            type="text"
            placeholder="e.g., Weekly Groceries"
            value={title}
            onChange={function (e) {
              setTitle(e.target.value);
            }}
            className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Amount + Category side by side */}
        <div className="flex gap-3 mb-3">
          {/* Amount */}
          <div className="flex-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">
              Amount
            </p>
            <div className="flex items-center bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2 focus-within:border-blue-500">
              <span className="text-gray-500 text-sm mr-1">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={function (e) {
                  setAmount(e.target.value);
                }}
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">
              Category
            </p>
            <select
              value={category}
              onChange={function (e) {
                setCategory(e.target.value);
              }}
              className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
            >
              {CATEGORIES.map(function (cat) {
                return (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Wallet */}
        <div className="mb-3">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">
            Wallet
          </p>
          <select
            value={wallet}
            onChange={function (e) {
              setWallet(e.target.value);
            }}
            className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
          >
            {WALLETS.map(function (w) {
              return (
                <option key={w} value={w}>
                  {w}
                </option>
              );
            })}
          </select>
        </div>

        {/* Date + Time side by side */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">
              Date
            </p>
            <input
              type="text"
              value={date}
              onChange={function (e) {
                setDate(e.target.value);
              }}
              className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">
              Time
            </p>
            <input
              type="text"
              value={time}
              onChange={function (e) {
                setTime(e.target.value);
              }}
              className="w-full bg-[#1a1d27] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Cancel and Submit buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-full border border-white/10 text-gray-400 text-sm hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-500"
          >
            Add Transaction
          </button>
        </div>

        {/* Bottom badges */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-gray-600 text-xs">🔒 SECURE ENTRY</span>
          <span className="text-gray-600 text-xs">🔄 AUTO-SYNCING</span>
        </div>
      </div>
    </div>
  );
}

export default AddTransactionModal;
