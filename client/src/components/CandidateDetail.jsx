import React from "react";
import { useCandidate, useReanalyze } from "../hooks/useResumes";
import ScoreBadge from "./ScoreBadge";

/**
 * CandidateDetail — Full detail view of a screened candidate.
 *
 * Props:
 *   candidateId  – MongoDB ObjectId string
 *   onBack       – Callback to navigate back to list
 *   className    – Additional CSS classes
 */
export default function CandidateDetail({
  candidateId,
  onBack,
  className = "",
}) {
  const { data, isLoading, error } = useCandidate(candidateId);
  const { mutate: reanalyze, isPending: isReanalyzing } = useReanalyze();

  const candidate = data?.data;

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        <div className="h-8 w-48 bg-gray-700 rounded-lg" />
        <div className="h-40 bg-gray-800 rounded-2xl" />
        <div className="h-60 bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-20 ${className}`}>
        <p className="text-red-400 mb-4">{error.message}</p>
        <button
          onClick={onBack}
          className="text-indigo-400 hover:text-indigo-300 underline"
        >
          ← Back to candidates
        </button>
      </div>
    );
  }

  if (!candidate) return null;

  const {
    candidate_name,
    email,
    job_title,
    job_description,
    original_filename,
    file_size,
    page_count,
    analysis,
    status,
    createdAt,
    updatedAt,
  } = candidate;

  const recommendationConfig = {
    strong_yes: {
      label: "Strong Yes",
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    yes: {
      label: "Yes",
      bg: "bg-green-500/15",
      text: "text-green-400",
      border: "border-green-500/30",
    },
    maybe: {
      label: "Maybe",
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      border: "border-amber-500/30",
    },
    no: {
      label: "No",
      bg: "bg-orange-500/15",
      text: "text-orange-400",
      border: "border-orange-500/30",
    },
    strong_no: {
      label: "Strong No",
      bg: "bg-red-500/15",
      text: "text-red-400",
      border: "border-red-500/30",
    },
  };

  const rec = recommendationConfig[analysis?.recommendation] || null;

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  return (
    <div className={`max-w-4xl mx-auto animate-fade-in ${className}`} id="candidate-detail">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400
                   transition-colors mb-6 group"
        id="back-to-list-btn"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to candidates
      </button>

      {/* ─── Header Card ─────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-100">
              {candidate_name || "Unknown Candidate"}
            </h1>
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-indigo-400 hover:text-indigo-300 text-sm mt-1 inline-block"
              >
                {email}
              </a>
            )}
            {job_title && (
              <p className="text-sm text-gray-400 mt-2">
                Applied for:{" "}
                <span className="text-gray-200 font-medium">{job_title}</span>
              </p>
            )}

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center rounded-full bg-gray-700/50 px-3 py-1 text-xs text-gray-300">
                📄 {original_filename}
              </span>
              {file_size && (
                <span className="inline-flex items-center rounded-full bg-gray-700/50 px-3 py-1 text-xs text-gray-400">
                  {Math.round(file_size / 1024)} KB
                </span>
              )}
              {page_count > 0 && (
                <span className="inline-flex items-center rounded-full bg-gray-700/50 px-3 py-1 text-xs text-gray-400">
                  {page_count} page{page_count !== 1 ? "s" : ""}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-gray-700/50 px-3 py-1 text-xs text-gray-400">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-2">
            <ScoreBadge score={analysis?.match_score} size="lg" />
            <span className="text-xs text-gray-500">Match Score</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-gray-700/50">
          <a
            href={`${API_BASE}/candidates/${candidate._id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-700/50 px-4 py-2
                       text-sm text-gray-200 hover:bg-gray-600/50 transition-colors"
            id="download-pdf-btn"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </a>

          <button
            onClick={() => reanalyze({ id: candidate._id })}
            disabled={isReanalyzing}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600/80 px-4 py-2
                       text-sm text-white hover:bg-indigo-500/80 disabled:opacity-50
                       transition-colors"
            id="reanalyze-btn"
          >
            <svg
              className={`h-4 w-4 ${isReanalyzing ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isReanalyzing ? "Re-analyzing…" : "Re-analyze"}
          </button>
        </div>
      </div>

      {/* ─── Recommendation + Experience ─────────────────────────────────────── */}
      {(rec || analysis?.experience_level) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {rec && (
            <div
              className={`rounded-2xl ${rec.bg} border ${rec.border} p-5`}
              id="recommendation-card"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Recommendation
              </p>
              <p className={`text-xl font-bold ${rec.text}`}>{rec.label}</p>
            </div>
          )}
          {analysis?.experience_level && (
            <div
              className="rounded-2xl bg-purple-500/10 border border-purple-500/20 p-5"
              id="experience-card"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Experience Level
              </p>
              <p className="text-xl font-bold text-purple-400 capitalize">
                {analysis.experience_level}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── AI Summary ──────────────────────────────────────────────────────── */}
      {analysis?.summary && (
        <div className="glass-card rounded-2xl p-6 mb-6" id="ai-summary">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            AI Assessment
          </h2>
          <p className="text-gray-200 leading-relaxed">{analysis.summary}</p>
        </div>
      )}

      {/* ─── Strengths & Missing Skills ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        {analysis?.strengths?.length > 0 && (
          <div className="glass-card rounded-2xl p-6" id="strengths-section">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Strengths
            </h2>
            <ul className="space-y-2.5">
              {analysis.strengths.map((strength, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-300"
                >
                  <svg
                    className="h-4 w-4 mt-0.5 text-emerald-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Skills */}
        {analysis?.missing_skills?.length > 0 && (
          <div className="glass-card rounded-2xl p-6" id="missing-skills-section">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Missing Skills
            </h2>
            <ul className="space-y-2.5">
              {analysis.missing_skills.map((skill, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-300"
                >
                  <svg
                    className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ─── Job Description (if provided) ───────────────────────────────────── */}
      {job_description && (
        <details className="glass-card rounded-2xl p-6 mb-6 group" id="job-desc-section">
          <summary className="text-sm font-semibold text-gray-400 uppercase tracking-wider cursor-pointer list-none flex items-center justify-between">
            Job Description
            <svg
              className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
            {job_description}
          </p>
        </details>
      )}

      {/* ─── Timestamps ──────────────────────────────────────────────────────── */}
      <div className="text-center text-xs text-gray-600 mt-8 pb-8">
        Uploaded: {new Date(createdAt).toLocaleString()} • Last updated:{" "}
        {new Date(updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
