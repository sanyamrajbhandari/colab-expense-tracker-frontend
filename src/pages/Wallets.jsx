import { useState } from "react";
import WalletCard from "../components/Wallets/WalletCard";
import { FaUniversity } from "react-icons/fa";

const Wallets = () => {

  // ─── State ───────────────────────────────────────────────────────────────────
  const [wallets, setWallets] = useState([
    { id: 1, walletName: "Cash",        balance: 520.5,   currency: "$", iconColor: "#0fc98a", type: "cash"   },
    { id: 2, walletName: "Bank",        balance: 8450.75, currency: "$", iconColor: "#3b82f6", type: "bank"   },
    { id: 3, walletName: "eSewa",       balance: 1250,    currency: "$", iconColor: "#f59e0b", type: "esewa"  },
    { id: 4, walletName: "Khalti",      balance: 680.25,  currency: "$", iconColor: "#760af1", type: "khalti" },
    { id: 5, walletName: "Credit Card", balance: 3200,    currency: "$", iconColor: "#ef4444", type: "credit" },
  ]);

  /** Controls Add Wallet modal */
  const [showAddModal, setShowAddModal]           = useState(false);

  /** Controls Edit modal and which wallet is being edited */
  const [showEditModal, setShowEditModal]         = useState(false);
  const [editingWallet, setEditingWallet]         = useState(null);
  const [newBalance, setNewBalance]               = useState("");

  /** Controls Transfer modal and which wallet is transferring from */
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFrom, setTransferFrom]           = useState(null);
  const [transferTo, setTransferTo]               = useState(null);
  const [transferAmount, setTransferAmount]       = useState("");

  /** Add Wallet form state */
  const [newWallet, setNewWallet] = useState({ walletName: "", balance: "", iconColor: "#a5b4fc" });

  // ─── Constants ───────────────────────────────────────────────────────────────
  const colors      = ["#a5b4fc", "#f9a8d4", "#c4b5fd", "#fca5a5"];
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /** Opens edit modal for a specific wallet */
  const handleOpenEdit = (wallet) => {
    setEditingWallet(wallet);
    setNewBalance("");
    setShowEditModal(true);
  };

  /** Updates the balance of the wallet being edited */
  const handleUpdateBalance = () => {
    if (!newBalance) return;
    setWallets((prev) =>
      prev.map((w) => w.id === editingWallet.id ? { ...w, balance: parseFloat(newBalance) } : w)
    );
    setShowEditModal(false);
  };

  /** Opens transfer modal for a specific wallet */
  const handleOpenTransfer = (wallet) => {
    setTransferFrom(wallet);
    setTransferTo(wallets.find((w) => w.id !== wallet.id));
    setTransferAmount("");
    setShowTransferModal(true);
  };

  /** Swaps the from and to wallets in transfer modal */
  const handleSwapWallets = () => {
    setTransferFrom(transferTo);
    setTransferTo(transferFrom);
  };

  /** Transfers amount from one wallet to another */
  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || amount > transferFrom.balance) return;
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === transferFrom.id) return { ...w, balance: w.balance - amount };
        if (w.id === transferTo.id)   return { ...w, balance: w.balance + amount };
        return w;
      })
    );
    setShowTransferModal(false);
  };

  /** Adds a new wallet to the list */
  const handleAddWallet = () => {
    if (!newWallet.walletName || !newWallet.balance) return;
    setWallets((prev) => [...prev, {
      id: Date.now(),
      walletName: newWallet.walletName,
      balance: parseFloat(newWallet.balance),
      currency: "$",
      iconColor: newWallet.iconColor,
      type: "cash",
    }]);
    setNewWallet({ walletName: "", balance: "", iconColor: "#a5b4fc" });
    setShowAddModal(false);
  };

  // ─── Shared Styles ────────────────────────────────────────────────────────────
  const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 };
  const modalStyle   = { background: "#151f2e", borderRadius: "16px", padding: "32px", width: "420px", border: "1px solid rgba(255,255,255,0.08)" };
  const inputStyle   = { background: "none", border: "none", color: "#fff", fontSize: "18px", outline: "none", width: "100%" };
  const inputBoxStyle = { display: "flex", alignItems: "center", background: "#1e2a3a", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 16px", marginTop: "8px", marginBottom: "16px" };
  const labelStyle   = { color: "#8a9bbf", fontSize: "12px", letterSpacing: "1px" };
  const cancelBtnStyle = { flex: 1, padding: "14px", borderRadius: "30px", background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.1)", color: "#8a9bbf", cursor: "pointer", fontSize: "14px" };
  const confirmBtnStyle = { flex: 1, padding: "14px", borderRadius: "30px", background: "linear-gradient(135deg, #6366f1, #3b82f6)", border: "none", color: "#fff", cursor: "pointer", fontWeight: "700", fontSize: "14px" };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "28px", background: "#0f1623", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <p style={{ color: "#8a9bbf", margin: 0 }}>Total Balance</p>
          <h2 style={{ color: "#3b82f6", fontSize: "28px", margin: 0 }}>${totalBalance.toLocaleString()}</h2>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ padding: "10px 20px", borderRadius: "10px", background: "#3b82f6", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer" }}>
          + Add Wallet
        </button>
      </div>

      {/* ── Wallet Cards Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            {...wallet}
            onEdit={() => handleOpenEdit(wallet)}
            onTransfer={() => handleOpenTransfer(wallet)}
          />
        ))}
      </div>

      {/* ── Edit Balance Modal ── */}
      {showEditModal && editingWallet && (
        <div onClick={() => setShowEditModal(false)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>

            {/* Title */}
            <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: "22px" }}>Edit {editingWallet.walletName} Balance</h3>
            <p style={{ color: "#8a9bbf", margin: "0 0 24px", fontSize: "13px" }}>Update your current liquidity across all accounts.</p>

            {/* Current Balance Display */}
            <div style={{ background: "#1e2a3a", borderRadius: "10px", padding: "16px 20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ ...labelStyle, margin: "0 0 4px" }}>CURRENT BALANCE</p>
                <h2 style={{ color: "#fff", margin: 0, fontSize: "24px" }}>${editingWallet.balance.toLocaleString()}</h2>
              </div>
              <FaUniversity size={24} color="#8a9bbf" />
            </div>

            {/* New Balance Input */}
            <label style={labelStyle}>New Balance</label>
            <div style={inputBoxStyle}>
              <span style={{ color: "#8a9bbf", marginRight: "8px", fontSize: "18px" }}>$</span>
              <input type="number" placeholder="0.00" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} style={inputStyle} />
            </div>

            {/* Info Note */}
            <div style={{ background: "rgba(99,102,241,0.1)", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ color: "#6366f1" }}>ℹ</span>
              <p style={{ color: "#8a9bbf", margin: 0, fontSize: "13px" }}>This adjustment will be logged as a manual balance correction.</p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowEditModal(false)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={handleUpdateBalance} style={confirmBtnStyle}>Update Balance</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Transfer Money Modal ── */}
      {showTransferModal && transferFrom && transferTo && (
        <div onClick={() => setShowTransferModal(false)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <h3 style={{ color: "#fff", margin: 0, fontSize: "22px" }}>Transfer Money</h3>
              <button onClick={() => setShowTransferModal(false)} style={{ background: "none", border: "none", color: "#8a9bbf", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ color: "#8a9bbf", margin: "0 0 24px", fontSize: "13px" }}>Move funds instantly between your wallets.</p>

            {/* From Wallet */}
            <label style={labelStyle}>FROM WALLET</label>
            <select
              value={transferFrom.id}
              onChange={(e) => setTransferFrom(wallets.find((w) => w.id === parseInt(e.target.value)))}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", marginTop: "8px", outline: "none" }}
            >
              {wallets.filter((w) => w.id !== transferTo.id).map((w) => (
                <option key={w.id} value={w.id}>{w.walletName}</option>
              ))}
            </select>

            {/* Swap Button */}
            <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
              <button onClick={handleSwapWallets} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#3b82f6", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px" }}>⇅</button>
            </div>

            {/* To Wallet */}
            <label style={labelStyle}>TO WALLET</label>
            <select
              value={transferTo.id}
              onChange={(e) => setTransferTo(wallets.find((w) => w.id === parseInt(e.target.value)))}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", marginTop: "8px", outline: "none" }}
            >
              {wallets.filter((w) => w.id !== transferFrom.id).map((w) => (
                <option key={w.id} value={w.id}>{w.walletName}</option>
              ))}
            </select>

            {/* Amount Input */}
            <label style={{ ...labelStyle, display: "block", marginTop: "16px" }}>AMOUNT</label>
            <div style={inputBoxStyle}>
              <span style={{ color: "#8a9bbf", marginRight: "8px", fontSize: "18px" }}>$</span>
              <input type="number" placeholder="0.00" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} style={inputStyle} />
            </div>

            {/* Available Balance + Use Max */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", marginTop: "-8px" }}>
              <span style={{ color: "#8a9bbf", fontSize: "13px" }}>Available: ${transferFrom.balance.toLocaleString()}</span>
              <button onClick={() => setTransferAmount(transferFrom.balance.toString())} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>USE MAX</button>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowTransferModal(false)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={handleTransfer} style={confirmBtnStyle}>Transfer →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Wallet Modal ── */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ color: "#fff", margin: 0, fontSize: "20px" }}>Add New Wallet</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", color: "#8a9bbf", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>
            <label style={labelStyle}>Wallet Name</label>
            <input placeholder="e.g., PayPal" value={newWallet.walletName} onChange={(e) => setNewWallet((p) => ({ ...p, walletName: e.target.value }))}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "#1e2a3a", color: "#fff", fontSize: "14px", marginTop: "8px", marginBottom: "16px", boxSizing: "border-box", outline: "none" }} />
            <label style={labelStyle}>Initial Balance</label>
            <div style={inputBoxStyle}>
              <span style={{ color: "#8a9bbf", marginRight: "8px" }}>$</span>
              <input type="number" placeholder="0.00" value={newWallet.balance} onChange={(e) => setNewWallet((p) => ({ ...p, balance: e.target.value }))} style={{ ...inputStyle, fontSize: "14px" }} />
            </div>
            <label style={labelStyle}>Wallet Color</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "24px" }}>
              {colors.map((color) => (
                <div key={color} onClick={() => setNewWallet((p) => ({ ...p, iconColor: color }))}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", background: color, cursor: "pointer", border: newWallet.iconColor === color ? "3px solid #fff" : "3px solid transparent" }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowAddModal(false)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={handleAddWallet} style={confirmBtnStyle}>Add Wallet</button>
            </div>
            <p style={{ color: "#3b4a5a", fontSize: "11px", textAlign: "center", marginTop: "20px", letterSpacing: "1px" }}>SECURELY MANAGED BY SPENDWISE ENGINE</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallets;