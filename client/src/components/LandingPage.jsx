import React from "react";

export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter'] selection:bg-primary-container selection:text-white">
      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">cognition</span>
          </div>
          <span className="text-xl font-black tracking-tighter">AI-Screener Pro</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#dae2fd]/70 hover:text-[#dae2fd] transition-colors">
          <a href="#product" className="hover:text-white">Product</a>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#enterprise" className="hover:text-white">Enterprise</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onEnter} className="text-sm font-bold text-[#dae2fd]/80 hover:text-white transition-colors">
            Login
          </button>
          <button 
            onClick={onEnter} 
            className="px-5 py-2.5 bg-primary-container text-white text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center animate-fade-in pb-24">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6 mt-12">
            The <span className="text-[#c3c0ff]">AI-Screener Pro</span><br />
            Experience
          </h1>
          <p className="text-[#dae2fd]/60 max-w-2xl text-lg mb-10">
            A cognitive monolith designed for precision. Transform fragmented data into surgical insights with our next-generation enterprise screening engine.
          </p>
          <div className="flex items-center gap-4 mb-20">
            <button 
              onClick={onEnter}
              className="px-8 py-3.5 bg-primary-container text-white font-bold rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              Deploy Infrastructure
            </button>
            <button 
              className="px-8 py-3.5 bg-[#141b2d] border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 active:scale-95 transition-all"
            >
              View Documentation
            </button>
          </div>

          {/* Hero Images simulating Dashboard components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative">
            <div className="absolute -inset-10 bg-primary-container/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-container to-transparent z-10" />
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#dae2fd]/50">Real-time Analytics</span>
              </div>
              <h3 className="text-xl font-bold mb-6">Neural Processing Core</h3>
              <div className="h-32 w-full flex items-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
                ))}
              </div>
            </div>

            <div className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative z-10">
              <div className="w-10 h-10 bg-[#c3c0ff]/10 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#c3c0ff]">analytics</span>
              </div>
              <h3 className="text-3xl font-black mb-2">99.8% Precision</h3>
              <p className="text-sm text-[#dae2fd]/60 mb-8 max-w-[200px]">Validate enterprise screening accuracy across 40k vector indices.</p>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[99.8%] bg-[#c3c0ff] shadow-[0_0_10px_#c3c0ff]" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Workflow ──────────────────────────────────────────────────────── */}
        <section className="py-24 border-t border-white/5" id="workflow">
          <div className="mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">Surgical Workflow</h2>
            <p className="text-[#dae2fd]/60">Efficiency is our primary directive. Three steps from noise to signal.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Upload", desc: "Securely ingest multi-modal datasets. Support for encrypted streams, JSON, and unstructured textual monoliths.", icon: "cloud_upload" },
              { num: "02", title: "Analyze", desc: "Proprietary AI engine dissects patterns, identifying anomalies and screening for critical risk vectors in milliseconds.", icon: "memory" },
              { num: "03", title: "Result", desc: "Receive automated-grade reports. Actionable intelligence delivered via API, web interface, or secure PDF.", icon: "verified" }
            ].map((step, i) => (
              <div key={i} className="flex flex-col group">
                <div className="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center text-xl font-black mb-6 group-hover:bg-primary-container group-hover:border-primary-container transition-colors duration-300">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-[#dae2fd]/60 leading-relaxed mb-8 flex-1">{step.desc}</p>
                <div className="h-px w-full bg-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-[#c3c0ff] group-hover:w-full transition-all duration-700 ease-out" />
                </div>
                <div className="mt-4 opacity-50"><span className="material-symbols-outlined text-sm">{step.icon}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Enterprise Architecture ────────────────────────────────────────── */}
        <section className="py-24 border-t border-white/5 flex flex-col items-center" id="features">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-4">The Stack</p>
          <h2 className="text-4xl font-black tracking-tighter mb-16">Enterprise Architecture</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="md:col-span-1 bg-surface-container/40 border border-white/5 p-8 rounded-3xl flex flex-col justify-end min-h-[300px] hover:bg-surface-container/60 transition-colors">
              <span className="material-symbols-outlined text-3xl mb-auto text-[#dae2fd]">bolt</span>
              <h3 className="text-xl font-bold mb-2">Velocity First</h3>
              <p className="text-sm text-[#dae2fd]/60">Sub-second latency on datasets exceeding 100GB. Performance without compromise.</p>
            </div>
            
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="flex-1 bg-surface-container/40 border border-white/5 p-8 rounded-3xl flex justify-between items-center hover:bg-surface-container/60 transition-colors">
                <div>
                  <h3 className="text-xl font-bold mb-2">Deep Integration</h3>
                  <p className="text-sm text-[#dae2fd]/60 max-w-md">Native hooks for Salesforce, AWS, and Azure. Seamlessly embed screening into your existing lifecycle.</p>
                </div>
                <span className="material-symbols-outlined text-6xl text-white/5 hidden md:block" style={{fontVariationSettings:"'FILL' 1"}}>extension</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="bg-surface-container/40 border border-white/5 p-8 rounded-3xl hover:bg-surface-container/60 transition-colors">
                  <h3 className="text-lg font-bold mb-2">Security</h3>
                  <p className="text-xs text-[#dae2fd]/60">SOC2 Type II compliant with end-to-end AES-256 encryption.</p>
                </div>
                <div className="bg-primary-container p-8 rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.2)]">
                  <h3 className="text-lg font-bold mb-2 text-white">Global Scale</h3>
                  <p className="text-xs text-white/80">Distributed nodes across 12 global regions for minimum drift.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-container/20 to-surface-container border border-primary-container/20 p-16 text-center">
            {/* Background design */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Ready to evolve?</h2>
              <p className="text-[#dae2fd]/80 mb-10 text-lg">
                Join 2,000+ enterprises optimizing their cognitive pipeline with AI-Screener Pro.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={onEnter}
                  className="px-8 py-3.5 bg-white text-[#0b1326] font-black tracking-tight rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Start 14-Day Trial
                </button>
                <button 
                  className="px-8 py-3.5 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 active:scale-95 transition-all"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-[#dae2fd]/40">
        <div>
          <span className="font-bold text-[#dae2fd]/80 mr-2">AI-Screener Pro</span>
          © 2026 AI-Screener Pro. The Cognitive Monolith.
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
          <a href="#" className="hover:text-white transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
}
