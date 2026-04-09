import React, { useState } from "react";
import { FiAlertTriangle, FiBell, FiSave, FiUser } from "react-icons/fi";
import MonthDropdown from "../components/Multipage/MonthDropdown";
import "../css/Settings.css";
import Sidebar from "../components/Multipage/Sidebar";
import Dashboard from "../components/Dashboard/DashboardHeader";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff",
  });

  const [notifications, setNotifications] = useState({
    budgetExceeded: true,
    goalAchieved: true,
    largeTransactions: false,
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationsChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  const handleDeleteAccount = () => {
    alert("Warning: This will permanently delete your account.");
  };

  return (
    <div className="app">
      {/* Sidebar component */}
      <Sidebar />

      <div className="right-board">
        {/* Topbar component */}
        <Dashboard title="Settings" />

        <div className="settings-container">
          {/* <div className="settings-header">
            <h1>Settings</h1>
            <div className="header-actions">
              <MonthDropdown />
              <div className="header-profile">
                <FiUser className="profile-icon" />
              </div>
            </div>
          </div> */}

          <div className="settings-content">
            {/* Profile Card */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-icon-wrapper">
                  <FiUser className="card-title-icon" />
                </div>
                <h2>Profile</h2>
              </div>

              <form onSubmit={handleSave} className="settings-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="avatar-section">
                  <label>Avatar</label>
                  <div className="avatar-actions">
                    <div className="avatar-preview">
                      <FiUser className="profile-icon" />
                    </div>
                    <button type="button" className="btn-secondary">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary mt-4">
                  <FiSave className="btn-icon" />
                  Save Changes
                </button>
              </form>
            </div>

            {/* Notifications Card */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-icon-wrapper">
                  <FiBell className="card-title-icon" />
                </div>
                <h2>Notification Preferences</h2>
              </div>

              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <div className="toggle-title">Budget Exceeded</div>
                    <div className="toggle-desc">
                      Get notified when you exceed your monthly budget
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="budgetExceeded"
                      checked={notifications.budgetExceeded}
                      onChange={handleNotificationsChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <div className="toggle-title">Goal Achieved</div>
                    <div className="toggle-desc">
                      Get notified when you reach a savings goal
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="goalAchieved"
                      checked={notifications.goalAchieved}
                      onChange={handleNotificationsChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <div className="toggle-title">Large Transactions</div>
                    <div className="toggle-desc">
                      Get notified for transactions over $500
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="largeTransactions"
                      checked={notifications.largeTransactions}
                      onChange={handleNotificationsChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone Card */}
            <div className="settings-card danger-zone">
              <div className="card-header">
                <div className="card-icon-wrapper danger-icon">
                  <FiAlertTriangle className="card-title-icon" />
                </div>
                <h2 className="danger-title">Danger Zone</h2>
              </div>

              <div className="danger-content">
                <div className="toggle-info">
                  <div className="toggle-title" style={{ color: "white" }}>
                    Delete Account
                  </div>
                  <div className="toggle-desc">
                    Once you delete your account, there is no going back. All
                    your data including transactions, wallets, budgets, and
                    goals will be permanently deleted.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-danger mt-4"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
