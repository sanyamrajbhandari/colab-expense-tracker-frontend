import React, { useState } from "react";
import Sidebar from "../components/Multipage/Sidebar";
import Topbar from "../components/Multipage/Topbar";
import TransactionList from "../components/Dashboard/TransactionList";
import AddTransaction from "../components/Dashboard/AddTransaction";
import "../css/Dashboard.css";

function Transactions(props) {
  // 1. Create the "Switch". Starts at 'false' because we don't want the popup visible immediately.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. These functions flip the switch
  const openPopup = () => setIsModalOpen(true);
  const closePopup = () => setIsModalOpen(false);

  return (
    <div className="app">
      <Sidebar items={props.items} />

      <span className="right-board">
        <Topbar title="Transactions" />

        <div className="scrollable-content">
          <div className="transactions-page">
            <div className="tx-controls">
              {/* Search bar stuff... */}
              <div className="tx-search">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
              </div>

              {/* 3. When this button is clicked, we call openPopup() */}
              <button className="add-btn" onClick={openPopup}>
                + Add Transaction
              </button>
            </div>

            <TransactionList transactions={props.allTransactions} />
          </div>
        </div>
      </span>

      {/* 4. The Magic Logic: If isModalOpen is true, show <AddTransaction />. 
          We pass the closePopup function as a "prop" named onClose. */}
      {isModalOpen && <AddTransaction onClose={closePopup} />}
    </div>
  );
}

export default Transactions;
