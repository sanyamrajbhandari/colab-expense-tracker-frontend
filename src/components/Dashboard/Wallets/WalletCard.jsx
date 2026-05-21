const WalletCard = ({ walletName, balance, currency }) => {
  return (
    <div style={{
      background: "#1a2235",
      borderRadius: "16px",
      padding: "24px",
      width: "280px",
    }}>
      <p style={{ color: "#8a9bbf", fontSize: "14px" }}>{walletName}</p>
      <h2 style={{ color: "#e8edf5", fontSize: "32px" }}>{currency}{balance}</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" }}>Edit</button>
        <button style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" }}>Transfer</button>
      </div>
    </div>
  );
};

export default WalletCard;