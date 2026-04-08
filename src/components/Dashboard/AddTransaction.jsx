import React, { useState } from "react";
// Path: goes up 2 levels (to src) then into css folder
import "../../css/AddTransaction.css";

// We add { onClose } here so the component knows how to close itself
export default function AddTransaction({ onClose }) {
  const [transactionType, setTransactionType] = useState("Expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [customCategory, setCustomCategory] = useState("");
  const [wallet, setWallet] = useState("Personal Checking (...4291)");
  const [date, setDate] = useState("05/24/2024");
  const [time, setTime] = useState("02:30 PM");

  const categories = [
    "Food & Dining",
    "Income",
    "Transportation",
    "Entertainment",
    "Bills",
    "Education",
    "Health",
    "Shopping",
    "Other",
  ];

  const handleSubmit = () => {
    const selectedCategory = category === "Other" ? customCategory : category;

    // This part handles the data
    console.log({
      type: transactionType,
      title,
      amount,
      category: selectedCategory,
      wallet,
      date,
      time,
    });

    alert("Transaction Added!");

    // After adding, we trigger the close signal
    onClose();
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="header">
          <h2 className="title">Add New Transaction</h2>
          {/* 1. The X button now triggers the close signal */}
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="subtitle">
          Record your latest activity to keep your budgets accurate.
        </p>

        {/* Transaction Type */}
        <label className="label">TRANSACTION TYPE</label>
        <div className="type-buttons">
          <button
            className={`type-button ${transactionType === "Expense" ? "active" : ""}`}
            onClick={() => setTransactionType("Expense")}
          >
            Expense
          </button>
          <button
            className={`type-button ${transactionType === "Income" ? "active" : ""}`}
            onClick={() => setTransactionType("Income")}
          >
            Income
          </button>
        </div>

        {/* Title */}
        <label className="label">TITLE</label>
        <input
          type="text"
          className="input"
          placeholder="e.g., Weekly Groceries"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Amount and Category */}
        <div className="row">
          <div className="column">
            <label className="label">AMOUNT</label>
            <input
              type="text"
              className="input"
              placeholder="$ 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="column">
            <label className="label">CATEGORY</label>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Category Input */}
        {category === "Other" && (
          <div>
            <label className="label">CUSTOM CATEGORY</label>
            <input
              type="text"
              className="input"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        )}

        {/* Wallet */}
        <label className="label">WALLET</label>
        <select
          className="select"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        >
          <option>Personal Checking (...4291)</option>
          <option>Cash</option>
          <option>Bank</option>
          <option>eSewa</option>
          <option>Khalti</option>
        </select>

        {/* Date and Time */}
        <div className="row">
          <div className="column">
            <label className="label">DATE</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="column">
            <label className="label">TIME</label>
            <input
              type="time"
              className="input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="button-row">
          {/* 2. The Cancel button also triggers the close signal */}
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>

          <button className="add-button" onClick={handleSubmit}>
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
