import {
  FaPen,
  FaTrash,
  FaUtensils,
  FaWallet,
  FaCar,
  FaFilm,
  FaBolt,
  FaShoppingBag,
  FaDumbbell,
  FaQuestion,
} from "react-icons/fa";

// Color for the category badge (the little pill label)
const CATEGORY_COLORS = {
  "Food & Dining": "text-orange-400 bg-orange-400/10",
  Income: "text-green-400 bg-green-400/10",
  Transportation: "text-blue-400 bg-blue-400/10",
  Entertainment: "text-purple-400 bg-purple-400/10",
  "Bills & Utilities": "text-yellow-400 bg-yellow-400/10",
  Shopping: "text-pink-400 bg-pink-400/10",
  "Health & Fitness": "text-teal-400 bg-teal-400/10",
};

const CATEGORY_ICON_COLORS = {
  "Food & Dining": "bg-orange-500",
  Income: "bg-green-500",
  Transportation: "bg-blue-500",
  Entertainment: "bg-purple-500",
  "Bills & Utilities": "bg-yellow-500",
  Shopping: "bg-pink-500",
  "Health & Fitness": "bg-teal-500",
};

const CATEGORY_ICONS = {
  "Food & Dining": FaUtensils,
  Income: FaWallet,
  Transportation: FaCar,
  Entertainment: FaFilm,
  "Bills & Utilities": FaBolt,
  Shopping: FaShoppingBag,
  "Health & Fitness": FaDumbbell,
};

// This is one single row in the table
function TransactionRow({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === "income";

  // Income shows green with a + sign, expense shows red
  const amountText = isIncome
    ? "+$" + transaction.amount.toLocaleString()
    : "$" + transaction.amount.toLocaleString();
  const amountColor = isIncome ? "text-green-400" : "text-red-400";

  const iconBg = CATEGORY_ICON_COLORS[transaction.category] || "bg-gray-600";
  const categoryStyle =
    CATEGORY_COLORS[transaction.category] || "text-gray-400 bg-white/5";
  const IconComponent = CATEGORY_ICONS[transaction.category] || FaQuestion;

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      {/* Title column */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {/* Colored square icon */}
          <div
            className={
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 " +
              iconBg
            }
          >
            <IconComponent className="text-white text-sm" />
          </div>
          <span className="text-white text-sm">{transaction.title}</span>
        </div>
      </td>

      {/* Category column */}
      <td className="py-3 px-4 hidden sm:table-cell">
        <span
          className={
            "text-xs px-2 py-1 rounded-full font-medium " + categoryStyle
          }
        >
          {transaction.category}
        </span>
      </td>

      {/* Wallet column */}
      <td className="py-3 px-4 text-gray-400 text-sm hidden md:table-cell">
        {transaction.paymentMethod}
      </td>

      {/* Amount column */}
      <td className={"py-3 px-4 text-sm font-semibold " + amountColor}>
        {amountText}
      </td>

      {/* Date column */}
      <td className="py-3 px-4 text-gray-400 text-sm">
        <div className="flex items-center justify-between gap-6">
          <span className="whitespace-nowrap">{transaction.date}</span>
          {!transaction.wallet?.isExternal && onEdit && onDelete && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(transaction)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                title="Edit"
              >
                <FaPen size={12} />
              </button>
              <button
                onClick={() => onDelete(transaction)}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 p-2 rounded-lg text-red-400 hover:text-red-300 transition-all cursor-pointer"
                title="Delete"
              >
                <FaTrash size={12} />
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// This is the full table with all rows
function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="overflow-auto">
      <table className="w-full">
        {/* Header row with column names */}
        <thead>
          <tr className="border-b border-white/5">
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
              Title
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left hidden sm:table-cell">
              Category
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left hidden md:table-cell">
              Wallet
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
              Amount
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
              Date
            </th>
          </tr>
        </thead>

        {/* All the transaction rows */}
        <tbody>
          {transactions.map(function (tx, index) {
            return (
              <TransactionRow
                key={index}
                transaction={tx}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </tbody>
      </table>

      {/* Show this message when no results match the search */}
      {transactions.length === 0 && (
        <div className="text-center py-16 text-gray-500 text-sm">
          No transactions found.
        </div>
      )}
    </div>
  );
}

export default TransactionTable;
