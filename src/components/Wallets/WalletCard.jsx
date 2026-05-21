import { useState } from "react";
import { FaWallet, FaBuilding, FaMobile, FaMobileAlt, FaCreditCard, FaTrash } from "react-icons/fa";

const icons = {
  cash: <FaWallet size={20} color="white" />,
  bank: <FaBuilding size={20} color="white" />,
  esewa: <FaMobile size={20} color="white" />,
  khalti: <FaMobileAlt size={20} color="white" />,
  credit: <FaCreditCard size={20} color="white" />,
};

const WalletCard = ({ walletName, balance, currency, iconColor, type, onEdit, onTransfer, onDelete, isExternal }) => {

  /** Controls visibility of the delete confirmation modal */
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* ── Wallet Card ── */}
      <div className="bg-[#1a2235] rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
        <div>
          {/* Icon + Delete Button Row */}
          <div className="flex justify-between items-start mb-4">
            {/* Wallet type icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: iconColor }}
            >
              {icons[type]}
            </div>

            {/* Delete button - opens confirmation modal */}
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 cursor-pointer text-red-500 hover:bg-red-500/20 transition-colors flex items-center"
            >
              <FaTrash size={14} />
            </button>
          </div>

          {/* Wallet Name */}
          <p className="text-[#8a9bbf] text-sm mb-1">{walletName}</p>

          {/* Balance */}
          <h2 className="text-[#e8edf5] text-2xl sm:text-3xl font-bold mb-5 leading-none">
            {currency}{balance.toLocaleString()}
          </h2>
        </div>

        {/* Edit + Transfer Buttons */}
        {!isExternal && (
          <div className="flex gap-2.5 mt-auto">
            <button
              onClick={onEdit}
              className="flex-1 py-2.5 rounded-xl bg-transparent border border-white/10 text-white hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={onTransfer}
              className="flex-1 py-2.5 rounded-xl bg-transparent border border-white/10 text-white hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium"
            >
              Transfer
            </button>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showConfirm && (
        // Overlay: click outside to cancel
        <div
          onClick={() => setShowConfirm(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]"
        >
          {/* Modal box: stop click bubbling */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#151f2e] rounded-2xl p-6 sm:p-8 w-full max-w-[380px] mx-4 border border-white/[0.08] text-center"
          >
            {/* Trash icon */}
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <FaTrash size={22} className="text-red-500" />
            </div>

            {/* Title */}
            <h3 className="text-white text-lg font-bold mb-2">
              Delete Wallet
            </h3>

            {/* Confirmation message with wallet name */}
            <p className="text-[#8a9bbf] text-sm mb-7 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">"{walletName}"</span>?
              <br />
              <span className="text-[11px]">This action cannot be undone.</span>
            </p>

            {/* Cancel + Confirm Buttons */}
            <div className="flex gap-3">
              {/* Cancel - closes modal */}
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-full bg-[#1e2a3a] border border-white/10 text-[#8a9bbf] text-sm cursor-pointer hover:bg-[#263347] transition-colors"
              >
                Cancel
              </button>

              {/* Confirm - deletes wallet and closes modal */}
              <button
                onClick={() => { onDelete(); setShowConfirm(false); }}
                className="flex-1 py-3 rounded-full bg-red-500 border-none text-white cursor-pointer font-bold text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletCard;