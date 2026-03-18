import React, { useState } from "react";
import { useCandidates, useDeleteCandidate } from "../hooks/useResumes";

/**
 * CandidateComparison — Stitch-faithful 3-column side-by-side comparison.
 * Props:
 *   onViewCandidate(id) – opens the Match Detail panel
 */
export default function CandidateComparison({ onViewCandidate }) {
  const { data, isLoading } = useCandidates({ sort: "analysis.match_score", order: "desc", limit: 3 });
  const { mutate: remove } = useDeleteCandidate();
  const candidates = data?.data || [];

  const getMatchColor = (score, rank) => {
    if (rank === 0) return "text-primary";
    if (rank === 1) return "text-on-surface-variant";
    return "text-on-surface-variant/40";
  };

  const isDimmed = (rank) => rank >= 2;

  const getSkillStatus = (skill, candidate) => {
    const strengths = (candidate.analysis?.strengths || []).map(s => s.toLowerCase());
    const missing = (candidate.analysis?.missing_skills || []).map(s => s.toLowerCase());
    const skillLower = skill.toLowerCase();

    if (strengths.some(s => s.includes(skillLower) || skillLower.includes(s)))
      return "match";
    if (missing.some(s => s.includes(skillLower) || skillLower.includes(s)))
      return "gap";
    return "partial";
  };

  // Collect union of all skills across compared candidates
  const allSkills = [...new Set(
    candidates.flatMap(c => [
      ...(c.analysis?.strengths || []),
      ...(c.analysis?.missing_skills || []),
    ])
  )].slice(0, 5);

  const initials = (name) =>
    name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "??";

  const perfVectors = [
    { label: "Technical Fit", key: "fit" },
    { label: "Domain Experience", key: "domain" },
    { label: "Growth Potential", key: "growth" },
  ];

  const getVector = (score, key, idx) => {
    const offsets = { fit: 5, domain: -8, growth: 10 };
    return Math.max(0, Math.min(100, (score || 0) + offsets[key] - idx * 3));
  };

  return (
    <div className="animate-fade-in pb-32">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tighter text-on-surface">
          Candidate Comparison
        </h2>
        <p className="text-on-surface-variant mt-1">
          Top {candidates.length} screened candidates ranked by AI match score
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-6 animate-pulse">
              <div className="h-36 bg-surface-container rounded-2xl" />
              <div className="h-32 bg-surface-container rounded-2xl" />
              <div className="h-52 bg-surface-container rounded-2xl" />
            </div>
          ))}
        </div>
      ) : candidates.length < 2 ? (
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-7xl text-outline-variant block mb-4">
            fact_check
          </span>
          <h3 className="text-xl font-bold text-on-surface-variant mb-2">Not enough candidates</h3>
          <p className="text-outline">Upload and analyze at least 2 resumes to compare candidates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {candidates.slice(0, 3).map((c, rank) => {
            const score = c.analysis?.match_score ?? 0;
            const dimmed = isDimmed(rank);

            return (
              <div key={c._id} className={`flex flex-col space-y-6 ${dimmed ? "opacity-70" : ""}`}>
                {/* Header Card */}
                <div className="bg-surface-container rounded-2xl p-6 shadow-xl relative overflow-hidden group cursor-pointer"
                  onClick={() => onViewCandidate(c._id)}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-3xl transition-colors
                    ${rank === 0 ? "bg-primary/10 group-hover:bg-primary/20" : dimmed ? "bg-error/5" : "bg-primary/5"}`}
                  />
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-xl ring-2 ring-primary-container/20 flex items-center justify-center text-lg font-black flex-shrink-0
                        ${dimmed ? "bg-surface-container-high text-on-surface-variant/40 grayscale" : "bg-primary-container/20 text-primary"}`}
                      >
                        {initials(c.candidate_name)}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${dimmed ? "text-on-surface" : "text-on-surface"}`}>
                          {c.candidate_name || "Unknown"}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium tracking-wide uppercase">
                          {c.job_title || "Candidate"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-3xl font-black leading-none tracking-tighter ${getMatchColor(score, rank)}`}>
                        {score}%
                      </span>
                      <span className="text-[0.6rem] font-bold text-on-surface-variant/60 uppercase mt-1">
                        Match Score
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-surface-container-high/40 rounded-2xl p-6 border border-outline-variant/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`material-symbols-outlined text-sm ${dimmed ? "text-outline" : "text-primary"}`}>
                      auto_awesome
                    </span>
                    <span className={`text-[0.7rem] font-bold tracking-widest uppercase ${dimmed ? "text-outline" : "text-primary"}`}>
                      AI Strategic Insight
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${dimmed ? "text-on-surface-variant/60" : "text-on-surface-variant"}`}>
                    {c.analysis?.summary
                      ? c.analysis.summary.slice(0, 160) + (c.analysis.summary.length > 160 ? "…" : "")
                      : "AI analysis pending…"
                    }
                  </p>
                </div>

                {/* Skills Matrix */}
                <div className="bg-surface-container rounded-2xl p-6">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                    Competency Mapping
                  </h4>
                  <div className="space-y-3">
                    {allSkills.slice(0, 4).map((skill, i) => {
                      const status = getSkillStatus(skill, c);
                      const statusConfig = {
                        match: { badge: "bg-primary/20 text-primary", label: "Match" },
                        gap: { badge: "bg-error-container/20 text-error", label: "Gap" },
                        partial: { badge: "bg-tertiary/20 text-tertiary", label: "Strong Sub" },
                      }[status];
                      return (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-lowest/50">
                          <span className={`text-sm ${status === "gap" || (dimmed && status !== "match") ? "text-on-surface-variant/50" : "text-on-surface"}`}>
                            {skill}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusConfig.badge} uppercase`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance Vectors */}
                <div className="bg-surface-container rounded-2xl p-6">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
                    Performance Vectors
                  </h4>
                  <div className="space-y-5">
                    {perfVectors.map(({ label, key }) => {
                      const val = getVector(score, key, rank);
                      return (
                        <div key={key}>
                          <div className="flex justify-between mb-2">
                            <span className={`text-xs font-medium ${dimmed ? "text-on-surface-variant/50" : ""}`}>
                              {label}
                            </span>
                            <span className={`text-xs font-bold ${dimmed ? "text-on-surface-variant/50" : ""}`}>
                              {val}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${dimmed ? "bg-outline opacity-40" : rank === 0 ? "bg-primary" : "bg-primary opacity-80"}`}
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => { if (window.confirm(`Reject ${c.candidate_name}?`)) remove(c._id); }}
                    className={`flex-1 py-4 px-4 text-sm font-bold rounded-xl transition-all active:scale-95
                      ${dimmed
                        ? "bg-error-container/30 text-error hover:bg-error-container/50"
                        : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright"
                      }`}
                    id={`reject-btn-${c._id}`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onViewCandidate(c._id)}
                    disabled={dimmed}
                    className={`flex-[2] py-4 px-4 text-sm font-bold rounded-xl transition-all active:scale-95
                      ${dimmed
                        ? "bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed opacity-50"
                        : "bg-primary-container text-on-primary-container hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                      }`}
                    id={`interview-btn-${c._id}`}
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Sticky Floating Comparison Summary ─────────────────────────────── */}
      {candidates.length >= 2 && (
        <div className="fixed bottom-8 left-[calc(16rem+2.5rem)] right-10 z-40" id="comparison-summary-bar">
          <div className="glass-panel rounded-full px-8 py-4 flex items-center justify-between border border-white/5 shadow-2xl">
            <div className="flex items-center space-x-6">
              <div className="flex -space-x-3">
                {candidates.slice(0, 3).map((c) => (
                  <div
                    key={c._id}
                    className="w-10 h-10 rounded-full border-2 border-surface bg-primary-container/30 flex items-center justify-center text-xs font-black text-primary"
                  >
                    {initials(c.candidate_name)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold">{candidates.length} Candidates Compared</p>
                <p className="text-[0.7rem] text-on-surface-variant font-medium">
                  Avg Score: {Math.round(candidates.reduce((sum, c) => sum + (c.analysis?.match_score || 0), 0) / candidates.length)}%
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-sm">file_download</span>
                <span>Export PDF</span>
              </button>
              <button className="bg-primary text-surface px-6 py-2 rounded-full text-xs font-black tracking-tight active:scale-95 transition-transform">
                SHARE COMPARISON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
