import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Target, 
  Crosshair,
  Sliders,
  Sparkles,
  Lock,
  Flame,
  CheckCircle2,
  Scan
} from 'lucide-react';
import { ForensicAnomaly } from '../types';

interface ForensicAnalyticsGraphProps {
  anomalies: ForensicAnomaly[];
  riskScore?: number;
  confidence?: number;
  riskBreakdown?: {
    font: number;
    layout: number;
    metadata: number;
    aiOrigin: number;
    splicing: number;
    crossField: number;
  };
  selectedAnomaly?: ForensicAnomaly | null;
  onSelectAnomaly?: (anomaly: ForensicAnomaly | null) => void;
  zoom?: number;
  isPiiMasked?: boolean;
}

interface AnalyticsBarItem {
  id: string;
  anomalyId?: string; // Links to forensic anomalies like 'a-1', 'a-2', 'a-4'
  name: string;
  shortLabel: string;
  category: string;
  value: number;
  type: 'risk' | 'suspicious' | 'clean';
  group: 'overall' | 'indicator';
  badge: string;
  isAnomalyTarget?: boolean;
  evidence: string;
}

export const ForensicAnalyticsGraph: React.FC<ForensicAnalyticsGraphProps> = ({
  anomalies,
  riskScore = 78,
  confidence = 94.2,
  riskBreakdown,
  selectedAnomaly,
  onSelectAnomaly,
  zoom = 1,
  isPiiMasked = false
}) => {
  const [hoveredBarId, setHoveredBarId] = useState<string | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger smooth upward entry animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Compute dynamic percentages for Overall Analysis (Group 1)
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

    // Default for riskScore 78 -> 44% risks, 29% suspicious, 27% clean
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

  // Find linked anomaly objects for interactive targeting
  const fontAnomaly = anomalies.find(a => a.category?.toLowerCase().includes('font') || a.id === 'a-1') || anomalies[0];
  const layoutAnomaly = anomalies.find(a => a.category?.toLowerCase().includes('layout') || a.id === 'a-2') || anomalies[1];
  const crossFieldAnomaly = anomalies.find(a => a.category?.toLowerCase().includes('cross') || a.id === 'a-4') || anomalies[2];

  // Group 1: Overall Analysis Bars
  const overallBars: AnalyticsBarItem[] = useMemo(() => {
    return [
      {
        id: 'bar-risks',
        name: 'Risks',
        shortLabel: 'Risks',
        category: 'High Anomaly',
        value: risksPercent,
        type: 'risk',
        group: 'overall',
        badge: 'Critical Anomaly',
        evidence: `${risksPercent}% of analyzed specimen regions exceed tamper probability thresholds.`
      },
      {
        id: 'bar-suspicious',
        name: 'Suspicious',
        shortLabel: 'Suspicious',
        category: 'Moderate Deviation',
        value: suspiciousPercent,
        type: 'suspicious',
        group: 'overall',
        badge: 'Moderate Fluctuation',
        evidence: `${suspiciousPercent}% of specimen shows secondary re-quantization deltas.`
      },
      {
        id: 'bar-clean',
        name: 'Verified Clean',
        shortLabel: 'Clean',
        category: 'Pristine Ground Truth',
        value: cleanPercent,
        type: 'clean',
        group: 'overall',
        badge: 'Verified Clean',
        evidence: `${cleanPercent}% of document substrate satisfies authentic baseline institutional profiles.`
      }
    ];
  }, [risksPercent, suspiciousPercent, cleanPercent]);

  // Group 2: Forensic Indicator Bars
  const indicatorBars: AnalyticsBarItem[] = useMemo(() => {
    // 1. DCT Variance -> 65% for default 78
    const dctVal = riskBreakdown?.splicing 
      ? Math.round(riskBreakdown.splicing * 0.956)
      : Math.min(100, Math.round(effectiveRisk * 0.8333));
    
    // 2. Layout -> 91% for default 78
    const layoutVal = riskBreakdown?.layout 
      ? Math.min(100, Math.round(riskBreakdown.layout * 1.167))
      : Math.min(100, Math.round(effectiveRisk * 1.1667));

    // 3. Font -> 96% for default 78
    const fontVal = riskBreakdown?.font 
      ? Math.min(100, Math.round(riskBreakdown.font * 1.043))
      : Math.min(100, Math.round(effectiveRisk * 1.2308));

    // 4. Cross-Field -> 100% for default 78
    const crossFieldVal = riskBreakdown?.crossField 
      ? Math.min(100, Math.round(riskBreakdown.crossField * 1.042))
      : Math.min(100, Math.max(20, Math.round(effectiveRisk * 1.282)));

    // 5. Substrate Baseline -> 25% for default 78
    const substrateVal = Math.max(8, Math.min(100, Math.round(100 - (effectiveRisk * 0.9615))));

    return [
      {
        id: 'bar-dct',
        name: 'DCT Variance',
        shortLabel: 'DCT',
        category: 'Compression Entropy (8x8 DCT)',
        value: dctVal,
        type: dctVal > 75 ? 'risk' : dctVal >= 40 ? 'suspicious' : 'clean',
        group: 'indicator',
        badge: 'Compression Noise',
        isAnomalyTarget: false,
        evidence: 'Quantization noise disparity detected in discrete cosine transform blocks.'
      },
      {
        id: 'bar-layout',
        anomalyId: layoutAnomaly?.id || 'a-2',
        name: 'Layout',
        shortLabel: 'Layout',
        category: 'Spatial Geometry & Baseline',
        value: layoutVal,
        type: layoutVal > 75 ? 'risk' : layoutVal >= 40 ? 'suspicious' : 'clean',
        group: 'indicator',
        badge: 'Layout Anomaly',
        isAnomalyTarget: true,
        evidence: 'Column header grid misaligned by 3.8px from reference template.'
      },
      {
        id: 'bar-font',
        anomalyId: fontAnomaly?.id || 'a-1',
        name: 'Font',
        shortLabel: 'Font',
        category: 'Glyph Weight & Optical Kerning',
        value: fontVal,
        type: fontVal > 75 ? 'risk' : fontVal >= 40 ? 'suspicious' : 'clean',
        group: 'indicator',
        badge: 'Font Anomaly',
        isAnomalyTarget: true,
        evidence: 'Glyph weight and optical kerning deviation exceeding 12% tolerance.'
      },
      {
        id: 'bar-cross-field',
        anomalyId: crossFieldAnomaly?.id || 'a-4',
        name: 'Cross-Field',
        shortLabel: 'Cross-Field',
        category: 'Semantic & Arithmetic Audit',
        value: crossFieldVal,
        type: crossFieldVal > 75 ? 'risk' : crossFieldVal >= 40 ? 'suspicious' : 'clean',
        group: 'indicator',
        badge: 'Cross-Field Risk',
        isAnomalyTarget: true,
        evidence: 'Relational arithmetic checksum mismatch between itemized totals and summary.'
      },
      {
        id: 'bar-substrate',
        name: 'Substrate Baseline',
        shortLabel: 'Substrate',
        category: 'Substrate & Sensor Noise Floor',
        value: substrateVal,
        type: 'clean', // Green color
        group: 'indicator',
        badge: 'Verified Clean',
        isAnomalyTarget: false,
        evidence: 'Scanner sensor pattern noise floor verified continuous.'
      }
    ];
  }, [effectiveRisk, riskBreakdown, fontAnomaly, layoutAnomaly, crossFieldAnomaly]);

  // Color & neon glow helper for bars
  const getBarStyling = (type: 'risk' | 'suspicious' | 'clean', isHighlighted: boolean, isSelected: boolean) => {
    if (type === 'risk') {
      return {
        barBg: 'bg-gradient-to-t from-rose-600/95 via-rose-500 to-rose-400 border-t-2 border-x border-rose-300',
        glow: isSelected 
          ? 'shadow-[0_0_25px_rgba(244,63,94,0.95)] ring-2 ring-rose-400' 
          : isHighlighted 
          ? 'shadow-[0_0_18px_rgba(244,63,94,0.7)]' 
          : 'shadow-[0_0_10px_rgba(244,63,94,0.4)]',
        text: 'text-rose-500 dark:text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]',
        topCap: 'bg-rose-200 shadow-[0_0_6px_#ffffff]',
        badgeBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
      };
    }
    if (type === 'suspicious') {
      return {
        barBg: 'bg-gradient-to-t from-amber-600/95 via-amber-500 to-yellow-400 border-t-2 border-x border-amber-300',
        glow: isSelected 
          ? 'shadow-[0_0_25px_rgba(245,158,11,0.95)] ring-2 ring-amber-400' 
          : isHighlighted 
          ? 'shadow-[0_0_18px_rgba(245,158,11,0.7)]' 
          : 'shadow-[0_0_10px_rgba(245,158,11,0.4)]',
        text: 'text-amber-500 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]',
        topCap: 'bg-amber-100 shadow-[0_0_6px_#ffffff]',
        badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      };
    }
    // Clean (Green)
    return {
      barBg: 'bg-gradient-to-t from-emerald-600/95 via-emerald-500 to-teal-400 border-t-2 border-x border-emerald-300',
      glow: isSelected 
        ? 'shadow-[0_0_25px_rgba(16,185,129,0.95)] ring-2 ring-emerald-400' 
        : isHighlighted 
        ? 'shadow-[0_0_18px_rgba(16,185,129,0.7)]' 
        : 'shadow-[0_0_10px_rgba(16,185,129,0.4)]',
      text: 'text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]',
      topCap: 'bg-emerald-100 shadow-[0_0_6px_#ffffff]',
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    };
  };

  // Check if a bar represents the currently selected anomaly
  const checkIsBarSelected = (bar: AnalyticsBarItem) => {
    if (!selectedAnomaly) return false;
    if (bar.anomalyId && bar.anomalyId === selectedAnomaly.id) return true;
    if (bar.shortLabel.toLowerCase() === selectedAnomaly.category.toLowerCase()) return true;
    return false;
  };

  const handleBarClick = (bar: AnalyticsBarItem) => {
    if (!onSelectAnomaly) return;
    if (bar.anomalyId) {
      const match = anomalies.find(a => a.id === bar.anomalyId);
      if (match) {
        onSelectAnomaly(selectedAnomaly?.id === match.id ? null : match);
        return;
      }
    }
    // Try matching category
    const categoryMatch = anomalies.find(a => a.category.toLowerCase().includes(bar.shortLabel.toLowerCase()));
    if (categoryMatch) {
      onSelectAnomaly(selectedAnomaly?.id === categoryMatch.id ? null : categoryMatch);
    }
  };

  return (
    <div 
      id="forensic-analytics-graph-container"
      className="relative w-full rounded-xl bg-[#060c1d] border border-cyan-950/80 shadow-2xl overflow-hidden flex flex-col justify-between select-none"
      style={{
        minHeight: '390px',
        transform: `scale(${zoom})`,
        transformOrigin: 'top center'
      }}
    >
      {/* Cybersecurity Coordinate Grid Background Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Subtle Neon Radial Glows */}
      <div className="absolute -top-10 left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 right-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP FORENSIC HUD TELEMETRY HEADER */}
      <div className="relative z-10 p-3 sm:p-3.5 border-b border-cyan-950/80 bg-slate-950/70 backdrop-blur-sm flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
        
        {/* Left Telemetry Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold uppercase tracking-wider">
            <Scan className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>FORENSIC ANALYSIS</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 uppercase tracking-widest hidden sm:inline">
            ANOMALY SPECTRUM
          </span>
        </div>

        {/* Right Telemetry: Confidence & Coordinate HUD */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-cyan-300">
            <Target className="w-3 h-3 text-cyan-400" />
            <span>CONFIDENCE: <strong className="text-white font-bold">{confidence}%</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-slate-500">
            <span>[X:042 Y:108]</span>
          </div>
        </div>
      </div>

      {/* SUB-HEADER: TWO GROUP LEGEND PILLS */}
      <div className="relative z-10 px-3 pt-2.5 flex items-center justify-between gap-2 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-cyan-400/90 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
          <span>Overall Analysis</span>
        </div>

        <div className="flex items-center gap-1 text-violet-400/90 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#a78bfa]" />
          <span>Forensic Indicators</span>
        </div>
      </div>

      {/* MAIN GRAPH STAGE (VERTICAL BAR CHART WITH 0–100% Y-AXIS) */}
      <div className="relative z-10 flex-1 flex gap-1 sm:gap-2 px-2 sm:px-3 pt-2 pb-1 min-h-[260px]">
        
        {/* Y-Axis Reference Scale (0% to 100%) */}
        <div className="w-7 sm:w-9 shrink-0 flex flex-col justify-between text-[9px] font-mono text-cyan-400/70 text-right pr-1 pb-14 pt-2 select-none">
          <span className="leading-none">100%</span>
          <span className="leading-none">75%</span>
          <span className="leading-none">50%</span>
          <span className="leading-none">25%</span>
          <span className="leading-none font-bold text-cyan-400">0%</span>
        </div>

        {/* Horizontal Background Cyan Grid Lines */}
        <div className="absolute left-9 sm:left-12 right-2 top-4 bottom-16 pointer-events-none z-0 flex flex-col justify-between">
          <div className="w-full border-b border-cyan-500/20 border-dashed" />
          <div className="w-full border-b border-cyan-500/10 border-dashed" />
          <div className="w-full border-b border-cyan-500/15 border-dashed" />
          <div className="w-full border-b border-cyan-500/10 border-dashed" />
          <div className="w-full border-b-2 border-cyan-500/40 shadow-[0_1px_4px_rgba(56,189,248,0.25)]" />
        </div>

        {/* BARS CONTAINER */}
        <div className="flex-1 flex gap-1 sm:gap-2 relative z-10">
          
          {/* ======================================================== */}
          {/* GROUP 1: OVERALL ANALYSIS (3 VERTICAL BARS) */}
          {/* ======================================================== */}
          <div className="w-[36%] sm:w-[37%] flex items-stretch justify-around px-0.5 sm:px-1.5 rounded-lg bg-slate-950/50 border border-cyan-500/15 relative">
            {overallBars.map((bar) => {
              const isHovered = hoveredBarId === bar.id;
              const isSelected = checkIsBarSelected(bar);
              const styling = getBarStyling(bar.type, isHovered, isSelected);
              const targetHeight = isAnimated ? `${bar.value}%` : '0%';

              return (
                <div
                  key={bar.id}
                  id={`analytics-${bar.id}`}
                  onMouseEnter={() => setHoveredBarId(bar.id)}
                  onMouseLeave={() => setHoveredBarId(null)}
                  onClick={() => handleBarClick(bar)}
                  className="flex-1 max-w-[48px] min-w-[24px] mx-0.5 flex flex-col items-center justify-end cursor-pointer group relative"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-30 px-2 py-1 rounded bg-slate-950/95 border border-cyan-400 text-white text-[10px] font-mono shadow-2xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                      <span className="font-bold">{bar.name}: </span>
                      <span className={styling.text}>{bar.value}%</span>
                    </div>
                  )}

                  {/* Percentage Value Above Bar */}
                  <div className="mb-1 text-center transition-transform group-hover:scale-110">
                    <span className={`text-[10px] sm:text-xs font-black font-mono tracking-tight ${styling.text}`}>
                      {bar.value}%
                    </span>
                  </div>

                  {/* Vertical Column Stage (starts at 0% baseline and extends upward) */}
                  <div className="w-full h-[150px] sm:h-[180px] flex items-end justify-center">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ease-out relative ${styling.barBg} ${styling.glow}`}
                      style={{ height: targetHeight }}
                    >
                      {/* Neon Top Edge Cap */}
                      <div className={`absolute top-0 inset-x-0 h-0.5 rounded-t-lg ${styling.topCap}`} />

                      {/* Sheen Gradient */}
                      <div className="absolute inset-0 rounded-t-lg bg-gradient-to-r from-white/15 via-transparent to-black/20 pointer-events-none" />

                      {/* Active Peak Indicator */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff] opacity-75 group-hover:opacity-100" />
                    </div>
                  </div>

                  {/* Label Below Bar */}
                  <div className="h-12 pt-1 text-center flex flex-col items-center justify-start">
                    <span className="text-[9px] sm:text-[10px] font-bold font-mono text-slate-300 group-hover:text-white leading-tight truncate max-w-full">
                      {bar.shortLabel}
                    </span>
                    <span className={`mt-0.5 text-[8px] font-mono px-1 rounded border ${styling.badgeBg} hidden sm:inline-block`}>
                      {bar.type === 'risk' ? 'RISK' : bar.type === 'suspicious' ? 'SUSP' : 'CLEAN'}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* CLEAR VISUAL DIVIDER BETWEEN GROUP 1 AND GROUP 2 */}
          {/* ======================================================== */}
          <div className="w-4 sm:w-5 flex flex-col items-center justify-center shrink-0 relative">
            <div className="h-[180px] sm:h-[220px] w-0.5 border-r border-dashed border-cyan-400/40 relative">
              <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 p-0.5 rounded-full bg-slate-900 border border-cyan-400/60 shadow-[0_0_6px_rgba(56,189,248,0.5)]">
                <Sliders className="w-2 h-2 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* GROUP 2: FORENSIC INDICATORS (5 VERTICAL BARS) */}
          {/* Includes Forensic Bounding Box Highlights (Font, Cross-Field, Layout) */}
          {/* ======================================================== */}
          <div className="flex-1 flex items-stretch justify-around px-0.5 sm:px-1.5 rounded-lg bg-slate-950/50 border border-violet-500/15 relative">
            {indicatorBars.map((bar) => {
              const isHovered = hoveredBarId === bar.id;
              const isSelected = checkIsBarSelected(bar);
              const styling = getBarStyling(bar.type, isHovered, isSelected);
              const targetHeight = isAnimated ? `${bar.value}%` : '0%';

              return (
                <div
                  key={bar.id}
                  id={`analytics-${bar.id}`}
                  onMouseEnter={() => setHoveredBarId(bar.id)}
                  onMouseLeave={() => setHoveredBarId(null)}
                  onClick={() => handleBarClick(bar)}
                  className="flex-1 max-w-[48px] min-w-[22px] mx-0.5 flex flex-col items-center justify-end cursor-pointer group relative"
                >
                  {/* FORENSIC BOUNDING BOX OVERLAY (For Layout 91%, Font 96%, Cross-Field 100%) */}
                  {bar.isAnomalyTarget && (
                    <div 
                      className={`absolute -inset-1 rounded border pointer-events-none transition-all duration-200 z-20 ${
                        isSelected 
                          ? 'border-rose-400 bg-rose-500/20 ring-2 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.7)] animate-pulse'
                          : isHovered
                          ? 'border-rose-400/80 bg-rose-500/10'
                          : 'border-rose-500/50 bg-rose-500/5 hover:border-rose-400'
                      }`}
                    >
                      {/* Bounding Box Forensic Tag (e.g. a-1, a-2, a-4) */}
                      <span className="absolute -top-3.5 left-0 text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-rose-600 text-white shadow-xs leading-tight whitespace-nowrap">
                        {bar.anomalyId || 'ANOMALY'}
                      </span>

                      {/* Reticle Corner Marks */}
                      <span className="absolute -top-0.5 -left-0.5 w-1 h-1 border-t border-l border-white" />
                      <span className="absolute -top-0.5 -right-0.5 w-1 h-1 border-t border-r border-white" />
                      <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 border-b border-l border-white" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-1 h-1 border-b border-r border-white" />
                    </div>
                  )}

                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-30 px-2 py-1 rounded bg-slate-950/95 border border-cyan-400 text-white text-[10px] font-mono shadow-2xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{bar.name}: </span>
                        <span className={styling.text}>{bar.value}%</span>
                      </div>
                      {bar.anomalyId && (
                        <span className="text-[8px] text-rose-400 font-bold block">Tag: {bar.anomalyId} (Click to inspect)</span>
                      )}
                    </div>
                  )}

                  {/* Percentage Value Above Bar */}
                  <div className="mb-1 text-center transition-transform group-hover:scale-110">
                    <span className={`text-[10px] sm:text-xs font-black font-mono tracking-tight ${styling.text}`}>
                      {bar.value}%
                    </span>
                  </div>

                  {/* Vertical Column Stage (starts at 0% baseline and extends upward) */}
                  <div className="w-full h-[150px] sm:h-[180px] flex items-end justify-center">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ease-out relative ${styling.barBg} ${styling.glow}`}
                      style={{ height: targetHeight }}
                    >
                      {/* Neon Top Edge Cap */}
                      <div className={`absolute top-0 inset-x-0 h-0.5 rounded-t-lg ${styling.topCap}`} />

                      {/* Sheen Gradient */}
                      <div className="absolute inset-0 rounded-t-lg bg-gradient-to-r from-white/15 via-transparent to-black/20 pointer-events-none" />

                      {/* Active Peak Indicator */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff] opacity-75 group-hover:opacity-100" />
                    </div>
                  </div>

                  {/* Label Below Bar */}
                  <div className="h-12 pt-1 text-center flex flex-col items-center justify-start">
                    <span className="text-[9px] sm:text-[10px] font-bold font-mono text-slate-300 group-hover:text-white leading-tight truncate max-w-full">
                      {bar.shortLabel}
                    </span>
                    <span className={`mt-0.5 text-[8px] font-mono px-1 rounded border ${styling.badgeBg} hidden sm:inline-block`}>
                      {bar.isAnomalyTarget ? 'FLAG' : bar.type.toUpperCase()}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* PII Zero-Knowledge Redaction Simulation Overlay */}
      {isPiiMasked && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none z-30 p-4">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/50 shadow-2xl flex items-center gap-2.5 text-emerald-400">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div className="text-left font-mono text-xs">
              <p className="font-bold">PII MASKED • ZERO-KNOWLEDGE AUDIT</p>
              <p className="text-[10px] text-slate-400">Document identifiers and account metadata redacted from graph view</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER FORENSIC STATUS BAR */}
      <div className="relative z-10 px-3 py-2 border-t border-cyan-950/80 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.8)]" />
            <span className="text-slate-300">Neon Red: Risks</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
            <span className="text-slate-300">Orange: Suspicious</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
            <span className="text-slate-300">Green: Clean</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-cyan-400 font-bold">
          <Sparkles className="w-3 h-3" />
          <span>FORENSIC SPECTRAL GRAPH</span>
        </div>
      </div>

    </div>
  );
};
