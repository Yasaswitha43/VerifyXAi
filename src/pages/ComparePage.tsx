import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Dna,
  Image as ImageIcon, 
  Type, 
  Layers,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Binary,
  Sparkles,
  Filter
} from 'lucide-react';
import { PageRoute } from '../types';
import { DifferenceMapViewer } from '../components/DifferenceMapViewer';
import { DNAComparisonCard } from '../components/DNAComparisonCard';
import { SAMPLE_DOCUMENTS } from '../data/mockData';

interface ComparePageProps {
  onNavigate: (page: PageRoute) => void;
}

type DataStatus = 'all' | 'clean' | 'suspicious' | 'tampered';

interface ForensicDataItem {
  id: string;
  field: string;
  category: 'clean' | 'suspicious' | 'tampered';
  baselineValue: string;
  specimenValue: string;
  finding: string;
  method: string;
  confidence: number;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const [docAIndex, setDocAIndex] = useState(0);
  const [docBIndex, setDocBIndex] = useState(1);
  const [activeDataFilter, setActiveDataFilter] = useState<DataStatus>('all');

  const docA = SAMPLE_DOCUMENTS[docAIndex];
  const docB = SAMPLE_DOCUMENTS[docBIndex];

  // Comprehensive forensic data items categorized into Clean, Suspicious, and Tampered
  const forensicDataItems: ForensicDataItem[] = [
    // Verified Clean Data (Green / Emerald)
    {
      id: 'd-clean-1',
      field: 'Issuing Authority Header & Seal Geometry',
      category: 'clean',
      baselineValue: 'Certified Federal Header (Anchor #01)',
      specimenValue: 'Identical Coordinate Vectors',
      finding: 'Header grid and official crest align to 0.02mm tolerance with 0% distortion.',
      method: 'Vector Coordinate Mapping',
      confidence: 99.8
    },
    {
      id: 'd-clean-2',
      field: 'Cryptographic SHA-256 Ledger Anchor',
      category: 'clean',
      baselineValue: 'Verified Block #489211 Chain Hash',
      specimenValue: 'Signature Match Confirmed',
      finding: 'Original issuer certificate matches notary custody ledger without integrity fault.',
      method: 'Blockchain & Hash Auditing',
      confidence: 100
    },
    {
      id: 'd-clean-3',
      field: 'Core Table Typography (Rows 1–13)',
      category: 'clean',
      baselineValue: '18.0pt Leading / Roboto-Medium',
      specimenValue: '18.0pt Leading / Standard Kerning',
      finding: 'Unaltered font glyph curves and baseline grid across rows 1 to 13.',
      method: 'Optical Font Geometry',
      confidence: 99.4
    },
    {
      id: 'd-clean-4',
      field: 'Institutional Watermark Frequency',
      category: 'clean',
      baselineValue: '45° Sinusoidal Micro-Mesh',
      specimenValue: 'Continuous Unperturbed Mesh',
      finding: 'Fourier transformation reveals unsevered anti-counterfeit guilloche pattern.',
      method: 'FFT Spectral Frequency',
      confidence: 98.9
    },
    {
      id: 'd-clean-5',
      field: 'Document Creation Ledger Timestamp',
      category: 'clean',
      baselineValue: '2026-03-12 09:14:02 UTC',
      specimenValue: 'Chronological Integrity Intact',
      finding: 'File generation metadata correlates with certified notary server timestamp.',
      method: 'EXIF / XMP Chrono Audit',
      confidence: 99.1
    },

    // Suspicious Data (Amber / Yellow)
    {
      id: 'd-susp-1',
      field: 'Row 14 Layout Baseline Disparity',
      category: 'suspicious',
      baselineValue: 'Y = 420.5mm Standard Baseline',
      specimenValue: 'Y = 423.9mm (+3.4mm Jitter)',
      finding: 'Vertical baseline offset in row 14 suggests insertion or manual re-alignment.',
      method: 'Subpixel Edge Detection',
      confidence: 89.4
    },
    {
      id: 'd-susp-2',
      field: 'Micro-Typography Kerning & Tracking',
      category: 'suspicious',
      baselineValue: '0.00em Neutral Metric Kerning',
      specimenValue: '+0.04em Expanded Tracking',
      finding: 'Subtle glyph expansion detected in secondary notes block, indicating reflow.',
      method: 'Glyph Contour Profiling',
      confidence: 86.7
    },
    {
      id: 'd-susp-3',
      field: 'XMP Metadata Timezone Deviation',
      category: 'suspicious',
      baselineValue: '-05:00 EST (New York Office)',
      specimenValue: '+00:00 UTC (Modified Producer)',
      finding: 'Producer tool was switched from Acrobat Distiller to an uncertified PDF library.',
      method: 'Forensic Metadata Disparity',
      confidence: 84.5
    },

    // Tampered Data (Rose / Red)
    {
      id: 'd-tamp-1',
      field: 'Primary Transaction Amount Substitution',
      category: 'tampered',
      baselineValue: '$1,250,000.00 USD (Certified)',
      specimenValue: '$4,250,000.00 USD (Altered)',
      finding: 'Critical value modification. Digit "4" replaces "1" with mismatched raster compression and kerning.',
      method: 'Glyph Weight & Quantization',
      confidence: 98.6
    },
    {
      id: 'd-tamp-2',
      field: 'Executive Authorization Seal Splicing',
      category: 'tampered',
      baselineValue: 'Authentic 24-bit Vector Seal',
      specimenValue: 'Photoshop 150 DPI Overlay',
      finding: 'Pasted secondary image block detected. Distinct JPEG DCT quantization boundaries present.',
      method: 'Error Level Analysis (ELA)',
      confidence: 97.8
    },
    {
      id: 'd-tamp-3',
      field: 'Beneficiary Bank Routing & IBAN Override',
      category: 'tampered',
      baselineValue: 'IBAN: GB33 BARC 2020 0192 8419 01',
      specimenValue: 'IBAN: DE89 DB20 1000 4829 1920 33',
      finding: 'Account digits rewritten with pixel interpolation halo and chromatic fringe.',
      method: 'Pixel Residual Analysis',
      confidence: 96.3
    }
  ];

  const cleanCount = forensicDataItems.filter(i => i.category === 'clean').length;
  const suspiciousCount = forensicDataItems.filter(i => i.category === 'suspicious').length;
  const tamperedCount = forensicDataItems.filter(i => i.category === 'tampered').length;

  const filteredItems = activeDataFilter === 'all'
    ? forensicDataItems
    : forensicDataItems.filter(i => i.category === activeDataFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* TOP-LEFT Navigation: Back to Dashboard */}
      <div>
        <button
          id="back-to-dashboard-btn"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all shadow-xs group cursor-pointer"
          title="Return to Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Page Title: Document DNA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 text-violet-500 shadow-sm">
              <Dna className="w-7 h-7 text-violet-500 dark:text-violet-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                Document DNA
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Dual-specimen forensic genome inspection with tri-color data classification
              </p>
            </div>
          </div>
        </div>

        {/* Global Genome Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
          <span className="font-semibold">GENOME DELTA ENGINE:</span>
          <span className="text-violet-600 dark:text-violet-400 font-bold">ACTIVE</span>
        </div>
      </div>

      {/* DOCUMENT A (Baseline) | DOCUMENT B (Suspect) Specimen Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DOCUMENT A Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              DOCUMENT A (BASELINE SPECIMEN)
            </span>
            <span className="text-[11px] font-mono text-slate-400">Certified Original</span>
          </div>

          <select
            id="doc-a-select"
            value={docAIndex}
            onChange={e => setDocAIndex(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            {SAMPLE_DOCUMENTS.map((doc, idx) => (
              <option key={doc.id} value={idx}>
                {doc.name} ({doc.type})
              </option>
            ))}
          </select>

          <div className="pt-2 flex items-center gap-3">
            <img 
              src={docA.thumbnailUrl} 
              alt={docA.name} 
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{docA.name}</p>
              <p className="text-[11px] font-mono text-slate-400 truncate">SHA-256: {docA.metadata.hashSha256.slice(0, 16)}...</p>
              <span className="inline-block mt-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CERTIFIED ANCHOR
              </span>
            </div>
          </div>
        </div>

        {/* DOCUMENT B Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              DOCUMENT B (SUSPECT SPECIMEN)
            </span>
            <span className="text-[11px] font-mono text-slate-400">Suspected Variant</span>
          </div>

          <select
            id="doc-b-select"
            value={docBIndex}
            onChange={e => setDocBIndex(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
          >
            {SAMPLE_DOCUMENTS.map((doc, idx) => (
              <option key={doc.id} value={idx}>
                {doc.name} ({doc.type})
              </option>
            ))}
          </select>

          <div className="pt-2 flex items-center gap-3">
            <img 
              src={docB.thumbnailUrl} 
              alt={docB.name} 
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{docB.name}</p>
              <p className="text-[11px] font-mono text-slate-400 truncate">SHA-256: {docB.metadata.hashSha256.slice(0, 16)}...</p>
              <span className="inline-block mt-1 text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                AUDITED SPECIMEN
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* TRI-COLOR FORENSIC SPECTRUM SUMMARY CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <span>Forensic Tri-Color Classification Spectrum</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-semibold border border-cyan-500/20">
              REAL-TIME AUDIT
            </span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {forensicDataItems.length} Total Evaluated Data Points
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 🟢 1. VERIFIED CLEAN DATA (Green / Emerald) */}
          <div 
            onClick={() => setActiveDataFilter('clean')}
            className={`p-6 rounded-2xl transition-all cursor-pointer border ${
              activeDataFilter === 'clean'
                ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-mono text-xs font-extrabold shadow-xs">
                {cleanCount} MATCHED
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300 font-display">
                  Verified Clean Data
                </h3>
              </div>
              <p className="text-xs text-emerald-700/90 dark:text-emerald-400/90 mt-1.5 leading-relaxed">
                Cryptographic hashes, baseline table typography (rows 1–13), continuous anti-counterfeit watermark mesh, and creation timestamps 100% intact.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
              <span>Authentic Anchors</span>
              <span className="font-bold">Zero Tampering Detected</span>
            </div>
          </div>

          {/* 🟡 2. SUSPICIOUS DATA (Amber / Yellow) */}
          <div 
            onClick={() => setActiveDataFilter('suspicious')}
            className={`p-6 rounded-2xl transition-all cursor-pointer border ${
              activeDataFilter === 'suspicious'
                ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-mono text-xs font-extrabold shadow-xs">
                {suspiciousCount} CAUTION
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-base font-bold text-amber-800 dark:text-amber-300 font-display">
                  Suspicious Data
                </h3>
              </div>
              <p className="text-xs text-amber-700/90 dark:text-amber-400/90 mt-1.5 leading-relaxed">
                Layout baseline drift on row 14 (+3.4mm downward jitter), subpixel kerning expansion (+0.04em), and metadata timezone disparities.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-mono text-amber-700 dark:text-amber-400">
              <span>Review Recommended</span>
              <span className="font-bold">Secondary Shift Identified</span>
            </div>
          </div>

          {/* 🔴 3. TAMPERED DATA (Rose / Red) */}
          <div 
            onClick={() => setActiveDataFilter('tampered')}
            className={`p-6 rounded-2xl transition-all cursor-pointer border ${
              activeDataFilter === 'tampered'
                ? 'bg-rose-500/15 border-rose-500 ring-2 ring-rose-500/20 shadow-lg'
                : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-mono text-xs font-extrabold shadow-xs">
                {tamperedCount} TAMPERED
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="text-base font-bold text-rose-800 dark:text-rose-300 font-display">
                  Tampered Data
                </h3>
              </div>
              <p className="text-xs text-rose-700/90 dark:text-rose-400/90 mt-1.5 leading-relaxed">
                Direct numeric substitution ($1.25M overwritten to $4.25M), Photoshop 150 DPI notary seal overlay, and spliced beneficiary bank coordinates.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-500/20 flex items-center justify-between text-[11px] font-mono text-rose-700 dark:text-rose-400">
              <span>Critical Discrepancy</span>
              <span className="font-bold">High Tampering Probability</span>
            </div>
          </div>

        </div>
      </div>

      {/* TRI-COLOR INTERACTIVE DATA MATRIX */}
      <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Header & Filter Pill Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <span>Document DNA Forensic Field Breakdown</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-300">
                {filteredItems.length} Shown
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Differential comparison highlighting authentic anchors (green), caution shifts (yellow), and manipulated blocks (red).
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveDataFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeDataFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Data ({forensicDataItems.length})
            </button>
            <button
              onClick={() => setActiveDataFilter('clean')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDataFilter === 'clean'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Verified Clean ({cleanCount})</span>
            </button>
            <button
              onClick={() => setActiveDataFilter('suspicious')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDataFilter === 'suspicious'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Suspicious ({suspiciousCount})</span>
            </button>
            <button
              onClick={() => setActiveDataFilter('tampered')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeDataFilter === 'tampered'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Tampered ({tamperedCount})</span>
            </button>
          </div>
        </div>

        {/* Forensic Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const isClean = item.category === 'clean';
            const isSuspicious = item.category === 'suspicious';
            const isTampered = item.category === 'tampered';

            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isClean
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                    : isSuspicious
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60'
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 border ${
                    isClean
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                      : isSuspicious
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40'
                  }`}>
                    {isClean && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    {isSuspicious && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                    {isTampered && <ShieldAlert className="w-3 h-3 text-rose-500" />}
                    <span>{isClean ? 'Verified Clean' : isSuspicious ? 'Suspicious' : 'Tampered Data'}</span>
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    {item.confidence}% Confidence
                  </span>
                </div>

                {/* Field Title */}
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display line-clamp-1">
                  {item.field}
                </h4>

                {/* Values Comparison */}
                <div className="mt-2 p-2 rounded-lg bg-white/70 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Baseline A:</span>
                    <span className="truncate max-w-[170px] font-medium text-slate-700 dark:text-slate-300">{item.baselineValue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Specimen B:</span>
                    <span className={`truncate max-w-[170px] font-bold ${
                      isClean ? 'text-emerald-600 dark:text-emerald-400' : isSuspicious ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {item.specimenValue}
                    </span>
                  </div>
                </div>

                {/* Evidence Note */}
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {item.finding}
                </p>

                {/* Detection Method Footer */}
                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Method:</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">{item.method}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DNA COMPARISON (RADAR & DUAL VECTOR PROFILE) */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Dna className="w-5 h-5 text-violet-500" />
            <span>Document DNA Genomic Biometrics</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multidimensional radar analysis profiling typography, margins, compression entropy, and mathematical sum delta.
          </p>
        </div>
        <DNAComparisonCard docA={docA} docB={docB} />
      </div>

      {/* 5. DIFFERENCE MAP (INTERACTIVE VISUAL DELTA & TRI-COLOR CALLOUTS) */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            <span>Optical Difference Map</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive slider, side-by-side view, and difference heatmap pinpointing clean, suspicious, and tampered coordinates.
          </p>
        </div>

        <DifferenceMapViewer
          docAName={docA.name}
          docBName={docB.name}
          imageA={docA.thumbnailUrl}
          imageB={docB.thumbnailUrl}
        />
      </div>

    </div>
  );
};
