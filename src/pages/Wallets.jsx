import { useState } from "react";
import WalletCard from "../components/Wallets/WalletCard";
import Sidebar from "../components/Multipage/Sidebar";
import Dashboard from "../components/Dashboard/DashboardHeader";
import { FaUniversity } from "react-icons/fa";

const Wallets = () => {
  const [wallets, setWallets] = useState([
    { id: 1, walletName: "Cash",        balance: 520.5,   currency: "$", iconColor: "#0fc98a", type: "cash"   },
    { id: 2, walletName: "Bank",        balance: 8450.75, currency: "$", iconColor: "#3b82f6", type: "bank"   },
    { id: 3, walletName: "eSewa",       balance: 1250,    currency: "$", iconColor: "#f59e0b", type: "esewa"  },
    { id: 4, walletName: "Khalti",      balance: 680.25,  currency: "$", iconColor: "#760af1", type: "khalti" },
    { id: 5, walletName: "Credit Card", balance: 3200,    currency: "$", iconColor: "#ef4444", type: "credit" },
  ]);

  const [showAddModal,      setShowAddModal]      = useState(false);
  const [showEditModal,     setShowEditModal]     = useState(false);
  const [editingWallet,     setEditingWallet]     = useState(null);
  const [newBalance,        setNewBalance]        = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFrom,      setTransferFrom]      = useState(null);
  const [transferTo,        setTransferTo]        = useState(null);
  const [transferAmount,    setTransferAmount]    = useState("");
  const [newWallet,         setNewWallet]         = useState({ walletName: "", balance: "", iconColor: "#a5b4fc" });

  const colors       = ["#a5b4fc", "#f9a8d4", "#c4b5fd", "#fca5a5"];
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const handleOpenEdit = (wallet) => { setEditingWallet(wallet); setNewBalance(""); setShowEditModal(true); };
  const handleUpdateBalance = () => {
    if (!newBalance) return;
    setWallets((prev) => prev.map((w) => w.id === editingWallet.id ? { ...w, balance: parseFloat(newBalance) } : w));
    setShowEditModal(false);
  };
  const handleOpenTransfer = (wallet) => {
    setTransferFrom(wallet);
    setTransferTo(wallets.find((w) => w.id !== wallet.id));
    setTransferAmount("");
    setShowTransferModal(true);
  };
  const handleSwapWallets = () => { setTransferFrom(transferTo); setTransferTo(transferFrom); };
  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || amount > transferFrom.balance) return;
    setWallets((prev) => prev.map((w) => {
      if (w.id === transferFrom.id) return { ...w, balance: w.balance - amount };
      if (w.id === transferTo.id)   return { ...w, balance: w.balance + amount };
      return w;
    }));
    setShowTransferModal(false);
  };
  const handleAddWallet = () => {
    if (!newWallet.walletName || !newWallet.balance) return;
    setWallets((prev) => [...prev, {
      id: Date.now(), walletName: newWallet.walletName, balance: parseFloat(newWallet.balance),
      currency: "$", iconColor: newWallet.iconColor, type: "cash",
    }]);
    setNewWallet({ walletName: "", balance: "", iconColor: "#a5b4fc" });
    setShowAddModal(false);
  };

  // ── Reusable modal pieces ──────────────────────────────────────────────────
  const ModalOverlay = ({ onClose, children }) => (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div onClick={(e) => e.stopPropagation()} className="bg-[#151f2e] rounded-2xl p-8 w-[420px] border border-white/[0.08]">
        {children}
      </div>
    </div>
  );
  const ModalLabel = ({ children }) => (
    <p className="text-[#8a9bbf] text-[11px] tracking-widest uppercase mb-2">{children}</p>
  );
  const InputBox = ({ children }) => (
    <div className="flex items-center bg-[#1e2a3a] rounded-xl border border-white/10 px-4 py-3 mb-4">{children}</div>
  );
  const inputCls = "bg-transparent border-none text-white text-lg outline-none w-full placeholder:text-[#4a5a6a]";
  const CancelBtn = ({ onClick }) => (
    <button onClick={onClick} className="flex-1 py-3.5 rounded-full bg-[#1e2a3a] border border-white/10 text-[#8a9bbf] text-sm cursor-pointer hover:bg-[#263347] transition-colors">
      Cancel
    </button>
  );
  const ConfirmBtn = ({ onClick, children }) => (
    <button onClick={onClick} className="flex-1 py-3.5 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity">
      {children}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0f1623] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Dashboard title="Wallets" />

        <div className="flex-1 overflow-y-auto p-7">

          {/* ── Header ── */}
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

          {/* ── Wallet Cards Grid ── */}
          <div className="grid grid-cols-3 gap-5">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                {...wallet}
                onEdit={() => handleOpenEdit(wallet)}
                onTransfer={() => handleOpenTransfer(wallet)}
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

          <div className="flex justify-between items-center bg-[#1e2a3a] rounded-xl px-5 py-4 mb-5">
            <div>
              <p className="text-[#8a9bbf] text-[10px] tracking-widest uppercase mb-1">Current Balance</p>
              <p className="text-white text-2xl font-bold">${editingWallet.balance.toLocaleString()}</p>
            </div>
            <FaUniversity size={24} className="text-[#8a9bbf]" />
          </div>

          <ModalLabel>New Balance</ModalLabel>
          <InputBox>
            <span className="text-[#8a9bbf] mr-2 text-lg">$</span>
            <input type="number" placeholder="0.00" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} className={inputCls} />
          </InputBox>

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

      {/* ── Transfer Modal ── */}
      {showTransferModal && transferFrom && transferTo && (
        <ModalOverlay onClose={() => setShowTransferModal(false)}>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-white text-xl font-bold">Transfer Money</h3>
            <button onClick={() => setShowTransferModal(false)} className="text-[#8a9bbf] text-xl bg-transparent border-none cursor-pointer hover:text-white transition-colors">✕</button>
          </div>
          <p className="text-[#8a9bbf] text-sm mb-6">Move funds instantly between your wallets.</p>

          <ModalLabel>From Wallet</ModalLabel>
          <select value={transferFrom.id} onChange={(e) => setTransferFrom(wallets.find((w) => w.id === parseInt(e.target.value)))}
            className="w-full px-4 py-3.5 rounded-xl bg-[#1e2a3a] border border-white/10 text-white text-sm mb-4 outline-none">
            {wallets.filter((w) => w.id !== transferTo.id).map((w) => <option key={w.id} value={w.id}>{w.walletName}</option>)}
          </select>

          <div className="flex justify-center mb-4">
            <button onClick={handleSwapWallets} className="w-9 h-9 rounded-full bg-blue-500 text-white border-none cursor-pointer hover:bg-blue-400 transition-colors flex items-center justify-center">
              ⇅
            </button>
          </div>

          <ModalLabel>To Wallet</ModalLabel>
          <select value={transferTo.id} onChange={(e) => setTransferTo(wallets.find((w) => w.id === parseInt(e.target.value)))}
            className="w-full px-4 py-3.5 rounded-xl bg-[#1e2a3a] border border-white/10 text-white text-sm mb-4 outline-none">
            {wallets.filter((w) => w.id !== transferFrom.id).map((w) => <option key={w.id} value={w.id}>{w.walletName}</option>)}
          </select>

          <ModalLabel>Amount</ModalLabel>
          <InputBox>
            <span className="text-[#8a9bbf] mr-2 text-lg">$</span>
            <input type="number" placeholder="0.00" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className={inputCls} />
          </InputBox>

          <div className="flex justify-between mb-6 -mt-2">
            <span className="text-[#8a9bbf] text-sm">Available: ${transferFrom.balance.toLocaleString()}</span>
            <button onClick={() => setTransferAmount(transferFrom.balance.toString())} className="bg-transparent border-none text-indigo-400 font-bold text-sm cursor-pointer hover:text-indigo-300 transition-colors">
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

          <ModalLabel>Wallet Name</ModalLabel>
          <input placeholder="e.g., PayPal" value={newWallet.walletName}
            onChange={(e) => setNewWallet((p) => ({ ...p, walletName: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1e2a3a] text-white text-sm mb-4 outline-none placeholder:text-[#4a5a6a]" />

          <ModalLabel>Initial Balance</ModalLabel>
          <InputBox>
            <span className="text-[#8a9bbf] mr-2">$</span>
            <input type="number" placeholder="0.00" value={newWallet.balance}
              onChange={(e) => setNewWallet((p) => ({ ...p, balance: e.target.value }))}
              className="bg-transparent border-none text-white text-sm outline-none w-full placeholder:text-[#4a5a6a]" />
          </InputBox>

          <ModalLabel>Wallet Color</ModalLabel>
          <div className="flex gap-2.5 mt-2 mb-6">
            {colors.map((color) => (
              <div key={color} onClick={() => setNewWallet((p) => ({ ...p, iconColor: color }))}
                className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform"
                style={{ background: color, border: newWallet.iconColor === color ? "3px solid #fff" : "3px solid transparent" }} />
            ))}
          </div>

          <div className="flex gap-3">
            <CancelBtn onClick={() => setShowAddModal(false)} />
            <ConfirmBtn onClick={handleAddWallet}>Add Wallet</ConfirmBtn>
          </div>

          <p className="text-[#3b4a5a] text-[10px] text-center mt-5 tracking-widest">SECURELY MANAGED BY SPENDWISE ENGINE</p>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Wallets;