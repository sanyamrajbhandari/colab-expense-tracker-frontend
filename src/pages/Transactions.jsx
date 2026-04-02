import Sidebar from "../components/Multipage/Sidebar";
import Topbar from "../components/Multipage/Topbar";
import TransactionList from "../components/Dashboard/TransactionList";
import "../css/Dashboard.css";

function Transactions(props) {
  return (
    <div className="app">
      {/* Sidebar — same as dashboard */}
      <Sidebar items={props.items} />

      <span className="right-board">
        {/* Topbar — just different title */}
        <Topbar title="Transactions" />

        <div className="scrollable-content">
          <div className="transactions-page">
            {/* ── Search bar + filter + add button row ── */}
            <div className="tx-controls">
              <div className="tx-search">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by title..."
                  className="search-input"
                />
              </div>
              <button className="filter-btn">March 2026 ▾</button>
              <button className="add-btn">+ Add Transaction</button>
            </div>

            {/* ── Reusing TransactionList component ── */}
            <TransactionList transactions={props.allTransactions} />
          </div>
        </div>
      </span>
    </div>
  );
}

export default Transactions;
