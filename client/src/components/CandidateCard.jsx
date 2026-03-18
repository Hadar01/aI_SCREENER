import React from "react";
import ScoreBadge from "./ScoreBadge";

/**
 * CandidateCard — Compact resume analysis card for the candidate list.
 *
 * Props:
 *   candidate  – Resume document from the API
 *   onClick    – Callback when the card is clicked (e.g., to open detail view)
 *   onDelete   – Callback to delete the candidate
 *   className  – Additional CSS classes
 */
export default function CandidateCard({
  candidate,
  onClick,
  onDelete,
  className = "",
}) {
  const {
    _id,
    candidate_name,
    email,
    job_title,
    original_filename,
    analysis,
    status,
    createdAt,
  } = candidate;

  const statusColors = {
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    analyzing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    parsing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    uploaded: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  };

  const recommendationLabels = {
    strong_yes: { text: "Strong Yes", color: "text-emerald-600 dark:text-emerald-400" },
    yes: { text: "Yes", color: "text-green-600 dark:text-green-400" },
    maybe: { text: "Maybe", color: "text-amber-600 dark:text-amber-400" },
    no: { text: "No", color: "text-orange-600 dark:text-orange-400" },
    strong_no: { text: "Strong No", color: "text-red-600 dark:text-red-400" },
  };

  const rec = recommendationLabels[analysis?.recommendation] || null;

  return (
    <div
      id={`candidate-card-${_id}`}
      onClick={() => onClick?.(_id)}
      className={`
        group relative rounded-2xl glass-card p-5 cursor-pointer
        hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/40
        transition-all duration-300 ease-out hover:-translate-y-0.5
        ${className}
      `}
    >
      {/* Top Row: Score + Name */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {candidate_name || "Unknown Candidate"}
          </h3>
          {email && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {email}
            </p>
          )}
          {job_title && (
            <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
              Applying for: {job_title}
            </p>
          )}
        </div>
        <ScoreBadge score={analysis?.match_score} size="md" />
      </div>

      {/* Status + Recommendation */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
        >
          {status}
        </span>
        {rec && (
          <span className={`text-xs font-semibold ${rec.color}`}>
            {rec.text}
          </span>
        )}
        {analysis?.experience_level && (
          <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
            • {analysis.experience_level}
          </span>
        )}
      </div>

      {/* Summary */}
      {analysis?.summary && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {analysis.summary}
        </p>
      )}

      {/* Skills Tags */}
      {analysis?.missing_skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {analysis.missing_skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="inline-block rounded-md bg-red-50 dark:bg-red-950/30 px-2 py-0.5
                         text-xs text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900"
            >
              {skill}
            </span>
          ))}
          {analysis.missing_skills.length > 4 && (
            <span className="text-xs text-gray-400">
              +{analysis.missing_skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer: filename + date */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span className="truncate max-w-[60%]">📄 {original_filename}</span>
        <span>
          {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
        </span>
      </div>

      {/* Delete Button (appears on hover) */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(_id);
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100
                     rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50
                     dark:hover:bg-red-950/30 transition-all duration-200"
          aria-label={`Delete ${candidate_name}`}
          id={`delete-btn-${_id}`}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
