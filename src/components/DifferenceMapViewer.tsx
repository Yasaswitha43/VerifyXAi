import React, { useState } from 'react';
import { GitCompare, Sliders, ArrowLeftRight, Check, AlertTriangle, Layers } from 'lucide-react';

interface DifferenceMapViewerProps {
  docAName?: string;
  docBName?: string;
  imageA?: string;
  imageB?: string;
}

export const DifferenceMapViewer: React.FC<DifferenceMapViewerProps> = ({
  docAName = 'Doc_A_Certified_Baseline_v1.pdf',
  docBName = 'Doc_B_Suspect_Specimen_v2.pdf',
  imageA = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&auto=format&fit=crop&q=80',
  imageB = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=700&auto=format&fit=crop&q=80'
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'diffmap' | 'sidebyside'>('slider');
  const [activeDiffFilter, setActiveDiffFilter] = useState<'all' | 'text' | 'stamp' | 'layout'>('all');

  const diffHighlights = [
    { type: 'text', title: 'Ending Balance Modification', original: '$5,420.00', altered: '$85,420.00', x: 65, y: 32, status: 'Altered' },
    { type: 'stamp', title: 'Executive Seal Replaced', original: 'Authentic 24-bit vector seal', altered: 'Photoshop 150 DPI stamp overlay', x: 72, y: 76, status: 'Replaced' },
    { type: 'layout', title: 'Grid Line Shift (Row 14)', original: 'Baseline Y: 420.5mm', altered: 'Baseline Y: 423.9mm (+3.4mm)', x: 20, y: 54, status: 'Shifted' }
  ];

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

            {/* Highlight Callout Pins */}
            {diffHighlights.map((item, idx) => (
              <div
                key={idx}
                className="absolute p-2.5 rounded-xl bg-slate-900/95 border border-rose-500/80 shadow-2xl backdrop-blur-md text-left animate-in fade-in"
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)', maxWidth: '240px' }}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400">
                  <AlertTriangle className="w-3 h-3" /> {item.title}
                </div>
                <div className="mt-1 text-[10px] font-mono text-slate-300">
                  <p className="text-slate-400 line-through">A: {item.original}</p>
                  <p className="text-cyan-400 font-bold">B: {item.altered}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'sidebyside' && (
          <div className="grid grid-cols-2 w-full h-full divide-x divide-slate-800">
            <div className="relative h-full">
              <img src={imageA} alt="Document A" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-cyan-400 text-[10px] font-mono">
                DOC A: BASELINE
              </div>
            </div>
            <div className="relative h-full">
              <img src={imageB} alt="Document B" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-rose-400 text-[10px] font-mono">
                DOC B: SUSPECT (+3 ANOMALIES)
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Difference Summary Table */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {diffHighlights.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left">
              <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider">{item.status}</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display mt-0.5">{item.title}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">Delta: {item.original} → {item.altered}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
