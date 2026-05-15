import { useMemo, useState } from "react";
import {
  FiBarChart2,
  FiHelpCircle,
  FiRefreshCcw,
  FiTarget,
} from "react-icons/fi";
import Sidebar from "../components/Multipage/Sidebar";
import Dashboard from "../components/Dashboard/DashboardHeader";

import { toast } from "react-toastify";
import api from "../utils/api";

const AiInsights = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getUTCMonth() + 1);
  const [year, setYear] = useState(now.getUTCFullYear());
  const [goals, setGoals] = useState([
    { name: "New Laptop", targetAmount: 2000, currentAmount: 850 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  const addGoal = () => {
    setGoals((prev) => [
      ...prev,
      { name: "", targetAmount: "", currentAmount: "" },
    ]);
  };

  const updateGoal = (index, key, value) => {
    setGoals((prev) =>
      prev.map((goal, i) => (i === index ? { ...goal, [key]: value } : goal)),
    );
  };

  const removeGoal = (index) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const normalizedGoals = useMemo(
    () =>
      goals
        .filter((goal) => goal.name?.trim())
        .map((goal) => ({
          name: goal.name.trim(),
          targetAmount: Number(goal.targetAmount || 0),
          currentAmount: Number(goal.currentAmount || 0),
        })),
    [goals],
  );

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/insights/monthly", {
        month: Number(month),
        year: Number(year),
        goals: normalizedGoals,
      });
      setInsights(response.data?.data || null);
      toast.success("AI insights generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate insights");
    } finally {
      setIsLoading(false);
    }
  };

  const monthlySummary = insights?.monthlySummary;

  return (
    <div className="flex h-screen bg-[#0b0d14] text-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Dashboard title="Ai Insights" />

        <div className="flex-1 overflow-y-auto px-10 pb-10 font-[Inter,Roboto,sans-serif]">
          <div className="mx-0 flex max-w-[1300px] flex-col gap-5">
            <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div>
                <p className="mb-1 text-xs text-slate-400">Month</p>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-400">Year</p>
                <input
                  type="number"
                  min="2000"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={generateInsights}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                {isLoading ? "Generating..." : "Generate Insights"}
              </button>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Goals Sent to AI</h3>
                <button
                  type="button"
                  onClick={addGoal}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs"
                >
                  + Add Goal
                </button>
              </div>
              <div className="space-y-2">
                {goals.map((goal, index) => (
                  <div key={`${goal.name}-${index}`} className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={goal.name}
                      onChange={(e) => updateGoal(index, "name", e.target.value)}
                      placeholder="Goal name"
                      className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs"
                    />
                    <input
                      type="number"
                      value={goal.targetAmount}
                      onChange={(e) =>
                        updateGoal(index, "targetAmount", e.target.value)
                      }
                      placeholder="Target"
                      className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs"
                    />
                    <input
                      type="number"
                      value={goal.currentAmount}
                      onChange={(e) =>
                        updateGoal(index, "currentAmount", e.target.value)
                      }
                      placeholder="Current"
                      className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="rounded-md border border-red-500/40 px-2 py-1.5 text-xs text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>


            {/* Monthly Financial Summary */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800 p-6">
              <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15">
                    <FiBarChart2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="mb-0.5 text-base font-semibold text-slate-50">
                      Monthly Financial Summary
                    </h2>
                    <p className="m-0 text-[13px] text-slate-400">
                      {monthlySummary
                        ? `AI-generated insights for ${monthlySummary.monthLabel}`
                        : "Generate insights to view your monthly summary"}

                    </p>
                  </div>
                </div>
                <button
                  type="button"

                  onClick={generateInsights}
                  className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-transparent px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-50"
                >
                  <FiRefreshCcw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              </div>

              <div className="text-[13px] leading-relaxed text-slate-300">
                {insights?.financialSummary ? (
                  <p className="mb-2 last:mb-0">{insights.financialSummary}</p>
                ) : (
                  <p className="mb-2 last:mb-0">
                    No insights generated yet. Select month/year and click
                    Generate Insights.
                  </p>
                )}
              </div>

              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-0.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Savings Rate
                  </span>

                  <span className="text-lg font-bold text-emerald-500">
                    {monthlySummary ? `${monthlySummary.savingsRate}%` : "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Net Income
                  </span>
                  <span className="text-lg font-bold text-slate-50">
                    {monthlySummary
                      ? `$${monthlySummary.netSavings.toLocaleString()}`
                      : "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Top Category
                  </span>
                  <span className="text-lg font-bold text-slate-50">
                    {monthlySummary?.topExpenseCategories?.[0]?.category || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Savings Goal Prediction */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800 p-6">
              <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15">
                    <FiTarget className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="mb-0.5 text-base font-semibold text-slate-50">
                      Savings Goal Prediction
                    </h2>
                    <p className="m-0 text-[13px] text-slate-400">
                      AI-powered goal timeline & recommendations
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-6">
                {(insights?.goalInsights || []).length === 0 ? (
                  <p className="text-[13px] text-slate-400">
                    Add goals above to receive timeline and suggestions.
                  </p>
                ) : (
                  insights.goalInsights.map((goal, index) => (
                    <div key={`${goal.name}-${index}`}>
                      {index > 0 && <div className="mb-6 h-px bg-slate-700" />}
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="m-0 text-sm font-semibold text-slate-50">
                            Goal: {goal.name}
                          </h3>
                          <span className="text-xs text-slate-400">
                            Target ${goal.targetAmount} • Current $
                            {goal.currentAmount}
                          </span>
                        </div>
                        <p className="m-0 text-[13px] text-slate-300">
                          Remaining ${goal.remainingAmount}. Estimated months:{" "}
                          <strong className="text-emerald-500">
                            {goal.estimatedMonthsToGoal}
                          </strong>{" "}
                          ({goal.status})
                        </p>
                        <div className="mt-1">
                          <h4 className="mb-1.5 text-[13px] font-semibold text-slate-50">
                            Suggestions:
                          </h4>
                          <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-300">
                            {(goal.aiSuggestions || []).map((tip, tipIndex) => (
                              <li key={`${goal.name}-tip-${tipIndex}`}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Smart Financial Tips */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800 p-6">
              <div className="mb-1 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
                  <FiHelpCircle className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <h2 className="m-0 text-base font-semibold text-slate-50">
                    Smart Financial Tips
                  </h2>
                </div>
              </div>

              <div className="text-[13px] leading-relaxed text-slate-300">
                <ul className="m-0 list-disc space-y-1 pl-5">
                  {(insights?.smartTips || []).length > 0 ? (
                    insights.smartTips.map((tip, index) => (
                      <li key={`smart-tip-${index}`}>{tip}</li>
                    ))
                  ) : (
                    <li>Generate insights to view smart recommendations.</li>
                  )}

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
