import { useState } from "react";
import WalletCard from "../components/Wallets/WalletCard";
import Sidebar from "../components/Multipage/Sidebar";
import Dashboard from "../components/Dashboard/DashboardHeader";
import { FaUniversity } from "react-icons/fa";

/**
 * Wallets Page Component
 *
 * Displays all user wallets in a 3-column grid layout.
 * Features:
 * - Shows total balance across all wallets
 * - Add new wallet via modal
 * - Edit wallet balance via modal
 * - Transfer funds between wallets via modal
 * - Delete a wallet
 */
const Wallets = () => {

  // ─── State ───────────────────────────────────────────────────────────────────

  /** List of all wallets with their details */
  const [wallets, setWallets] = useState([
    { id: 1, walletName: "Cash",        balance: 520.5,   currency: "$", iconColor: "#0fc98a", type: "cash"   },
    { id: 2, walletName: "Bank",        balance: 8450.75, currency: "$", iconColor: "#3b82f6", type: "bank"   },
    { id: 3, walletName: "eSewa",       balance: 1250,    currency: "$", iconColor: "#f59e0b", type: "esewa"  },
    { id: 4, walletName: "Khalti",      balance: 680.25,  currency: "$", iconColor: "#760af1", type: "khalti" },
    { id: 5, walletName: "Credit Card", balance: 3200,    currency: "$", iconColor: "#ef4444", type: "credit" },
  ]);

  /** Controls visibility of the Add Wallet modal */
  const [showAddModal,      setShowAddModal]      = useState(false);

  /** Controls visibility of the Edit Balance modal */
  const [showEditModal,     setShowEditModal]      = useState(false);

  /** Stores the wallet currently being edited */
  const [editingWallet,     setEditingWallet]      = useState(null);

  /** Stores the new balance input value in the Edit modal */
  const [newBalance,        setNewBalance]         = useState("");

  /** Controls visibility of the Transfer Money modal */
  const [showTransferModal, setShowTransferModal]  = useState(false);

  /** Wallet to transfer funds FROM */
  const [transferFrom,      setTransferFrom]       = useState(null);

  /** Wallet to transfer funds TO */
  const [transferTo,        setTransferTo]         = useState(null);

  /** Amount to transfer between wallets */
  const [transferAmount,    setTransferAmount]     = useState("");

  /** Stores form input values for the new wallet being created */
  const [newWallet,         setNewWallet]          = useState({
    walletName: "",
    balance: "",
    iconColor: "#a5b4fc",
  });

  // ─── Constants ───────────────────────────────────────────────────────────────

  /** Preset colors available for wallet icon */
  const colors = ["#a5b4fc", "#f9a8d4", "#c4b5fd", "#fca5a5"];

  /** Calculated total of all wallet balances */
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Opens the Edit Balance modal for the selected wallet.
   * @param {object} wallet - The wallet to edit
   */
  const handleOpenEdit = (wallet) => {
    setEditingWallet(wallet);
    setNewBalance("");
    setShowEditModal(true);
  };

  /**
   * Updates the balance of the wallet being edited.
   * Closes the modal after updating.
   */
  const handleUpdateBalance = () => {
    if (!newBalance) return; // Prevent update if input is empty
    setWallets((prev) =>
      prev.map((w) => w.id === editingWallet.id ? { ...w, balance: parseFloat(newBalance) } : w)
    );
    setShowEditModal(false);
  };

  /**
   * Opens the Transfer Money modal for the selected wallet.
   * Automatically sets the first other wallet as the transfer destination.
   * @param {object} wallet - The wallet to transfer FROM
   */
  const handleOpenTransfer = (wallet) => {
    setTransferFrom(wallet);
    setTransferTo(wallets.find((w) => w.id !== wallet.id)); // Default "to" wallet
    setTransferAmount("");
    setShowTransferModal(true);
  };

  /**
   * Swaps the FROM and TO wallets in the transfer modal.
   */
  const handleSwapWallets = () => {
    setTransferFrom(transferTo);
    setTransferTo(transferFrom);
  };

  /**
   * Executes the transfer between two wallets.
   * Validates: amount must be positive and not exceed available balance.
   */
  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || amount > transferFrom.balance) return; // Validation check
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === transferFrom.id) return { ...w, balance: w.balance - amount }; // Deduct from sender
        if (w.id === transferTo.id)   return { ...w, balance: w.balance + amount }; // Add to receiver
        return w;
      })
    );
    setShowTransferModal(false);
  };

  /**
   * Adds a new wallet to the wallets list.
   * Validates that walletName and balance are not empty.
   * Resets the form and closes the modal after successful addition.
   */
  const handleAddWallet = () => {
    if (!newWallet.walletName || !newWallet.balance) return; // Prevent adding empty wallet
    setWallets((prev) => [
      ...prev,
      {
        id: Date.now(), // Unique ID using timestamp
        walletName: newWallet.walletName,
        balance: parseFloat(newWallet.balance),
        currency: "$",
        iconColor: newWallet.iconColor,
        type: "cash",
      },
    ]);
    // Reset form and close modal
    setNewWallet({ walletName: "", balance: "", iconColor: "#a5b4fc" });
    setShowAddModal(false);
  };

  /**
   * Deletes a wallet from the list by its ID.
   * @param {number} id - The ID of the wallet to delete
   */
  const handleDeleteWallet = (id) => {
    setWallets((prev) => prev.filter((w) => w.id !== id));
  };

  // ─── Reusable Modal Components ───────────────────────────────────────────────

  /** Dark overlay backdrop for all modals. Closes on outside click. */
  const ModalOverlay = ({ onClose, children }) => (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      {/* Stop click from bubbling to overlay when clicking inside modal */}
      <div onClick={(e) => e.stopPropagation()} className="bg-[#151f2e] rounded-2xl p-8 w-[420px] border border-white/[0.08]">
        {children}
      </div>
    </div>
  );

  /** Small uppercase label used above inputs in modals */
  const ModalLabel = ({ children }) => (
    <p className="text-[#8a9bbf] text-[11px] tracking-widest uppercase mb-2">{children}</p>
  );

  /** Dark input container box used for number/text inputs in modals */
  const InputBox = ({ children }) => (
    <div className="flex items-center bg-[#1e2a3a] rounded-xl border border-white/10 px-4 py-3 mb-4">
      {children}
    </div>
  );

  /** Shared input className for all text/number inputs inside InputBox */
  const inputCls = "bg-transparent border-none text-white text-lg outline-none w-full placeholder:text-[#4a5a6a]";

  /** Reusable Cancel button used in all modals */
  const CancelBtn = ({ onClick }) => (
    <button onClick={onClick} className="flex-1 py-3.5 rounded-full bg-[#1e2a3a] border border-white/10 text-[#8a9bbf] text-sm cursor-pointer hover:bg-[#263347] transition-colors">
      Cancel
    </button>
  );

  /** Reusable gradient Confirm button used in all modals */
  const ConfirmBtn = ({ onClick, children }) => (
    <button onClick={onClick} className="flex-1 py-3.5 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity">
      {children}
    </button>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-[#0f1623] overflow-hidden">

      {/* ── Sidebar Navigation ── */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Dashboard Header ── */}
        <Dashboard title="Wallets" />

        <div className="flex-1 overflow-y-auto p-7">

          {/* ── Header: Total Balance + Add Wallet Button ── */}
          <div className="flex justify-between items-center mb-7">
            <div>
              <p className="text-[#8a9bbf] text-sm mb-1">Total Balance</p>
              <h2 className="text-[#3b82f6] text-3xl font-bold leading-none">
                ${totalBalance.toLocaleString()}
              </h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-sm hover:bg-blue-500 transition-colors"
            >
              + Add Wallet
            </button>
          </div>

          {/* ── Wallet Cards Grid: renders each wallet as a WalletCard ── */}
          <div className="grid grid-cols-3 gap-5">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                {...wallet}
                onEdit={() => handleOpenEdit(wallet)}
                onTransfer={() => handleOpenTransfer(wallet)}
                onDelete={() => handleDeleteWallet(wallet.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Edit Balance Modal ── */}
      {showEditModal && editingWallet && (
        <ModalOverlay onClose={() => setShowEditModal(false)}>
          <h3 className="text-white text-xl font-bold mb-1">Edit {editingWallet.walletName} Balance</h3>
          <p className="text-[#8a9bbf] text-sm mb-6">Update your current liquidity across all accounts.</p>

          {/* Current balance display */}
          <div className="flex justify-between items-center bg-[#1e2a3a] rounded-xl px-5 py-4 mb-5">
            <div>
              <p className="text-[#8a9bbf] text-[10px] tracking-widest uppercase mb-1">Current Balance</p>
              <p className="text-white text-2xl font-bold">${editingWallet.balance.toLocaleString()}</p>
            </div>
            <FaUniversity size={24} className="text-[#8a9bbf]" />
          </div>

          {/* New balance input */}
          <ModalLabel>New Balance</ModalLabel>
          <InputBox>
            <span className="text-[#8a9bbf] mr-2 text-lg">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className={inputCls}
            />
          </InputBox>

          {/* Info note about manual correction log */}
          <div className="flex items-center gap-2.5 bg-indigo-500/10 rounded-xl px-4 py-3 mb-6">
            <span className="text-indigo-400">ℹ</span>
            <p className="text-[#8a9bbf] text-xs">This adjustment will be logged as a manual balance correction.</p>
          </div>

          <div className="flex gap-3">
            <CancelBtn onClick={() => setShowEditModal(false)} />
            <ConfirmBtn onClick={handleUpdateBalance}>Update Balance</ConfirmBtn>
          </div>
        </ModalOverlay>
      )}

      {/* ── Transfer Money Modal ── */}
      {showTransferModal && transferFrom && transferTo && (
        <ModalOverlay onClose={() => setShowTransferModal(false)}>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-white text-xl font-bold">Transfer Money</h3>
            <button onClick={() => setShowTransferModal(false)} className="text-[#8a9bbf] text-xl bg-transparent border-none cursor-pointer hover:text-white transition-colors">✕</button>
          </div>
          <p className="text-[#8a9bbf] text-sm mb-6">Move funds instantly between your wallets.</p>

          {/* From wallet selector */}
          <ModalLabel>From Wallet</ModalLabel>
          <select
            value={transferFrom.id}
            onChange={(e) => setTransferFrom(wallets.find((w) => w.id === parseInt(e.target.value)))}
            className="w-full px-4 py-3.5 rounded-xl bg-[#1e2a3a] border border-white/10 text-white text-sm mb-4 outline-none"
          >
            {wallets.filter((w) => w.id !== transferTo.id).map((w) => (
              <option key={w.id} value={w.id}>{w.walletName}</option>
            ))}
          </select>

          {/* Swap button to reverse transfer direction */}
          <div className="flex justify-center mb-4">
            <button onClick={handleSwapWallets} className="w-9 h-9 rounded-full bg-blue-500 text-white border-none cursor-pointer hover:bg-blue-400 transition-colors flex items-center justify-center">
              ⇅
            </button>
          </div>

          {/* To wallet selector */}
          <ModalLabel>To Wallet</ModalLabel>
          <select
            value={transferTo.id}
            onChange={(e) => setTransferTo(wallets.find((w) => w.id === parseInt(e.target.value)))}
            className="w-full px-4 py-3.5 rounded-xl bg-[#1e2a3a] border border-white/10 text-white text-sm mb-4 outline-none"
          >
            {wallets.filter((w) => w.id !== transferFrom.id).map((w) => (
              <option key={w.id} value={w.id}>{w.walletName}</option>
            ))}
          </select>

          {/* Transfer amount input */}
          <ModalLabel>Amount</ModalLabel>
          <InputBox>
            <span className="text-[#8a9bbf] mr-2 text-lg">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className={inputCls}
            />
          </InputBox>

          {/* Available balance + USE MAX shortcut */}
          <div className="flex justify-between mb-6 -mt-2">
            <span className="text-[#8a9bbf] text-sm">Available: ${transferFrom.balance.toLocaleString()}</span>
            <button
              onClick={() => setTransferAmount(transferFrom.balance.toString())}
              className="bg-transparent border-none text-indigo-400 font-bold text-sm cursor-pointer hover:text-indigo-300 transition-colors"
            >
              USE MAX
            </button>
          </div>

          <div className="flex gap-3">
            <CancelBtn onClick={() => setShowTransferModal(false)} />
            <ConfirmBtn onClick={handleTransfer}>Transfer →</ConfirmBtn>
          </div>
        </ModalOverlay>
      )}

      {/* ── Add Wallet Modal ── */}
      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-xl font-bold">Add New Wallet</h3>
            <button onClick={() => setShowAddModal(false)} className="text-[#8a9bbf] text-xl bg-transparent border-none cursor-pointer hover:text-white transition-colors">✕</button>
          </div>

          {/* Wallet name input */}
          <ModalLabel>Wallet Name</ModalLabel>
          <input
            placeholder="e.g., PayPal"
            value={newWallet.walletName}
            onChange={(e) => setNewWallet((p) => ({ ...p, walletName: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1e2a3a] text-white text-sm mb-4 outline-none placeholder:text-[#4a5a6a]"
          />

          {/* Initial balance input */}
          <ModalLabel>Initial Balance</ModalLabel>
          <InputBox>
            <span className="text-[#8a9bbf] mr-2">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={newWallet.balance}
              onChange={(e) => setNewWallet((p) => ({ ...p, balance: e.target.value }))}
              className="bg-transparent border-none text-white text-sm outline-none w-full placeholder:text-[#4a5a6a]"
            />
          </InputBox>

          {/* Color picker: white border shows selected color */}
          <ModalLabel>Wallet Color</ModalLabel>
          <div className="flex gap-2.5 mt-2 mb-6">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => setNewWallet((p) => ({ ...p, iconColor: color }))}
                className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform"
                style={{ background: color, border: newWallet.iconColor === color ? "3px solid #fff" : "3px solid transparent" }}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <CancelBtn onClick={() => setShowAddModal(false)} />
            <ConfirmBtn onClick={handleAddWallet}>Add Wallet</ConfirmBtn>
          </div>

          {/* Footer note */}
          <p className="text-[#3b4a5a] text-[10px] text-center mt-5 tracking-widest">
            SECURELY MANAGED BY SPENDWISE ENGINE
          </p>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Wallets;