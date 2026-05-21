import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiBarChart2,
  FiHelpCircle,
  FiRefreshCcw,
  FiTarget,
} from "react-icons/fi";
import Sidebar from "../components/Multipage/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import { toast } from "react-toastify";
import api from "../utils/api";
import { buildMonthOptions, parseMonthFilter } from "../utils/dateUtils";

const AiInsights = () => {
  const monthOptions = useMemo(() => buildMonthOptions(), []);
  // Default to the current month (first option after "All")
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[1] || monthOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  const fetchOrGenerateInsights = useCallback(async (isRegenerate = false) => {
    const filter = parseMonthFilter(selectedMonth);
    if (!filter) {
      setInsights(null);
      return;
    }

    setIsLoading(true);
    try {
      if (isRegenerate) {
        // Explicit regeneration
        const genResponse = await api.post("/insights/generate", filter);
        setInsights(genResponse.data?.data || null);
        toast.success("AI insights regenerated");
      } else {
        // Try fetching first
        try {
          const response = await api.get("/insights/fetch", { params: filter });
          setInsights(response.data?.data || null);
        } catch (error) {
          if (error.response?.status === 404) {
            // Not found, generate
            const genResponse = await api.post("/insights/generate", filter);
            setInsights(genResponse.data?.data || null);
            toast.success("AI insights generated");
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process insights");
      setInsights(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchOrGenerateInsights();
  }, [fetchOrGenerateInsights]);

  const monthlySummary = insights?.monthlySummary;

  return (
    <div className="flex h-screen bg-[#0b0d14] text-slate-50 overflow-hidden">
      <Sidebar activePage="Ai Insights" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader 
          title="Ai Insights" 
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          monthOptions={monthOptions}
        />

        <div className="flex-1 overflow-y-auto px-10 pb-10 font-[Inter,Roboto,sans-serif]">
          <div className="mx-0 mt-6 flex max-w-[1300px] flex-col gap-6">
            
            {/* Monthly Financial Summary */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                    <FiBarChart2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="mb-0.5 text-lg font-bold text-slate-50">
                      Monthly Financial Summary
                    </h2>
                    <p className="m-0 text-sm text-slate-400">
                      {monthlySummary
                        ? `AI-generated insights for ${monthlySummary.monthLabel}`
                        : isLoading ? "Analyzing your finances..." : "Select a month to view insights"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isLoading || selectedMonth === "All"}
                  onClick={() => fetchOrGenerateInsights(true)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700 hover:text-slate-50 disabled:opacity-50"
                >
                  <FiRefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Regenerate
                </button>
              </div>

              <div className="text-[14px] leading-relaxed text-slate-300">
                {isLoading ? (
                  <div className="flex items-center gap-3 py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    <p>AI is processing your financial data...</p>
                  </div>
                ) : insights?.financialSummary ? (
                  <p className="mb-2 whitespace-pre-wrap last:mb-0">{insights.financialSummary}</p>
                ) : (
                  <p className="mb-2 italic text-slate-500 last:mb-0">
                    {selectedMonth === "All" 
                      ? "AI Insights are generated on a monthly basis. Please select a specific month."
                      : "No data available for this period. Try another month or add some transactions."}
                  </p>
                )}
              </div>

              {monthlySummary && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col gap-1 rounded-xl border border-slate-700 bg-slate-950/50 px-5 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Savings Rate
                    </span>
                    <span className="text-xl font-bold text-emerald-500">
                      {monthlySummary.savingsRate}%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl border border-slate-700 bg-slate-950/50 px-5 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total Income
                    </span>
                    <span className="text-xl font-bold text-slate-50">
                      ${monthlySummary.totalIncome?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl border border-slate-700 bg-slate-950/50 px-5 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Net Savings
                    </span>
                    <span className="text-xl font-bold text-blue-400">
                      ${monthlySummary.netSavings?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl border border-slate-700 bg-slate-950/50 px-5 py-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Top Expense
                    </span>
                    <span className="text-xl font-bold text-amber-400 truncate" title={monthlySummary.topExpenseCategories?.[0]?.category}>
                      {monthlySummary.topExpenseCategories?.[0]?.category || "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Savings Goal Prediction */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <div className="mb-1 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                  <FiTarget className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="mb-0.5 text-lg font-bold text-slate-50">
                    Savings Goal Progress
                  </h2>
                  <p className="m-0 text-sm text-slate-400">
                    AI-powered timeline & recommendations
                  </p>
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-6">
                {isLoading ? (
                  <div className="h-20 w-full animate-pulse rounded-lg bg-slate-700/50" />
                ) : (insights?.goalInsights || []).length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No active savings goals found for this period. 
                      Set up goals in the <span className="text-blue-400">Budgets & Goals</span> page to see AI predictions.
                    </p>
                  </div>
                ) : (
                  insights.goalInsights.map((goal, index) => (
                    <div key={`${goal.name}-${index}`} className="group relative">
                      {index > 0 && <div className="mb-6 h-px bg-slate-700/50" />}
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <h3 className="text-base font-bold text-slate-50 group-hover:text-emerald-400 transition-colors">
                            {goal.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-950/40 px-3 py-1 rounded-full border border-slate-700">
                            <span>Target: <b className="text-slate-200">${goal.targetAmount?.toLocaleString()}</b></span>
                            <span className="h-3 w-px bg-slate-700" />
                            <span>Saved: <b className="text-emerald-400">${goal.currentAmount?.toLocaleString()}</b></span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                             <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Status</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-tighter ${
                                  goal.status === 'on_track' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {goal.status?.replace('_', ' ')}
                                </span>
                             </div>
                             <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Est. Time to Goal</span>
                                <span className="text-slate-100 font-semibold">{goal.estimatedMonthsToGoal} months</span>
                             </div>
                             {/* Progress Bar */}
                             <div className="mt-2 h-2 w-full rounded-full bg-slate-700 overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 transition-all duration-1000" 
                                  style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                                />
                             </div>
                          </div>

                          <div className="rounded-xl bg-slate-950/40 p-4 border border-slate-700/50">
                            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                              AI Recommendations:
                            </h4>
                            <ul className="list-none space-y-2 text-sm leading-relaxed text-slate-300">
                              {(goal.aiSuggestions || []).map((tip, tipIndex) => (
                                <li key={`${goal.name}-tip-${tipIndex}`} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Smart Financial Tips */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <div className="mb-1 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                  <FiHelpCircle className="h-6 w-6 text-violet-500" />
                </div>
                <div>
                  <h2 className="m-0 text-lg font-bold text-slate-50">
                    Smart Financial Tips
                  </h2>
                </div>
              </div>

              <div className="text-[14px] leading-relaxed text-slate-300">
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-700/50" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-700/50" />
                  </div>
                ) : (insights?.smartTips || []).length > 0 ? (
                  <ul className="m-0 list-none space-y-3">
                    {insights.smartTips.map((tip, index) => (
                      <li key={`smart-tip-${index}`} className="flex items-start gap-3 rounded-lg bg-slate-950/30 p-3 border border-slate-700/30">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-400">
                          {index + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-slate-500">No specific tips for this period.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
