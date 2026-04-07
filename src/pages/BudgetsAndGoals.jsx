import React from "react";
import "../css/BudgetsGoals.css";
import Sidebar from "../components/Multipage/Sidebar";
import Topbar from "../components/Multipage/Topbar";

const goals = [
  {
    title: "New Laptop",
    saved: 850,
    target: 2000,
    color: "#3b82f6",
  },
  {
    title: "Vacation Fund",
    saved: 1200,
    target: 3500,
    color: "#10b981",
  },
  {
    title: "Emergency Fund",
    saved: 5000,
    target: 10000,
    color: "#f59e0b",
  },
];

const BudgetsGoals = () => {
  const spending = 4100;
  const limit = 5000;
  const percentUsed = (spending / limit) * 100;

  return (
    <div className="app">
      {/* Sidebar component */}
      <Sidebar />

      <div className="right-board">
        {/* Topbar component */}
        <Topbar title="Wallets" />

        <div className="budgets-container">
          <h2 className="page-title">Budgets & Goals</h2>

          {/* Monthly Budget */}
          <div className="budget-card">
            <div className="budget-header">
              <h3>Monthly Budget</h3>
              <button className="btn">Set Budget</button>
            </div>

            <div className="budget-info">
              <div>
                <p className="label">Current Spending</p>
                <h2>${spending.toLocaleString()}</h2>
              </div>

              <div className="right">
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

          {/* Savings Goals */}
          <div className="goals-header">
            <h3>Savings Goals</h3>
            <button className="btn">+ Add Goal</button>
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

                  <button className="update-btn">Update Progress</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsGoals;
