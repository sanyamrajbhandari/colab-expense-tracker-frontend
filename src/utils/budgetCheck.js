import api from "./api";
import { toast } from "react-toastify";

/**
 * Checks if the user's overall budget is set and exceeded.
 * If exceeded, triggers a warning toast notification.
 * 
 * @param {Object} transaction - The transaction that was just added/updated.
 */
export const checkBudgetAndNotify = async (transaction) => {
  // Budget warning should only trigger if a transaction is explicitly provided
  if (!transaction) return;

  // 0. Respect the user's notification preference
  const notifPref = JSON.parse(localStorage.getItem("notificationPrefs") || "{}");
  if (notifPref.budgetExceeded === false) return;

  // 1. Must be an expense
  if (transaction.type !== "expense") return;

  // 2. Must be tracked in the current month of the current year
  if (transaction.date) {
    const txDate = new Date(transaction.date);
    const today = new Date();
    const isCurrentMonth = 
      txDate.getMonth() === today.getMonth() && 
      txDate.getFullYear() === today.getFullYear();
    
    if (!isCurrentMonth) return;
  }

  try {
    const budgetRes = await api.get("/budgets/current/status");
    if (budgetRes.data?.success) {
      const budgetData = budgetRes.data.data;
      const limit = Number(budgetData?.budgetAmount || 0);
      const spending = Number(budgetData?.totalExpense || 0);

      if (limit > 0 && spending > limit) {
        toast.warn(
          `Monthly budget exceeded! Limit: $${limit.toLocaleString()}, Spent: $${spending.toLocaleString()}. Exceeded by $${(spending - limit).toLocaleString()}!`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    }
  } catch (err) {
    // If no budget is set, endpoint returns 404, which is expected.
    if (err.response?.status !== 404) {
      console.error("Failed to check budget status:", err);
    }
  }
};
