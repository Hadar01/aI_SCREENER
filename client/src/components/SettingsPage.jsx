import React, { useState } from "react";

/**
 * SettingsPage — Full Stitch-faithful Settings panel.
 * AI provider config, theme, notifications, export preferences.
 */
export default function SettingsPage({ onToast }) {
  const [aiProvider, setAiProvider] = useState("gemini");
  const [model, setModel] = useState("gemini-flash-latest");
  const [theme, setTheme] = useState("dark");
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [maxFiles, setMaxFiles] = useState(10);
  const [exportFormat, setExportFormat] = useState("csv");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    onToast?.("✅ Settings saved successfully");
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-on-surface">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? "bg-primary" : "bg-surface-container-highest"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-on-surface">Settings</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Configure AI engine, notifications, and export preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-primary-container text-on-primary-container font-bold rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 text-sm"
        >
          {saved ? "✓ Saved" : "Save All"}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* ── Left Column ─────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* AI Engine Configuration */}
          <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-container/20 rounded-lg">
                <span className="material-symbols-outlined text-primary">psychology</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">AI Engine Configuration</h3>
                <p className="text-xs text-on-surface-variant">Select your AI provider and model</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold mb-2 block opacity-50 uppercase tracking-widest">AI Provider</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "gemini", label: "Google Gemini", desc: "Fast, cost-effective", icon: "auto_awesome" },
                    { key: "openai", label: "OpenAI GPT", desc: "High accuracy", icon: "smart_toy" },
                  ].map(p => (
                    <button
                      key={p.key}
                      onClick={() => setAiProvider(p.key)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        aiProvider === p.key
                          ? "border-primary bg-primary-container/10 ring-1 ring-primary/30"
                          : "border-outline-variant/20 hover:border-outline-variant/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`material-symbols-outlined ${aiProvider === p.key ? "text-primary" : "text-outline"}`}>{p.icon}</span>
                        <span className="text-sm font-bold text-on-surface">{p.label}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold mb-2 block opacity-50 uppercase tracking-widest">Model</label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-3 text-sm focus:ring-0 text-on-surface"
                >
                  {aiProvider === "gemini"
                    ? ["gemini-flash-latest", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro"].map(m => <option key={m} value={m}>{m}</option>)
                    : ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"].map(m => <option key={m} value={m}>{m}</option>)
                  }
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold mb-2 block opacity-50 uppercase tracking-widest">Temperature (Creativity)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="30"
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-outline mt-1">
                  <span>Precise</span><span>Creative</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Settings */}
          <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-tertiary/10 rounded-lg">
                <span className="material-symbols-outlined text-tertiary">cloud_upload</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Upload Settings</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold mb-2 block opacity-50 uppercase tracking-widest">Max Files Per Batch</label>
                <select
                  value={maxFiles}
                  onChange={e => setMaxFiles(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-3 text-sm focus:ring-0 text-on-surface"
                >
                  {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} files</option>)}
                </select>
              </div>
              <Toggle enabled={autoAnalyze} onChange={setAutoAnalyze} label="Auto-analyze on upload" />
            </div>
          </div>

          {/* Export Settings */}
          <div className="bg-surface-container rounded-2xl p-8 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <span className="material-symbols-outlined text-secondary">download</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Export Preferences</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "csv", label: "CSV", icon: "table_chart" },
                { key: "json", label: "JSON", icon: "data_object" },
                { key: "pdf", label: "PDF Report", icon: "picture_as_pdf" },
              ].map(fmt => (
                <button
                  key={fmt.key}
                  onClick={() => setExportFormat(fmt.key)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    exportFormat === fmt.key
                      ? "border-primary bg-primary-container/10 ring-1 ring-primary/30"
                      : "border-outline-variant/20 hover:border-outline-variant/40"
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl mb-2 block ${exportFormat === fmt.key ? "text-primary" : "text-outline"}`}>{fmt.icon}</span>
                  <span className="text-xs font-bold">{fmt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column ────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Appearance */}
          <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Appearance</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "dark", label: "Dark Mode", icon: "dark_mode" },
                { key: "light", label: "Light Mode", icon: "light_mode" },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    theme === t.key
                      ? "border-primary bg-primary-container/10 ring-1 ring-primary/30"
                      : "border-outline-variant/20 hover:border-outline-variant/40 opacity-60"
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl mb-2 block ${theme === t.key ? "text-primary" : "text-outline"}`}>{t.icon}</span>
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Notifications</h4>
            <Toggle enabled={emailNotifs} onChange={setEmailNotifs} label="Email notifications" />
            <Toggle enabled={slackNotifs} onChange={setSlackNotifs} label="Slack integration" />
            <Toggle enabled={true} onChange={() => {}} label="In-app notifications" />
          </div>

          {/* System Info */}
          <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">System Info</h4>
            <div className="space-y-3">
              {[
                { label: "Version", value: "2.4.1 Enterprise" },
                { label: "API Status", value: "Operational", valueClass: "text-emerald-400" },
                { label: "Region", value: "ap-south-1" },
                { label: "Last Deploy", value: "Mar 18, 2026" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">{item.label}</span>
                  <span className={`text-xs font-bold ${item.valueClass || "text-on-surface"}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Quick Actions</h4>
            <div className="space-y-2">
              {[
                { label: "Clear all candidates", icon: "delete_sweep", color: "text-error hover:bg-error-container/10" },
                { label: "Regenerate API key", icon: "refresh", color: "text-amber-400 hover:bg-amber-500/10" },
                { label: "Download system logs", icon: "download", color: "text-on-surface-variant hover:bg-surface-container-high" },
              ].map((a, i) => (
                <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${a.color}`}>
                  <span className="material-symbols-outlined text-lg">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
