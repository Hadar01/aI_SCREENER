import React from "react";
import { useStats } from "../hooks/useResumes";

/**
 * StatsPanel — Dashboard statistics overview.
 *
 * Props:
 *   className – Additional CSS classes
 */
export default function StatsPanel({ className = "" }) {
  const { data, isLoading, error } = useStats();
  const stats = data?.data || {};

  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 h-28"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
        Failed to load stats
      </div>
    );
  }

  const statCards = [
    {
      id: "stat-total",
      label: "Total Candidates",
      value: stats.total_candidates || 0,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      gradient: "from-indigo-500 to-blue-500",
      shadowColor: "shadow-indigo-500/20",
    },
    {
      id: "stat-avg-score",
      label: "Avg. Match Score",
      value: stats.avg_score != null ? `${stats.avg_score}%` : "—",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      ),
      gradient: "from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      id: "stat-completed",
      label: "Completed",
      value: stats.completed || 0,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      gradient: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/20",
    },
    {
      id: "stat-pending",
      label: "Pending",
      value: stats.pending || 0,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      gradient: "from-amber-500 to-orange-500",
      shadowColor: "shadow-amber-500/20",
    },
  ];

  return (
    <div className={className} id="stats-panel">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className={`
              relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/80
              border border-gray-100 dark:border-gray-700 p-5
              shadow-lg ${card.shadowColor} hover:shadow-xl
              transition-all duration-300 hover:-translate-y-0.5
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {card.value}
                </p>
              </div>
              <div
                className={`rounded-xl bg-gradient-to-br ${card.gradient} p-2.5`}
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {card.icon}
                </svg>
              </div>
            </div>

            {/* Decorative gradient blur */}
            <div
              className={`absolute -bottom-4 -right-4 h-20 w-20 rounded-full
                          bg-gradient-to-br ${card.gradient} opacity-10 blur-xl`}
            />
          </div>
        ))}
      </div>

      {/* Score Distribution */}
      {stats.score_distribution && (
        <div
          className="rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100
                     dark:border-gray-700 p-6"
          id="score-distribution"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
            Score Distribution
          </h3>
          <div className="flex items-end gap-3 h-32">
            {Object.entries(stats.score_distribution).map(
              ([range, count]) => {
                const maxCount = Math.max(
                  ...Object.values(stats.score_distribution),
                  1
                );
                const heightPct = (count / maxCount) * 100;

                const barColors = {
                  "0-19": "bg-red-500",
                  "20-39": "bg-orange-500",
                  "40-59": "bg-amber-500",
                  "60-79": "bg-blue-500",
                  "80-100": "bg-emerald-500",
                };

                return (
                  <div key={range} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {count}
                    </span>
                    <div
                      className={`w-full rounded-t-lg ${barColors[range]} transition-all duration-500`}
                      style={{
                        height: `${Math.max(heightPct, 4)}%`,
                        minHeight: "4px",
                      }}
                    />
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {range}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Top Missing Skills */}
      {stats.top_missing_skills?.length > 0 && (
        <div
          className="mt-4 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100
                     dark:border-gray-700 p-6"
          id="top-missing-skills"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
            Top Missing Skills (across all candidates)
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.top_missing_skills.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full
                           bg-gradient-to-r from-red-50 to-orange-50
                           dark:from-red-950/30 dark:to-orange-950/30
                           border border-red-100 dark:border-red-900
                           px-3 py-1 text-sm text-red-700 dark:text-red-400"
              >
                {item.skill}
                <span className="text-xs text-red-400 dark:text-red-500">
                  ({item.count})
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
