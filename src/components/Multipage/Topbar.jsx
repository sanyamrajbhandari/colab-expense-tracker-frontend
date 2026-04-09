import { ChevronDown, UserCircle } from "lucide-react";

function Topbar({ title }) {
  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">
        <button className="month-btn">
          March 2026 <ChevronDown size={16} style={{ marginLeft: "4px" }} />
        </button>
        <div className="avatar">
          <UserCircle size={32} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

export default Topbar;

