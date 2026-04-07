import React, { useState } from "react";
import "../css/BudgetsGoals.css";
import Sidebar from "../components/Multipage/Sidebar";
import Topbar from "../components/Multipage/Topbar";

const BudgetsAndGoals = () => {
  const [limit, setLimit] = useState(5000);
  const [spending, setSpending] = useState(4100);

  const [goals, setGoals] = useState([
    { title: "New Laptop", saved: 850, target: 2000, color: "#3b82f6" },
    { title: "Vacation Fund", saved: 1200, target: 3500, color: "#10b981" },
    { title: "Emergency Fund", saved: 5000, target: 10000, color: "#f59e0b" },
  ]);

  // ===== MODAL STATES =====
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [tempLimit, setTempLimit] = useState(limit);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);

  const percentUsed = (spending / limit) * 100;

  // ===== OPEN MODALS =====
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
        updatedGoals[selectedGoalIndex].saved += Number(updateAmount);
        setGoals(updatedGoals);
      }
    }

    setShowModal(false);
  };

  return (
    <div className="app">
      <Sidebar />

      <div className="right-board">
        <Topbar title="Wallets" />

        <div className="budgets-container">
          <h2 className="page-title">Budgets & Goals</h2>

          {/* ===== BUDGET ===== */}
          <div className="budget-card">
            <div className="budget-header">
              <h3>Monthly Budget</h3>
              <button className="btn" onClick={handleSetBudget}>
                Set Budget
              </button>
            </div>

            <div className="budget-info">
              <div>
                <p className="label">Current Spending</p>
                <h2>${spending.toLocaleString()}</h2>
              </div>

              <div>
                <p className="label">Budget Limit</p>
                <h3>${limit.toLocaleString()}</h3>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>

            <div className="budget-footer">
              <span>{percentUsed.toFixed(1)}% used</span>
              <span>${limit - spending} remaining</span>
            </div>
          </div>

          {/* ===== GOALS ===== */}
          <div className="goals-header">
            <h3>Savings Goals</h3>
            <button className="btn" onClick={handleAddGoal}>
              + Add Goal
            </button>
          </div>

          <div className="goals-grid">
            {goals.map((goal, index) => {
              const percent = (goal.saved / goal.target) * 100;

              return (
                <div key={index} className="goal-card">
                  <div className="goal-top">
                    <h4>{goal.title}</h4>
                    <div
                      className="goal-icon"
                      style={{ backgroundColor: goal.color }}
                    ></div>
                  </div>

                  <p className="goal-amount">
                    ${goal.saved} / ${goal.target}
                  </p>

                  <div className="progress-bar small">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: goal.color,
                      }}
                    ></div>
                  </div>

                  <div className="goal-footer">
                    <span>{percent.toFixed(0)}% complete</span>
                    <span>${goal.target - goal.saved} to go</span>
                  </div>

                  <button
                    className="update-btn"
                    onClick={() => handleUpdateGoal(index)}
                  >
                    Update Progress
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalType === "budget" && "Monthly Budget"}
                {modalType === "addGoal" && "Add New Goal"}
                {modalType === "updateGoal" && "Update Progress"}
              </h3>
              <span className="close-btn" onClick={handleCloseModal}>
                ×
              </span>
            </div>

            <p className="modal-text">
              {modalType === "budget" && "Set your monthly spending limit."}
              {modalType === "addGoal" && "Create a new savings goal."}
              {modalType === "updateGoal" && "Add progress to your goal."}
            </p>

            {/* ===== BUDGET ===== */}
            {modalType === "budget" && (
              <>
                <label className="modal-label">BUDGET AMOUNT</label>
                <div className="input-box">
                  <span>$</span>
                  <input
                    type="number"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ===== ADD GOAL ===== */}
            {modalType === "addGoal" && (
              <>
                <label className="modal-label">GOAL NAME</label>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="e.g. New Phone"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                  />
                </div>

                <label className="modal-label" style={{ marginTop: "10px" }}>
                  TARGET AMOUNT
                </label>
                <div className="input-box">
                  <span>$</span>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ===== UPDATE ===== */}
            {modalType === "updateGoal" && (
              <>
                <label className="modal-label">ADD AMOUNT</label>
                <div className="input-box">
                  <span>$</span>
                  <input
                    type="number"
                    value={updateAmount}
                    onChange={(e) => setUpdateAmount(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                {modalType === "budget" && "Set Budget"}
                {modalType === "addGoal" && "Add Goal"}
                {modalType === "updateGoal" && "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsAndGoals;
