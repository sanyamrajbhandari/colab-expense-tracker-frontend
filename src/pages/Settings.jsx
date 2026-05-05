import React, { useState } from "react";
import { FiAlertTriangle, FiBell, FiSave, FiUser } from "react-icons/fi";
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

  const toggleRow =
    "flex items-center justify-between border-b border-slate-700 pb-4 last:border-b-0 last:pb-0";

  const ToggleSwitch = ({ name, checked, onChange }) => (
    <label className="relative ml-5 inline-flex h-6 w-11 shrink-0 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-slate-100 transition-colors peer-checked:bg-blue-500" />
      <span className="pointer-events-none absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-slate-900 transition-transform peer-checked:translate-x-5 peer-checked:bg-white" />
    </label>
  );

  return (
    <div className="flex h-screen bg-[#0b0d14] text-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Dashboard title="Settings" />

        <div className="flex-1 overflow-y-auto px-10 pb-10 font-[Inter,Roboto,sans-serif]">
          <div className="mx-0 flex max-w-[900px] flex-col gap-5">
            {/* Profile Card */}
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-8 py-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center text-blue-500">
                  <FiUser className="h-[22px] w-[22px]" />
                </div>
                <h2 className="m-0 text-lg font-semibold text-slate-50">Profile</h2>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-50"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-slate-50 outline-none transition-colors focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-50"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-slate-50 outline-none transition-colors focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-semibold text-slate-50">
                    Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                      <FiUser className="h-6 w-6 text-white" />
                    </div>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-50 transition-colors hover:border-slate-600 hover:bg-slate-800"
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  <FiSave className="h-[18px] w-[18px]" />
                  Save Changes
                </button>
              </form>
            </div>

            {/* Notifications Card */}
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-8 py-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center text-blue-500">
                  <FiBell className="h-[22px] w-[22px]" />
                </div>
                <h2 className="m-0 text-lg font-semibold text-slate-50">
                  Notification Preferences
                </h2>
              </div>

              <div className="flex flex-col gap-5">
                <div className={toggleRow}>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-semibold text-slate-50">
                      Budget Exceeded
                    </div>
                    <div className="text-[13px] leading-snug text-slate-400">
                      Get notified when you exceed your monthly budget
                    </div>
                  </div>
                  <ToggleSwitch
                    name="budgetExceeded"
                    checked={notifications.budgetExceeded}
                    onChange={handleNotificationsChange}
                  />
                </div>

                <div className={toggleRow}>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-semibold text-slate-50">
                      Goal Achieved
                    </div>
                    <div className="text-[13px] leading-snug text-slate-400">
                      Get notified when you reach a savings goal
                    </div>
                  </div>
                  <ToggleSwitch
                    name="goalAchieved"
                    checked={notifications.goalAchieved}
                    onChange={handleNotificationsChange}
                  />
                </div>

                <div className={toggleRow}>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-semibold text-slate-50">
                      Large Transactions
                    </div>
                    <div className="text-[13px] leading-snug text-slate-400">
                      Get notified for transactions over $500
                    </div>
                  </div>
                  <ToggleSwitch
                    name="largeTransactions"
                    checked={notifications.largeTransactions}
                    onChange={handleNotificationsChange}
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone Card */}
            <div className="rounded-xl border border-red-950 bg-[#1a1625] px-8 py-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center text-red-500">
                  <FiAlertTriangle className="h-[22px] w-[22px]" />
                </div>
                <h2 className="m-0 text-lg font-semibold text-slate-50">
                  Danger Zone
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-[#25121b] p-4">
                  <div className="mb-1 text-sm font-semibold text-white">
                    Delete Account
                  </div>
                  <div className="text-[13px] leading-snug text-slate-400">
                    Once you delete your account, there is no going back. All your
                    data including transactions, wallets, budgets, and goals will
                    be permanently deleted.
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 w-fit rounded-md bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
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
