import { useState } from "react";
import { FaWallet, FaBuilding, FaMobile, FaMobileAlt, FaCreditCard, FaTrash } from "react-icons/fa";

const icons = {
  cash:   <FaWallet     size={20} color="white" />,
  bank:   <FaBuilding   size={20} color="white" />,
  esewa:  <FaMobile     size={20} color="white" />,
  khalti: <FaMobileAlt  size={20} color="white" />,
  credit: <FaCreditCard size={20} color="white" />,
};

const WalletCard = ({ walletName, balance, currency, iconColor, type, onEdit, onTransfer, onDelete }) => {

  /** Controls visibility of the delete confirmation modal */
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* ── Wallet Card ── */}
      <div style={{ background: "#1a2235", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Icon + Delete Button Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>

          {/* Wallet type icon */}
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icons[type]}
          </div>

          {/* Delete button - opens confirmation modal */}
          <button
            onClick={() => setShowConfirm(true)}
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "6px 8px", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center" }}
          >
            <FaTrash size={14} />
          </button>
        </div>

        {/* Wallet Name */}
        <p style={{ color: "#8a9bbf", fontSize: "14px", margin: "0 0 6px" }}>{walletName}</p>

        {/* Balance */}
        <h2 style={{ color: "#e8edf5", fontSize: "28px", fontWeight: "700", margin: "0 0 20px" }}>
          {currency}{balance.toLocaleString()}
        </h2>

        {/* Edit + Transfer Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onEdit} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" }}>
            Edit
          </button>
          <button onClick={onTransfer} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" }}>
            Transfer
          </button>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showConfirm && (
        // Overlay: click outside to cancel
        <div
          onClick={() => setShowConfirm(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
        >
          {/* Modal box: stop click bubbling */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#151f2e", borderRadius: "16px", padding: "32px", width: "380px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}
          >
            {/* Trash icon */}
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FaTrash size={22} color="#ef4444" />
            </div>

            {/* Title */}
            <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>
              Delete Wallet
            </h3>

            {/* Confirmation message with wallet name */}
            <p style={{ color: "#8a9bbf", fontSize: "14px", margin: "0 0 28px" }}>
              Are you sure you want to delete{" "}
              <span style={{ color: "#fff", fontWeight: "600" }}>"{walletName}"</span>?
              <br />
              <span style={{ fontSize: "12px" }}>This action cannot be undone.</span>
            </p>

            {/* Cancel + Confirm Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              {/* Cancel - closes modal */}
              <button
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, padding: "12px", borderRadius: "30px", background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.1)", color: "#8a9bbf", cursor: "pointer", fontSize: "14px" }}
              >
                Cancel
              </button>

              {/* Confirm - deletes wallet and closes modal */}
              <button
                onClick={() => { onDelete(); setShowConfirm(false); }}
                style={{ flex: 1, padding: "12px", borderRadius: "30px", background: "#ef4444", border: "none", color: "#fff", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}
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