import React from "react";
import {
  FiBarChart2,
  FiHelpCircle,
  FiRefreshCcw,
  FiTarget,
} from "react-icons/fi";
import Sidebar from "../components/Multipage/Sidebar";
import Dashboard from "../components/Dashboard/DashboardHeader";

const AiInsights = () => {
  return (
    <div className="flex h-screen bg-[#0b0d14] text-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Dashboard title="Ai Insights" />

        <div className="flex-1 overflow-y-auto px-10 pb-10 font-[Inter,Roboto,sans-serif]">
          <div className="mx-0 flex max-w-[1300px] flex-col gap-5">
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
                      AI-generated insights for February 2026
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-transparent px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-50"
                >
                  <FiRefreshCcw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              </div>

              <div className="text-[13px] leading-relaxed text-slate-300">
                <p className="mb-2 last:mb-0">
                  This month, your financial health looks positive. You&apos;ve
                  earned <strong>$6,550</strong> in total income and spent{" "}
                  <strong>$4,100</strong>, resulting in a net savings of{" "}
                  <strong>$2,450</strong>. Your spending has been relatively
                  controlled, with the largest expenses going toward Food &
                  Dining ($1,200) and Shopping ($800).
                </p>
                <p className="mb-2 last:mb-0">
                  However, I notice you&apos;re spending about{" "}
                  <strong className="text-amber-500">
                    29% of your income on food
                  </strong>
                  , which is slightly above the recommended 25%. Consider meal
                  planning or cooking at home more often to reduce this expense.
                  Your transportation costs are well-managed at $600, which is
                  excellent.
                </p>
                <p className="mb-2 last:mb-0">
                  Your current savings rate is{" "}
                  <strong className="text-emerald-500">37%</strong>, which is
                  fantastic! This puts you well ahead of the average savings rate
                  of 20%. Keep up the great work, and you&apos;ll reach your
                  financial goals in no time.
                </p>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-0.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Savings Rate
                  </span>
                  <span className="text-lg font-bold text-emerald-500">37%</span>
                </div>
                <div className="flex flex-col gap-0.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Net Income
                  </span>
                  <span className="text-lg font-bold text-slate-50">
                    $2,450
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Top Category
                  </span>
                  <span className="text-lg font-bold text-slate-50">
                    Food & Dining
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
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="m-0 text-sm font-semibold text-slate-50">
                      Goal: New Laptop
                    </h3>
                    <span className="text-xs text-slate-400">
                      Target $2,000 • Current $850
                    </span>
                  </div>
                  <p className="m-0 text-[13px] text-slate-300">
                    Based on your current savings rate of $2,450/month, you&apos;ll
                    reach your goal of $2,000 in approximately{" "}
                    <strong className="text-emerald-500">
                      0.5 months (2 weeks)
                    </strong>
                    . You&apos;re making excellent progress!
                  </p>
                  <div className="mt-1">
                    <h4 className="mb-1.5 text-[13px] font-semibold text-slate-50">
                      💡 Suggestions to reach your goal faster:
                    </h4>
                    <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-300">
                      <li>
                        Reduce Food & Dining expenses by $100/month (meal prep 2x
                        per week)
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

                <div className="h-px bg-slate-700" />

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="m-0 text-sm font-semibold text-slate-50">
                      Goal: Vacation Fund
                    </h3>
                    <span className="text-xs text-slate-400">
                      Target $4,000 • Current $1,200
                    </span>
                  </div>
                  <p className="m-0 text-[13px] text-slate-300">
                    You need $2,800 more to reach your vacation fund goal. At
                    your current pace, you&apos;ll achieve this in approximately{" "}
                    <strong className="text-emerald-500">1.1 months</strong>.
                  </p>
                  <div className="mt-1">
                    <h4 className="mb-1.5 text-[13px] font-semibold text-slate-50">
                      💡 Suggestions to reach your goal faster:
                    </h4>
                    <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-300">
                      <li>
                        Take on a freelance project ($300-$500 potential)
                      </li>
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
                  <li>
                    Your shopping expenses increased by 25% this month. Review
                    your purchases and consider waiting 24 hours before buying
                    non-essentials.
                  </li>
                  <li>
                    You&apos;re on track to exceed your monthly budget. Consider
                    adjusting your spending in the last week of the month.
                  </li>
                  <li>
                    Great job maintaining your emergency fund! You&apos;re 80% of
                    the way to your $10,000 goal.
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
