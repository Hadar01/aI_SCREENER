import React, { useState } from "react";
import { useUploadResumes } from "../hooks/useResumes";

const TEMPLATES = [
  { label: "Senior Frontend Engineer", meta: "React • 5+ Years • High Technicality", jd: "We are looking for a Senior Frontend Engineer with 5+ years of experience in React.js, TypeScript, and modern web architecture. The ideal candidate has experience with design systems, performance optimization, and cross-functional collaboration." },
  { label: "DevOps Lead", meta: "K8s • AWS • Security-First", jd: "Seeking a DevOps Lead with deep expertise in Kubernetes, AWS infrastructure, Terraform, and security-first engineering. You will own the CI/CD pipeline and drive platform reliability across the organization." },
  { label: "AI Research Scientist", meta: "NLP • PhD Preference • PyTorch", jd: "We are hiring an AI Research Scientist to advance our NLP capabilities. PhD preferred. Must have hands-on experience with PyTorch, transformer architectures, and publishing research in top-tier venues." },
];

/**
 * JobDescriptionUpload — Stitch-faithful JD input page.
 * Props:
 *   onSaveAndScreen(jobTitle, jobDescription) – parent callback
 */
export default function JobDescriptionUpload({ onSaveAndScreen }) {
  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("Senior Product Engineer");
  const [department, setDepartment] = useState("Engineering");
  const [seniority, setSeniority] = useState("Senior");
  const [location, setLocation] = useState("Remote");
  const [skills, setSkills] = useState(["TypeScript", "Next.js", "System Architecture"]);
  const [skillInput, setSkillInput] = useState("");

  const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0;
  const complexityScore = Math.min(Math.round((wordCount / 500) * 100), 100);

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const removeSkill = (idx) => setSkills(prev => prev.filter((_, i) => i !== idx));

  const loadTemplate = (tpl) => {
    setJdText(tpl.jd);
    setJobTitle(tpl.label);
  };

  const handleSave = () => {
    onSaveAndScreen?.(jobTitle, jdText, skills);
  };

  return (
    <div className="animate-fade-in">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="mb-12 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-on-surface mb-2">
            Define Your Ideal Candidate
          </h2>
          <p className="text-on-surface-variant max-w-xl font-medium">
            Craft a surgical job profile. Our AI analyzes sentiment and technical depth to ensure maximum screening accuracy.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 rounded-lg border border-outline-variant/20 text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors">
            Import from URL
          </button>
          <button
            onClick={handleSave}
            id="save-screening-btn"
            className="px-6 py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary-container
                       text-surface text-sm font-bold shadow-2xl shadow-primary-container/20
                       hover:brightness-110 active:scale-95 transition-all"
          >
            Save &amp; Start Screening
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* ── Left: JD Input ─────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Full JD Textarea */}
          <div className="bg-surface-container rounded-xl p-8 shadow-inner overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
                Full Job Description
              </label>
              <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full">
                <span className="material-symbols-outlined text-xs text-primary">auto_fix_high</span>
                <span className="text-[10px] font-bold text-primary">AI Optimizer Enabled</span>
              </div>
            </div>

            <textarea
              id="jd-textarea"
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              className="w-full h-72 bg-transparent border-none focus:ring-0 text-on-surface
                         placeholder:text-outline-variant/40 resize-none leading-relaxed text-base"
              placeholder="Paste the full job description here… Our engine will extract requirements, culture fits, and technical stacks automatically."
            />

            {/* Complexity bar */}
            <div className="absolute bottom-6 right-8 left-8 p-4 bg-surface-container-lowest/80 backdrop-blur-md rounded-lg flex items-center gap-6">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Complexity Score</span>
                  <span className="text-xs font-black text-primary">
                    {complexityScore}% — {complexityScore > 70 ? "High Precision" : complexityScore > 40 ? "Moderate" : "Draft"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_#4f46e5] transition-all duration-500"
                    style={{ width: `${complexityScore}%` }}
                  />
                </div>
              </div>
              <div className="w-px h-8 bg-outline-variant/20" />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                <span className="text-xs font-bold">{wordCount} words</span>
              </div>
            </div>
          </div>

          {/* Skills Tags */}
          <div className="bg-surface-container rounded-xl p-8">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant block mb-6">
              Must-Have Skills &amp; Requirements
            </label>
            <div className="flex flex-wrap gap-3 mb-4">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-primary-container/20 text-primary border border-primary/20 rounded-full text-xs font-bold flex items-center gap-2"
                >
                  {skill}
                  <button onClick={() => removeSkill(idx)} aria-label={`Remove ${skill}`}>
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </span>
              ))}
              <div className="flex-1 min-w-[150px]">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="Add skill (press Enter)…"
                  className="w-full bg-transparent border-none text-sm focus:ring-0 p-2 text-on-surface placeholder:text-outline"
                  id="skill-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Metadata + Templates ────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Job Metadata */}
          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-6">
              Job Metadata
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold mb-2 opacity-50 uppercase">Job Title</p>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  id="job-title-input"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:border-primary/40 focus:ring-0 transition-all text-on-surface"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold mb-2 opacity-50 uppercase">Department</p>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-3 text-sm focus:ring-0 text-on-surface"
                  >
                    {["Engineering", "Product", "Design", "Marketing", "Sales"].map(d => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-[10px] font-bold mb-2 opacity-50 uppercase">Seniority</p>
                  <select
                    value={seniority}
                    onChange={e => setSeniority(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-3 text-sm focus:ring-0 text-on-surface"
                  >
                    {["Junior", "Mid", "Senior", "Staff", "Lead", "Principal"].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold mb-2 opacity-50 uppercase">Location</p>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3.5 text-xs opacity-40">location_on</span>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-0 text-on-surface"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Templates */}
          <div className="bg-surface-container rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
                Recommended Templates
              </h3>
              <span className="material-symbols-outlined text-sm opacity-50 cursor-pointer hover:text-primary transition-colors">
                filter_list
              </span>
            </div>
            <div className="space-y-3">
              {TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => loadTemplate(tpl)}
                  className="w-full text-left p-4 rounded-lg bg-surface-container-high/50 border border-transparent hover:border-primary/40 hover:bg-surface-container-high transition-all group"
                >
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">{tpl.label}</p>
                  <p className="text-[10px] opacity-50 mt-1 uppercase font-medium">{tpl.meta}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Preview */}
          <div className="relative overflow-hidden p-8 rounded-xl bg-surface-container">
            <div className="absolute top-0 right-0 p-4">
              <span
                className="material-symbols-outlined text-primary opacity-20 text-6xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
              Screening Precision
            </p>
            <p className="text-5xl font-black tracking-tighter mb-1">
              {(complexityScore / 10).toFixed(1)}
            </p>
            <p className="text-xs font-medium text-on-surface-variant">AI Confidence in JD context</p>
            <div className="mt-4 flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i < Math.round(complexityScore / 20) ? "bg-primary" : "bg-outline-variant/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Status Bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-max bg-surface-container-highest/60 backdrop-blur-2xl px-6 py-3 rounded-full border border-outline-variant/10 shadow-2xl flex items-center gap-8 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Analyzing Draft</span>
        </div>
        <div className="w-px h-4 bg-outline-variant/30" />
        <div className="flex items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            Status: <span className="text-on-surface ml-1">Drafting Profile</span>
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            Words: <span className="text-on-surface ml-1">{wordCount}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
