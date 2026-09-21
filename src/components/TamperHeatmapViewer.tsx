import React, { useState } from 'react';
import { Flame, ZoomIn, ZoomOut, Maximize2, AlertTriangle, Layers, Info } from 'lucide-react';
import { ForensicAnomaly } from '../types';

interface TamperHeatmapViewerProps {
  imageSrc: string;
  anomalies: ForensicAnomaly[];
}

export const TamperHeatmapViewer: React.FC<TamperHeatmapViewerProps> = ({ imageSrc, anomalies }) => {
  const [activeFilter, setActiveFilter] = useState<'heatmap' | 'ela' | 'edges' | 'clean'>('heatmap');
  const [zoom, setZoom] = useState(1);
  const [selectedAnomaly, setSelectedAnomaly] = useState<ForensicAnomaly | null>(null);

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
              Tamper Heatmap & ELA Inspector
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono">WOW FEATURE</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">Pixel compression entropy & manipulation zones</p>
          </div>
        </div>

        {/* Filter Switcher & Zoom */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveFilter('heatmap')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'heatmap' ? 'bg-rose-500 text-white font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setActiveFilter('ela')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'ela' ? 'bg-cyan-500 text-slate-950 font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              ELA (Noise)
            </button>
            <button
              onClick={() => setActiveFilter('edges')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'edges' ? 'bg-violet-500 text-white font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Laplacian Edges
            </button>
            <button
              onClick={() => setActiveFilter('clean')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'clean' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Original
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg">
            <button
              onClick={() => setZoom(prev => Math.max(0.8, prev - 0.2))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(2.0, prev + 0.2))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Visualizer Container */}
      <div className="relative w-full h-[380px] sm:h-[460px] bg-slate-950 overflow-hidden flex items-center justify-center select-none">
        <div 
          className="relative transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, width: '100%', height: '100%' }}
        >
          {/* Base Document Image with Filters */}
          <img
            src={imageSrc}
            alt="Specimen inspection"
            className={`w-full h-full object-cover transition-all duration-300 ${
              activeFilter === 'ela' 
                ? 'contrast-200 brightness-125 filter grayscale invert' 
                : activeFilter === 'edges' 
                ? 'contrast-200 brightness-75 invert filter saturate-200' 
                : ''
            }`}
          />

          {/* Synthetic Tamper Heatmap Gradient Overlay */}
          {activeFilter === 'heatmap' && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Hotspot 1 (ending balance alteration) */}
              <div 
                className="absolute w-44 h-24 rounded-full filter blur-xl opacity-75 animate-pulse"
                style={{
                  top: '30%',
                  right: '18%',
                  background: 'radial-gradient(circle, rgba(239,68,68,0.9) 0%, rgba(249,115,22,0.7) 45%, rgba(234,179,8,0.3) 70%, transparent 100%)'
                }}
              />
              {/* Hotspot 2 (transaction row deviation) */}
              <div 
                className="absolute w-64 h-16 rounded-full filter blur-lg opacity-60"
                style={{
                  top: '52%',
                  left: '20%',
                  background: 'radial-gradient(circle, rgba(249,115,22,0.8) 0%, rgba(234,179,8,0.4) 55%, transparent 90%)'
                }}
              />
            </div>
          )}

          {/* Interactive Bounding Boxes for Detected Anomalies */}
          {activeFilter !== 'clean' && anomalies.map((anomaly, idx) => {
            if (!anomaly.location) return null;
            const isSelected = selectedAnomaly?.id === anomaly.id;
            return (
              <div
                key={anomaly.id}
                onClick={() => setSelectedAnomaly(isSelected ? null : anomaly)}
                className={`absolute cursor-pointer border-2 transition-all duration-200 group ${
                  anomaly.severity === 'critical'
                    ? 'border-rose-500 bg-rose-500/20 hover:bg-rose-500/30'
                    : 'border-amber-400 bg-amber-400/20 hover:bg-amber-400/30'
                } ${isSelected ? 'ring-4 ring-rose-400/50 scale-105' : ''}`}
                style={{
                  left: `${anomaly.location.x}%`,
                  top: `${anomaly.location.y}%`,
                  width: `${anomaly.location.width}%`,
                  height: `${anomaly.location.height}%`
                }}
              >
                {/* Hotspot Tag */}
                <div className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase text-white shadow-md flex items-center gap-1 ${
                  anomaly.severity === 'critical' ? 'bg-rose-600' : 'bg-amber-600'
                }`}>
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {anomaly.category} ({Math.round(anomaly.confidence)}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Overlay at bottom-left */}
        <div className="absolute bottom-3 left-3 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg text-[10px] font-mono text-slate-300 flex items-center gap-3">
          <span className="text-slate-400">Entropy Scale:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Moderate (ELA 40%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Critical Anomaly (90%+)</span>
          </div>
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
              className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
