import React from 'react';
import { Dna, Fingerprint, ShieldCheck, Sparkles, Binary, Cpu } from 'lucide-react';
import { DocumentDNAData } from '../types';

interface DocumentDNAVisualizerProps {
  dna: DocumentDNAData;
  docTitle: string;
}

export const DocumentDNAVisualizer: React.FC<DocumentDNAVisualizerProps> = ({ dna, docTitle }) => {
  const axesLabels = [
    'Micro-Typography',
    'Layout Grid',
    'DCT Compression',
    'Pixel Entropy',
    'XMP Metadata',
    'Mathematical Sums',
    'Chroma Consistency',
    'Margin Vectors'
  ];

  // Radar points calculation
  const size = 260;
  const center = size / 2;
  const radius = size * 0.38;
  const pointsCount = dna.radialFeatures.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / pointsCount) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = dna.radialFeatures
    .map((val, idx) => {
      const { x, y } = getCoordinates(idx, val);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xl p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-500">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              Document DNA Biometric Vector
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-mono">WOW FEATURE</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">64-point forensic profile & layout genotype</p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-mono text-xs text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5">
          <Fingerprint className="w-3.5 h-3.5" />
          {dna.hash}
        </div>
      </div>

      {/* Center content: Radar Chart + Genomic Metric Pills */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4">
        
        {/* Radar SVG */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
              {/* Background Concentric Radar Rings */}
              {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius * level}
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeDasharray={level === 1.0 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
              ))}

              {/* Axis rays */}
              {axesLabels.map((_, i) => {
                const angle = (Math.PI * 2 / pointsCount) * i - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Specimen DNA Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(139, 92, 246, 0.25)"
                stroke="#8b5cf6"
                strokeWidth="2"
                className="transition-all duration-500 hover:fill-violet-500/40"
              />

              {/* Polygon Vertex Nodes */}
              {dna.radialFeatures.map((val, idx) => {
                const { x, y } = getCoordinates(idx, val);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                  />
                );
              })}
            </svg>

            {/* Micro labels around chart */}
            <div className="text-[9px] font-mono text-slate-400 absolute inset-0 pointer-events-none flex flex-col justify-between items-center py-1">
              <span>{axesLabels[0]}</span>
              <span>{axesLabels[4]}</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-2">
            Radial Entropy Dispersion Profile
          </span>
        </div>

        {/* DNA Vectors & Key Signatures */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Structural Coherence:</span>
              <span className={`font-mono font-bold ${dna.structuralCoherence < 60 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {dna.structuralCoherence}% (Anomaly delta)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${dna.structuralCoherence < 60 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${dna.structuralCoherence}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-mono">Entropy Dispersion:</span>
              <span className="font-mono font-bold text-violet-400">{dna.entropyScore} (High)</span>
            </div>
          </div>

          {/* Genomic Barcode Visualization */}
          <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/20 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <Binary className="w-3 h-3" /> GENOMIC SPECTRAL BARCODE
              </span>
              <span className="text-[10px] font-mono text-slate-400">SHA-256 HASH</span>
            </div>

            {/* Barcode Strip */}
            <div className="h-7 w-full flex items-center gap-[2px] bg-slate-950 p-1 rounded-sm overflow-hidden">
              {Array.from({ length: 54 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${
                    (i * 7) % 3 === 0 
                      ? 'w-[3px] bg-cyan-400' 
                      : (i * 5) % 4 === 0 
                      ? 'w-[1.5px] bg-violet-400' 
                      : (i * 3) % 5 === 0 
                      ? 'w-[4px] bg-rose-400' 
                      : 'w-[1px] bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-2 truncate">
              Signature: {dna.fontFingerprint} | {dna.layoutSignature}
            </p>
          </div>
        </div>

      </div>

      {/* Footer warning */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>DNA MATCH WITH CERTIFIED TEMPLATES: <strong className="text-rose-500">MISMATCH (Deviation &gt; 35%)</strong></span>
        <span>BENCHMARK DATA ONLY</span>
      </div>
    </div>
  );
};
