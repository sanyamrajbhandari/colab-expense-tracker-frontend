import { useEffect, useMemo, useState } from "react";
// import "../css/BudgetsGoals.css";
import Sidebar from "../components/Multipage/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import { toast } from "react-toastify";
import api from "../utils/api";

const BudgetsAndGoals = () => {
  const [limit, setLimit] = useState(0);
  const [budgetCategory, setBudgetCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("March 2026");
  const [spending, setSpending] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [serverMonth, setServerMonth] = useState(null);
  const [serverYear, setServerYear] = useState(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(true);

  //Savings Goals
  const [goals, setGoals] = useState([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);

  // MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [tempLimit, setTempLimit] = useState(limit);
  const [tempCategory, setTempCategory] = useState("");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);

  const percentUsed = useMemo(() => {
    if (!limit) return 0;
    return (spending / limit) * 100;
  }, [spending, limit]);

  const fetchBudgetStatus = async (categoryValue) => {
    setIsLoadingBudget(true);
    try {
      const response = await api.get("/budgets/current/status", {
        params: categoryValue && categoryValue !== "All" ? { category: categoryValue } : undefined,
      });
      const data = response.data?.data;
      setLimit(Number(data?.budgetAmount || 0));
      setSpending(Number(data?.totalExpense || 0));
      setRemainingAmount(Number(data?.remainingAmount || 0));
      setServerMonth(data?.month || null);
      setServerYear(data?.year || null);
    } catch (error) {
      if (error.response?.status === 404) {
        setLimit(0);
        setSpending(0);
        setRemainingAmount(0);
        // toast.info("No budget set yet for this month/category.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to load budget status",
        );
      }
    } finally {
      setIsLoadingBudget(false);
    }
  };

  const fetchGoals = async () => {
    setIsLoadingGoals(true);
    try {
      const response = await api.get("/saving-goals");
      setGoals(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load goals");
    } finally {
      setIsLoadingGoals(false);
    }
  };

  useEffect(() => {
    fetchBudgetStatus(budgetCategory);
    fetchGoals();
  }, [budgetCategory]);

  const categories = [
    "All",
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Bills & Utilities",
    "Shopping",
    "Health & Fitness",
    "Other",
  ];

  // OPEN MODALS
  const handleSetBudget = () => {
    setModalType("budget");
    setTempLimit(limit);
    setTempCategory(budgetCategory);
    setShowModal(true);
  };

  const handleAddGoal = () => {
    setModalType("addGoal");
    setGoalTitle("");
    setGoalTarget("");
    setShowModal(true);
  };

  const handleEditGoal = (goal) => {
    setModalType("editGoal");
    setSelectedGoal(goal);
    setGoalTitle(goal.title);
    setGoalTarget(goal.targetAmount);
    setShowModal(true);
  };

  const handleUpdateProgress = (goal) => {
    setModalType("updateProgress");
    setSelectedGoal(goal);
    setUpdateAmount("");
    setShowModal(true);
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await api.delete(`/saving-goals/${id}`);
      toast.success("Goal deleted successfully");
      fetchGoals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete goal");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // ===== SAVE ACTION =====
  const handleSave = async () => {
    try {
      if (modalType === "budget") {
        if (!isNaN(tempLimit) && Number(tempLimit) >= 0) {
          await api.post("/budgets/current", {
            amount: Number(tempLimit),
            category: tempCategory === "All" ? null : tempCategory?.trim() || null,
          });
          setBudgetCategory(tempCategory || "All");
          await fetchBudgetStatus(tempCategory || "All");
          toast.success("Current month budget saved successfully");
        }
      } else if (modalType === "addGoal") {
        if (goalTitle && goalTarget && !isNaN(goalTarget)) {
          await api.post("/saving-goals", {
            title: goalTitle,
            targetAmount: Number(goalTarget),
          });
          toast.success("Goal created successfully");
          fetchGoals();
        }
      } else if (modalType === "editGoal") {
        if (goalTitle && goalTarget && !isNaN(goalTarget)) {
          await api.put(`/saving-goals/${selectedGoal._id}`, {
            title: goalTitle,
            targetAmount: Number(goalTarget),
          });
          toast.success("Goal updated successfully");
          fetchGoals();
        }
      } else if (modalType === "updateProgress") {
        if (!isNaN(updateAmount) && updateAmount > 0) {
          await api.patch(`/saving-goals/${selectedGoal._id}/progress`, {
            amount: Number(updateAmount),
          });
          toast.success("Progress updated successfully");
          fetchGoals();
        }
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-gray-200 overflow-x-hidden">
      <Sidebar activePage="Budgets & Goals" />

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top header */}
        <DashboardHeader
          title="Budgets & Goals"
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <div className="p-4 sm:p-6">
          {/* ===== BUDGET CARD ===== */}
          <div className="bg-gray-800 p-5 rounded-xl mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Monthly Budget</h3>
              <button
                onClick={handleSetBudget}
                className="bg-blue-600 px-4 py-2 rounded-lg text-white"
              >
                Set Budget
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Budget month/year are server-side UTC current month.
              {serverMonth && serverYear
                ? ` Current: ${serverMonth}/${serverYear}`
                : ""}
            </p>

            <div className="mt-6">
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">Category Filter</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setBudgetCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      budgetCategory === cat
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {!isLoadingBudget && limit === 0 ? (
              <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-8 mt-6 text-center">
                <p className="text-gray-400">
                  No budget set for <span className="text-white font-semibold">{budgetCategory === "All" ? "overall monthly budget" : budgetCategory}</span>
                </p>
                <button
                  onClick={handleSetBudget}
                  className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium underline"
                >
                  Set one now
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between my-5">
                  <div>
                    <p className="text-sm text-gray-400">Current Spending</p>
                    <h2 className="text-xl font-bold">
                      {isLoadingBudget ? "Loading..." : `$${spending.toLocaleString()}`}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Budget Limit</p>
                    <h3 className="text-lg font-semibold">
                      {isLoadingBudget ? "Loading..." : `$${limit.toLocaleString()}`}
                    </h3>
                  </div>
                </div>

                {/* progress */}
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <span className={percentUsed > 100 ? "text-red-400" : "text-gray-400"}>
                    {percentUsed.toFixed(1)}% used
                  </span>
                  <span className={remainingAmount < 0 ? "text-red-400" : "text-gray-400"}>
                    ${remainingAmount.toLocaleString()} {remainingAmount < 0 ? "over budget" : "remaining"}
                  </span>
                </div>
              </>
            )}
          </div>
          {/* ===== GOALS HEADER ===== */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Savings Goals</h3>

            <button
              onClick={handleAddGoal}
              className="bg-blue-600 px-4 py-2 rounded-lg text-white"
            >
              + Add Goal
            </button>
          </div>
          {/* //GOALS GRID */}
          {isLoadingGoals ? (
            <div className="text-center py-10 text-gray-500">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No savings goals found. Click "+ Add Goal" to create one.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => {
                const percent = goal.progressPercentage || 0;
                const goalColor = "#6366f1"; // Default color

                return (
                  <div key={goal._id} className="bg-gray-800 p-4 rounded-xl relative group">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditGoal(goal)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit Goal"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal._id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Goal"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-400 mt-2">
                      ${goal.savedAmount} / ${goal.targetAmount}
                    </p>

                    <div className="w-full h-2 bg-gray-700 rounded-full my-3">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(percent, 100)}%`,
                          backgroundColor: goalColor,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs mb-3">
                      <span>{percent.toFixed(0)}% complete</span>
                      <span>${Math.max(0, goal.amountLeft)} to go</span>
                    </div>

                    {goal.isCompleted ? (
                      <div className="w-full bg-green-600 py-2 rounded-lg text-center text-white font-medium cursor-default">
                        ✓ Completed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpdateProgress(goal)}
                        className="w-full bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Update Progress
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-[400px] mx-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {modalType === "budget" && "Monthly Budget"}
                {modalType === "addGoal" && "Add New Goal"}
                {modalType === "editGoal" && "Edit Goal"}
                {modalType === "updateProgress" && "Update Progress"}
              </h3>

              <span
                onClick={handleCloseModal}
                className="cursor-pointer text-xl"
              >
                ×
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-2 mb-4">
              {modalType === "budget" && "Set your monthly spending limit."}
              {modalType === "addGoal" && "Create a new savings goal."}
              {modalType === "editGoal" && "Modify your savings goal details."}
              {modalType === "updateProgress" && "Add progress to your goal."}
            </p>

            {/* budget */}
            {modalType === "budget" && (
              <>
                <label className="text-xs text-gray-400">BUDGET AMOUNT</label>
                <div className="flex items-center bg-gray-700 p-3 rounded-lg mt-2">
                  <span className="mr-2">$</span>
                  <input
                    type="number"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(e.target.value)}
                    className="bg-transparent w-full outline-none"
                  />
                </div>
                <label className="text-xs text-gray-400 mt-3 block">
                  CATEGORY
                </label>
                <div className="bg-gray-700 p-3 rounded-lg mt-2">
                  <select
                    value={tempCategory}
                    onChange={(e) => setTempCategory(e.target.value)}
                    className="bg-transparent w-full outline-none text-white appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-800">
                        {cat === "All" ? "Overall Budget" : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* add or edit goal */}
            {(modalType === "addGoal" || modalType === "editGoal") && (
              <>
                <label className="text-xs text-gray-400">GOAL NAME</label>
                <div className="bg-gray-700 p-3 rounded-lg mt-2">
                  <input
                    type="text"
                    placeholder="e.g. New Phone"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="bg-transparent w-full outline-none"
                  />
                </div>

                <label className="text-xs text-gray-400 mt-3 block">
                  TARGET AMOUNT
                </label>

                <div className="flex items-center bg-gray-700 p-3 rounded-lg mt-2">
                  <span className="mr-2">$</span>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="bg-transparent w-full outline-none"
                  />
                </div>
              </>
            )}

            {/* update progress */}
            {modalType === "updateProgress" && (
              <>
                <label className="text-xs text-gray-400">ADD AMOUNT</label>
                <div className="flex items-center bg-gray-700 p-3 rounded-lg mt-2">
                  <span className="mr-2">$</span>
                  <input
                    type="number"
                    value={updateAmount}
                    onChange={(e) => setUpdateAmount(e.target.value)}
                    className="bg-transparent w-full outline-none"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsAndGoals;
