import React from "react";
import {
  FiBarChart2,
  FiHelpCircle,
  FiRefreshCcw,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import MonthDropdown from "../components/Multipage/MonthDropdown";
import Sidebar from "../components/Multipage/Sidebar";
import Topbar from "../components/Multipage/Topbar";
import "../css/AIInsights.css";

const AiInsights = () => {
  return (
    <div className="app">
      {/* Sidebar component */}
      <Sidebar />

      <div className="right-board">
        {/* Topbar component */}
        <Topbar title="Ai Insights" />

        <div className="insights-container">
          {/* <div className="insights-header-top">
            <h1>AI Insights</h1> */}
          {/* <div className="header-actions">
              <MonthDropdown />
              <div className="header-profile">
                <FiUser className="profile-icon" />
              </div>
            </div>
          </div> */}

          <div className="insights-content">
            {/* Monthly Financial Summary */}
            <div className="insight-widescreen-card">
              <div className="card-header-flex">
                <div className="card-title-group">
                  <div className="icon-box blue-box">
                    <FiBarChart2 />
                  </div>
                  <div>
                    <h2>Monthly Financial Summary</h2>
                    <p className="subtitle">
                      AI-generated insights for February 2026
                    </p>
                  </div>
                </div>
                <button className="regenerate-btn">
                  <FiRefreshCcw />
                  Regenerate
                </button>
              </div>

              <div className="card-body-text">
                <p>
                  This month, your financial health looks positive. You've
                  earned <strong>$6,550</strong> in total income and spent{" "}
                  <strong>$4,100</strong>, resulting in a net savings of{" "}
                  <strong>$2,450</strong>. Your spending has been relatively
                  controlled, with the largest expenses going toward Food &
                  Dining ($1,200) and Shopping ($800).
                </p>
                <p>
                  However, I notice you're spending about{" "}
                  <strong className="text-warning">
                    29% of your income on food
                  </strong>
                  , which is slightly above the recommended 25%. Consider meal
                  planning or cooking at home more often to reduce this expense.
                  Your transportation costs are well-managed at $600, which is
                  excellent.
                </p>
                <p>
                  Your current savings rate is{" "}
                  <strong className="text-success">37%</strong>, which is
                  fantastic! This puts you well ahead of the average savings
                  rate of 20%. Keep up the great work, and you'll reach your
                  financial goals in no time.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Savings Rate</span>
                  <span className="stat-value text-success">37%</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Net Income</span>
                  <span className="stat-value">$2,450</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Top Category</span>
                  <span className="stat-value">Food & Dining</span>
                </div>
              </div>
            </div>

            {/* Savings Goal Prediction */}
            <div className="insight-widescreen-card">
              <div className="card-header-flex">
                <div className="card-title-group">
                  <div className="icon-box green-box">
                    <FiTarget />
                  </div>
                  <div>
                    <h2>Savings Goal Prediction</h2>
                    <p className="subtitle">
                      AI-powered goal timeline & recommendations
                    </p>
                  </div>
                </div>
              </div>

              <div className="goals-container">
                <div className="goal-section">
                  <div className="goal-header">
                    <h3 className="goal-title">Goal: New Laptop</h3>
                    <span className="goal-target">
                      Target $2,000 • Current $850
                    </span>
                  </div>
                  <p className="goal-desc">
                    Based on your current savings rate of $2,450/month, you'll
                    reach your goal of $2,000 in approximately{" "}
                    <strong className="text-success">
                      0.5 months (2 weeks)
                    </strong>
                    . You're making excellent progress!
                  </p>
                  <div className="suggestions-box">
                    <h4>💡 Suggestions to reach your goal faster:</h4>
                    <ul>
                      <li>
                        Reduce Food & Dining expenses by $100/month (meal prep
                        2x per week)
                      </li>
                      <li>
                        Cancel unused subscriptions (potential savings:
                        $45/month)
                      </li>
                      <li>
                        Consider selling items you no longer use for extra cash
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="goal-divider"></div>

                <div className="goal-section">
                  <div className="goal-header">
                    <h3 className="goal-title">Goal: Vacation Fund</h3>
                    <span className="goal-target">
                      Target $4,000 • Current $1,200
                    </span>
                  </div>
                  <p className="goal-desc">
                    You need $2,800 more to reach your vacation fund goal. At
                    your current pace, you'll achieve this in approximately{" "}
                    <strong className="text-success">1.1 months</strong>.
                  </p>
                  <div className="suggestions-box">
                    <h4>💡 Suggestions to reach your goal faster:</h4>
                    <ul>
                      <li>Take on a freelance project ($300-$500 potential)</li>
                      <li>Reduce entertainment spending by $150/month</li>
                      <li>
                        Set up automatic transfers of $100/week to your vacation
                        fund
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Financial Tips */}
            <div className="insight-widescreen-card">
              <div className="card-header-flex">
                <div className="card-title-group">
                  <div className="icon-box purple-box">
                    <FiHelpCircle />
                  </div>
                  <div>
                    <h2>Smart Financial Tips</h2>
                  </div>
                </div>
              </div>

              <div className="tips-list">
                <ul>
                  <li>
                    Your shopping expenses increased by 25% this month. Review
                    your purchases and consider waiting 24 hours before buying
                    non-essentials.
                  </li>
                  <li>
                    You're on track to exceed your monthly budget. Consider
                    adjusting your spending in the last week of the month.
                  </li>
                  <li>
                    Great job maintaining your emergency fund! You're 80% of the
                    way to your $10,000 goal.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
