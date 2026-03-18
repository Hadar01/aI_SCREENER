import React from "react";

/**
 * ScoreBadge — Visual match score indicator with color coding.
 *
 * Props:
 *   score     – Number (0–100)
 *   size      – "sm" | "md" | "lg"
 *   className – Additional CSS classes
 */
export default function ScoreBadge({ score, size = "md", className = "" }) {
  if (score === null || score === undefined) {
    return (
      <span className={`inline-flex items-center text-gray-400 ${className}`}>
        N/A
      </span>
    );
  }

  const getColorClasses = (s) => {
    if (s >= 80) return "from-emerald-500 to-green-500 text-white shadow-emerald-500/30";
    if (s >= 60) return "from-blue-500 to-cyan-500 text-white shadow-blue-500/30";
    if (s >= 40) return "from-amber-500 to-yellow-500 text-white shadow-amber-500/30";
    return "from-red-500 to-rose-500 text-white shadow-red-500/30";
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm font-bold",
    lg: "h-16 w-16 text-lg font-extrabold",
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full
        bg-gradient-to-br ${getColorClasses(score)} ${sizeClasses[size]}
        shadow-lg transition-transform duration-200 hover:scale-110
        ${className}
      `}
      title={`Match Score: ${score}%`}
    >
      {score}
    </div>
  );
}
