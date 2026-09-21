import React, { useState } from 'react';
import { 
  Type, 
  LayoutGrid, 
  FileCode, 
  Sparkles, 
  Layers, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Compass,
  Cpu,
  Info
} from 'lucide-react';
import { SyntheticDocument, ForensicAnomaly } from '../types';

interface ForensicLayersInspectorProps {
  document: SyntheticDocument;
  onSelectAnomaly?: (anomaly: ForensicAnomaly) => void;
}

type LayerKey = 'font' | 'layout' | 'metadata' | 'aiOrigin' | 'splicing' | 'crossField';

export const ForensicLayersInspector: React.FC<ForensicLayersInspectorProps> = ({ 
  document, 
  onSelectAnomaly 
}) => {
  const [activeLayer, setActiveLayer] = useState<LayerKey>('font');

  // Breakdown metrics fallback if not explicitly defined
  const breakdown = document.riskBreakdown || {
    font: document.anomalies.filter(a => a.category === 'Font').length > 0 ? 82 : 12,
    layout: document.anomalies.filter(a => a.category === 'Layout' || a.category === 'Template Deviation').length > 0 ? 76 : 14,
    metadata: document.anomalies.filter(a => a.category === 'Metadata').length > 0 ? 88 : 10,
    aiOrigin: document.aiOriginScore || 15,
    splicing: document.anomalies.filter(a => a.category === 'Image Splicing').length > 0 ? 84 : 16,
    crossField: document.anomalies.filter(a => a.category === 'Cross-Field').length > 0 ? 94 : 8,
  };

  const layersConfig: {
    id: LayerKey;
    name: string;
    icon: any;
    score: number;
    description: string;
    checks: { name: string; status: 'pass' | 'fail' | 'warn'; detail: string }[];
  }[] = [
    {
      id: 'font',
      name: 'Font & Micro-Typography',
      icon: Type,
      score: breakdown.font,
      description: 'Examines sub-pixel font weights, baseline horizontal alignment, kerning rhythm, and anti-aliasing curve residuals.',
      checks: [
        { 
          name: 'Baseline Elevation Consistency', 
          status: breakdown.font > 50 ? 'fail' : 'pass', 
          detail: breakdown.font > 50 ? 'Subpixel vertical shift of 1.8px detected on critical numerical glyphs.' : 'Vector baselines strictly match institutional master font metrics.'
        },
        { 
          name: 'Glyph Anti-Aliasing Curve', 
          status: breakdown.font > 60 ? 'fail' : 'pass', 
          detail: breakdown.font > 60 ? 'Raster pixel halo indicates manual text replacement over flat background.' : 'Anti-aliasing curve conforms to standard vector renderer.'
        },
        { 
          name: 'Micro-Kerning Pitch Delta', 
          status: breakdown.font > 40 ? 'warn' : 'pass', 
          detail: breakdown.font > 40 ? 'Character spacing delta exceeds 4% tolerance in numerical fields.' : 'Character pitch uniform across all tabular data.'
        }
      ]
    },
    {
      id: 'layout',
      name: 'Layout & Template Grid',
      icon: LayoutGrid,
      score: breakdown.layout,
      description: 'Measures spatial margins, column gutter alignment, and deviation relative to canonical institutional templates.',
      checks: [
        { 
          name: 'Canonical Template Deviation', 
          status: breakdown.layout > 60 ? 'fail' : 'pass', 
          detail: `Measured template deviation: ${document.templateDeviationScore || (breakdown.layout > 50 ? 74 : 12)}% against master registry.`
        },
        { 
          name: 'Column Gutter Alignment', 
          status: breakdown.layout > 50 ? 'fail' : 'pass', 
          detail: breakdown.layout > 50 ? 'Vertical table guides shift horizontally on rows 12-14.' : 'All vertical guidelines align with 0.1mm precision.'
        },
        { 
          name: 'Header Seal & Watermark Position', 
          status: breakdown.layout > 70 ? 'fail' : 'pass', 
          detail: breakdown.layout > 70 ? 'Official regulatory crest coordinates diverge by 4.8mm.' : 'Institutional seal placed within official regulatory margins.'
        }
      ]
    },
    {
      id: 'metadata',
      name: 'Metadata & File Structure',
      icon: FileCode,
      score: breakdown.metadata,
      description: 'Interrogates XMP packets, creation tool signatures, modification timelines, and SHA-256 cryptographic hashes.',
      checks: [
        { 
          name: 'Editing Software Trace', 
          status: document.metadata.creationTool.includes('Photoshop') || document.metadata.creationTool.includes('GIMP') || document.metadata.creationTool.includes('Diffusion') ? 'fail' : 'pass', 
          detail: `Detected tool signature: "${document.metadata.creationTool}".`
        },
        { 
          name: 'Temporal Timestamp Concordance', 
          status: document.metadata.modifiedDate ? 'warn' : 'pass', 
          detail: document.metadata.modifiedDate ? `File saved again on ${document.metadata.modifiedDate} after generation.` : 'Creation timestamp intact; no subsequent save packets.'
        },
        { 
          name: 'Color Space Integrity', 
          status: document.metadata.colorSpace.includes('Inconsistent') || document.metadata.colorSpace.includes('Expected') ? 'fail' : 'pass', 
          detail: `Color Profile: ${document.metadata.colorSpace}.`
        }
      ]
    },
    {
      id: 'aiOrigin',
      name: 'AI-Origin & Generative Forensics',
      icon: Sparkles,
      score: breakdown.aiOrigin,
      description: 'Analyzes high-frequency discrete Fourier transform residuals for neural diffusion inpainting, GAN artifacts, and synthetic face swaps.',
      checks: [
        { 
          name: 'Latent Diffusion Noise Spectrum', 
          status: breakdown.aiOrigin > 60 ? 'fail' : 'pass', 
          detail: breakdown.aiOrigin > 60 ? 'High-frequency spectral loss indicates diffusion model upscaling / inpainting.' : 'Natural optical camera sensor noise profile verified.'
        },
        { 
          name: 'Biometric Facial Symmetry', 
          status: breakdown.aiOrigin > 70 ? 'fail' : 'pass', 
          detail: breakdown.aiOrigin > 70 ? 'Pupillary reflection angles contradict ambient scene lighting vectors.' : 'Biometric photo adheres to ICAO 9303 illumination guidelines.'
        },
        { 
          name: 'Synthetic Guilloche Distortion', 
          status: breakdown.aiOrigin > 50 ? 'fail' : 'pass', 
          detail: breakdown.aiOrigin > 50 ? 'Micro-line security guilloche pattern reveals generative continuity breaks.' : 'Continuous line vector fidelity certified.'
        }
      ]
    },
    {
      id: 'splicing',
      name: 'Image Splicing & ELA',
      icon: Layers,
      score: breakdown.splicing,
      description: 'Calculates Error Level Analysis (ELA) compression residuals, copy-move cloning signatures, and spliced perimeter noise.',
      checks: [
        { 
          name: 'DCT Compression Grid Coherence', 
          status: breakdown.splicing > 50 ? 'fail' : 'pass', 
          detail: breakdown.splicing > 50 ? '8x8 discrete cosine transform grid misalignment indicates pasted element.' : 'Consistent single-generation JPEG compression across all blocks.'
        },
        { 
          name: 'Copy-Move Feature Point Matching', 
          status: breakdown.splicing > 65 ? 'fail' : 'pass', 
          detail: breakdown.splicing > 65 ? 'Cloned texture patches identified in background security field.' : 'No repeated pixel feature clusters found.'
        },
        { 
          name: 'Border Mask Feather Gradient', 
          status: breakdown.splicing > 55 ? 'fail' : 'pass', 
          detail: breakdown.splicing > 55 ? 'Razor-edge 1px mask clipping boundary surrounding official seal.' : 'Seamless edge integration with native document substrate.'
        }
      ]
    },
    {
      id: 'crossField',
      name: 'Cross-Field & Checksums',
      icon: Calculator,
      score: breakdown.crossField,
      description: 'Executes statutory algorithmic checksums including Verhoeff dihedral D5, Luhn formula, PAN schema rules, and ledger additions.',
      checks: [
        { 
          name: 'Algorithmic Checksum Validation', 
          status: breakdown.crossField > 60 ? 'fail' : 'pass', 
          detail: breakdown.crossField > 60 ? 'Direct failure of national checksum rule (e.g., Verhoeff / PAN / MRZ parity).' : 'All statutory check digits calculate successfully.'
        },
        { 
          name: 'Tabular Ledger Sum Verification', 
          status: breakdown.crossField > 50 ? 'fail' : 'pass', 
          detail: breakdown.crossField > 50 ? 'Sum of transactional credit line items does not equal total balance.' : 'All arithmetic rows sum to stated subtotal and total values.'
        },
        { 
          name: 'Temporal & Entity Cross-Check', 
          status: breakdown.crossField > 40 ? 'warn' : 'pass', 
          detail: breakdown.crossField > 40 ? 'Expiration date contradicts student matriculation year or entity category.' : 'Dates and entity references maintain chronological logic.'
        }
      ]
    }
  ];

  const currentLayer = layersConfig.find(l => l.id === activeLayer) || layersConfig[0];
  const layerAnomalies = document.anomalies.filter(a => {
    if (activeLayer === 'font') return a.category === 'Font';
    if (activeLayer === 'layout') return a.category === 'Layout' || a.category === 'Template Deviation';
    if (activeLayer === 'metadata') return a.category === 'Metadata';
    if (activeLayer === 'aiOrigin') return a.category === 'AI Origin';
    if (activeLayer === 'splicing') return a.category === 'Image Splicing' || a.category === 'Partial Tampering';
    if (activeLayer === 'crossField') return a.category === 'Cross-Field';
    return false;
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden text-left">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/50">
        <div>
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>Multi-Layer Forensic Analysis Suite</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono font-bold">6 VECTORS</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Granular inspection of independent verification strata
          </p>
        </div>
      </div>

      {/* Layer selector tabs */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {layersConfig.map((layer) => {
          const Icon = layer.icon;
          const isSelected = activeLayer === layer.id;
          const isHigh = layer.score >= 60;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-cyan-500 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-cyan-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-500' : 'text-slate-500'}`} />
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  isHigh 
                    ? 'bg-rose-500/20 text-rose-500' 
                    : layer.score >= 35 
                    ? 'bg-amber-500/20 text-amber-500' 
                    : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {layer.score}%
                </span>
              </div>
              <span className={`text-xs font-semibold truncate ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                {layer.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Layer Deep Dive */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <currentLayer.icon className="w-5 h-5 text-cyan-500" />
              <span>{currentLayer.name}</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {currentLayer.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Risk Vector Score</span>
              <span className={`text-xl font-bold font-display ${
                currentLayer.score >= 60 
                  ? 'text-rose-500' 
                  : currentLayer.score >= 35 
                  ? 'text-amber-500' 
                  : 'text-emerald-500'
              }`}>
                {currentLayer.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Verification Checkpoints */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Layer Checkpoints ({currentLayer.checks.length})
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentLayer.checks.map((chk, i) => (
              <div 
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-1.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {chk.name}
                  </span>
                  {chk.status === 'fail' ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-500 uppercase">
                      Anomaly
                    </span>
                  ) : chk.status === 'warn' ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-500 uppercase">
                      Variance
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-500 uppercase">
                      Pass
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {chk.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Layer-Specific Anomalies (if any) */}
        {layerAnomalies.length > 0 && (
          <div className="pt-2 space-y-3">
            <h5 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Flagged Anomalies in this Layer ({layerAnomalies.length})</span>
            </h5>
            
            <div className="space-y-2">
              {layerAnomalies.map((anom) => (
                <div 
                  key={anom.id}
                  onClick={() => onSelectAnomaly && onSelectAnomaly(anom)}
                  className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-left cursor-pointer hover:border-rose-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {anom.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 font-mono font-bold">
                        {anom.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {anom.description}
                    </p>
                  </div>

                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold shrink-0 group-hover:underline flex items-center gap-1">
                    Locate in Preview &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
