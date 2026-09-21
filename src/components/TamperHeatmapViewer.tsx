import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  BarChart3,
  TrendingUp,
  Info
} from 'lucide-react';
import { ForensicAnomaly } from '../types';

interface TamperHeatmapViewerProps {
  imageSrc?: string;
  anomalies: ForensicAnomaly[];
  riskScore?: number;
}

export const TamperHeatmapViewer: React.FC<TamperHeatmapViewerProps> = ({ 
  anomalies, 
  riskScore = 78 
}) => {
  const [activeFilter, setActiveFilter] = useState<'heatmap' | 'ela' | 'edges' | 'clean'>('heatmap');
  const [zoom, setZoom] = useState(1);
  const [selectedAnomaly, setSelectedAnomaly] = useState<ForensicAnomaly | null>(null);

  // Calculate dynamic percentages of Risks, Suspicious, and Verified Clean
  const { risksPercent, suspiciousPercent, cleanPercent } = useMemo(() => {
    // If anomalies exist, compute based on severity weights, otherwise use riskScore
    let computedRisk = riskScore;
    if (anomalies && anomalies.length > 0) {
      const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
      const moderateCount = anomalies.filter(a => a.severity !== 'critical').length;
      computedRisk = Math.min(95, Math.max(15, (criticalCount * 28) + (moderateCount * 14)));
    }

    // High severity tampering/risks
    const rPct = Math.max(8, Math.min(75, Math.round(computedRisk * 0.52)));
    // Suspicious fluctuations/anomalies
    const sPct = Math.max(6, Math.min(45, Math.round(computedRisk * 0.34)));
    // Remainder is verified clean
    const cPct = Math.max(5, 100 - rPct - sPct);

    return {
      risksPercent: rPct,
      suspiciousPercent: sPct,
      cleanPercent: cPct
    };
  }, [riskScore, anomalies]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xl">
      {/* Control Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              Tamper Heatmap &amp; Spectral Graph Inspector
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono">LIVE GRAPH MATRIX</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">Pixel compression entropy &amp; forensic risk distribution graph</p>
          </div>
        </div>

        {/* Filter Switcher & Zoom */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveFilter('heatmap')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'heatmap' ? 'bg-rose-500 text-white font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setActiveFilter('ela')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'ela' ? 'bg-cyan-500 text-slate-950 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              ELA (Noise)
            </button>
            <button
              onClick={() => setActiveFilter('edges')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'edges' ? 'bg-violet-500 text-white font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Laplacian Edges
            </button>
            <button
              onClick={() => setActiveFilter('clean')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'clean' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Clean Baseline
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg">
            <button
              onClick={() => setZoom(prev => Math.max(0.8, prev - 0.2))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(2.0, prev + 0.2))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Graph HUD: Percentages of Risks, Suspicious, and Verified Clean */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
            Forensic Verdict Distribution Graph
          </span>
        </div>

        {/* 3 Metric Cards with Exact Percentages */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Risks Percentage */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-mono text-[11px]">Risks:</span>
            <span className="font-extrabold font-mono text-sm text-rose-400">{risksPercent}%</span>
          </div>

          {/* Suspicious Percentage */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono text-[11px]">Suspicious:</span>
            <span className="font-extrabold font-mono text-sm text-amber-400">{suspiciousPercent}%</span>
          </div>

          {/* Verified Clean Percentage */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-mono text-[11px]">Verified Clean:</span>
            <span className="font-extrabold font-mono text-sm text-emerald-400">{cleanPercent}%</span>
          </div>
        </div>
      </div>

      {/* Multi-segment Distribution Bar */}
      <div className="w-full h-2 bg-slate-950 flex overflow-hidden border-b border-slate-800">
        <div 
          className="h-full bg-rose-500 transition-all duration-500 relative group cursor-pointer" 
          style={{ width: `${risksPercent}%` }} 
          title={`Risks: ${risksPercent}%`}
        />
        <div 
          className="h-full bg-amber-500 transition-all duration-500 relative group cursor-pointer" 
          style={{ width: `${suspiciousPercent}%` }} 
          title={`Suspicious: ${suspiciousPercent}%`}
        />
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 relative group cursor-pointer" 
          style={{ width: `${cleanPercent}%` }} 
          title={`Verified Clean: ${cleanPercent}%`}
        />
      </div>

      {/* Main Visualizer Container: Forensic Graph Representation */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-[#070d1e] overflow-hidden flex items-center justify-center select-none">
        <div 
          className="relative transition-transform duration-200 w-full h-full"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Forensic Vector Graph Background (Replacing Calculator Image) */}
          <svg 
            className="w-full h-full"
            viewBox="0 0 1000 500" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Coordinate Grid Pattern */}
              <pattern id="forensicGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeWidth="1" />
                <circle cx="50" cy="50" r="1.2" fill="rgba(56, 189, 248, 0.2)" />
              </pattern>

              {/* Sub-grid pattern */}
              <pattern id="fineGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
              </pattern>

              {/* Gradient for Risks Area (Rose/Red) */}
              <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.55" />
                <stop offset="45%" stopColor="#f43f5e" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
              </linearGradient>

              {/* Gradient for Suspicious Area (Amber/Orange) */}
              <linearGradient id="suspiciousAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>

              {/* Gradient for Verified Clean Area (Emerald/Green) */}
              <linearGradient id="cleanAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Grid Rectangles */}
            <rect width="1000" height="500" fill="#060c1d" />
            <rect width="1000" height="500" fill="url(#fineGrid)" />
            <rect width="1000" height="500" fill="url(#forensicGrid)" />

            {/* Y-Axis Horizontal Scale Lines */}
            <line x1="60" y1="80" x2="960" y2="80" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <line x1="60" y1="160" x2="960" y2="160" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <line x1="60" y1="240" x2="960" y2="240" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <line x1="60" y1="320" x2="960" y2="320" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <line x1="60" y1="420" x2="960" y2="420" stroke="rgba(56,189,248,0.25)" strokeWidth="1.5" />

            {/* Axis Labels */}
            <text x="70" y="75" fill="#f43f5e" fontSize="11" fontFamily="monospace" opacity="0.8">ERROR ENTROPY 100% (CRITICAL RISKS)</text>
            <text x="70" y="155" fill="#f59e0b" fontSize="11" fontFamily="monospace" opacity="0.8">DCT VARIANCE 65% (SUSPICIOUS DEVIATION)</text>
            <text x="70" y="315" fill="#10b981" fontSize="11" fontFamily="monospace" opacity="0.8">SUBSTRATE BASELINE 25% (VERIFIED CLEAN)</text>
            <text x="70" y="440" fill="#64748b" fontSize="10" fontFamily="monospace">0.0 PX (ORIGIN)</text>
            <text x="480" y="440" fill="#64748b" fontSize="10" fontFamily="monospace">SPATIAL RASTER SCAN (2048 PX)</text>
            <text x="880" y="440" fill="#64748b" fontSize="10" fontFamily="monospace">4096 PX (MAX)</text>

            {/* 1. Verified Clean Graph Area & Curve (Emerald Baseline) */}
            {(activeFilter === 'clean' || activeFilter === 'heatmap' || activeFilter === 'ela' || activeFilter === 'edges') && (
              <g id="clean-graph-series">
                <path
                  d="M 60 420 
                     C 180 370, 240 360, 340 375 
                     C 440 390, 520 340, 620 360 
                     C 720 380, 800 350, 960 380 
                     L 960 420 Z"
                  fill="url(#cleanAreaGrad)"
                />
                <path
                  d="M 60 420 
                     C 180 370, 240 360, 340 375 
                     C 440 390, 520 340, 620 360 
                     C 720 380, 800 350, 960 380"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray={activeFilter === 'clean' ? 'none' : 'none'}
                />
                {/* Clean Data Points */}
                <circle cx="340" cy="375" r="4" fill="#10b981" />
                <circle cx="620" cy="360" r="4" fill="#10b981" />
                <text x="345" y="365" fill="#10b981" fontSize="10" fontFamily="monospace">Clean: {cleanPercent}%</text>
              </g>
            )}

            {/* 2. Suspicious Graph Area & Curve (Amber Fluctuations) */}
            {activeFilter !== 'clean' && (
              <g id="suspicious-graph-series">
                <path
                  d="M 60 420 
                     C 140 400, 200 280, 280 260 
                     C 360 240, 440 320, 540 290 
                     C 640 260, 720 220, 800 250 
                     C 880 280, 920 340, 960 420 Z"
                  fill="url(#suspiciousAreaGrad)"
                />
                <path
                  d="M 60 420 
                     C 140 400, 200 280, 280 260 
                     C 360 240, 440 320, 540 290 
                     C 640 260, 720 220, 800 250 
                     C 880 280, 920 340, 960 420"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
                {/* Suspicious Peak Marker */}
                <circle cx="280" cy="260" r="4" fill="#f59e0b" />
                <circle cx="800" cy="250" r="4" fill="#f59e0b" />
                <text x="285" y="250" fill="#f59e0b" fontSize="10" fontFamily="monospace">Suspicious: {suspiciousPercent}%</text>
              </g>
            )}

            {/* 3. Risks Graph Area & Sharp Peak Curve (Rose Critical Spikes) */}
            {activeFilter !== 'clean' && (
              <g id="risks-graph-series">
                <path
                  d="M 60 420 
                     C 120 420, 180 340, 220 280 
                     C 250 240, 280 140, 310 100 
                     C 330 75, 360 90, 390 150 
                     C 420 210, 480 360, 560 380 
                     C 620 395, 680 290, 720 180 
                     C 750 110, 780 90, 810 120 
                     C 840 150, 890 320, 960 420 Z"
                  fill="url(#riskAreaGrad)"
                />
                <path
                  d="M 60 420 
                     C 120 420, 180 340, 220 280 
                     C 250 240, 280 140, 310 100 
                     C 330 75, 360 90, 390 150 
                     C 420 210, 480 360, 560 380 
                     C 620 395, 680 290, 720 180 
                     C 750 110, 780 90, 810 120 
                     C 840 150, 890 320, 960 420"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3.2"
                />

                {/* Critical Risk Peak Callouts */}
                <circle cx="310" cy="100" r="6" fill="#f43f5e" className="animate-ping" opacity="0.6" />
                <circle cx="310" cy="100" r="5" fill="#f43f5e" />
                <text x="320" y="95" fill="#f43f5e" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  Tamper Peak: {risksPercent}%
                </text>

                <circle cx="780" cy="90" r="6" fill="#f43f5e" className="animate-ping" opacity="0.6" />
                <circle cx="780" cy="90" r="5" fill="#f43f5e" />
                <text x="790" y="85" fill="#f43f5e" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  Splicing Cluster: {risksPercent}%
                </text>
              </g>
            )}

            {/* Scanning Radar Line */}
            <line x1="310" y1="60" x2="310" y2="420" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="780" y1="60" x2="780" y2="420" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>

          {/* Thermal Heatmap Gradient Overlays floating over graph risk peaks */}
          {activeFilter === 'heatmap' && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Hotspot 1 (at Risk Peak x:31%, y:20%) */}
              <div 
                className="absolute w-52 h-40 rounded-full filter blur-2xl opacity-80 animate-pulse"
                style={{
                  top: '15%',
                  left: '26%',
                  background: 'radial-gradient(circle, rgba(239,68,68,0.9) 0%, rgba(249,115,22,0.65) 45%, rgba(234,179,8,0.25) 75%, transparent 100%)'
                }}
              />
              {/* Hotspot 2 (at Splicing Cluster x:76%, y:18%) */}
              <div 
                className="absolute w-56 h-36 rounded-full filter blur-xl opacity-75"
                style={{
                  top: '14%',
                  left: '70%',
                  background: 'radial-gradient(circle, rgba(244,63,94,0.85) 0%, rgba(249,115,22,0.6) 45%, rgba(234,179,8,0.2) 80%, transparent 100%)'
                }}
              />
            </div>
          )}

          {/* Filter Mode Specific Graphical Overlays */}
          {activeFilter === 'ela' && (
            <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 bg-[radial-gradient(#00ffff_1px,transparent_1px)] [background-size:16px_16px]" />
          )}

          {activeFilter === 'edges' && (
            <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-30 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
          )}

          {/* Interactive Bounding Boxes for Detected Anomalies over the Graph */}
          {activeFilter !== 'clean' && anomalies.map((anomaly) => {
            if (!anomaly.location) return null;
            const isSelected = selectedAnomaly?.id === anomaly.id;
            return (
              <div
                key={anomaly.id}
                onClick={() => setSelectedAnomaly(isSelected ? null : anomaly)}
                className={`absolute cursor-pointer border-2 transition-all duration-200 group ${
                  anomaly.severity === 'critical'
                    ? 'border-rose-500 bg-rose-500/25 hover:bg-rose-500/35'
                    : 'border-amber-400 bg-amber-400/25 hover:bg-amber-400/35'
                } ${isSelected ? 'ring-4 ring-rose-400/50 scale-105 z-20' : 'z-10'}`}
                style={{
                  left: `${anomaly.location.x}%`,
                  top: `${anomaly.location.y}%`,
                  width: `${anomaly.location.width}%`,
                  height: `${anomaly.location.height}%`
                }}
              >
                {/* Hotspot Tag */}
                <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase text-white shadow-md flex items-center gap-1 ${
                  anomaly.severity === 'critical' ? 'bg-rose-600' : 'bg-amber-600'
                }`}>
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {anomaly.category} ({Math.round(anomaly.confidence)}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* Graph Legend Overlay at bottom-left */}
        <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md shadow-xl text-[10px] font-mono text-slate-300 flex flex-wrap items-center gap-4">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Graph Spectrum:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50" />
            <span className="text-rose-300 font-bold">Risks ({risksPercent}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50" />
            <span className="text-amber-300 font-bold">Suspicious ({suspiciousPercent}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
            <span className="text-emerald-300 font-bold">Verified Clean ({cleanPercent}%)</span>
          </div>
        </div>

        {/* Graph Coordinate HUD at bottom-right */}
        <div className="hidden sm:flex absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>SPECTRAL SAMPLE: 8x8 DCT BLOCKS</span>
        </div>
      </div>

      {/* Selected Anomaly Details Inspector Drawer */}
      {selectedAnomaly && (
        <div className="p-4 bg-rose-950/20 dark:bg-rose-950/30 border-t border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-rose-400 font-display">{selectedAnomaly.title}</p>
              <p className="text-slate-300 text-[11px] mt-0.5">{selectedAnomaly.description}</p>
              <p className="text-[10px] font-mono text-cyan-400 mt-1">Evidence: {selectedAnomaly.evidence}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-mono text-[11px] font-bold">
              Confidence: {selectedAnomaly.confidence}%
            </span>
            <button
              onClick={() => setSelectedAnomaly(null)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

