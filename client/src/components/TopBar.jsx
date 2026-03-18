import React from "react";

const PAGE_LABELS = {
  dashboard: "Dashboard",
  upload: "Upload Resumes",
  "job-descriptions": "Job Description Upload",
  comparison: "Candidate Comparison",
  settings: "Settings",
  detail: "Match Detail",
};

/**
 * TopBar — Stitch-faithful sticky top navigation.
 * Props:
 *   activeView       – current view key
 *   searchQuery      – controlled search value
 *   onSearchChange   – search input handler
 */
export default function TopBar({ activeView, searchQuery = "", onSearchChange }) {
  const pageLabel = PAGE_LABELS[activeView] || "Dashboard";

  return (
    <header
      className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-30
                 glass-nav font-['Inter'] text-sm font-medium"
      id="topbar"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-on-surface-variant">Pages</span>
        <span className="text-outline-variant">/</span>
        <span className="text-[#dae2fd] font-bold">{pageLabel}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
            search
          </span>
          <input
            id="topbar-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search candidates..."
            className="bg-surface-container-highest/30 border border-outline-variant/20
                       rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none
                       focus:ring-1 focus:ring-primary transition-all
                       text-on-surface text-xs placeholder:text-outline"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors"
            aria-label="Help"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-container/30 border border-outline-variant/30 flex items-center justify-center text-xs font-bold text-primary">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
