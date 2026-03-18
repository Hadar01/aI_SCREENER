import React from "react";

/**
 * Sidebar — Stitch-faithful left navigation panel.
 * Props:
 *   activeView    – current view key
 *   onNavigate(view) – navigation callback
 *   onLogout      – logout callback
 */
export default function Sidebar({ activeView, onNavigate, onLogout }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard" },
    { key: "upload", label: "Upload Resumes", icon: "cloud_upload" },
    { key: "job-descriptions", label: "Job Profiles", icon: "description" },
    { key: "comparison", label: "Candidate Compare", icon: "fact_check" },
    { key: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-full z-40 flex flex-col p-6 bg-[#0b1326] w-64 font-['Inter'] antialiased tracking-tight"
      id="sidebar"
    >
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("dashboard")}>
        <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-on-primary-container text-xl">
            cognition
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-[#dae2fd]">
            AI-Screener Pro
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Enterprise Tier
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ key, label, icon }) => {
          const isActive = activeView === key;
          return (
            <button
              key={key}
              id={`nav-${key}`}
              onClick={() => onNavigate(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ease-in-out cursor-pointer active:scale-95 text-left rounded-lg
                ${
                  isActive
                    ? "text-[#dae2fd] font-semibold border-r-2 border-[#4f46e5] bg-surface-container-high/10"
                    : "text-[#dae2fd]/60 font-medium hover:text-[#dae2fd] hover:bg-[#4f46e5]/10"
                }
              `}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-3 pt-6 border-t border-outline-variant/10">
        {/* New Screening CTA */}
        <button
          onClick={() => onNavigate("upload")}
          id="new-screening-btn"
          className="w-full flex items-center justify-center gap-2 py-3
                     bg-gradient-to-br from-[#c3c0ff] to-[#4f46e5]
                     text-on-primary-container font-bold rounded-xl
                     shadow-lg shadow-primary-container/20 active:scale-[0.98]
                     transition-transform hover:brightness-110"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>New Screening</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          id="sidebar-logout-btn"
          className="w-full flex items-center justify-center gap-2 py-2.5 text-[#dae2fd]/40 hover:text-error text-sm font-medium rounded-lg hover:bg-error/5 transition-all"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
