import React, { useState } from 'react';
import { Dna, Fingerprint, Activity, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { SyntheticDocument } from '../types';

interface DNAComparisonCardProps {
  docA: SyntheticDocument;
  docB: SyntheticDocument;
}

export const DNAComparisonCard: React.FC<DNAComparisonCardProps> = ({ docA, docB }) => {
  const [geneFilter, setGeneFilter] = useState<'all' | 'clean' | 'suspicious' | 'tampered'>('all');

  const axesLabels = [
    'Typography',
    'Layout Grid',
    'Compression',
    'Pixel Entropy',
    'XMP Metadata',
    'Math Sums',
    'Chroma Delta',
    'Margin Vectors'
  ];

  const size = 260;
  const center = size / 2;
  const radius = size * 0.38;
  const pointsCount = docA.dna.radialFeatures.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / pointsCount) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polyA = docA.dna.radialFeatures
    .map((val, idx) => {
      const { x, y } = getCoordinates(idx, val);
      return `${x},${y}`;
    })
    .join(' ');

  const polyB = docB.dna.radialFeatures
    .map((val, idx) => {
      const { x, y } = getCoordinates(idx, val);
      return `${x},${y}`;
    })
    .join(' ');

  // Calculate similarity
  const deltas = docA.dna.radialFeatures.map((valA, idx) => Math.abs(valA - docB.dna.radialFeatures[idx]));
  const avgDelta = deltas.reduce((acc, curr) => acc + curr, 0) / deltas.length;
  const similarityScore = Math.max(10, Math.round(100 - avgDelta));
  const entropyDiff = (docB.dna.entropyScore - docA.dna.entropyScore).toFixed(2);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 shadow-xl space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <span>Document DNA Comparative Genome</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-400 font-mono font-bold">
                DUAL VECTOR
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              64-point forensic biometrics overlaying Document A (Baseline) and Document B (Suspect)
            </p>
          </div>
        </div>

        {/* Concordance Metric Pill */}
        <div className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">DNA Concordance</span>
            <span className={`text-base font-mono font-bold ${
              similarityScore >= 80 ? 'text-emerald-500' : similarityScore >= 50 ? 'text-amber-500' : 'text-rose-500'
            }`}>
              {similarityScore}%
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Entropy Shift</span>
            <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">
              {Number(entropyDiff) > 0 ? `+${entropyDiff}` : entropyDiff}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Radar Chart + Gene Deltas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Radar Comparison Chart */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-2">
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
              {/* Concentric grid rings */}
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

              {/* Polygon A: Baseline (Cyan) */}
              <polygon
                points={polyA}
                fill="rgba(6, 182, 212, 0.2)"
                stroke="#06b6d4"
                strokeWidth="2"
              />

              {/* Polygon B: Suspect (Rose/Violet) */}
              <polygon
                points={polyB}
                fill="rgba(244, 63, 94, 0.25)"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Axis Labels */}
              {axesLabels.map((label, i) => {
                const angle = (Math.PI * 2 / pointsCount) * i - Math.PI / 2;
                const labelDist = radius + 20;
                const x = center + labelDist * Math.cos(angle);
                const y = center + labelDist * Math.sin(angle);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[9px] font-mono fill-slate-500 dark:fill-slate-400 font-semibold"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Doc A: Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 border border-dashed border-rose-300" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Doc B: Suspect Specimen</span>
            </div>
          </div>
        </div>

        {/* Gene Differential Table */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Genomic Gene Tri-Color Classification
            </h4>
            
            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-mono">
              <button
                onClick={() => setGeneFilter('all')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  geneFilter === 'all' 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                All (8)
              </button>
              <button
                onClick={() => setGeneFilter('clean')}
                className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                  geneFilter === 'clean' 
                    ? 'bg-emerald-500 text-white font-bold shadow-xs' 
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Clean</span>
              </button>
              <button
                onClick={() => setGeneFilter('suspicious')}
                className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                  geneFilter === 'suspicious' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Suspicious</span>
              </button>
              <button
                onClick={() => setGeneFilter('tampered')}
                className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                  geneFilter === 'tampered' 
                    ? 'bg-rose-500 text-white font-bold shadow-xs' 
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Tampered</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {axesLabels
              .map((label, idx) => {
                const valA = docA.dna.radialFeatures[idx];
                const valB = docB.dna.radialFeatures[idx];
                const diff = Math.abs(valA - valB);
                const category: 'clean' | 'suspicious' | 'tampered' = 
                  diff >= 25 ? 'tampered' : diff >= 10 ? 'suspicious' : 'clean';
                return { label, idx, valA, valB, diff, category };
              })
              .filter(item => geneFilter === 'all' || item.category === geneFilter)
              .map(item => {
                const isTampered = item.category === 'tampered';
                const isSuspicious = item.category === 'suspicious';
                const isClean = item.category === 'clean';

                return (
                  <div 
                    key={item.idx} 
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                      isTampered
                        ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-500/30'
                        : isSuspicious
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500/30'
                        : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isTampered && <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                      {isSuspicious && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      {isClean && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2.5 font-mono">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{item.valA}%</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className={`text-[11px] font-bold ${
                        isTampered ? 'text-rose-500' : isSuspicious ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {item.valB}%
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isTampered 
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30' 
                          : isSuspicious 
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isTampered ? `Tampered Δ${item.diff}%` : isSuspicious ? `Suspicious Δ${item.diff}%` : `Clean Δ${item.diff}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
};
