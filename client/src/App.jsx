import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./components/Dashboard";
import MatchDetailPanel from "./components/MatchDetailPanel";
import JobDescriptionUpload from "./components/JobDescriptionUpload";
import CandidateComparison from "./components/CandidateComparison";
import ResumeUploader from "./components/ResumeUploader";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";

const VIEWS = {
  LANDING: "landing",
  DASHBOARD: "dashboard",
  UPLOAD: "upload",
  JOB_DESCRIPTIONS: "job-descriptions",
  COMPARISON: "comparison",
  SETTINGS: "settings",
  PROFILE: "profile",
};

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS.LANDING);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [userName] = useState("Admin");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleStartApp = () => setActiveView(VIEWS.DASHBOARD);
  const handleLogout = () => {
    showToast("👋 Signed out successfully");
    setActiveView(VIEWS.LANDING);
  };

  const handleViewCandidate = (id) => setSelectedCandidateId(id);
  const handleCloseDetail = () => setSelectedCandidateId(null);

  const handleSaveAndScreen = (jobTitle) => {
    showToast(`✅ Job profile "${jobTitle}" saved. Ready to screen!`);
    setActiveView(VIEWS.DASHBOARD);
  };

  // ── Landing Page ────────────────────────────────────────────────────────
  if (activeView === VIEWS.LANDING) {
    return <LandingPage onEnter={handleStartApp} />;
  }

  // ── View Router ─────────────────────────────────────────────────────────
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
          <div className="animate-fade-in space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tighter text-on-surface">Upload Resumes</h2>
              <p className="text-on-surface-variant font-medium mt-1">
                Batch process multiple PDFs. Our engine will extract text and analyze against your active Job Profile.
              </p>
            </div>
            <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 shadow-xl">
              <ResumeUploader
                onUploadComplete={() => {
                  showToast("✅ Resumes uploaded and queued for analysis!");
                  setActiveView(VIEWS.DASHBOARD);
                }}
              />
            </div>
          </div>
        );
      case VIEWS.JOB_DESCRIPTIONS:
        return <JobDescriptionUpload onSaveAndScreen={handleSaveAndScreen} />;
      case VIEWS.COMPARISON:
        return <CandidateComparison onViewCandidate={handleViewCandidate} />;
      case VIEWS.SETTINGS:
        return <SettingsPage onToast={showToast} />;
      case VIEWS.PROFILE:
        return <ProfilePage userName={userName} onNavigate={setActiveView} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface text-on-surface font-['Inter'] antialiased" id="app-root">
      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={handleLogout}
      />

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <TopBar
        activeView={activeView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={setActiveView}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="ml-64 pt-20 px-8 pb-12 min-h-screen bg-surface-container-low" id="main-content">
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
      <div className="fixed bottom-8 right-8 pointer-events-none z-30 hidden md:block">
        <div className="p-4 glass-panel rounded-2xl border border-primary/20 flex items-center gap-4 pointer-events-auto shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary opacity-20 animate-pulse" />
            <span className="material-symbols-outlined animate-spin" style={{ animationDuration: "3s" }}>sync</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-on-surface leading-none">AI Engine Active</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Refining matching algorithms</span>
          </div>
        </div>
      </div>

      {/* ── Toast Notification ────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-slide-up bg-surface-container-highest/90 backdrop-blur-xl border border-outline-variant/20 px-6 py-3 text-sm font-bold text-on-surface shadow-2xl rounded-full">
          {toast}
        </div>
      )}
    </div>
  );
}
