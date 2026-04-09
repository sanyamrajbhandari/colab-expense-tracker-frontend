import { useState } from "react";
import "../css/Wallets.css";
import WalletCard from "../components/Wallets/WalletCard";
import Sidebar from "../components/Multipage/Sidebar";
import Dashboard from "../components/Dashboard/DashboardHeader";

/**
 * Wallets Page Component
 *
 * Displays all user wallets in a 3-column grid layout.
 * Features:
 * - Shows total balance across all wallets
 * - Add new wallet via modal
 * - Each wallet rendered as a WalletCard component
 */
const Wallets = () => {
  // ─── State ───────────────────────────────────────────────────────────────────

  /** List of all wallets with their details */
  const [wallets, setWallets] = useState([
    {
      id: 1,
      walletName: "Cash",
      balance: 520.5,
      currency: "$",
      iconColor: "#0fc98a",
      type: "cash",
    },
    {
      id: 2,
      walletName: "Bank",
      balance: 8450.75,
      currency: "$",
      iconColor: "#3b82f6",
      type: "bank",
    },
    {
      id: 3,
      walletName: "eSewa",
      balance: 1250,
      currency: "$",
      iconColor: "#f59e0b",
      type: "esewa",
    },
    {
      id: 4,
      walletName: "Khalti",
      balance: 680.25,
      currency: "$",
      iconColor: "#760af1",
      type: "khalti",
    },
    {
      id: 5,
      walletName: "Credit Card",
      balance: 3200,
      currency: "$",
      iconColor: "#ef4444",
      type: "credit",
    },
  ]);

  /** Controls visibility of the Add Wallet modal */
  const [showModal, setShowModal] = useState(false);

  /** Stores form input values for the new wallet being created */
  const [newWallet, setNewWallet] = useState({
    walletName: "",
    balance: "",
    iconColor: "#a5b4fc",
  });

  // ─── Constants ───────────────────────────────────────────────────────────────

  /** Preset colors for wallet icon selection */
  const colors = ["#a5b4fc", "#f9a8d4", "#c4b5fd", "#fca5a5"];

  /** Sum of all wallet balances */
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Adds a new wallet to the wallets list.
   * Validates that walletName and balance are not empty before adding.
   * Resets the form and closes the modal after successful addition.
   */
  const handleAddWallet = () => {
    // Prevent adding if name or balance is empty
    if (!newWallet.walletName || !newWallet.balance) return;

    // Add new wallet to the list
    setWallets((prev) => [
      ...prev,
      {
        id: Date.now(),
        walletName: newWallet.walletName,
        balance: parseFloat(newWallet.balance),
        currency: "$",
        iconColor: newWallet.iconColor,
        type: "cash",
      },
    ]);

    // Reset form and close modal
    setNewWallet({ walletName: "", balance: "", iconColor: "#a5b4fc" });
    setShowModal(false);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      {/* Sidebar component */}
      <Sidebar />

      <div className="right-board">
        {/* Topbar component */}
        <Dashboard title="Wallets" />

        <div
          style={{ padding: "28px", background: "#0f1623", minHeight: "100vh" }}
        >
          {/* ── Header: Total Balance + Add Wallet Button ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <div>
              <p style={{ color: "#8a9bbf", margin: 0 }}>Total Balance</p>
              <h2 style={{ color: "#3b82f6", fontSize: "28px", margin: 0 }}>
                ${totalBalance.toLocaleString()}
              </h2>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                background: "#3b82f6",
                border: "none",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              + Add Wallet
            </button>
          </div>

          {/* ── Wallet Cards Grid ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} {...wallet} />
            ))}
          </div>

          {/* ── Add Wallet Modal ── */}
          {showModal && (
            <div
              onClick={() => setShowModal(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#151f2e",
                  borderRadius: "16px",
                  padding: "32px",
                  width: "380px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h3 style={{ color: "#fff", margin: 0, fontSize: "20px" }}>
                    Add New Wallet
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8a9bbf",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <label style={{ color: "#8a9bbf", fontSize: "14px" }}>
                  Wallet Name
                </label>
                <input
                  placeholder="e.g., PayPal"
                  value={newWallet.walletName}
                  onChange={(e) =>
                    setNewWallet((p) => ({ ...p, walletName: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#1e2a3a",
                    color: "#fff",
                    fontSize: "14px",
                    marginTop: "8px",
                    marginBottom: "16px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />

                <label style={{ color: "#8a9bbf", fontSize: "14px" }}>
                  Initial Balance
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#1e2a3a",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    marginTop: "8px",
                    marginBottom: "16px",
                    padding: "12px 16px",
                  }}
                >
                  <span style={{ color: "#8a9bbf", marginRight: "8px" }}>
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newWallet.balance}
                    onChange={(e) =>
                      setNewWallet((p) => ({ ...p, balance: e.target.value }))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                </div>

                <label style={{ color: "#8a9bbf", fontSize: "14px" }}>
                  Wallet Color
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                    marginBottom: "24px",
                  }}
                >
                  {colors.map((color) => (
                    <div
                      key={color}
                      onClick={() =>
                        setNewWallet((p) => ({ ...p, iconColor: color }))
                      }
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: color,
                        cursor: "pointer",
                        border:
                          newWallet.iconColor === color
                            ? "3px solid #fff"
                            : "3px solid transparent",
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#1e2a3a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#8a9bbf",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddWallet}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Add Wallet
                  </button>
                </div>

                <p
                  style={{
                    color: "#3b4a5a",
                    fontSize: "11px",
                    textAlign: "center",
                    marginTop: "20px",
                    letterSpacing: "1px",
                  }}
                >
                  SECURELY MANAGED BY SPENDWISE ENGINE
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallets;
