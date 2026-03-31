import { FaWallet, FaBuilding, FaMobile, FaMobileAlt, FaCreditCard } from "react-icons/fa";

const icons = {
  cash: <FaWallet size={20} color="white" />,
  bank: <FaBuilding size={20} color="white" />,
  esewa: <FaMobile size={20} color="white" />,
  khalti: <FaMobileAlt size={20} color="white" />,
  credit: <FaCreditCard size={20} color="white" />,
};

const WalletCard = ({ walletName, balance, currency, iconColor, type }) => {
  return (
    <div style={{ background: "#1a2235", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: iconColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
        {icons[type]}
      </div>
      <p style={{ color: "#8a9bbf", fontSize: "14px", margin: "0 0 6px" }}>{walletName}</p>
      <h2 style={{ color: "#e8edf5", fontSize: "28px", fontWeight: "700", margin: "0 0 20px" }}>
        {currency}{balance.toLocaleString()}
      </h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" }}>
          Edit
        </button>
        <button style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" }}>
          Transfer
        </button>
      </div>
    </div>
  );
};

export default WalletCard;