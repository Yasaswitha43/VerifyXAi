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
import { ForensicAnalyticsGraph } from '../components/ForensicAnalyticsGraph';
import { useLanguage } from '../i18n';

interface ResultsPageProps {
  document: SyntheticDocument;
  onNavigate: (page: PageRoute) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ document: initialDoc, onNavigate }) => {
  const { t, isRTL, formatNumber } = useLanguage();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
      
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <button
          id="back-to-dashboard-btn"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all shadow-xs group w-fit cursor-pointer"
          title={t('backToDashboard')}
        >
          <ArrowLeft className={`w-4 h-4 text-cyan-500 transition-transform ${isRTL ? 'group-hover:translate-x-0.5 rotate-180' : 'group-hover:-translate-x-0.5'}`} />
          <span>{t('dashboard')}</span>
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
            title={t('zeroKnowledgeMask')}
          >
            {isPiiMasked ? <Lock className="w-3.5 h-3.5 text-emerald-500" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isPiiMasked ? t('piiMasked') : t('maskPii')}</span>
          </button>

          {/* Export Certificate Button */}
          <button
            id="export-cert-btn"
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t('forensicCertificate')}</span>
          </button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
              {t('dossierHeader')}
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
            <span>{t('fileType')}: <strong className="text-slate-700 dark:text-slate-200">{document.type}</strong></span>
            <span>•</span>
            <span>{t('created')}: {document.uploadedAt}</span>
            <span>•</span>
            <span className="font-mono">{t('hashSha256')}: {document.metadata.hashSha256.slice(0, 18)}...</span>
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
                <span>{t('highTamperProbability', { score: formatNumber(document.riskScore) })}</span>
              </>
            ) : isTampered ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>{t('suspiciousAnomaliesRisk', { score: formatNumber(document.riskScore) })}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>{t('authenticVerified', { score: formatNumber(document.riskScore) })}</span>
              </>
            )}
          </div>

          {/* Owner Verification Button */}
          {document.verification?.verified ? (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{t('holderAttested')}</span>
            </div>
          ) : (
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-cyan-500" />
              <span>{t('verifyOwnerOtp')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: t('overview'), icon: FileText },
            { id: 'layers', label: t('multiLayerForensics'), icon: Layers },
            { id: 'xray', label: t('aiXrayMode'), icon: Eye },
            { id: 'heatmap', label: t('tamperHeatmap'), icon: Flame },
            { id: 'dna', label: t('documentDNA'), icon: Dna },
            { id: 'explain', label: t('explainRisk'), icon: HelpCircle },
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
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('forensicRiskScore')}</span>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {formatNumber(document.riskScore)} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </p>
              <p className="text-[11px] text-slate-500">{document.riskLevel} {t('tamperRiskLevel')}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('aiOrigin')}</span>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {formatNumber(document.aiOriginScore || 15)}%
              </p>
              <p className="text-[11px] text-slate-500">{t('syntheticAnomalies') || 'Synthetic text & generative artifacts'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('suspiciousAnomalies')}</span>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {formatNumber(document.anomalies.length)}
              </p>
              <p className="text-[11px] text-slate-500">{t('crossFieldAndVisualFlags') || 'Cross-field and visual flags'}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('securityVerification')}</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pt-1">
                {document.metadata.digitalSignaturePresent ? (
                  <span className="text-emerald-500 flex items-center gap-1 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> {t('verifiedAuthentic')}
                  </span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1 text-sm font-semibold">
                    <AlertCircle className="w-4 h-4" /> {t('missingOrStripped') || 'Missing / Stripped'}
                  </span>
                )}
              </p>
              <p className="text-[11px] text-slate-500">{t('shaValidated')}</p>
            </div>

          </div>

          {/* Risk Breakdown by Category (Visual Progress Bars) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-500" />
                <span>{t('anomalyBreakdown')}</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Weighted Multi-Factor Assessment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: t('font'), score: breakdown.font },
                { label: t('layout'), score: breakdown.layout },
                { label: t('metadata'), score: breakdown.metadata },
                { label: t('aiOrigin'), score: breakdown.aiOrigin },
                { label: t('imageSplicing'), score: breakdown.splicing },
                { label: t('crossField'), score: breakdown.crossField },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/70 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className={`font-mono font-bold ${
                      item.score >= 70 ? 'text-rose-500' : item.score >= 40 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {formatNumber(item.score)}%
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
                  <span>{t('specimenViewport')}</span>
                </h2>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setSpecimenZoom(prev => Math.max(0.8, prev - 0.2))}
                    className="p-1 hover:text-cyan-500 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] px-1">{formatNumber(Math.round(specimenZoom * 100))}%</span>
                  <button
                    onClick={() => setSpecimenZoom(prev => Math.min(2.5, prev + 0.2))}
                    className="p-1 hover:text-cyan-500 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsZoomMagnifierActive(!isZoomMagnifierActive)}
                    className={`p-1 rounded cursor-pointer ${isZoomMagnifierActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'hover:text-cyan-500'}`}
                    title="Toggle Magnifier Crosshair"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-md overflow-hidden group">
                <ForensicAnalyticsGraph
                  anomalies={document.anomalies}
                  riskScore={document.riskScore}
                  confidence={document.confidence}
                  riskBreakdown={document.riskBreakdown}
                  selectedAnomaly={selectedAnomaly}
                  onSelectAnomaly={setSelectedAnomaly}
                  zoom={specimenZoom}
                  isPiiMasked={isPiiMasked}
                />

                {/* Selected Anomaly Inspection Drawer */}
                {selectedAnomaly && (
                  <div className="mt-3 p-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/90 dark:bg-rose-950/40 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-700 dark:text-rose-300">
                        {selectedAnomaly.id}: {selectedAnomaly.title}
                      </span>
                      <button 
                        onClick={() => setSelectedAnomaly(null)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {selectedAnomaly.description}
                    </p>
                    {selectedAnomaly.evidence && (
                      <p className="text-[11px] font-mono text-rose-600 dark:text-rose-400 pt-1 border-t border-rose-200 dark:border-rose-900">
                        {t('evidence')}: {selectedAnomaly.evidence}
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
                  {t('findings')} ({formatNumber(document.anomalies.length)})
                </h2>
                <span className="text-xs text-slate-400">
                  {t('clickToInspect')}
                </span>
              </div>

              {document.anomalies.length === 0 ? (
                <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('verifiedAuthentic')}
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
                        className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
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
                            {anomaly.severity.toUpperCase()} ({formatNumber(anomaly.confidence)}% {t('confidence')})
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {anomaly.description}
                        </p>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span><strong>{t('evidence')}:</strong> {anomaly.evidence}</span>
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
              {t('aiXrayForensicLens')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('spectralInvestigation')}
            </p>
          </div>
          <AIXRayViewer 
            imageSrc={document.thumbnailUrl} 
            docTitle={document.name} 
            anomalies={document.anomalies}
            confidence={document.confidence}
          />
        </div>
      )}

      {/* Tab Content 4: Tamper Heatmap */}
      {activeTab === 'heatmap' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('tamperHeatmap')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('tamperHeatmapDesc')}
            </p>
          </div>
          <TamperHeatmapViewer 
            imageSrc={document.thumbnailUrl} 
            anomalies={document.anomalies} 
            riskScore={document.riskScore}
            riskBreakdown={document.riskBreakdown}
          />
        </div>
      )}

      {/* Tab Content 5: Document DNA */}
      {activeTab === 'dna' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('documentDNA')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('compareDocumentsDesc')}
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
                {t('explainRisk')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('riskAssessment')}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('riskExplanation')}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {document.riskExplanation}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/50 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
              {t('recommendedAction') || 'Recommended Investigator Actions'}
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

