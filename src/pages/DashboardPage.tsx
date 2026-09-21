import React from 'react';
import { 
  FileSearch, 
  GitCompare, 
  Dna,
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  FileText,
  History
} from 'lucide-react';
import { PageRoute, SyntheticDocument } from '../types';
import { SAMPLE_DOCUMENTS, MOCK_HISTORY } from '../data/mockData';

interface DashboardPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectDocument: (doc: SyntheticDocument) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectDocument }) => {
  // Recent analyses from mock data
  const recentAnalyses = MOCK_HISTORY.slice(0, 5);

  // Recent findings across specimens
  const recentFindings = [
    {
      id: 'f1',
      title: 'Font Weight & Kerning Disparity',
      doc: 'Financial_Earnings_2025.pdf',
      severity: 'high',
      time: '12m ago',
      desc: 'Subpixel raster weight variation detected on net revenue cell ($4.2M). Replaced with Helvetica Bold.'
    },
    {
      id: 'f2',
      title: 'ELA Compression Artifact',
      doc: 'Passport_Scan_Specimen.jpg',
      severity: 'medium',
      time: '42m ago',
      desc: 'Discrete Cosine Transform (DCT) block entropy anomaly around photo seal border.'
    },
    {
      id: 'f3',
      title: 'Cryptographic Hash Mismatch',
      doc: 'Vendor_Contract_Amendment.pdf',
      severity: 'low',
      time: '1h ago',
      desc: 'Incremental revision detected after certified PDF timestamp.'
    },
    {
      id: 'f4',
      title: 'Tabular Alignment Baseline Skew',
      doc: 'Bank_Statement_Oct2025.pdf',
      severity: 'high',
      time: '2h ago',
      desc: '3.2px baseline vertical shift in transaction row 14.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left relative z-10">
      
      {/* Header with System Integrity Status Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            AI Document Tampering & Identity Risk Analyzer
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Analyze documents, detect potential tampering, identify anomalies, and understand verification risk with AI-powered forensic analysis.
          </p>
        </div>

        {/* Live Forensic Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-[#0b1736]/80 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-slate-700 dark:text-cyan-300 shadow-sm self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="tracking-wide">AI FORENSIC ENGINE ONLINE</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">SHA-256 Validated</span>
        </div>
      </div>

      {/* Primary Action Cards: Analysis, Document Comparison, History, Reports (Glass Depth & 3D Visibility) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Analyze Document Card */}
        <div 
          id="dashboard-action-analyze"
          onClick={() => onNavigate('analyze')}
          className="group cursor-pointer rounded-2xl p-5 bg-white/75 dark:bg-[#091533]/80 backdrop-blur-xl border border-slate-200/80 dark:border-cyan-500/25 hover:border-cyan-500 dark:hover:border-cyan-400/70 shadow-lg shadow-slate-900/5 dark:shadow-cyan-950/25 hover:shadow-cyan-500/15 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <FileSearch className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                Single Scan
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Analysis
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                Inspect documents for text modifications, ELA, and metadata anomalies.
              </p>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <span>Analyze Specimen</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Compare Documents Card */}
        <div 
          id="dashboard-action-compare"
          onClick={() => onNavigate('compare')}
          className="group cursor-pointer rounded-2xl p-5 bg-white/75 dark:bg-[#091533]/80 backdrop-blur-xl border border-slate-200/80 dark:border-violet-500/25 hover:border-violet-500 dark:hover:border-violet-400/70 shadow-lg shadow-slate-900/5 dark:shadow-violet-950/25 hover:shadow-violet-500/15 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20 group-hover:scale-105 transition-transform">
                <Dna className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                DNA Engine
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Document DNA
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                Genomic biometrics and tri-color differential analysis of clean, suspicious, and tampered data.
              </p>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-violet-600 dark:text-violet-400">
            <span>Inspect Document DNA</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* History Card */}
        <div 
          id="dashboard-action-history"
          onClick={() => onNavigate('history')}
          className="group cursor-pointer rounded-2xl p-5 bg-white/75 dark:bg-[#091533]/80 backdrop-blur-xl border border-slate-200/80 dark:border-blue-500/25 hover:border-blue-500 dark:hover:border-blue-400/70 shadow-lg shadow-slate-900/5 dark:shadow-blue-950/25 hover:shadow-blue-500/15 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
                <History className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Audit Trail
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                History
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                Audit trail and historical logs of all completed forensic verifications.
              </p>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Reports Card */}
        <div 
          id="dashboard-action-reports"
          onClick={() => onNavigate('reports')}
          className="group cursor-pointer rounded-2xl p-5 bg-white/75 dark:bg-[#091533]/80 backdrop-blur-xl border border-slate-200/80 dark:border-emerald-500/25 hover:border-emerald-500 dark:hover:border-emerald-400/70 shadow-lg shadow-slate-900/5 dark:shadow-emerald-950/25 hover:shadow-emerald-500/15 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Certificates
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Reports
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                Export verifiable certificates, audit dossiers, and compliance reports.
              </p>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>View Certificates</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 3. Risk Overview (Glass Depth Card) */}
      <div className="rounded-2xl p-6 bg-white/75 dark:bg-[#091533]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-900/5 dark:shadow-cyan-950/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Risk Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of forensic scan verdicts across all ingested documents.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" /> Low Risk (72%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" /> Suspicious (14%)
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" /> Tampered (14%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex shadow-inner">
          <div className="h-full bg-emerald-500" style={{ width: '72%' }} title="72% Low Risk" />
          <div className="h-full bg-amber-500" style={{ width: '14%' }} title="14% Suspicious" />
          <div className="h-full bg-rose-500" style={{ width: '14%' }} title="14% Tampered" />
        </div>

        {/* Quick Stat Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0c1c44]/60 border border-slate-200/60 dark:border-cyan-500/15 backdrop-blur-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">924</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified Authentic</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0c1c44]/60 border border-slate-200/60 dark:border-cyan-500/15 backdrop-blur-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">178</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Suspicious Anomalies</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0c1c44]/60 border border-slate-200/60 dark:border-cyan-500/15 backdrop-blur-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">182</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Confirmed Tampered</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 & 5: Recent Analyses & Recent Findings in a balanced 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Analyses (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-white/75 dark:bg-[#091533]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-900/5 dark:shadow-cyan-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Analyses
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest document forensic inspections.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentAnalyses.map((item) => {
              const isHigh = item.riskScore >= 70;
              const isMedium = item.riskScore >= 40 && item.riskScore < 70;
              return (
                <div 
                  key={item.id} 
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-[#0c1c44]/60 px-2.5 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.docName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.date} • {item.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isHigh
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                        : isMedium
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                    }`}>
                      Risk {item.riskScore}
                    </span>
                    <button
                      onClick={() => {
                        const doc = SAMPLE_DOCUMENTS[0];
                        onSelectDocument(doc);
                        onNavigate('results');
                      }}
                      className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Report
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Findings (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-white/75 dark:bg-[#091533]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-900/5 dark:shadow-cyan-950/20 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Findings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Critical anomalies flagged by neural analyzers.
            </p>
          </div>

          <div className="space-y-3">
            {recentFindings.map((finding) => (
              <div 
                key={finding.id}
                className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0c1c44]/60 border border-slate-200/60 dark:border-cyan-500/15 backdrop-blur-sm space-y-1.5 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {finding.title}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    finding.severity === 'high'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50'
                      : finding.severity === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50'
                  }`}>
                    {finding.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {finding.desc}
                </p>
                <p className="text-[11px] text-slate-400 pt-0.5">
                  {finding.doc} • {finding.time}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
