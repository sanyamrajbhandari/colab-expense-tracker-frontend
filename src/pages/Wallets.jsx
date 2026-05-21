import { useCallback, useEffect, useMemo, useState } from "react";
import WalletCard from "../components/Wallets/WalletCard";
import Sidebar from "../components/Multipage/Sidebar";
import Dashboard from "../components/Dashboard/DashboardHeader";
import { toast } from "react-toastify";
import api from "../utils/api";

/** Dark overlay backdrop for all modals. Closes on outside click. */
const ModalOverlay = ({ onClose, children }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]"
  >
    {/* Stop click from bubbling to overlay when clicking inside modal */}
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-[#151f2e] rounded-2xl p-6 sm:p-8 w-full max-w-[420px] mx-4 border border-white/[0.08]"
    >
      {children}
    </div>
  </div>
);

/** Small uppercase label used above inputs in modals */
const ModalLabel = ({ children }) => (
  <p className="text-[#8a9bbf] text-[11px] tracking-widest uppercase mb-2">
    {children}
  </p>
);

/** Dark input container box used for number/text inputs in modals */
const InputBox = ({ children }) => (
  <div className="flex items-center bg-[#1e2a3a] rounded-xl border border-white/10 px-4 py-3 mb-4">
    {children}
  </div>
);

/** Reusable Cancel button used in all modals */
const CancelBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 py-3.5 rounded-full bg-[#1e2a3a] border border-white/10 text-[#8a9bbf] text-sm cursor-pointer hover:bg-[#263347] transition-colors"
  >
    Cancel
  </button>
);

/** Reusable gradient Confirm button used in all modals */
const ConfirmBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex-1 py-3.5 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
  >
    {children}
  </button>
);

/** Shared input className for all text/number inputs inside InputBox */
const inputCls =
  "bg-transparent border-none text-white text-lg outline-none w-full placeholder:text-[#4a5a6a]";

/**
 * Wallets Page Component
 */
const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);

  const [newBalance, setNewBalance] = useState("");
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferFrom, setTransferFrom] = useState(null);
  const [transferTo, setTransferTo] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");

  const [newWallet, setNewWallet] = useState({
    walletName: "",
    balance: "",
    iconColor: "#a5b4fc",
  });

  const colors = ["#a5b4fc", "#f9a8d4", "#c4b5fd", "#fca5a5"];

  const totalBalance = useMemo(
    () => wallets.reduce((sum, w) => sum + (w.balance || 0), 0),
    [wallets],
  );

  const getWalletType = (name = "") => {
    const normalized = name.toLowerCase();
    if (normalized.includes("bank")) return "bank";
    if (normalized.includes("esewa")) return "esewa";
    if (normalized.includes("khalti")) return "khalti";
    if (normalized.includes("credit")) return "credit";
    return "cash";
  };

  const mapWallet = (wallet) => ({
    id: wallet._id,
    walletName: wallet.name,
    balance: Number(wallet.balance || 0),
    currency: "$",
    iconColor: wallet.color || "#a5b4fc",
    type: getWalletType(wallet.name),
    isExternal: wallet.isExternal,
    raw: wallet,
  });

  const fetchWallets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/wallets");
      const walletList = Array.isArray(response.data?.data)
        ? response.data.data.map(mapWallet)
        : [];
      setWallets(walletList);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load wallets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleOpenEdit = (wallet) => {
    setEditingWallet(wallet);
    setNewBalance(wallet.balance.toString());
    setNewName(wallet.walletName);
    setNewColor(wallet.iconColor);
    setShowEditModal(true);
  };

  const handleUpdateWallet = async () => {
    if (!newName.trim() || newBalance === "" || Number(newBalance) < 0) return;
    setIsSubmitting(true);
    try {
      const response = await api.put(`/wallets/${editingWallet.id}`, {
        name: newName.trim(),
        balance: Number(newBalance),
        color: newColor,
      });
      const updatedWallet = response.data?.data;
      setWallets((prev) =>
        prev.map((w) =>
          w.id === editingWallet.id ? mapWallet(updatedWallet) : w,
        ),
      );
      setShowEditModal(false);
      toast.success("Wallet updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wallet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenTransfer = (wallet) => {
    setTransferFrom(wallet);
    setTransferTo(wallets.find((w) => w.id !== wallet.id));
    setTransferAmount("");
    setShowTransferModal(true);
  };

  const handleSwapWallets = () => {
    setTransferFrom(transferTo);
    setTransferTo(transferFrom);
  };

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || amount > transferFrom.balance) return;
    setIsSubmitting(true);
    try {
      const response = await api.post("/wallets/transfer", {
        fromWalletId: transferFrom.id,
        toWalletId: transferTo.id,
        amount,
      });

      const fromWallet = mapWallet(response.data?.data?.fromWallet || {});
      const toWallet = mapWallet(response.data?.data?.toWallet || {});

      setWallets((prev) =>
        prev.map((w) => {
          if (w.id === fromWallet.id) return fromWallet;
          if (w.id === toWallet.id) return toWallet;
          return w;
        }),
      );
      setShowTransferModal(false);
      toast.success("Transfer completed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddWallet = async () => {
    if (!newWallet.walletName.trim() || newWallet.balance === "") return;
    setIsSubmitting(true);
    try {
      const response = await api.post("/wallets", {
        name: newWallet.walletName.trim(),
        initialBalance: Number(newWallet.balance),
        color: newWallet.iconColor,
      });

      setWallets((prev) => [mapWallet(response.data?.data), ...prev]);
      setNewWallet({ walletName: "", balance: "", iconColor: "#a5b4fc" });
      setShowAddModal(false);
      toast.success("Wallet created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create wallet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWallet = async (id) => {
    setIsSubmitting(true);
    try {
      await api.delete(`/wallets/${id}`);
      setWallets((prev) => prev.filter((w) => w.id !== id));
      toast.success("Wallet deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete wallet");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1623] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Dashboard title="Wallets" />
        <div className="flex-1 overflow-y-auto p-4 sm:p-7">
          <div className="flex justify-between items-center mb-7">
            <div>
              <p className="text-[#8a9bbf] text-sm mb-1">Total Balance</p>
              <h2 className="text-[#3b82f6] text-2xl sm:text-3xl font-bold leading-none">
                ${totalBalance.toLocaleString()}
              </h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-sm hover:bg-blue-500 transition-colors cursor-pointer"
            >
              + Add Wallet
            </button>
          </div>

          {isLoading ? (
            <p className="text-[#8a9bbf]">Loading wallets...</p>
          ) : wallets.length === 0 ? (
            <p className="text-[#8a9bbf]">
              No wallets yet. Add your first wallet to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          )}
        </div>
      </div>

      {/* ── Edit Wallet Modal ── */}
      {showEditModal && editingWallet && (
        <ModalOverlay onClose={() => setShowEditModal(false)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-xl font-bold">Edit Wallet</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-[#8a9bbf] text-xl bg-transparent border-none cursor-pointer hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <ModalLabel>Wallet Name</ModalLabel>
          <input
            placeholder="e.g., Main Wallet"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1e2a3a] text-white text-sm mb-4 outline-none placeholder:text-[#4a5a6a]"
          />

          <ModalLabel>Balance</ModalLabel>
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

          <ModalLabel>Wallet Color</ModalLabel>
          <div className="flex gap-2.5 mt-2 mb-6">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => setNewColor(color)}
                className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform"
                style={{
                  background: color,
                  border:
                    newColor === color
                      ? "3px solid #fff"
                      : "3px solid transparent",
                }}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <CancelBtn onClick={() => setShowEditModal(false)} />
            <ConfirmBtn onClick={handleUpdateWallet}>
              {isSubmitting ? "Updating..." : "Update Wallet"}
            </ConfirmBtn>
          </div>
        </ModalOverlay>
      )}

      {/* ── Transfer Money Modal ── */}
      {showTransferModal && transferFrom && transferTo && (
        <ModalOverlay onClose={() => setShowTransferModal(false)}>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-white text-xl font-bold">Transfer Money</h3>
            <button
              onClick={() => setShowTransferModal(false)}
              className="text-[#8a9bbf] text-xl bg-transparent border-none cursor-pointer hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-[#8a9bbf] text-sm mb-6">
            Move funds instantly between your wallets.
          </p>

          <ModalLabel>From Wallet</ModalLabel>
          <select
            value={transferFrom.id}
            onChange={(e) =>
              setTransferFrom(wallets.find((w) => w.id === e.target.value))
            }
            className="w-full px-4 py-3.5 rounded-xl bg-[#1e2a3a] border border-white/10 text-white text-sm mb-4 outline-none"
          >
            {wallets
              .filter((w) => w.id !== transferTo.id)
              .map((w) => (
                <option key={w.id} value={w.id}>
                  {w.walletName}
                </option>
              ))}
          </select>

          <div className="flex justify-center mb-4">
            <button
              onClick={handleSwapWallets}
              className="w-9 h-9 rounded-full bg-blue-500 text-white border-none cursor-pointer hover:bg-blue-400 transition-colors flex items-center justify-center"
            >
              ⇅
            </button>
          </div>

          <ModalLabel>To Wallet</ModalLabel>
          <select
            value={transferTo.id}
            onChange={(e) =>
              setTransferTo(wallets.find((w) => w.id === e.target.value))
            }
            className="w-full px-4 py-3.5 rounded-xl bg-[#1e2a3a] border border-white/10 text-white text-sm mb-4 outline-none"
          >
            {wallets
              .filter((w) => w.id !== transferFrom.id)
              .map((w) => (
                <option key={w.id} value={w.id}>
                  {w.walletName}
                </option>
              ))}
          </select>

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

          <div className="flex justify-between mb-6 -mt-2">
            <span className="text-[#8a9bbf] text-sm">
              Available: ${transferFrom.balance.toLocaleString()}
            </span>
            <button
              onClick={() => setTransferAmount(transferFrom.balance.toString())}
              className="bg-transparent border-none text-indigo-400 font-bold text-sm cursor-pointer hover:text-indigo-300 transition-colors"
            >
              USE MAX
            </button>
          </div>

          <div className="flex gap-3">
            <CancelBtn onClick={() => setShowTransferModal(false)} />
            <ConfirmBtn onClick={handleTransfer}>
              {isSubmitting ? "Transferring..." : "Transfer →"}
            </ConfirmBtn>
          </div>
        </ModalOverlay>
      )}

      {/* ── Add Wallet Modal ── */}
      {showAddModal && (
        <ModalOverlay onClose={() => setShowAddModal(false)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-xl font-bold">Add New Wallet</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-[#8a9bbf] text-xl bg-transparent border-none cursor-pointer hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <ModalLabel>Wallet Name</ModalLabel>
          <input
            placeholder="e.g., PayPal"
            value={newWallet.walletName}
            onChange={(e) =>
              setNewWallet((p) => ({ ...p, walletName: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1e2a3a] text-white text-sm mb-4 outline-none placeholder:text-[#4a5a6a]"
          />

          <ModalLabel>Initial Balance</ModalLabel>
          <InputBox>
            <span className="text-[#8a9bbf] mr-2">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={newWallet.balance}
              onChange={(e) =>
                setNewWallet((p) => ({ ...p, balance: e.target.value }))
              }
              className="bg-transparent border-none text-white text-sm outline-none w-full placeholder:text-[#4a5a6a]"
            />
          </InputBox>

          <ModalLabel>Wallet Color</ModalLabel>
          <div className="flex gap-2.5 mt-2 mb-6">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => setNewWallet((p) => ({ ...p, iconColor: color }))}
                className="w-9 h-9 rounded-full cursor-pointer hover:scale-110 transition-transform"
                style={{
                  background: color,
                  border:
                    newWallet.iconColor === color
                      ? "3px solid #fff"
                      : "3px solid transparent",
                }}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <CancelBtn onClick={() => setShowAddModal(false)} />
            <ConfirmBtn onClick={handleAddWallet}>
              {isSubmitting ? "Adding..." : "Add Wallet"}
            </ConfirmBtn>
          </div>

          <p className="text-[#3b4a5a] text-[10px] text-center mt-5 tracking-widest">
            SECURELY MANAGED BY SPENDWISE ENGINE
          </p>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Wallets;