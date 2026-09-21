import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Flame, 
  Dna, 
  HelpCircle, 
  Layers, 
  FileText, 
  Clock, 
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Smartphone,
  Sparkles,
  Sliders,
  Crosshair,
  FileCheck
} from 'lucide-react';
import { PageRoute, SyntheticDocument, ForensicAnomaly, VerificationState } from '../types';
import { AIXRayViewer } from '../components/AIXRayViewer';
import { TamperHeatmapViewer } from '../components/TamperHeatmapViewer';
import { DocumentDNAVisualizer } from '../components/DocumentDNAVisualizer';
import { ForensicLayersInspector } from '../components/ForensicLayersInspector';
import { OwnerVerificationModal } from '../components/OwnerVerificationModal';

interface ResultsPageProps {
  document: SyntheticDocument;
  onNavigate: (page: PageRoute) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ document: initialDoc, onNavigate }) => {
  const [document, setDocument] = useState<SyntheticDocument>(initialDoc);
  const [activeTab, setActiveTab] = useState<'overview' | 'layers' | 'xray' | 'heatmap' | 'dna' | 'explain'>('overview');
  
  // Interactive features
  const [isPiiMasked, setIsPiiMasked] = useState<boolean>(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<ForensicAnomaly | null>(null);
  const [isZoomMagnifierActive, setIsZoomMagnifierActive] = useState<boolean>(false);
  const [specimenZoom, setSpecimenZoom] = useState<number>(1);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);

  const isTampered = document.riskScore >= 40;
  const isHighRisk = document.riskScore >= 70;

  // Breakdown metrics
  const breakdown = document.riskBreakdown || {
    font: document.anomalies.filter(a => a.category === 'Font').length > 0 ? 82 : 12,
    layout: document.anomalies.filter(a => a.category === 'Layout' || a.category === 'Template Deviation').length > 0 ? 76 : 14,
    metadata: document.anomalies.filter(a => a.category === 'Metadata').length > 0 ? 88 : 10,
    aiOrigin: document.aiOriginScore || 15,
    splicing: document.anomalies.filter(a => a.category === 'Image Splicing').length > 0 ? 84 : 16,
    crossField: document.anomalies.filter(a => a.category === 'Cross-Field').length > 0 ? 94 : 8,
  };

  const handleVerified = (updatedVerification: VerificationState) => {
    setDocument(prev => ({
      ...prev,
      verification: updatedVerification
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left relative z-10">
      
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <button
          id="back-to-dashboard-btn"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all shadow-xs group w-fit cursor-pointer"
          title="Return to Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* PII Masking Switcher */}
          <button
            onClick={() => setIsPiiMasked(!isPiiMasked)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isPiiMasked
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Personally Identifiable Information Masking"
          >
            {isPiiMasked ? <Lock className="w-3.5 h-3.5 text-emerald-500" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isPiiMasked ? 'PII Masked' : 'Mask PII'}</span>
          </button>

          {/* Export Certificate Button */}
          <button
            id="export-cert-btn"
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Forensic Certificate</span>
          </button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
              VERIFYX FORENSIC INTELLIGENCE DOSSIER
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {document.format}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            {document.name}
          </h1>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
            <span>Type: <strong className="text-slate-700 dark:text-slate-200">{document.type}</strong></span>
            <span>•</span>
            <span>Scanned: {document.uploadedAt}</span>
            <span>•</span>
            <span className="font-mono">SHA-256: {document.metadata.hashSha256.slice(0, 18)}...</span>
          </p>
        </div>

        {/* Status Badge & Owner Verification Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border shadow-xs ${
            isHighRisk
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
              : isTampered
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          }`}>
            {isHighRisk ? (
              <>
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <span>High Tamper Probability ({document.riskScore}/100)</span>
              </>
            ) : isTampered ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Suspicious Anomalies ({document.riskScore}/100)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Authentic Verified ({document.riskScore}/100)</span>
              </>
            )}
          </div>

          {/* Owner Verification Button */}
          {document.verification?.verified ? (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Holder Attested (OTP)</span>
            </div>
          ) : (
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-cyan-500" />
              <span>Verify Owner (OTP)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'layers', label: 'Multi-Layer Forensics', icon: Layers },
            { id: 'xray', label: 'AI X-Ray Mode', icon: Eye },
            { id: 'heatmap', label: 'Tamper Heatmap', icon: Flame },
            { id: 'dna', label: 'Document DNA', icon: Dna },
            { id: 'explain', label: 'Explain Risk', icon: HelpCircle },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Composite Risk Score</span>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {document.riskScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </p>
              <p className="text-[11px] text-slate-500">{document.riskLevel} Risk Classification</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">AI-Origin Probability</span>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {document.aiOriginScore}%
              </p>
              <p className="text-[11px] text-slate-500">Synthetic text &amp; generative artifacts</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Detected Anomalies</span>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {document.anomalies.length}
              </p>
              <p className="text-[11px] text-slate-500">Cross-field and visual flags</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Digital Signature</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pt-1">
                {document.metadata.digitalSignaturePresent ? (
                  <span className="text-emerald-500 flex items-center gap-1 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Cryptographically Valid
                  </span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1 text-sm font-semibold">
                    <AlertCircle className="w-4 h-4" /> Missing / Stripped
                  </span>
                )}
              </p>
              <p className="text-[11px] text-slate-500">PKI Certificate Verification</p>
            </div>

          </div>

          {/* Risk Breakdown by Category (Visual Progress Bars) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-500" />
                <span>Forensic Vector Risk Breakdown</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Weighted Multi-Factor Assessment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Font & Micro-Typography', score: breakdown.font },
                { label: 'Layout & Template Grid', score: breakdown.layout },
                { label: 'Metadata & File Structure', score: breakdown.metadata },
                { label: 'AI Origin & Synthetics', score: breakdown.aiOrigin },
                { label: 'Image Splicing & ELA', score: breakdown.splicing },
                { label: 'Cross-Field Checksums', score: breakdown.crossField },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/70 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className={`font-mono font-bold ${
                      item.score >= 70 ? 'text-rose-500' : item.score >= 40 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.score >= 70 
                          ? 'bg-rose-500' 
                          : item.score >= 40 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Preview with Deep Zoom & Bounding Box Inspection */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Visual Specimen Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-500" />
                  <span>Specimen Viewport</span>
                </h2>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setSpecimenZoom(prev => Math.max(0.8, prev - 0.2))}
                    className="p-1 hover:text-cyan-500"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] px-1">{Math.round(specimenZoom * 100)}%</span>
                  <button
                    onClick={() => setSpecimenZoom(prev => Math.min(2.5, prev + 0.2))}
                    className="p-1 hover:text-cyan-500"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsZoomMagnifierActive(!isZoomMagnifierActive)}
                    className={`p-1 rounded ${isZoomMagnifierActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:text-cyan-500'}`}
                    title="Toggle Magnifier Crosshair"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md overflow-hidden group">
                <div className="relative overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center min-h-[380px]">
                  <img 
                    src={document.thumbnailUrl} 
                    alt={document.name} 
                    style={{ transform: `scale(${specimenZoom})` }}
                    className="w-full h-full object-contain max-h-[460px] transition-transform duration-200"
                  />

                  {/* Bounding Box Highlights for Anomaly Inspection */}
                  {document.anomalies.map((anomaly) => {
                    if (!anomaly.location) return null;
                    const isSelected = selectedAnomaly?.id === anomaly.id;
                    return (
                      <div
                        key={anomaly.id}
                        onClick={() => setSelectedAnomaly(anomaly)}
                        style={{
                          left: `${anomaly.location.x}%`,
                          top: `${anomaly.location.y}%`,
                          width: `${anomaly.location.width}%`,
                          height: `${anomaly.location.height}%`,
                        }}
                        className={`absolute border-2 rounded-sm cursor-pointer transition-all ${
                          isSelected
                            ? 'border-rose-400 bg-rose-500/30 ring-2 ring-rose-400 shadow-lg animate-pulse'
                            : 'border-rose-500/70 bg-rose-500/15 hover:border-rose-300'
                        }`}
                        title={`Anomaly: ${anomaly.title}`}
                      >
                        <span className="absolute -top-5 left-0 text-[9px] font-mono font-bold px-1 rounded bg-rose-600 text-white whitespace-nowrap shadow-xs">
                          {anomaly.id}
                        </span>
                      </div>
                    );
                  })}

                  {/* PII Masking Overlay Simulation */}
                  {isPiiMasked && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-around p-8">
                      <div className="w-3/5 h-6 bg-slate-900/90 rounded border border-slate-700/80 mx-auto flex items-center justify-center">
                        <span className="text-[10px] font-mono text-cyan-400">████ REDACTED PII ████</span>
                      </div>
                      <div className="w-2/5 h-6 bg-slate-900/90 rounded border border-slate-700/80 mx-auto flex items-center justify-center">
                        <span className="text-[10px] font-mono text-cyan-400">████ REDACTED ████</span>
                      </div>
                      <div className="w-4/5 h-6 bg-slate-900/90 rounded border border-slate-700/80 mx-auto flex items-center justify-center">
                        <span className="text-[10px] font-mono text-cyan-400">████ IDENTIFIER MASKED (ZERO-KNOWLEDGE) ████</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Anomaly Inspection Drawer */}
                {selectedAnomaly && (
                  <div className="mt-3 p-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/90 dark:bg-rose-950/40 text-left text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-700 dark:text-rose-300">
                        {selectedAnomaly.id}: {selectedAnomaly.title}
                      </span>
                      <button 
                        onClick={() => setSelectedAnomaly(null)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {selectedAnomaly.description}
                    </p>
                    {selectedAnomaly.evidence && (
                      <p className="text-[11px] font-mono text-rose-600 dark:text-rose-400 pt-1 border-t border-rose-200 dark:border-rose-900">
                        Evidence: {selectedAnomaly.evidence}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Forensic Findings List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Forensic Findings ({document.anomalies.length})
                </h2>
                <span className="text-xs text-slate-400">
                  Click any card to inspect coordinates
                </span>
              </div>

              {document.anomalies.length === 0 ? (
                <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    No Forensic Tampering Detected
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    All typographic vectors, metadata packets, and structural layout grids conform to canonical standards.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {document.anomalies.map((anomaly) => {
                    const isSelected = selectedAnomaly?.id === anomaly.id;
                    return (
                      <div 
                        key={anomaly.id}
                        onClick={() => setSelectedAnomaly(anomaly)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 text-left ${
                          isSelected
                            ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500 shadow-md ring-1 ring-rose-400'
                            : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-semibold font-mono">
                              {anomaly.category}
                            </span>
                            {anomaly.title}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                            anomaly.severity === 'high' || anomaly.severity === 'critical'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          }`}>
                            {anomaly.severity.toUpperCase()} ({anomaly.confidence}% Confidence)
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {anomaly.description}
                        </p>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span><strong>Forensic Evidence:</strong> {anomaly.evidence}</span>
                          {anomaly.location && (
                            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 shrink-0 ml-2">
                              Coord: [{anomaly.location.x}, {anomaly.location.y}]
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Tab Content 2: Multi-Layer Vectors */}
      {activeTab === 'layers' && (
        <ForensicLayersInspector 
          document={document} 
          onSelectAnomaly={(anom) => {
            setSelectedAnomaly(anom);
            setActiveTab('overview');
          }}
        />
      )}

      {/* Tab Content 3: AI X-Ray */}
      {activeTab === 'xray' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI X-Ray Forensic Lens
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect sub-pixel compression artifacts, vector outlines, and discrete cosine transform (DCT) grids.
            </p>
          </div>
          <AIXRayViewer 
            imageSrc={document.thumbnailUrl} 
            docTitle={document.name} 
          />
        </div>
      )}

      {/* Tab Content 4: Tamper Heatmap */}
      {activeTab === 'heatmap' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Tamper Heatmap &amp; ELA Inspector
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Colorized error level distribution displaying altered pixels and spliced region coordinates.
            </p>
          </div>
          <TamperHeatmapViewer 
            imageSrc={document.thumbnailUrl} 
            anomalies={document.anomalies} 
            riskScore={document.riskScore}
          />
        </div>
      )}

      {/* Tab Content 5: Document DNA */}
      {activeTab === 'dna' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Document DNA Fingerprint
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-dimensional radial vector analyzing structural coherence, font fingerprints, and pixel entropy.
            </p>
          </div>
          <DocumentDNAVisualizer 
            dna={document.dna} 
            docTitle={document.name} 
          />
        </div>
      )}

      {/* Tab Content 6: Explain Risk */}
      {activeTab === 'explain' && (
        <div className="rounded-2xl p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Explain Risk Assessment &amp; Decision Framework
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent natural-language justification of the composite forensic score.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Executive Forensic Verdict
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {document.riskExplanation}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/50 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
              Recommended Investigator Actions
            </h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {document.recommendedAction}
            </p>
          </div>
        </div>
      )}

      {/* Owner Verification Modal */}
      <OwnerVerificationModal
        document={document}
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerified={handleVerified}
      />

    </div>
  );
};
