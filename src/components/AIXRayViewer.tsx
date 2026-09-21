import React, { useState } from 'react';
import { Eye, Layers, Sparkles, Sliders, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AIXRayViewerProps {
  imageSrc: string;
  docTitle: string;
}

export const AIXRayViewer: React.FC<AIXRayViewerProps> = ({ imageSrc, docTitle }) => {
  const [xrayActive, setXrayActive] = useState(true);
  const [intensity, setIntensity] = useState(75);
  const [activeLayer, setActiveLayer] = useState<'all' | 'subpixel' | 'compression' | 'vectors'>('all');
  const [hoverPos, setHoverPos] = useState({ x: 50, y: 50 });
  const [lensMode, setLensMode] = useState<'full' | 'lens'>('full');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos({ x, y });
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xl">
      {/* Control bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              AI X-Ray Forensic Lens
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">WOW FEATURE</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">Sub-pixel vector layer & DCT residual inspection</p>
          </div>
        </div>

        {/* Mode & Layer controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setLensMode('full')}
              className={`px-2 py-1 rounded-md transition-colors ${lensMode === 'full' ? 'bg-white dark:bg-slate-700 text-cyan-500 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
            >
              Full Spectrum
            </button>
            <button
              onClick={() => setLensMode('lens')}
              className={`px-2 py-1 rounded-md transition-colors ${lensMode === 'lens' ? 'bg-white dark:bg-slate-700 text-cyan-500 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
            >
              Magnifier Beam
            </button>
          </div>

          <button
            onClick={() => setXrayActive(!xrayActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              xrayActive
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {xrayActive ? 'X-Ray Active' : 'Enable X-Ray'}
          </button>
        </div>
      </div>

      {/* Interactive viewport */}
      <div 
        onMouseMove={handleMouseMove}
        className="relative w-full h-[380px] sm:h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden cursor-crosshair group select-none"
      >
        {/* Base Document Image */}
        <img
          src={imageSrc}
          alt={docTitle}
          className={`w-full h-full object-cover transition-all duration-300 ${
            xrayActive && lensMode === 'full' ? 'filter invert contrast-150 brightness-90 hue-rotate-180' : ''
          }`}
        />

        {/* X-Ray Digital Grid Overlay */}
        {xrayActive && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-35"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
        )}

        {/* Interactive Magnifier Lens Beam Mode */}
        {xrayActive && lensMode === 'lens' && (
          <div
            className="absolute w-56 h-56 rounded-full border-2 border-cyan-400 pointer-events-none shadow-[0_0_40px_rgba(6,182,212,0.6)] overflow-hidden"
            style={{
              left: `${hoverPos.x}%`,
              top: `${hoverPos.y}%`,
              transform: 'translate(-50%, -50%)',
              backdropFilter: 'invert(1) hue-rotate(180deg) contrast(1.7) brightness(1.1)',
              WebkitBackdropFilter: 'invert(1) hue-rotate(180deg) contrast(1.7) brightness(1.1)'
            }}
          >
            {/* Center target crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border border-cyan-400/80 rounded-full" />
              <div className="absolute w-12 h-px bg-cyan-400/80" />
              <div className="absolute h-12 w-px bg-cyan-400/80" />
            </div>
            <div className="absolute bottom-2 inset-x-0 text-center text-[10px] font-mono text-cyan-300 font-bold bg-slate-950/70 py-0.5">
              X-RAY MAGNIFIER 4.5X
            </div>
          </div>
        )}

        {/* Forensic Hotspot Callouts in X-Ray */}
        {xrayActive && (
          <>
            <div 
              className="absolute top-[32%] right-[22%] p-2 rounded-lg bg-rose-950/90 border border-rose-500/80 backdrop-blur-md text-left shadow-lg animate-pulse"
              style={{ maxWidth: '190px' }}
            >
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400">
                <ShieldAlert className="w-3 h-3" /> ALTERATION DETECTED
              </div>
              <p className="text-[10px] text-rose-200 mt-0.5 font-mono">
                Font baseline drop: -1.8px (Altered digit "$85,420")
              </p>
            </div>

            <div 
              className="absolute bottom-[24%] left-[16%] p-2 rounded-lg bg-cyan-950/90 border border-cyan-500/80 backdrop-blur-md text-left shadow-lg"
              style={{ maxWidth: '180px' }}
            >
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400">
                <CheckCircle2 className="w-3 h-3" /> NATIVE WATERMARK
              </div>
              <p className="text-[10px] text-cyan-200 mt-0.5 font-mono">
                Vector guilloche pattern valid
              </p>
            </div>
          </>
        )}

        {/* Scan line effect */}
        {xrayActive && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce opacity-80 pointer-events-none" />
        )}
      </div>

      {/* Bottom status & sliders */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono">
          <span>X-RAY SENSITIVITY:</span>
          <input
            type="range"
            min="20"
            max="100"
            value={intensity}
            onChange={e => setIntensity(Number(e.target.value))}
            className="w-28 accent-cyan-500 cursor-pointer"
          />
          <span className="text-cyan-500 font-bold">{intensity}%</span>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          [SYNTHETIC FORENSIC BENCHMARK SPECIMEN]
        </div>
      </div>
    </div>
  );
};
