import React, { useState } from 'react';
import { GitCompare, Sliders, ArrowLeftRight, CheckCircle2, AlertTriangle, ShieldAlert, Layers } from 'lucide-react';

interface DifferenceMapViewerProps {
  docAName?: string;
  docBName?: string;
  imageA?: string;
  imageB?: string;
}

type FindingCategory = 'tampered' | 'suspicious' | 'clean';

interface DiffHighlightItem {
  type: string;
  title: string;
  original: string;
  altered: string;
  x: number;
  y: number;
  category: FindingCategory;
  statusLabel: string;
}

export const DifferenceMapViewer: React.FC<DifferenceMapViewerProps> = ({
  docAName = 'Doc_A_Certified_Baseline_v1.pdf',
  docBName = 'Doc_B_Suspect_Specimen_v2.pdf',
  imageA = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&auto=format&fit=crop&q=80',
  imageB = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=700&auto=format&fit=crop&q=80'
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'diffmap' | 'sidebyside'>('slider');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | FindingCategory>('all');

  const diffHighlights: DiffHighlightItem[] = [
    { 
      type: 'text', 
      title: 'Ending Balance Modification', 
      original: '$5,420.00', 
      altered: '$85,420.00', 
      x: 65, 
      y: 32, 
      category: 'tampered',
      statusLabel: 'Tampered (Critical)' 
    },
    { 
      type: 'stamp', 
      title: 'Executive Seal Replaced', 
      original: 'Authentic 24-bit vector seal', 
      altered: 'Photoshop 150 DPI stamp overlay', 
      x: 72, 
      y: 76, 
      category: 'tampered',
      statusLabel: 'Tampered (Spliced)' 
    },
    { 
      type: 'layout', 
      title: 'Grid Line Shift (Row 14)', 
      original: 'Baseline Y: 420.5mm', 
      altered: 'Baseline Y: 423.9mm (+3.4mm offset)', 
      x: 25, 
      y: 54, 
      category: 'suspicious',
      statusLabel: 'Suspicious Shift' 
    },
    { 
      type: 'header', 
      title: 'Certified Authority Header & Serial', 
      original: 'SHA-256 Validated Hash', 
      altered: '100% Cryptographic Match', 
      x: 30, 
      y: 18, 
      category: 'clean',
      statusLabel: 'Verified Clean' 
    }
  ];

  const filteredHighlights = activeCategoryFilter === 'all'
    ? diffHighlights
    : diffHighlights.filter(h => h.category === activeCategoryFilter);

  const getCategoryStyles = (category: FindingCategory) => {
    switch (category) {
      case 'tampered':
        return {
          border: 'border-rose-500/80',
          bg: 'bg-rose-500/10',
          text: 'text-rose-600 dark:text-rose-400',
          badge: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40',
          pin: 'border-rose-500 bg-rose-500 text-white shadow-rose-500/40',
          Icon: ShieldAlert
        };
      case 'suspicious':
        return {
          border: 'border-amber-500/80',
          bg: 'bg-amber-500/10',
          text: 'text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40',
          pin: 'border-amber-500 bg-amber-500 text-slate-950 shadow-amber-500/40',
          Icon: AlertTriangle
        };
      case 'clean':
        return {
          border: 'border-emerald-500/80',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-600 dark:text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
          pin: 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/40',
          Icon: CheckCircle2
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xl">
      {/* Control Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              Document A vs B Difference Map
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">WOW FEATURE</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">Pixel-level delta, typography shifts & optical displacement</p>
          </div>
        </div>

        {/* View Mode Switcher & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tri-color Category Filter */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium text-[11px] ${
                activeCategoryFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({diffHighlights.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('clean')}
              className={`px-2 py-1 rounded-md transition-colors text-[11px] flex items-center gap-1 ${
                activeCategoryFilter === 'clean'
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Clean ({diffHighlights.filter(d => d.category === 'clean').length})</span>
            </button>
            <button
              onClick={() => setActiveCategoryFilter('suspicious')}
              className={`px-2 py-1 rounded-md transition-colors text-[11px] flex items-center gap-1 ${
                activeCategoryFilter === 'suspicious'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Suspicious ({diffHighlights.filter(d => d.category === 'suspicious').length})</span>
            </button>
            <button
              onClick={() => setActiveCategoryFilter('tampered')}
              className={`px-2 py-1 rounded-md transition-colors text-[11px] flex items-center gap-1 ${
                activeCategoryFilter === 'tampered'
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Tampered ({diffHighlights.filter(d => d.category === 'tampered').length})</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'slider' ? 'bg-cyan-500 text-slate-950 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Split Slider
            </button>
            <button
              onClick={() => setViewMode('diffmap')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'diffmap' ? 'bg-cyan-500 text-slate-950 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Difference Heatmap
            </button>
            <button
              onClick={() => setViewMode('sidebyside')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'sidebyside' ? 'bg-cyan-500 text-slate-950 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Side by Side
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-950 select-none overflow-hidden">
        
        {viewMode === 'slider' && (
          <div className="relative w-full h-full">
            {/* Background: Document B (Suspect / Modified) */}
            <div className="absolute inset-0">
              <img src={imageB} alt="Document B" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded bg-slate-900/90 text-rose-400 border border-rose-500/40 text-[11px] font-mono font-bold">
                DOC B (SUSPECT SPECIMEN)
              </div>
            </div>

            {/* Foreground: Document A (Baseline), clipped by slider percentage */}
            <div 
              className="absolute inset-0 overflow-hidden border-r-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={imageA} 
                alt="Document A" 
                className="w-full h-full object-cover"
                style={{ width: '100%', minWidth: '100%' }}
              />
              <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-slate-900/90 text-cyan-400 border border-cyan-500/40 text-[11px] font-mono font-bold">
                DOC A (CERTIFIED BASELINE)
              </div>
            </div>

            {/* Draggable Slider Control handle */}
            <div
              className="absolute top-0 bottom-0 z-20 w-8 -ml-4 flex items-center justify-center cursor-ew-resize group"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Invisible Range Input for accessibility & effortless dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={e => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        )}

        {viewMode === 'diffmap' && (
          <div className="relative w-full h-full">
            <img src={imageB} alt="Difference overlay" className="w-full h-full object-cover filter contrast-125" />
            {/* Diff Delta Masks */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(244,63,94,0.7) 10%, rgba(6,182,212,0.4) 60%, transparent 80%)',
                mixBlendMode: 'difference'
              }}
            />

            {/* Highlight Callout Pins with Tri-Color Spectrum */}
            {filteredHighlights.map((item, idx) => {
              const styles = getCategoryStyles(item.category);
              const IconComponent = styles.Icon;
              return (
                <div
                  key={idx}
                  className={`absolute p-2.5 rounded-xl bg-slate-900/95 border ${styles.border} shadow-2xl backdrop-blur-md text-left animate-in fade-in z-20`}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)', maxWidth: '250px' }}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${styles.badge} uppercase tracking-wider flex items-center gap-1`}>
                      <IconComponent className="w-2.5 h-2.5" /> {item.statusLabel}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-white font-display">
                    {item.title}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-slate-300">
                    <p className="text-slate-400">Baseline: {item.original}</p>
                    <p className={styles.text}>Specimen: {item.altered}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'sidebyside' && (
          <div className="grid grid-cols-2 w-full h-full divide-x divide-slate-800">
            <div className="relative h-full">
              <img src={imageA} alt="Document A" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 text-[10px] font-mono border border-emerald-500/40">
                DOC A: CERTIFIED BASELINE
              </div>
            </div>
            <div className="relative h-full">
              <img src={imageB} alt="Document B" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-rose-400 text-[10px] font-mono border border-rose-500/40">
                DOC B: SUSPECT SPECIMEN
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Difference Summary Table: Tri-Color Highlighting */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredHighlights.map((item, idx) => {
            const styles = getCategoryStyles(item.category);
            const IconComp = styles.Icon;
            return (
              <div 
                key={idx} 
                className={`p-3 rounded-xl bg-white dark:bg-slate-900 border ${styles.border} text-left transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${styles.badge} uppercase tracking-wider flex items-center gap-1`}>
                    <IconComp className="w-3 h-3" />
                    <span>{item.statusLabel}</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display line-clamp-1">{item.title}</p>
                <div className="mt-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-0.5">
                  <p className="text-slate-500 line-through truncate">A: {item.original}</p>
                  <p className={`font-semibold ${styles.text} truncate`}>B: {item.altered}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
