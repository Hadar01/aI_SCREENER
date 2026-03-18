import React, { useState, useCallback, useRef } from "react";
import { useUploadResumes, useStats, useCandidates, useDeleteCandidate, useExportCSV } from "../hooks/useResumes";

/**
 * Dashboard — Integrated Stitch main dashboard.
 * Combines: upload hero, analytics bento, candidate table.
 *
 * Props:
 *   onViewCandidate(id) – open Match Detail panel
 *   searchQuery         – global search from TopBar
 */
export default function Dashboard({ onViewCandidate, searchQuery }) {
  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("analysis.match_score");
  const [sortOrder, setSortOrder] = useState("desc");
  const fileInputRef = useRef(null);

  const { mutate: upload, isPending: isUploading, isError: uploadError, error: uploadErr } = useUploadResumes();
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: candidatesData, isLoading: candidatesLoading } = useCandidates({
    page,
    limit: 10,
    sort: sortBy,
    order: sortOrder,
    search: searchQuery || undefined,
  });
  const { mutate: remove } = useDeleteCandidate();
  const { mutate: exportCsv, isPending: isExporting } = useExportCSV();

  const stats = statsData?.data || {};
  const candidates = candidatesData?.data || [];
  const pagination = candidatesData?.pagination || { total: 0, pages: 1 };

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
    setFiles(prev => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e) => {
    setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const handleUpload = () => {
    if (!files.length) { fileInputRef.current?.click(); return; }
    setUploadProgress(0);
    upload({ files, jobTitle, jobDescription, onProgress: setUploadProgress }, {
      onSuccess: () => { setFiles([]); setUploadProgress(0); },
    });
  };

  // ── Score badge color ──────────────────────────────────────────────────────
  const getScoreStyle = (score) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-error-container/20 text-error border-error/20";
  };

  const initials = (name) =>
    name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "??";

  return (
    <div className="animate-fade-in space-y-8">

      {/* ── Hero Upload + System Status ─────────────────────────────────────── */}
      <section className="grid grid-cols-12 gap-8">
        {/* Upload Zone */}
        <div className="col-span-12 lg:col-span-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !files.length && fileInputRef.current?.click()}
            className={`relative h-64 w-full rounded-2xl border-2 border-dashed flex flex-col
                        items-center justify-center group transition-all cursor-pointer p-8 overflow-hidden
                        ${isDragging
                          ? "border-primary-container/80 bg-primary-container/5"
                          : "border-outline-variant/30 bg-surface-container-lowest hover:border-primary-container/50"
                        }`}
            id="upload-drop-zone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="resume-file-input"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/5 to-transparent pointer-events-none" />

            <div className={`mb-4 w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center
                            text-primary-container group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined text-4xl">cloud_upload</span>
            </div>

            {files.length > 0 ? (
              <>
                <h2 className="text-xl font-black tracking-tight text-on-surface mb-1">
                  {files.length} PDF{files.length > 1 ? "s" : ""} selected
                </h2>
                <p className="text-on-surface-variant text-sm mb-2">
                  {files.map(f => f.name).join(", ").substring(0, 60)}{files.join(", ").length > 60 ? "…" : ""}
                </p>

                {/* Job Title inline */}
                <div className="flex gap-3 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="Target role (optional)"
                    className="flex-1 bg-surface-container-high/50 border border-outline-variant/20
                               rounded-xl px-4 py-2 text-sm text-on-surface placeholder:text-outline
                               focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Progress */}
                {isUploading && (
                  <div className="w-full max-w-lg mt-3" onClick={e => e.stopPropagation()}>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-outline mt-1">{uploadProgress}% uploaded…</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black tracking-tight text-on-surface mb-2">
                  Drop resumes here to start analyzing
                </h2>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md text-center">
                  PDF files only. Bulk processing up to 10 files simultaneously.
                </p>
              </>
            )}

            <button
              onClick={e => { e.stopPropagation(); handleUpload(); }}
              disabled={isUploading}
              id="analyze-resume-btn"
              className="px-8 py-3 bg-primary-container text-on-primary-container font-bold rounded-xl
                         hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all disabled:opacity-60
                         active:scale-95"
            >
              {isUploading ? "Analyzing…" : files.length > 0 ? "Analyze Resumes" : "Choose PDFs"}
            </button>

            {uploadError && (
              <p className="absolute bottom-3 text-xs text-error mt-2">{uploadErr?.message}</p>
            )}
          </div>
        </div>

        {/* System Status Card */}
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="p-6 rounded-2xl bg-surface-container-high border border-outline-variant/10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">System Status</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-on-surface-variant">Live</span>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Core Intelligence</h3>
            <p className="text-sm text-on-surface-variant mb-6 flex-grow">
              Neural engine active. Accuracy optimized for Engineering &amp; Product roles.
            </p>
            <div className="space-y-3">
              <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary-container h-full"
                  role="progressbar"
                  aria-valuenow={stats.completed || 0}
                  style={{ width: `${Math.min(((stats.completed || 0) / 10000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-outline uppercase">
                <span>Usage Limit</span>
                <span>{(stats.completed || 0).toLocaleString()} / 10,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Analytics Bento ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total */}
        <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl">description</span>
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-1">Total Resumes Processed</p>
          <div className="flex items-baseline gap-2">
            {statsLoading
              ? <div className="h-10 w-20 bg-surface-container-high rounded animate-pulse" />
              : <span className="text-4xl font-black tracking-tighter text-on-surface">
                  {(stats.total_candidates || 0).toLocaleString()}
                </span>
            }
            {stats.completed > 0 && (
              <span className="text-xs font-bold text-emerald-500">
                {stats.completed} done
              </span>
            )}
          </div>
        </div>

        {/* Avg Score */}
        <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl">target</span>
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-1">Average Match %</p>
          <div className="flex items-baseline gap-2">
            {statsLoading
              ? <div className="h-10 w-16 bg-surface-container-high rounded animate-pulse" />
              : <span className="text-4xl font-black tracking-tighter text-on-surface">
                  {stats.avg_score != null ? `${stats.avg_score}%` : "—"}
                </span>
            }
            <span className="text-xs font-bold text-on-surface-variant">Avg. Score</span>
          </div>
        </div>

        {/* Top Missing Skill */}
        <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl">warning</span>
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-1">Top Missing Skill</p>
          {statsLoading ? (
            <div className="h-8 w-32 bg-surface-container-high rounded animate-pulse" />
          ) : stats.top_missing_skills?.length > 0 ? (
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-primary leading-tight capitalize">
                {stats.top_missing_skills[0].skill}
              </span>
              <span className="text-xs text-on-surface-variant mt-1">
                Across {stats.top_missing_skills[0].count} resumes
              </span>
            </div>
          ) : (
            <span className="text-2xl font-black tracking-tight text-on-surface-variant">—</span>
          )}
        </div>
      </section>

      {/* ── Candidate Table ──────────────────────────────────────────────────── */}
      <section className="bg-surface-container border border-outline-variant/5 rounded-3xl overflow-hidden" id="candidates-table-section">
        <div className="p-8 flex items-center justify-between border-b border-outline-variant/10">
          <h3 className="text-xl font-black tracking-tight">Recent Applicants</h3>
          <div className="flex gap-2">
            <button
              onClick={() => exportCsv({})}
              disabled={isExporting || candidates.length === 0}
              id="export-csv-btn"
              className="px-4 py-1.5 text-xs font-bold rounded-lg border border-outline-variant/20
                         hover:bg-surface-container-high transition-colors disabled:opacity-40"
            >
              {isExporting ? "Exporting…" : "Export CSV"}
            </button>
            {/* Sort toggle */}
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={e => {
                const [s, o] = e.target.value.split(":");
                setSortBy(s); setSortOrder(o); setPage(1);
              }}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-surface-container-high
                         text-on-surface hover:bg-surface-bright transition-colors
                         border-none focus:ring-0 cursor-pointer"
              id="sort-select"
            >
              <option value="analysis.match_score:desc">Score ↑</option>
              <option value="analysis.match_score:asc">Score ↓</option>
              <option value="createdAt:desc">Newest</option>
              <option value="createdAt:asc">Oldest</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                {["Candidate Name", "Matching Score", "Top Skills", "Status", ""].map(h => (
                  <th key={h} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-outline">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {candidatesLoading && [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high" />
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-surface-container-high rounded" />
                        <div className="h-2 w-32 bg-surface-container-high rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5"><div className="h-6 w-20 bg-surface-container-high rounded-full" /></td>
                  <td className="px-8 py-5"><div className="flex gap-2"><div className="h-4 w-14 bg-surface-container-high rounded" /><div className="h-4 w-14 bg-surface-container-high rounded" /></div></td>
                  <td className="px-8 py-5"><div className="h-3 w-16 bg-surface-container-high rounded" /></td>
                  <td className="px-8 py-5"><div className="h-5 w-5 bg-surface-container-high rounded ml-auto" /></td>
                </tr>
              ))}

              {!candidatesLoading && candidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <span className="material-symbols-outlined text-6xl text-outline-variant block mb-4">
                      description
                    </span>
                    <p className="text-on-surface-variant font-medium">No candidates yet</p>
                    <p className="text-sm text-outline mt-1">Upload resumes above to get started</p>
                  </td>
                </tr>
              )}

              {candidates.map(c => (
                <tr
                  key={c._id}
                  className="hover:bg-surface-container-high/50 transition-colors group cursor-pointer"
                  onClick={() => onViewCandidate(c._id)}
                >
                  {/* Name */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/30 flex-shrink-0">
                        {initials(c.candidate_name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-on-surface truncate max-w-[12rem]">
                          {c.candidate_name || "Unknown Candidate"}
                        </span>
                        <span className="text-xs text-on-surface-variant truncate max-w-[12rem]">
                          {c.job_title || c.email || "—"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-8 py-5">
                    {c.analysis?.match_score != null ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${getScoreStyle(c.analysis.match_score)}`}>
                        {c.analysis.match_score}% Match
                      </span>
                    ) : (
                      <span className="text-xs text-outline">Pending</span>
                    )}
                  </td>

                  {/* Skills */}
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-2">
                      {(c.analysis?.strengths || []).slice(0, 2).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary text-[10px] font-bold border border-tertiary-container/30 uppercase tracking-tighter truncate max-w-[6rem]">
                          {s}
                        </span>
                      ))}
                      {(!c.analysis?.strengths?.length && (c.analysis?.missing_skills || []).slice(0, 2).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-error-container/20 text-error text-[10px] font-bold border border-error/20 uppercase tracking-tighter truncate max-w-[6rem]">
                          {s}
                        </span>
                      )))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-8 py-5">
                    {c.status === "completed" ? (
                      <span className="text-xs font-bold text-on-surface-variant flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        AI Verified
                      </span>
                    ) : c.status === "failed" ? (
                      <span className="text-xs font-bold text-error">Failed</span>
                    ) : (
                      <span className="text-xs font-bold text-amber-400 capitalize">{c.status}</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={e => { e.stopPropagation(); onViewCandidate(c._id); }}
                      className="p-2 rounded-lg text-outline hover:text-primary transition-colors"
                      aria-label="View candidate"
                    >
                      <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-8 py-6 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <span className="text-xs text-outline font-bold uppercase tracking-widest">
            Displaying {candidates.length} of {pagination.total} candidates
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-outline hover:text-on-surface transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-xs font-black text-on-surface">
              Page {page} of {pagination.pages || 1}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages}
              className="text-outline hover:text-on-surface transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
