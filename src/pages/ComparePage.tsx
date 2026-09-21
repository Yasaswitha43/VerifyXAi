import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Type, 
  Layers
} from 'lucide-react';
import { PageRoute } from '../types';
import { DifferenceMapViewer } from '../components/DifferenceMapViewer';
import { DNAComparisonCard } from '../components/DNAComparisonCard';
import { SAMPLE_DOCUMENTS } from '../data/mockData';

interface ComparePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const [docAIndex, setDocAIndex] = useState(0);
  const [docBIndex, setDocBIndex] = useState(1);

  const docA = SAMPLE_DOCUMENTS[docAIndex];
  const docB = SAMPLE_DOCUMENTS[docBIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* TOP-LEFT Navigation: Back to Dashboard */}
      <div>
        <button
          id="back-to-dashboard-btn"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all shadow-xs group"
          title="Return to Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
          Document Comparison
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Perform differential inspection between two documents to reveal altered text, images, and structural shifts.
        </p>
      </div>

      {/* DOCUMENT A | DOCUMENT B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DOCUMENT A Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              DOCUMENT A (BASELINE)
            </span>
            <span className="text-[11px] text-slate-400">Original Certified</span>
          </div>

          <select
            value={docAIndex}
            onChange={e => setDocAIndex(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
              <p className="text-[11px] text-slate-400">SHA-256: {docA.metadata.hashSha256.slice(0, 12)}...</p>
            </div>
          </div>
        </div>

        {/* DOCUMENT B Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              DOCUMENT B (SUSPECT SPECIMEN)
            </span>
            <span className="text-[11px] text-slate-400">Suspected Variant</span>
          </div>

          <select
            value={docBIndex}
            onChange={e => setDocBIndex(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
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
              <p className="text-[11px] text-slate-400">SHA-256: {docB.metadata.hashSha256.slice(0, 12)}...</p>
            </div>
          </div>
        </div>

      </div>

      {/* 1. CHANGES FOUND */}
      <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Changes Found
          </span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            4 Notable Variances Detected Between Document A and B
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated alignment matched 98.6% of structural grid points.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-700 dark:text-amber-400 shrink-0">
          Delta Status: Discrepancies Present
        </span>
      </div>

      {/* 2, 3, 4: TEXT DIFFERENCES, IMAGE DIFFERENCES, LAYOUT DIFFERENCES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Text Differences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-500">
            <Type className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Text Differences
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Modified numeric field in transaction row ($4,250,000 substituted for $1,250,000). Font kerning variance detected.
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Variance: Subpixel glyph weight +0.4px
          </div>
        </div>

        {/* Image Differences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <ImageIcon className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Image Differences
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Secondary compression artifact around notary watermark. JPEG quantization table mismatch on pasted signature block.
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Variance: DCT Entropy 18.2% delta
          </div>
        </div>

        {/* Layout Differences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-500">
            <Layers className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Layout Differences
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Row 14 displaced vertically by 3.2mm. Inconsistent baseline relative to certified institutional template bounds.
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Variance: Vertical baseline offset 3.2mm
          </div>
        </div>

      </div>

      {/* 4. DNA COMPARISON */}
      <DNAComparisonCard docA={docA} docB={docB} />

      {/* 5. DIFFERENCE MAP */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Difference Map
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive slider comparing visual differences between Document A and Document B.
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
