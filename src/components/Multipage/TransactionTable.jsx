import { FaPen, FaTrash } from "react-icons/fa";

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

// Background color for the icon square on the left of each row
const ICON_COLORS = {
  "Grocery Shopping": "bg-orange-500",
  Salary: "bg-green-500",
  "Uber Ride": "bg-teal-500",
  "Netflix Subscription": "bg-red-500",
  "Freelance Project": "bg-green-500",
  "Restaurant Dinner": "bg-orange-500",
  "Electricity Bill": "bg-yellow-500",
  "Online Shopping": "bg-purple-500",
  "Gas Station": "bg-teal-500",
  "Coffee Shop": "bg-orange-500",
  "Client Payment": "bg-green-500",
  "Gym Membership": "bg-red-500",
};

// Takes a title like "Gas Station" and returns "GS"
function getInitials(title) {
  const words = title.split(" ");
  const firstTwo = words.slice(0, 2);
  const initials = firstTwo.map(function (word) {
    return word[0];
  });
  return initials.join("").toUpperCase();
}

// This is one single row in the table
function TransactionRow({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === "income";

  // Income shows green with a + sign, expense shows red
  const amountText = isIncome
    ? "+$" + transaction.amount.toLocaleString()
    : "$" + transaction.amount.toLocaleString();
  const amountColor = isIncome ? "text-green-400" : "text-red-400";

  const iconBg = ICON_COLORS[transaction.title] || "bg-gray-600";
  const categoryStyle =
    CATEGORY_COLORS[transaction.category] || "text-gray-400 bg-white/5";

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
            <span className="text-white text-xs font-bold">
              {getInitials(transaction.title)}
            </span>
          </div>
          <span className="text-white text-sm">{transaction.title}</span>
        </div>
      </td>

      {/* Category column */}
      <td className="py-3 px-4">
        <span
          className={
            "text-xs px-2 py-1 rounded-full font-medium " + categoryStyle
          }
        >
          {transaction.category}
        </span>
      </td>

      {/* Wallet column */}
      <td className="py-3 px-4 text-gray-400 text-sm">{transaction.wallet}</td>

      {/* Amount column */}
      <td className={"py-3 px-4 text-sm font-semibold " + amountColor}>
        {amountText}
      </td>

      {/* Date column */}
      <td className="py-3 px-4 text-gray-400 text-sm text-right">
        <div className="flex items-center justify-end gap-3">
          <span>{transaction.date}</span>
          {onEdit && onDelete && (
            <>
              <button
                onClick={() => onEdit(transaction)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Edit"
              >
                <FaPen size={12} />
              </button>
              <button
                onClick={() => onDelete(transaction)}
                className="text-red-400 hover:text-red-300 transition-colors"
                title="Delete"
              >
                <FaTrash size={12} />
              </button>
            </>
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
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
              Category
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
              Wallet
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
              Amount
            </th>
            <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
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
