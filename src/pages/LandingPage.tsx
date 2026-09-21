import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  FileSearch, 
  Dna, 
  Flame, 
  Eye, 
  GitCompare, 
  Lock, 
  Database, 
  CheckCircle2, 
  ChevronRight,
  Bot
} from 'lucide-react';
import { SecurityVerificationEmblem3D } from '../components/SecurityVerificationEmblem3D';
import { PageRoute } from '../types';

interface LandingPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeFeature, setActiveFeature] = useState<'xray' | 'heatmap' | 'dna' | 'compare'>('xray');

  const features = [
    {
      id: 'xray' as const,
      title: 'AI X-Ray Mode',
      subtitle: 'Subterranean Layer Inspection',
      icon: Eye,
      tag: 'Optical Residuals',
      description: 'Strips surface rendering to inspect vector baselines, hidden white-on-white text layers, font anti-aliasing signatures, and subpixel raster weight modifications.',
      previewImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      metric: 'Pixel Precision 0.1px'
    },
    {
      id: 'heatmap' as const,
      title: 'Tamper Heatmap & ELA',
      subtitle: 'Compression Entropy Gradient',
      icon: Flame,
      tag: 'Error Level Analysis',
      description: 'Calculates discrete cosine transform (DCT) variance across 8x8 blocks, illuminating localized JPEG re-compression, pasted seals, and spliced transaction rows in thermal hues.',
      previewImg: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      metric: '99.4% Anomaly Recall'
    },
    {
      id: 'dna' as const,
      title: 'Document DNA',
      subtitle: 'Forensic Biometric Hash',
      icon: Dna,
      tag: 'Cryptographic Profile',
      description: 'Synthesizes micro-typography variance, structural grid margins, chromatic consistency, and cryptographic timestamps into a verifiable forensic fingerprint.',
      previewImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      metric: 'SHA-256 Validated'
    },
    {
      id: 'compare' as const,
      title: 'Document A vs B Difference Map',
      subtitle: 'Automated Comparative Delta',
      icon: GitCompare,
      tag: 'Differential Matrix',
      description: 'Ingests suspected variants alongside certified baselines, automatically aligning rotation and scaling while highlighting text additions, deletions, and subtle layout shifts.',
      previewImg: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      metric: 'Multi-Page Alignment'
    }
  ];

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-700 dark:selection:text-cyan-200">
      
      {/* Subtle ambient lighting - soft, gentle, never overwhelming */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-15%] right-[15%] w-[550px] h-[550px] rounded-full bg-cyan-500/8 dark:bg-cyan-500/12 filter blur-[140px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-500/8 dark:bg-violet-600/10 filter blur-[140px]" />
      </div>

      {/* 1. HERO SECTION: Clean 2-column layout */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Clear, High-Contrast Typography & Actions */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Subtle Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span className="tracking-wide">VERIFYX AI</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">Document Verification</span>
              </div>

              {/* Exact Hero Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white leading-[1.12]">
                AI Document Tampering &{' '}
                <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-violet-600 dark:from-cyan-400 dark:via-sky-400 dark:to-violet-400 bg-clip-text text-transparent">
                  Identity Risk Analyzer
                </span>
              </h1>

              {/* Exact Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Analyze documents, detect potential tampering, identify anomalies, and understand verification risk with AI-powered forensic analysis.
              </p>

              {/* Two Clear Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  id="hero-analyze-doc-btn"
                  onClick={() => onNavigate('analyze')}
                  className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm tracking-normal shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <FileSearch className="w-4 h-4 text-slate-950" />
                  <span>Analyze Document</span>
                  <ArrowRight className="w-4 h-4 btn-icon-arrow transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  id="hero-compare-doc-btn"
                  onClick={() => onNavigate('compare')}
                  className="px-6 py-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-cyan-500/30 hover:border-cyan-400 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-all duration-200 shadow-md shadow-slate-900/5 dark:shadow-cyan-950/30 flex items-center justify-center gap-2 group backdrop-blur-md cursor-pointer"
                >
                  <GitCompare className="w-4 h-4 text-cyan-500 group-hover:rotate-12 transition-transform" />
                  <span>Compare Documents</span>
                </button>
              </div>

              {/* Minimal sub-label */}
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                Built for synthetic and authorized documents. Enterprise SHA-256 cryptographic verification.
              </p>
            </div>

            {/* Right Column: 3D Cybersecurity & Document Verification Scene */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-white/40 to-white/10 dark:from-slate-900/40 dark:to-slate-950/60 backdrop-blur-md shadow-2xl p-1 sm:p-2 overflow-hidden group">
                <SecurityVerificationEmblem3D className="w-full" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MINIMAL FLOW SECTION */}
      <section className="py-6 border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <span className="text-slate-800 dark:text-slate-200 font-semibold">DOCUMENT</span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">ANALYZE</span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">DETECT</span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">EXPLAIN</span>
            <span className="text-slate-300 dark:text-slate-700">→</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">VERIFY</span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
              Forensic Methodology
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
              How VerifyX Works
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              Our forensic engine interrogates document structure, optical layers, and textual signatures to provide explainable risk indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: Detect */}
            <div className="interactive-card rounded-2xl p-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <FileSearch className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Step 1</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
                Detect Anomalies
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Interrogates micro-typography kerning, compression artifacts, metadata history, and pixel entropy to detect subtle modifications.
              </p>
            </div>

            {/* Step 2: Explain */}
            <div className="interactive-card rounded-2xl p-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">Step 2</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
                Explain Risk
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Translates technical findings into plain-language forensic reasoning so teams can make confident compliance and legal decisions.
              </p>
            </div>

            {/* Step 3: Verify */}
            <div className="interactive-card rounded-2xl p-7 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Step 3</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
                Verify & Export
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generates audit-ready reports stamped with cryptographic SHA-256 hashes, tamper heatmaps, and forensic certificates.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-20 md:py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
              Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
              Forensic Intelligence Features
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
              Explore the key analytical methods built directly into the VerifyX engine.
            </p>
          </div>

          {/* Interactive Feature Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {features.map(feat => {
              const Icon = feat.icon;
              const isActive = activeFeature === feat.id;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeature(feat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{feat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Feature Showcase */}
          {(() => {
            const current = features.find(f => f.id === activeFeature) || features[0];
            const Icon = current.icon;
            return (
              <div className="interactive-card rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-10 shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left: Detail */}
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium">
                      <Icon className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{current.tag}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
                      {current.title}
                    </h3>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">{current.subtitle}</p>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {current.description}
                    </p>

                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                        {current.metric}
                      </span>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => onNavigate('analyze')}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                      >
                        Try {current.title}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Visual Preview */}
                  <div className="lg:col-span-7">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-950 aspect-[16/10] group">
                      <img
                        src={current.previewImg}
                        alt={current.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between text-xs text-slate-300">
                        <span className="bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-700">
                          {current.title}
                        </span>
                        <span className="text-cyan-400 font-medium bg-slate-900/90 px-3 py-1 rounded-lg border border-cyan-500/30">
                          Synthetic Inspection
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* 5. SECURITY & PRIVACY */}
      <section id="security" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Privacy & Trust
            </h2>
            <p className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Enterprise Security Standards
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Engineered for data protection and confidentiality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="interactive-card p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Zero Document Retention
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Files are processed in temporary memory and can be permanently removed according to your retention policies.
              </p>
            </div>

            <div className="interactive-card p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Synthetic Benchmark Safety
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calibrated with synthetic document models to ensure privacy compliance and robust generalized detection.
              </p>
            </div>

            <div className="interactive-card p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Cryptographic Hashing
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every scan computes standard SHA-256 fingerprints to ensure mathematical integrity and chain-of-custody verification.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CLEAN CTA */}
      <section className="py-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mb-3">
              Ready to verify your documents?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-6">
              Start an analysis on any sample document or enter your workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="cta-analyze-btn"
                onClick={() => onNavigate('analyze')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Analyze Document</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="cta-login-btn"
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white font-display">VERIFYX AI</span>
            <span>• Document Intelligence</span>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Built for synthetic and authorized documents.
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => onNavigate('landing')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Home</button>
            <button onClick={() => onNavigate('analyze')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Analyze</button>
            <button onClick={() => onNavigate('settings')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Settings</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
