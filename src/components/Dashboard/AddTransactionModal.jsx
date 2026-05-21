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

function AddTransactionModal({ onClose, onAdd, transactionToEdit, onEdit }) {
  const isEditMode = !!transactionToEdit;
  // One state variable for each form field
  // Initialize states with edit data if available
  const [type, setType] = useState(
    isEditMode ? transactionToEdit.type : "expense",
  );
  const [title, setTitle] = useState(isEditMode ? transactionToEdit.title : "");
  const [amount, setAmount] = useState(
    isEditMode ? transactionToEdit.amount : "",
  );
  const [category, setCategory] = useState(
    isEditMode ? transactionToEdit.category : "Food & Dining",
  );

  // Wallet could be paymentMethod or wallet depending on how it was passed
  const initialWallet = isEditMode
    ? transactionToEdit.wallet || transactionToEdit.paymentMethod
    : "Personal Checking (...4290)";
  const [wallet, setWallet] = useState(initialWallet);

  // Try to parse the date and time from the transaction to be edited
  const now = new Date();
  const zeroPad = (num) => String(num).padStart(2, "0");
  let defaultDate = `${now.getFullYear()}-${zeroPad(now.getMonth() + 1)}-${zeroPad(now.getDate())}`;
  let defaultTime = `${zeroPad(now.getHours())}:${zeroPad(now.getMinutes())}`;

  if (isEditMode && transactionToEdit.date) {
    try {
      const parsedDate = new Date(transactionToEdit.date);
      if (!isNaN(parsedDate.getTime())) {
        defaultDate = `${parsedDate.getFullYear()}-${zeroPad(parsedDate.getMonth() + 1)}-${zeroPad(parsedDate.getDate())}`;
        defaultTime = `${zeroPad(parsedDate.getHours())}:${zeroPad(parsedDate.getMinutes())}`;
      }
    } catch (e) {
      // Intentionally empty
    }
  }

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);

  // This runs when the user clicks "Add Transaction"
  function handleSubmit() {
    // Don't do anything if title or amount is empty
    if (!title.trim() || !amount) return;

    const payload = {
      title: title,
      amount: parseFloat(amount),
      type: type,
      category: category,
      paymentMethod: wallet,
      date: new Date(`${date}T${time}:00`).toISOString(),
    };

    if (isEditMode && onEdit) {
      onEdit({ ...transactionToEdit, ...payload });
    } else {
      // Send the new transaction back to the parent component
      onAdd(payload);
    }

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
              {isEditMode ? "Edit Transaction" : "Add New Transaction"}
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
              type="date"
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
              type="time"
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
            {isEditMode ? "Edit transaction" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTransactionModal;
