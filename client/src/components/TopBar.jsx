import React, { useState, useRef, useEffect } from "react";

const PAGE_LABELS = {
  dashboard: "Dashboard",
  upload: "Upload Resumes",
  "job-descriptions": "Job Description Upload",
  comparison: "Candidate Comparison",
  settings: "Settings",
  profile: "My Profile",
  detail: "Match Detail",
};

/**
 * TopBar — Stitch-faithful sticky top navigation.
 * Props:
 *   activeView       – current view key
 *   searchQuery      – controlled search value
 *   onSearchChange   – search input handler
 *   onNavigate       – navigate to a view
 *   userName         – logged in user name
 *   onLogout         – logout callback
 */
export default function TopBar({ activeView, searchQuery = "", onSearchChange, onNavigate, userName = "Admin", onLogout }) {
  const pageLabel = PAGE_LABELS[activeView] || "Dashboard";
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handle = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const initials = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const notifications = [
    { id: 1, icon: "check_circle", color: "text-emerald-400", title: "Analysis Complete", desc: "3 resumes analyzed successfully", time: "2m ago" },
    { id: 2, icon: "warning", color: "text-amber-400", title: "Rate Limit Warning", desc: "Gemini API quota at 80%", time: "15m ago" },
    { id: 3, icon: "cloud_upload", color: "text-primary", title: "Upload Queued", desc: "Batch upload of 5 resumes is queued", time: "1h ago" },
    { id: 4, icon: "insights", color: "text-tertiary", title: "New Insight", desc: "Top missing skill updated: Docker", time: "3h ago" },
  ];

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
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
              className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors relative"
              aria-label="Notifications"
              id="notif-btn"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full flex items-center justify-center text-[8px] font-black text-white">
                {notifications.length}
              </span>
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-surface-container border border-outline-variant/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-widest text-on-surface">Notifications</h4>
                  <span className="text-[10px] font-bold text-primary cursor-pointer hover:text-on-surface transition-colors">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-high/50 transition-colors cursor-pointer border-b border-outline-variant/5 last:border-none">
                      <span className={`material-symbols-outlined text-lg mt-0.5 ${n.color}`}>{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{n.title}</p>
                        <p className="text-xs text-on-surface-variant truncate">{n.desc}</p>
                      </div>
                      <span className="text-[10px] text-outline whitespace-nowrap">{n.time}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-outline-variant/10 text-center">
                  <button className="text-xs font-bold text-primary hover:text-on-surface transition-colors">View All Notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button
            className="text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors"
            aria-label="Help"
            onClick={() => window.open("https://github.com/Hadar01/aI_SCREENER", "_blank")}
            id="help-btn"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>

          {/* Avatar / Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
              className="w-8 h-8 rounded-full bg-primary-container/30 border border-outline-variant/30 flex items-center justify-center text-xs font-bold text-primary hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer"
              id="avatar-btn"
              aria-label="Profile menu"
            >
              {initials}
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-64 bg-surface-container border border-outline-variant/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                {/* Profile Header */}
                <div className="p-5 border-b border-outline-variant/10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/30 border border-primary/20 flex items-center justify-center text-lg font-black text-primary">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{userName}</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Enterprise Tier</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {[
                    { icon: "person", label: "My Profile", action: () => { onNavigate?.("profile"); setShowProfile(false); } },
                    { icon: "settings", label: "Settings", action: () => { onNavigate?.("settings"); setShowProfile(false); } },
                    { icon: "code", label: "API Keys", action: () => { onNavigate?.("settings"); setShowProfile(false); } },
                    { icon: "help_outline", label: "Documentation", action: () => window.open("https://github.com/Hadar01/aI_SCREENER", "_blank") },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <div className="border-t border-outline-variant/10 p-2">
                  <button
                    onClick={() => { onLogout?.(); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-error hover:bg-error-container/10 transition-colors rounded-lg text-left"
                    id="logout-btn"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span className="font-bold">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
