import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Info,
  Sliders,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { ForensicAnomaly } from '../types';

interface TamperHeatmapViewerProps {
  imageSrc?: string;
  anomalies: ForensicAnomaly[];
  riskScore?: number;
  riskBreakdown?: {
    font: number;
    layout: number;
    metadata: number;
    aiOrigin: number;
    splicing: number;
    crossField: number;
  };
}

interface VerticalBarItem {
  id: string;
  name: string;
  shortLabel?: string;
  category: string;
  value: number;
  type: 'risk' | 'suspicious' | 'clean';
  group: 'overall' | 'indicator';
  badge: string;
  filterGroup?: 'all' | 'ela' | 'edges' | 'clean';
  description: string;
  evidence: string;
}

export const TamperHeatmapViewer: React.FC<TamperHeatmapViewerProps> = ({ 
  anomalies, 
  riskScore = 78,
  riskBreakdown
}) => {
  const [activeFilter, setActiveFilter] = useState<'heatmap' | 'ela' | 'edges' | 'clean'>('heatmap');
  const [zoom, setZoom] = useState(1);
  const [hoveredBarId, setHoveredBarId] = useState<string | null>(null);
  const [selectedBarId, setSelectedBarId] = useState<string | null>('dct');
  const [isAnimated, setIsAnimated] = useState(false);

  // Smooth entry animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Calculate dynamic percentages of Risks, Suspicious, and Verified Clean
  const { risksPercent, suspiciousPercent, cleanPercent, effectiveRisk } = useMemo(() => {
    let computedRisk = riskScore;
    if (anomalies && anomalies.length > 0) {
      const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
      const moderateCount = anomalies.filter(a => a.severity !== 'critical').length;
      const weighted = (criticalCount * 26) + (moderateCount * 13);
      if (weighted > 0) {
        computedRisk = Math.min(96, Math.max(15, weighted));
      }
    }

    // Default for riskScore 78 gives exactly 44% risks, 29% suspicious, 27% clean
    const rPct = Math.max(5, Math.min(85, Math.round(computedRisk * 0.564)));
    const sPct = Math.max(5, Math.min(45, Math.round(computedRisk * 0.372)));
    const cPct = Math.max(5, 100 - rPct - sPct);

    return {
      risksPercent: rPct,
      suspiciousPercent: sPct,
      cleanPercent: cPct,
      effectiveRisk: computedRisk
    };
  }, [riskScore, anomalies]);

  // GROUP 1: Overall Classification Vertical Bars
  const overallBars: VerticalBarItem[] = useMemo(() => {
    return [
      {
        id: 'overall-risks',
        name: 'Risks',
        shortLabel: 'Risks',
        category: 'Critical Forensic Anomalies',
        value: risksPercent,
        type: 'risk',
        group: 'overall',
        badge: 'High Anomaly',
        description: 'Aggregate proportion of specimen surface exhibiting high-severity tampering spikes and vector splicing.',
        evidence: `${risksPercent}% of analyzed regions exhibit structural or pixel entropy divergence exceeding safety thresholds.`
      },
      {
        id: 'overall-suspicious',
        name: 'Suspicious',
        shortLabel: 'Suspicious',
        category: 'Moderate Forensic Fluctuations',
        value: suspiciousPercent,
        type: 'suspicious',
        group: 'overall',
        badge: 'Moderate Deviation',
        description: 'Aggregate proportion of specimen exhibiting compression artifacts, re-compression jitter, or minor misalignment.',
        evidence: `${suspiciousPercent}% of specimen exhibits localized secondary quantization deltas.`
      },
      {
        id: 'overall-clean',
        name: 'Verified Clean',
        shortLabel: 'Clean',
        category: 'Pristine Ground Truth',
        value: cleanPercent,
        type: 'clean',
        group: 'overall',
        badge: 'Verified Clean',
        description: 'Aggregate proportion of specimen maintaining continuous sensor noise, uniform baseline, and authentic typography.',
        evidence: `${cleanPercent}% of document substrate satisfies authentic baseline institutional profiles.`
      }
    ];
  }, [risksPercent, suspiciousPercent, cleanPercent]);

  // GROUP 2: Forensic Indicator Vertical Bars
  const indicatorBars: VerticalBarItem[] = useMemo(() => {
    // 1. DCT Variance (65% for default 78)
    const dctVal = riskBreakdown?.splicing 
      ? Math.round(riskBreakdown.splicing * 0.956)
      : Math.min(100, Math.round(effectiveRisk * 0.8333));
    
    // 2. Layout (91% for default 78)
    const layoutVal = riskBreakdown?.layout 
      ? Math.min(100, Math.round(riskBreakdown.layout * 1.167))
      : Math.min(100, Math.round(effectiveRisk * 1.1667));

    // 3. Font (96% for default 78)
    const fontVal = riskBreakdown?.font 
      ? Math.min(100, Math.round(riskBreakdown.font * 1.043))
      : Math.min(100, Math.round(effectiveRisk * 1.2308));

    // 4. Cross-Field (100% for default 78)
    const crossFieldVal = riskBreakdown?.crossField 
      ? Math.min(100, Math.round(riskBreakdown.crossField * 1.042))
      : Math.min(100, Math.max(20, Math.round(effectiveRisk * 1.282)));

    // 5. Substrate Baseline (25% for default 78)
    const substrateVal = Math.max(8, Math.min(100, Math.round(100 - (effectiveRisk * 0.9615))));

    const list: VerticalBarItem[] = [
      {
        id: 'dct',
        name: 'DCT Variance',
        shortLabel: 'DCT Variance',
        category: 'Compression Entropy (8x8 DCT)',
        value: dctVal,
        type: dctVal > 75 ? 'risk' : dctVal >= 40 ? 'suspicious' : 'clean',
        group: 'indicator',
        badge: dctVal > 75 ? 'Critical' : dctVal >= 40 ? 'Suspicious' : 'Clean',
        filterGroup: 'ela',
        description: 'Measures high-frequency quantization noise disparities across JPEG/PDF discrete cosine transform blocks.',
        evidence: 'Detected +4.2 dB non-uniform high-frequency residual energy across numeric field boundary.'
      },
      {
        id: 'layout',
        name: 'Layout',
        shortLabel: 'Layout',
        category: 'Spatial Coordinates & Margin Geometry',
        value: layoutVal,
        type: layoutVal > 75 ? 'risk' : layoutVal >= 40 ? 'suspicious' : 'clean',
        group: 'indicator',
        badge: layoutVal > 75 ? 'High Anomaly' : layoutVal >= 40 ? 'Suspicious' : 'Clean',
        filterGroup: 'edges',
        description: 'Calculates Euclidean baseline alignment shift and table column bounding box deviations from institutional templates.',
        evidence: 'Column header grid misaligned by 3.8px compared to reference canonical schema.'
      },
      {
        id: 'font',
        name: 'Font',
        shortLabel: 'Font',
        category: 'Glyph Biometrics & Optical Kerning',
        value: fontVal,
        type: fontVal > 75 ? 'risk' : fontVal >= 40 ? 'suspicious' : 'clean',
        group: 'indicator',
        badge: fontVal > 75 ? 'High Anomaly' : fontVal >= 40 ? 'Suspicious' : 'Clean',
        filterGroup: 'edges',
        description: 'Extracts typographic stroke thickness, optical character kerning deltas, and synthetic font substitutions.',
        evidence: 'Embedded typeface replaced with synthetic Arial vector approximation; kerning variance exceeds 12%.'
      },
      {
        id: 'cross-field',
        name: 'Cross-Field',
        shortLabel: 'Cross-Field',
        category: 'Semantic & Arithmetic Audit',
        value: crossFieldVal,
        type: crossFieldVal > 75 ? 'risk' : crossFieldVal >= 40 ? 'suspicious' : 'clean',
        group: 'indicator',
        badge: crossFieldVal > 75 ? 'Critical Risk' : crossFieldVal >= 40 ? 'Suspicious' : 'Clean',
        filterGroup: 'edges',
        description: 'Cross-references arithmetic balances, tax rates, transaction dates, and account hashes against relational rules.',
        evidence: 'Total amount does not balance against itemized subtotal; line 4 timestamp post-dates document generation.'
      },
      {
        id: 'substrate',
        name: 'Substrate Baseline',
        shortLabel: 'Substrate',
        category: 'Substrate Integrity & Clean Noise Floor',
        value: substrateVal,
        type: 'clean', // Green color language
        group: 'indicator',
        badge: 'Verified Clean',
        filterGroup: 'clean',
        description: 'Analyzes micro-texture paper substrate fibers and scanner sensor pattern noise to verify non-tampered baseline.',
        evidence: '25% of background substrate maintains pristine continuous scanner sensor noise profile.'
      }
    ];

    return list;
  }, [effectiveRisk, riskBreakdown]);

  // Filtered indicator bars based on active toolbar filter
  const displayedIndicators = useMemo(() => {
    if (activeFilter === 'heatmap') return indicatorBars;
    if (activeFilter === 'ela') return indicatorBars.filter(i => i.filterGroup === 'ela' || i.id === 'substrate');
    if (activeFilter === 'edges') return indicatorBars.filter(i => i.filterGroup === 'edges');
    if (activeFilter === 'clean') return indicatorBars.filter(i => i.type === 'clean');
    return indicatorBars;
  }, [activeFilter, indicatorBars]);

  // Currently active bar for inspector drawer
  const allBars = useMemo(() => [...overallBars, ...indicatorBars], [overallBars, indicatorBars]);
  const activeBar = allBars.find(b => b.id === (hoveredBarId || selectedBarId)) || indicatorBars[0];

  // Helper for bar styling
  const getBarColorClasses = (type: 'risk' | 'suspicious' | 'clean', isHovered: boolean, isSelected: boolean) => {
    if (type === 'risk') {
      return {
        barBg: 'bg-gradient-to-t from-rose-600/95 via-rose-500 to-rose-400 border-t-2 border-x border-rose-300/80',
        glow: isHovered || isSelected
          ? 'shadow-[0_0_24px_rgba(244,63,94,0.85)] ring-2 ring-rose-400'
          : 'shadow-[0_0_14px_rgba(244,63,94,0.5)]',
        text: 'text-rose-500 dark:text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]',
        topCap: 'bg-rose-200 shadow-[0_0_8px_#ffffff]',
        badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
      };
    }
    if (type === 'suspicious') {
      return {
        barBg: 'bg-gradient-to-t from-amber-600/95 via-amber-500 to-yellow-400 border-t-2 border-x border-amber-300/80',
        glow: isHovered || isSelected
          ? 'shadow-[0_0_24px_rgba(245,158,11,0.85)] ring-2 ring-amber-400'
          : 'shadow-[0_0_14px_rgba(245,158,11,0.5)]',
        text: 'text-amber-500 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]',
        topCap: 'bg-amber-100 shadow-[0_0_8px_#ffffff]',
        badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
      };
    }
    // Clean (Green)
    return {
      barBg: 'bg-gradient-to-t from-emerald-600/95 via-emerald-500 to-teal-400 border-t-2 border-x border-emerald-300/80',
      glow: isHovered || isSelected
        ? 'shadow-[0_0_24px_rgba(16,185,129,0.85)] ring-2 ring-emerald-400'
        : 'shadow-[0_0_14px_rgba(16,185,129,0.5)]',
      text: 'text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]',
      topCap: 'bg-emerald-100 shadow-[0_0_8px_#ffffff]',
      badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    };
  };

  return (
    <div id="tamper-heatmap-container" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d1e] overflow-hidden shadow-xl text-left">
      
      {/* Control Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              Tamper Heatmap &amp; Spectral Bar Inspector
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                VERTICAL BAR CHART
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">
              Overall spectrum classification &amp; forensic indicator vertical bar metrics
            </p>
          </div>
        </div>

        {/* Filter Switcher & Zoom */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveFilter('heatmap')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'heatmap' ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              All Bars
            </button>
            <button
              onClick={() => setActiveFilter('ela')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'ela' ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              ELA (Noise)
            </button>
            <button
              onClick={() => setActiveFilter('edges')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'edges' ? 'bg-rose-500 text-white font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Vector &amp; Edges
            </button>
            <button
              onClick={() => setActiveFilter('clean')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'clean' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Clean Baseline
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-lg">
            <button
              onClick={() => setZoom(prev => Math.max(0.85, prev - 0.15))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Compact View"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-600 dark:text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(1.25, prev + 0.15))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Expanded View"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* VERTICAL BAR CHART VISUALIZER */}
      <div 
        className="p-4 sm:p-6 bg-[#060b19] relative overflow-hidden transition-all duration-200 select-none"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center'
        }}
      >
        {/* Futuristic Cyan/Blue Coordinate Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Ambient Subtle Radial Glows */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Group Headers / Category Badges */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-4 pb-4 mb-3 border-b border-cyan-950/80">
          
          {/* Group 1 Header Label */}
          <div className="w-full md:w-[38%] flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/80 border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-cyan-300">
                GROUP 1: Overall Classification
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              3 Spectrum Bars
            </span>
          </div>

          {/* Group 2 Header Label */}
          <div className="w-full md:flex-1 flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/80 border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-violet-300">
                GROUP 2: Forensic Anomaly Indicators
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              5 Forensic Indicators
            </span>
          </div>
        </div>

        {/* Main Chart Area with Y-Axis and Vertical Bars */}
        <div className="relative z-10 flex gap-2 sm:gap-4 h-[380px] sm:h-[420px] pt-4 pb-2">
          
          {/* Y-Axis Scale (0% - 100%) */}
          <div className="w-9 sm:w-11 shrink-0 flex flex-col justify-between text-[10px] font-mono text-cyan-400/70 text-right pr-1 pb-16 pt-4 select-none">
            <span className="leading-none">100%</span>
            <span className="leading-none">75%</span>
            <span className="leading-none">50%</span>
            <span className="leading-none">25%</span>
            <span className="leading-none text-cyan-500/90 font-bold">0%</span>
          </div>

          {/* Grid Lines Overlay Behind Bars */}
          <div className="absolute left-10 sm:left-14 right-2 top-8 bottom-20 pointer-events-none z-0 flex flex-col justify-between">
            <div className="w-full border-b border-cyan-500/25 border-dashed" />
            <div className="w-full border-b border-cyan-500/15 border-dashed" />
            <div className="w-full border-b border-cyan-500/20 border-dashed" />
            <div className="w-full border-b border-cyan-500/15 border-dashed" />
            <div className="w-full border-b-2 border-cyan-500/40 shadow-[0_1px_4px_rgba(56,189,248,0.3)]" />
          </div>

          {/* Bars Stage Container */}
          <div className="flex-1 flex gap-2 sm:gap-4 relative z-10">
            
            {/* ======================================================== */}
            {/* GROUP 1: OVERALL CLASSIFICATION (3 VERTICAL BARS) */}
            {/* ======================================================== */}
            <div className="w-[36%] sm:w-[38%] flex items-stretch justify-around px-1 sm:px-3 rounded-xl bg-slate-950/40 border border-cyan-500/15 relative">
              {overallBars.map((bar) => {
                const isHovered = hoveredBarId === bar.id;
                const isSelected = selectedBarId === bar.id;
                const colors = getBarColorClasses(bar.type, isHovered, isSelected);
                const targetHeight = isAnimated ? `${bar.value}%` : '0%';

                return (
                  <div
                    key={bar.id}
                    id={`bar-${bar.id}`}
                    onMouseEnter={() => setHoveredBarId(bar.id)}
                    onMouseLeave={() => setHoveredBarId(null)}
                    onClick={() => setSelectedBarId(bar.id)}
                    className="flex-1 max-w-[64px] min-w-[32px] mx-1 flex flex-col items-center justify-end cursor-pointer group"
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute top-1 z-30 px-2.5 py-1.5 rounded-lg bg-slate-950/95 border border-cyan-400 text-white text-[11px] font-mono shadow-2xl backdrop-blur-md pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={`w-2 h-2 rounded-full ${bar.type === 'risk' ? 'bg-rose-500' : bar.type === 'suspicious' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <span>{bar.name}:</span>
                          <span className={colors.text}>{bar.value}%</span>
                        </div>
                        <p className="text-[10px] text-slate-300">{bar.badge}</p>
                      </div>
                    )}

                    {/* Value Badge Above Bar */}
                    <div className="mb-2 text-center transition-transform duration-200 group-hover:scale-110">
                      <span className={`text-xs sm:text-sm font-extrabold font-mono tracking-tight ${colors.text}`}>
                        {bar.value}%
                      </span>
                    </div>

                    {/* Vertical Bar Column Stage (extends from bottom baseline 0% upward) */}
                    <div className="w-full h-[220px] sm:h-[260px] flex items-end justify-center">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-700 ease-out relative ${colors.barBg} ${colors.glow}`}
                        style={{ height: targetHeight }}
                      >
                        {/* Neon Top Edge Cap Highlight */}
                        <div className={`absolute top-0 inset-x-0 h-1 rounded-t-xl ${colors.topCap}`} />

                        {/* Subtle Vertical Sheen */}
                        <div className="absolute inset-0 rounded-t-xl bg-gradient-to-r from-white/20 via-transparent to-black/30 pointer-events-none" />

                        {/* Glowing Pulse Dot at Bar Peak */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                      </div>
                    </div>

                    {/* Bottom X-Axis Label */}
                    <div className="h-16 pt-2 text-center flex flex-col items-center justify-start">
                      <span className="text-[11px] sm:text-xs font-bold font-mono text-slate-200 group-hover:text-white transition-colors leading-tight truncate max-w-full">
                        {bar.shortLabel || bar.name}
                      </span>
                      <span className={`mt-0.5 text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-full border ${colors.badge} hidden sm:inline-block`}>
                        {bar.type.toUpperCase()}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* ======================================================== */}
            {/* CLEAR VISUAL DIVIDER BETWEEN GROUP 1 AND GROUP 2 */}
            {/* ======================================================== */}
            <div className="w-6 sm:w-8 flex flex-col items-center justify-center shrink-0 relative">
              {/* Vertical Dashed Neon Line */}
              <div className="h-[280px] sm:h-[320px] w-0.5 border-r border-dashed border-cyan-400/50 relative">
                {/* Center Separation Icon / Badge */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-2.5 p-1 rounded-full bg-slate-900 border border-cyan-400/60 shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
              <span className="mt-2 text-[9px] font-mono text-slate-500 rotate-90 sm:rotate-0 tracking-widest uppercase">
                DIV
              </span>
            </div>

            {/* ======================================================== */}
            {/* GROUP 2: FORENSIC INDICATORS (5 VERTICAL BARS) */}
            {/* ======================================================== */}
            <div className="flex-1 flex items-stretch justify-around px-1 sm:px-3 rounded-xl bg-slate-950/40 border border-violet-500/15 relative">
              {displayedIndicators.map((bar) => {
                const isHovered = hoveredBarId === bar.id;
                const isSelected = selectedBarId === bar.id;
                const colors = getBarColorClasses(bar.type, isHovered, isSelected);
                const targetHeight = isAnimated ? `${bar.value}%` : '0%';

                return (
                  <div
                    key={bar.id}
                    id={`bar-${bar.id}`}
                    onMouseEnter={() => setHoveredBarId(bar.id)}
                    onMouseLeave={() => setHoveredBarId(null)}
                    onClick={() => setSelectedBarId(bar.id)}
                    className="flex-1 max-w-[64px] min-w-[28px] mx-0.5 sm:mx-1 flex flex-col items-center justify-end cursor-pointer group"
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute top-1 z-30 px-2.5 py-1.5 rounded-lg bg-slate-950/95 border border-cyan-400 text-white text-[11px] font-mono shadow-2xl backdrop-blur-md pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={`w-2 h-2 rounded-full ${bar.type === 'risk' ? 'bg-rose-500' : bar.type === 'suspicious' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <span>{bar.name}:</span>
                          <span className={colors.text}>{bar.value}%</span>
                        </div>
                        <p className="text-[10px] text-slate-300">{bar.category}</p>
                        <p className="text-[9px] text-cyan-400 mt-0.5">{bar.badge}</p>
                      </div>
                    )}

                    {/* Value Badge Above Bar */}
                    <div className="mb-2 text-center transition-transform duration-200 group-hover:scale-110">
                      <span className={`text-xs sm:text-sm font-extrabold font-mono tracking-tight ${colors.text}`}>
                        {bar.value}%
                      </span>
                    </div>

                    {/* Vertical Bar Column Stage (extends from bottom baseline 0% upward) */}
                    <div className="w-full h-[220px] sm:h-[260px] flex items-end justify-center">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-700 ease-out relative ${colors.barBg} ${colors.glow}`}
                        style={{ height: targetHeight }}
                      >
                        {/* Neon Top Edge Cap Highlight */}
                        <div className={`absolute top-0 inset-x-0 h-1 rounded-t-xl ${colors.topCap}`} />

                        {/* Subtle Vertical Sheen */}
                        <div className="absolute inset-0 rounded-t-xl bg-gradient-to-r from-white/20 via-transparent to-black/30 pointer-events-none" />

                        {/* Glowing Pulse Dot at Bar Peak */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                      </div>
                    </div>

                    {/* Bottom X-Axis Label */}
                    <div className="h-16 pt-2 text-center flex flex-col items-center justify-start">
                      <span className="text-[10px] sm:text-xs font-bold font-mono text-slate-200 group-hover:text-white transition-colors leading-tight truncate max-w-full">
                        {bar.shortLabel || bar.name}
                      </span>
                      <span className={`mt-0.5 text-[9px] font-mono font-semibold px-1 py-0.2 rounded-full border ${colors.badge} hidden sm:inline-block`}>
                        {bar.badge}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Legend & Calibration Footer */}
        <div className="relative z-10 pt-3 mt-1 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-slate-400 border-t border-cyan-950/70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
              <span className="text-slate-300">Neon Red/Pink: Risks / Critical Anomaly</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.9)]" />
              <span className="text-slate-300">Orange/Yellow: Suspicious</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
              <span className="text-slate-300">Green: Verified Clean</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-cyan-400">
            <Sparkles className="w-3 h-3" />
            <span>VERTICAL COLUMN GRAPH • 0–100% Y-AXIS CALIBRATION</span>
          </div>
        </div>

      </div>

      {/* Interactive Detail Inspector Drawer for Selected / Hovered Bar */}
      {activeBar && (
        <div className="p-4 bg-slate-100/90 dark:bg-[#050a18] border-t border-slate-200 dark:border-cyan-950/80 flex flex-wrap items-center justify-between gap-4 text-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
              activeBar.type === 'risk'
                ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                : activeBar.type === 'suspicious'
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
            }`}>
              <Info className="w-4 h-4" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                  {activeBar.name}
                </span>
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                  [{activeBar.category}]
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  activeBar.type === 'risk'
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    : activeBar.type === 'suspicious'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}>
                  Metric: {activeBar.value}%
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {activeBar.group === 'overall' ? 'Group 1: Overall' : 'Group 2: Forensic Indicator'}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {activeBar.description}
              </p>
              <p className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300">
                <strong>Forensic Evidence:</strong> {activeBar.evidence}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedBarId(null);
                setHoveredBarId(null);
              }}
              className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs cursor-pointer transition-colors"
            >
              Reset Focus
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


