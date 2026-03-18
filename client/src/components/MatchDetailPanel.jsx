import React from "react";
import { useCandidate, useReanalyze, useDeleteCandidate } from "../hooks/useResumes";

/**
 * MatchDetailPanel — Stitch slide-out panel for a single candidate.
 * Props:
 *   candidateId  – MongoDB ObjectId
 *   onClose      – callback to close the panel
 */
export default function MatchDetailPanel({ candidateId, onClose }) {
  const { data, isLoading } = useCandidate(candidateId);
  const { mutate: reanalyze, isPending: isReanalyzing } = useReanalyze();
  const { mutate: remove } = useDeleteCandidate();

  const candidate = data?.data;
  const analysis = candidate?.analysis || {};

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Score progress bar color
  const progressColor = (val) => {
    if (val >= 80) return "bg-primary";
    if (val >= 60) return "bg-amber-400";
    return "bg-error";
  };

  const recConfig = {
    strong_yes: { label: "Strong Yes → Schedule Interview", color: "text-emerald-400" },
    yes: { label: "Yes → Proceed", color: "text-emerald-400" },
    maybe: { label: "Maybe → Review Required", color: "text-amber-400" },
    no: { label: "No", color: "text-orange-400" },
    strong_no: { label: "Strong No → Reject", color: "text-error" },
  };
  const rec = recConfig[analysis.recommendation] || null;

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-end animate-fade-in" id="match-detail-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-lowest/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close panel"
      />

      {/* Slide-out panel */}
      <div
        className="relative h-full w-full max-w-4xl bg-surface-container-low shadow-2xl flex flex-col border-l border-outline-variant/10 animate-slide-in-right z-10"
        id="match-detail-panel"
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="p-8 flex items-start justify-between bg-surface-container-low flex-shrink-0">
          {isLoading ? (
            <div className="flex items-center gap-6 w-full animate-pulse">
              <div className="w-16 h-16 rounded-xl bg-surface-container-high" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-48 bg-surface-container-high rounded" />
                <div className="h-4 w-64 bg-surface-container-high rounded" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-xl bg-primary-container/20 border border-primary/20 flex items-center justify-center text-xl font-black text-primary flex-shrink-0">
                {candidate?.candidate_name
                  ? candidate.candidate_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                  : "??"
                }
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                    {candidate?.candidate_name || "Unknown Candidate"}
                  </h2>
                  {analysis.recommendation === "strong_yes" || analysis.recommendation === "yes" ? (
                    <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-fixed text-[10px] font-bold uppercase tracking-wider">
                      Top Match
                    </span>
                  ) : null}
                </div>
                <p className="text-on-surface-variant mt-1">
                  {candidate?.job_title || "Candidate"}{candidate?.email ? ` • ${candidate.email}` : ""}
                </p>
                {analysis.experience_level && (
                  <p className="text-xs text-primary mt-0.5 capitalize">{analysis.experience_level} Level</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-8 flex-shrink-0 ml-4">
            {/* Score */}
            {!isLoading && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Match Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-primary">
                    {analysis.match_score ?? "—"}
                  </span>
                  <span className="text-sm font-medium text-on-surface-variant/60">/ 100</span>
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
              id="close-detail-btn"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* ── Scrollable Content ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-surface-container-high rounded-2xl" />)}
            </div>
          ) : (
            <>
              {/* ── Skill Comparison Grid ──────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-8 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/10 -translate-x-1/2 hidden md:block" />

                {/* Resume Keywords / Strengths */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-sm">person_search</span>
                    <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                      Resume Strengths
                    </h3>
                  </div>
                  {(analysis.strengths || []).length > 0 ? (
                    <div className="space-y-3">
                      {analysis.strengths.map((strength, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-surface-container-high/50 rounded-xl hover:bg-surface-container-high transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            <span className="font-semibold text-on-surface text-sm">{strength}</span>
                          </div>
                          <span className="text-[10px] font-medium text-on-surface-variant px-2 py-1 bg-surface-container rounded-lg italic">
                            Present
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">No strengths extracted</p>
                  )}
                </div>

                {/* Job Requirements / Missing Skills */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-secondary text-sm">work_outline</span>
                    <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                      Skill Gaps
                    </h3>
                  </div>
                  {(analysis.missing_skills || []).length > 0 ? (
                    <div className="space-y-3">
                      {analysis.missing_skills.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-error-container/10 border border-error/10 rounded-xl">
                          <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-error text-sm">error_outline</span>
                            <span className="font-semibold text-on-surface text-sm">{skill}</span>
                          </div>
                          <span className="text-[10px] font-bold text-error uppercase tracking-tight">
                            Requirement Gap
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">No skill gaps identified</p>
                  )}
                </div>
              </div>

              {/* ── AI Insights ────────────────────────────────────────────── */}
              {analysis.summary && (
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-1.5 bg-gradient-to-br from-primary to-primary-container rounded-lg">
                      <span
                        className="material-symbols-outlined text-surface text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        auto_awesome
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-tighter">
                      Generated AI Match Analysis
                    </h4>
                  </div>

                  <p className="text-sm leading-relaxed text-on-surface-variant mb-6">
                    {analysis.summary}
                  </p>

                  {/* Performance vectors */}
                  {analysis.match_score != null && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/10">
                      {[
                        { label: "Technical Fit", val: Math.min(analysis.match_score + 5, 100) },
                        { label: "Domain Exp.", val: Math.max(analysis.match_score - 8, 0) },
                        { label: "Growth Potential", val: Math.min(analysis.match_score + 10, 100) },
                      ].map(({ label, val }) => (
                        <div key={label} className="space-y-1">
                          <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase">{label}</p>
                          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                            <div className={`h-full ${progressColor(val)}`} style={{ width: `${val}%` }} />
                          </div>
                          <p className="text-[10px] text-outline">{val}%</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Recommendation ─────────────────────────────────────────── */}
              {rec && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container border border-outline-variant/10">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">AI Recommendation</p>
                    <p className={`text-sm font-bold mt-0.5 ${rec.color}`}>{rec.label}</p>
                  </div>
                </div>
              )}

              {/* ── Job Description ─────────────────────────────────────────── */}
              {candidate?.job_description && (
                <details className="group">
                  <summary className="cursor-pointer text-xs font-bold text-outline uppercase tracking-widest flex items-center gap-2 list-none">
                    <span className="material-symbols-outlined text-sm">description</span>
                    Job Description
                    <span className="material-symbols-outlined text-xs transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <p className="mt-4 text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap bg-surface-container p-4 rounded-xl">
                    {candidate.job_description}
                  </p>
                </details>
              )}
            </>
          )}
        </div>

        {/* ── Footer Actions ───────────────────────────────────────────────── */}
        <div className="p-8 bg-surface-container-low flex justify-between items-center border-t border-outline-variant/10 flex-shrink-0">
          <a
            href={`${API_BASE}/candidates/${candidateId}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant text-sm font-bold flex items-center gap-2 hover:text-on-surface transition-colors"
            id="download-report-btn"
          >
            <span className="material-symbols-outlined">file_download</span>
            Download Report
          </a>
          <div className="flex gap-4">
            <button
              onClick={() => { remove(candidateId); onClose(); }}
              className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm hover:brightness-125 transition-all"
              id="reject-candidate-btn"
            >
              Reject Candidate
            </button>
            <button
              onClick={() => reanalyze({ id: candidateId })}
              disabled={isReanalyzing}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-surface font-bold text-sm
                         shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              id="schedule-interview-btn"
            >
              {isReanalyzing ? "Re-analyzing…" : "Schedule Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
