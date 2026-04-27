import React, { useState } from "react";
// import "../css/BudgetsGoals.css";
import Sidebar from "../components/Multipage/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";

const BudgetsAndGoals = () => {
  const [limit, setLimit] = useState(5000);
  const [selectedMonth, setSelectedMonth] = useState("March 2026");
  const [spending, setSpending] = useState(4100);

  //Savings Goals
  // Each goal has a title, amount saved so far, a target amount, and a display color
  const [goals, setGoals] = useState([
    { title: "New Laptop", saved: 850, target: 2000, color: "#3b82f6" },
    { title: "Vacation Fund", saved: 1200, target: 3500, color: "#10b981" },
    { title: "Emergency Fund", saved: 5000, target: 10000, color: "#f59e0b" },
  ]);

  // MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [tempLimit, setTempLimit] = useState(limit);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);

  const percentUsed = (spending / limit) * 100;

  // OPEN MODALS
  const handleSetBudget = () => {
    setModalType("budget");
    setTempLimit(limit);
    setShowModal(true);
  };

  const handleAddGoal = () => {
    setModalType("addGoal");
    setGoalTitle("");
    setGoalTarget("");
    setShowModal(true);
  };

  const handleUpdateGoal = (index) => {
    setModalType("updateGoal");
    setSelectedGoalIndex(index);
    setUpdateAmount("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // ===== DELETE GOAL =====
  const handleDeleteGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  // ===== SAVE ACTION =====
  const handleSave = () => {
    if (modalType === "budget") {
      if (!isNaN(tempLimit) && tempLimit > 0) {
        setLimit(Number(tempLimit));
      }
    }

    if (modalType === "addGoal") {
      if (goalTitle && goalTarget && !isNaN(goalTarget)) {
        const newGoal = {
          title: goalTitle,
          saved: 0,
          target: Number(goalTarget),
          color: "#6366f1",
        };
        setGoals([...goals, newGoal]);
      }
    }

    if (modalType === "updateGoal") {
      if (!isNaN(updateAmount) && selectedGoalIndex !== null) {
        const updatedGoals = [...goals];
        // FIX 3: Prevent saved from exceeding the target
        updatedGoals[selectedGoalIndex].saved = Math.min(
          updatedGoals[selectedGoalIndex].saved + Number(updateAmount),
          updatedGoals[selectedGoalIndex].target,
        );
        setGoals(updatedGoals);
      }
    }

    setShowModal(false);
  };

  return (
    <div className="flex bg-gray-900 min-h-screen text-gray-200">
      <Sidebar activePage="Budgets & Goals" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <DashboardHeader
          title="Budgets & Goals"
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <div className="p-6">
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

            <div className="flex justify-between my-5">
              <div>
                <p className="text-sm text-gray-400">Current Spending</p>
                <h2 className="text-xl font-bold">
                  ${spending.toLocaleString()}
                </h2>
              </div>

              <div>
                <p className="text-sm text-gray-400">Budget Limit</p>
                <h3 className="text-lg font-semibold">
                  ${limit.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* progress */}
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>{percentUsed.toFixed(1)}% used</span>
              <span>${limit - spending} remaining</span>
            </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal, index) => {
              const percent = (goal.saved / goal.target) * 100;

              return (
                <div key={index} className="bg-gray-800 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{goal.title}</h4>
                    <div
                      className="w-8 h-8 rounded-md"
                      style={{ backgroundColor: goal.color }}
                    ></div>
                  </div>

                  <p className="text-gray-400 mt-2">
                    ${goal.saved} / ${goal.target}
                  </p>

                  <div className="w-full h-2 bg-gray-700 rounded-full my-3">
                    <div
                      className="h-full rounded-full"
                      style={{
                        // FIX 1: Cap progress bar at 100%
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: goal.color,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs mb-3">
                    <span>{percent.toFixed(0)}% complete</span>
                    {/* FIX 2: Prevent "to go" from going negative */}
                    <span>${Math.max(0, goal.target - goal.saved)} to go</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateGoal(index)}
                      className="w-full bg-gray-700 py-2 rounded-lg"
                    >
                      Update Progress
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(index)}
                      className="bg-red-600 px-3 py-2 rounded-lg text-white"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-[400px] text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {modalType === "budget" && "Monthly Budget"}
                {modalType === "addGoal" && "Add New Goal"}
                {modalType === "updateGoal" && "Update Progress"}
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
              {modalType === "updateGoal" && "Add progress to your goal."}
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
              </>
            )}

            {/* add goal */}
            {modalType === "addGoal" && (
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

            {/* update */}
            {modalType === "updateGoal" && (
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
