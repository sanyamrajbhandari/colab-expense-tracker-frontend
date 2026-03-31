import { useState } from "react";
import WalletCard from "../components/Dashboard/Wallets/WalletCard";

/**
 * Wallets Component
 *
 * Displays all user wallets in a responsive 3-column grid layout.
 * Shows total balance across all wallets and an "Add Wallet" button.
 *
 * @component
 * @returns {JSX.Element} The wallets page with wallet cards
 */
const Wallets = () => {

  /**
   * List of wallet objects
   * @type {Array<{id: number, walletName: string, balance: number, currency: string, iconColor: string, type: string}>}
   */
  const [wallets] = useState([
    { id: 1, walletName: "Cash", balance: 520.5, currency: "$", iconColor: "#0fc98a", type: "cash" },
    { id: 2, walletName: "Bank", balance: 8450.75, currency: "$", iconColor: "#3b82f6", type: "bank" },
    { id: 3, walletName: "eSewa", balance: 1250, currency: "$", iconColor: "#f59e0b", type: "esewa" },
    { id: 4, walletName: "Khalti", balance: 680.25, currency: "$", iconColor: "#760af1", type: "khalti" },
    { id: 5, walletName: "Credit Card", balance: 3200, currency: "$", iconColor: "#ef4444", type: "credit" },
  ]);

  /**
   * Calculates the total balance across all wallets
   * @type {number}
   */
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <div style={{ padding: "28px", background: "#0f1623", minHeight: "100vh" }}>
      {/* Header - shows total balance and add wallet button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <p style={{ color: "#8a9bbf", margin: 0 }}>Total Balance</p>
          <h2 style={{ color: "#3b82f6", fontSize: "28px", margin: 0 }}>${totalBalance.toLocaleString()}</h2>
        </div>
        <button style={{ padding: "10px 20px", borderRadius: "10px", background: "#3b82f6", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer" }}>
          + Add Wallet
        </button>
      </div>

      {/* Wallet Cards Grid - renders each wallet as a WalletCard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {wallets.map((wallet) => (
          <WalletCard key={wallet.id} {...wallet} />
        ))}
      </div>
    </div>
  );
};

export default Wallets;