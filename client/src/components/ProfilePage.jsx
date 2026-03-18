import React, { useState } from "react";

/**
 * ProfilePage — Full Stitch-faithful user profile page.
 * Shows user info, account settings, API key management, and activity log.
 */
export default function ProfilePage({ userName = "Admin", onNavigate }) {
  const [displayName, setDisplayName] = useState(userName);
  const [email, setEmail] = useState("admin@ai-screener.pro");
  const [role, setRole] = useState("Enterprise Admin");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const activityLog = [
    { action: "Uploaded 3 resumes", time: "2 minutes ago", icon: "cloud_upload", color: "text-primary" },
    { action: "Analyzed batch — avg score 72%", time: "5 minutes ago", icon: "auto_awesome", color: "text-amber-400" },
    { action: "Exported CSV report", time: "1 hour ago", icon: "download", color: "text-tertiary" },
    { action: "Created Job Profile: DevOps Lead", time: "3 hours ago", icon: "description", color: "text-emerald-400" },
    { action: "Deleted candidate record", time: "Yesterday", icon: "delete", color: "text-error" },
    { action: "System login", time: "Yesterday", icon: "login", color: "text-on-surface-variant" },
  ];

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black tracking-tighter text-on-surface">My Profile</h2>
        <p className="text-on-surface-variant font-medium mt-1">
          Manage your account, view activity, and configure API access.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* ── Left Column: Profile Card + Activity ───────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10 text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary-container/20 to-transparent" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-primary-container/30 border-2 border-primary/30 flex items-center justify-center text-2xl font-black text-primary mx-auto mb-4">
                {displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-on-surface">{displayName}</h3>
              <p className="text-sm text-on-surface-variant">{email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-container/20 border border-primary/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{role}</span>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant/10">
              {[
                { label: "Resumes", value: "247" },
                { label: "Analyzed", value: "231" },
                { label: "Avg Score", value: "73%" },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-black tracking-tighter text-on-surface">{stat.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-outline">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Recent Activity</h4>
            <div className="space-y-1">
              {activityLog.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-outline-variant/5 last:border-none">
                  <span className={`material-symbols-outlined text-lg mt-0.5 ${item.color}`}>{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface truncate">{item.action}</p>
                    <p className="text-[10px] text-outline">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Edit Form + API Keys ─────────────────────── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Account Settings */}
          <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-on-surface">Account Settings</h3>
              {saved && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 animate-fade-in">
                  ✓ Saved
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold mb-2 block opacity-50 uppercase tracking-widest">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:border-primary/40 focus:ring-0 transition-all text-on-surface"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold mb-2 block opacity-50 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:border-primary/40 focus:ring-0 transition-all text-on-surface"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold mb-2 block opacity-50 uppercase tracking-widest">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-3 text-sm focus:ring-0 text-on-surface"
                >
                  {["Enterprise Admin", "Hiring Manager", "Recruiter", "Viewer"].map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold mb-2 block opacity-50 uppercase tracking-widest">Timezone</label>
                <select className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-3 text-sm focus:ring-0 text-on-surface">
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Asia/Tokyo (JST)</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-primary-container text-on-primary-container font-bold rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* API Key Management */}
          <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface">API Access</h3>
                <p className="text-xs text-on-surface-variant mt-1">Manage your API keys for programmatic access</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">Active</span>
            </div>
            <div className="space-y-4">
              {/* API Key Row */}
              <div className="p-4 bg-surface-container-high/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">key</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Production Key</p>
                    <p className="text-xs text-on-surface-variant font-mono">
                      {showApiKey ? "sk-screener-pro-2026-xxxx-xxxx-xxxx" : "sk-•••••••••••••••••••••••••"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showApiKey ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText("sk-screener-pro-2026-xxxx-xxxx-xxxx"); }}
                    className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
              </div>

              {/* Webhook */}
              <div className="p-4 bg-surface-container-high/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-lg">webhook</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Webhook Endpoint</p>
                    <p className="text-xs text-on-surface-variant font-mono">https://your-app.com/api/webhooks/screener</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded border border-amber-500/20 uppercase">Not Set</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-error-container/5 rounded-2xl p-8 border border-error/10">
            <h3 className="text-lg font-bold text-error mb-2">Danger Zone</h3>
            <p className="text-sm text-on-surface-variant mb-6">Irreversible actions. Proceed with extreme caution.</p>
            <div className="flex gap-4">
              <button className="px-6 py-2.5 bg-surface-container border border-outline-variant/20 text-on-surface text-sm font-bold rounded-xl hover:bg-surface-container-high transition-colors">
                Export All Data
              </button>
              <button className="px-6 py-2.5 bg-error/10 border border-error/20 text-error text-sm font-bold rounded-xl hover:bg-error/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
