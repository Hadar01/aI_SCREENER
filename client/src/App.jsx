import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";
import MatchDetailPanel from "./components/MatchDetailPanel";
import JobDescriptionUpload from "./components/JobDescriptionUpload";
import CandidateComparison from "./components/CandidateComparison";

const VIEWS = {
  DASHBOARD: "dashboard",
  UPLOAD: "upload",
  JOB_DESCRIPTIONS: "job-descriptions",
  COMPARISON: "comparison",
  SETTINGS: "settings",
};

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS.DASHBOARD);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleViewCandidate = (id) => {
    setSelectedCandidateId(id);
  };

  const handleCloseDetail = () => {
    setSelectedCandidateId(null);
  };

  const handleSaveAndScreen = (jobTitle, jd, skills) => {
    showToast(`✅ Job profile "${jobTitle}" saved. Ready to screen!`);
    setActiveView(VIEWS.DASHBOARD);
  };

  const renderView = () => {
    switch (activeView) {
      case VIEWS.DASHBOARD:
        return (
          <Dashboard
            onViewCandidate={handleViewCandidate}
            searchQuery={searchQuery}
          />
        );
      case VIEWS.UPLOAD:
        return (
          <JobDescriptionUpload
            onSaveAndScreen={handleSaveAndScreen}
          />
        );
      case VIEWS.JOB_DESCRIPTIONS:
        return (
          <JobDescriptionUpload
            onSaveAndScreen={handleSaveAndScreen}
          />
        );
      case VIEWS.COMPARISON:
        return (
          <CandidateComparison
            onViewCandidate={handleViewCandidate}
          />
        );
      case VIEWS.SETTINGS:
        return (
          <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
            <span className="material-symbols-outlined text-7xl text-outline-variant mb-4">settings</span>
            <h2 className="text-2xl font-black text-on-surface">Settings</h2>
            <p className="text-on-surface-variant mt-2">Configuration panel coming soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-['Inter'] antialiased" id="app-root">
      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <TopBar
        activeView={activeView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="ml-64 pt-20 p-8 min-h-screen bg-surface-container-low" id="main-content">
        {renderView()}
      </main>

      {/* ── Match Detail Slide-out Panel ──────────────────────────────────── */}
      {selectedCandidateId && (
        <MatchDetailPanel
          candidateId={selectedCandidateId}
          onClose={handleCloseDetail}
        />
      )}

      {/* ── Floating AI Engine Badge ──────────────────────────────────────── */}
      <div className="fixed bottom-8 right-8 pointer-events-none z-30">
        <div className="p-4 glass-panel rounded-2xl border border-primary/20 flex items-center gap-4 pointer-events-auto shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0">
            <span
              className="material-symbols-outlined animate-spin"
              style={{ animationDuration: "3s" }}
            >
              sync
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-on-surface leading-none">AI Engine Active</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
              Refining matching algorithms
            </span>
          </div>
        </div>
      </div>

      {/* ── Toast Notification ────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-slide-up
                     rounded-full bg-surface-container-highest/90 backdrop-blur-xl border border-outline-variant/20
                     px-6 py-3 text-sm font-medium text-on-surface shadow-2xl whitespace-nowrap"
          id="toast-notification"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
