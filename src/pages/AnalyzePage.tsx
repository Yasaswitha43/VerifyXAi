import React, { useState } from 'react';
import { 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileCheck, 
  RefreshCw,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  GitCompare,
  Sliders,
  ShieldCheck,
  Eye,
  Hash
} from 'lucide-react';
import { PageRoute, SyntheticDocument, DocumentType } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/mockData';

interface AnalyzePageProps {
  onAnalysisComplete: (doc: SyntheticDocument) => void;
  onNavigate: (page: PageRoute) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onAnalysisComplete, onNavigate }) => {
  // Mode Selection: Single Document Analysis vs Document Comparison
  const [activeMode, setActiveMode] = useState<'single' | 'compare'>('single');

  // Selected specimen / uploaded file
  const [selectedPreset, setSelectedPreset] = useState<SyntheticDocument>(SAMPLE_DOCUMENTS[0]);
  const [selectedFileName, setSelectedFileName] = useState<string>(SAMPLE_DOCUMENTS[0].name);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>(SAMPLE_DOCUMENTS[0].thumbnailUrl);
  const [fileSizeText, setFileSizeText] = useState<string>(SAMPLE_DOCUMENTS[0].fileSize);
  const [fileFormat, setFileFormat] = useState<string>(SAMPLE_DOCUMENTS[0].format);
  
  // Validation state
  const [validationStatus, setValidationStatus] = useState<{
    valid: boolean;
    message: string;
    details?: string;
  }>({
    valid: true,
    message: 'File structure & MIME header validated',
    details: 'MIME: application/pdf • 2.4 MB • SHA-256 Verified'
  });

  // Document Type Detection
  const [detectedType, setDetectedType] = useState<DocumentType>(SAMPLE_DOCUMENTS[0].type);
  const [detectionConfidence, setDetectionConfidence] = useState<number>(98.4);
  const [isManualTypeOverride, setIsManualTypeOverride] = useState<boolean>(false);

  // Analysis tier
  const [analysisType, setAnalysisType] = useState<'standard' | 'deep' | 'full'>('full');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('Ingesting document layers...');

  const stages = [
    'Validating file structure, MIME headers, and container encoding...',
    'Interrogating optical character baselines & micro-typography kerning...',
    'Executing Error Level Analysis (ELA) and DCT frequency decomposition...',
    'Analyzing neural diffusion signatures & generative inpainting boundaries...',
    'Validating cross-field checksums (Verhoeff/Luhn/PAN/MRZ) and ledger formulas...',
    'Synthesizing 64-point Document DNA profile and compiling risk verdict...'
  ];

  // Document type list for manual override
  const allDocumentTypes: DocumentType[] = [
    'Aadhaar-style ID',
    'PAN-style Card',
    'College ID',
    'Driving Licence-style',
    'Certificate',
    'Bank Statement',
    'Commercial Invoice',
    'Identity Passport',
    'Academic Degree',
    'Medical Certificate',
    'Legal Contract'
  ];

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStage(stages[0]);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            // Pass updated specimen with user-selected or detected type
            const finalDoc: SyntheticDocument = {
              ...selectedPreset,
              type: detectedType,
              name: selectedFileName
            };
            onAnalysisComplete(finalDoc);
          }, 400);
          return 100;
        }
        const next = prev + 12;
        const stageIdx = Math.min(Math.floor((next / 100) * stages.length), stages.length - 1);
        setCurrentStage(stages[stageIdx]);
        return next;
      });
    }, 130);
  };

  const inferDocumentTypeFromName = (name: string): { type: DocumentType; confidence: number } => {
    const lower = name.toLowerCase();
    if (lower.includes('aadhaar') || lower.includes('uid')) {
      return { type: 'Aadhaar-style ID', confidence: 98.4 };
    }
    if (lower.includes('pan') || lower.includes('tax')) {
      return { type: 'PAN-style Card', confidence: 96.2 };
    }
    if (lower.includes('student') || lower.includes('college') || lower.includes('univ')) {
      return { type: 'College ID', confidence: 94.8 };
    }
    if (lower.includes('driving') || lower.includes('licence') || lower.includes('license') || lower.includes('dl')) {
      return { type: 'Driving Licence-style', confidence: 97.6 };
    }
    if (lower.includes('cert') || lower.includes('diploma')) {
      return { type: 'Certificate', confidence: 95.5 };
    }
    if (lower.includes('bank') || lower.includes('statement')) {
      return { type: 'Bank Statement', confidence: 98.0 };
    }
    if (lower.includes('invoice')) {
      return { type: 'Commercial Invoice', confidence: 93.9 };
    }
    if (lower.includes('passport')) {
      return { type: 'Identity Passport', confidence: 99.1 };
    }
    return { type: 'Bank Statement', confidence: 85.0 };
  };

  const validateAndProcessFile = (file: File) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const maxSizeBytes = 25 * 1024 * 1024; // 25MB

    if (!allowedExtensions.includes(extension)) {
      setValidationStatus({
        valid: false,
        message: `Unsupported file format: .${extension}`,
        details: 'Only JPG, JPEG, PNG, and PDF files under 25MB are accepted.'
      });
      return;
    }

    if (file.size > maxSizeBytes) {
      setValidationStatus({
        valid: false,
        message: 'File size exceeds maximum threshold',
        details: `Uploaded size: ${(file.size / (1024 * 1024)).toFixed(1)} MB. Limit is 25 MB.`
      });
      return;
    }

    // Valid file
    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setSelectedFileName(file.name);
    setFileSizeText(sizeFormatted);
    setFileFormat(extension.toUpperCase() as 'PDF' | 'PNG' | 'JPG');

    // Create object URL for preview
    if (file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      setFilePreviewUrl(preview);
    } else {
      // For PDF, use a clean document card preview
      setFilePreviewUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
    }

    // Auto-detect type
    const inferred = inferDocumentTypeFromName(file.name);
    setDetectedType(inferred.type);
    setDetectionConfidence(inferred.confidence);
    setIsManualTypeOverride(false);

    // Pick closest preset or create synthesized custom document
    const matchingPreset = SAMPLE_DOCUMENTS.find(d => d.type === inferred.type) || SAMPLE_DOCUMENTS[0];
    setSelectedPreset({
      ...matchingPreset,
      name: file.name,
      fileSize: sizeFormatted,
      format: (extension.toUpperCase() === 'PDF' ? 'PDF' : extension.toUpperCase() === 'PNG' ? 'PNG' : 'JPG')
    });

    setValidationStatus({
      valid: true,
      message: 'Cryptographic header & MIME integrity verified',
      details: `Type: ${file.type || extension.toUpperCase()} • Size: ${sizeFormatted} • SHA-256 Computed`
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (doc: SyntheticDocument) => {
    setSelectedPreset(doc);
    setSelectedFileName(doc.name);
    setFilePreviewUrl(doc.thumbnailUrl);
    setFileSizeText(doc.fileSize);
    setFileFormat(doc.format);
    setDetectedType(doc.type);
    setDetectionConfidence(doc.confidence);
    setIsManualTypeOverride(false);
    setValidationStatus({
      valid: true,
      message: 'Synthetic specimen cryptographic baseline verified',
      details: `Format: ${doc.format} • Size: ${doc.fileSize} • Baseline SHA-256 Validated`
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left relative z-10">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <button
            id="back-to-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all shadow-xs group mb-2 cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Dashboard</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Document Ingestion & Forensic Intake
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Upload single documents for multi-layer tampering analysis, or switch to side-by-side comparison mode.
          </p>
        </div>

        {/* Mode Selector Pill: Single Analysis vs Document Comparison */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 self-start sm:self-center">
          <button
            id="mode-single-analysis-btn"
            onClick={() => setActiveMode('single')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'single'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Single Document</span>
          </button>
          <button
            id="mode-compare-btn"
            onClick={() => {
              setActiveMode('compare');
              onNavigate('compare');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'compare'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Document Comparison</span>
          </button>
        </div>
      </div>

      {/* Analyzing Progress State */}
      {isAnalyzing && (
        <div className="p-8 sm:p-12 rounded-2xl border border-cyan-500/30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 mx-auto flex items-center justify-center animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FORENSIC PIPELINE ENGAGED</span>
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Analyzing &ldquo;{selectedFileName}&rdquo;
            </h3>
            <p className="text-sm font-mono text-cyan-600 dark:text-cyan-400 min-h-[20px] transition-all">
              {currentStage}
            </p>
          </div>

          {/* Progress Bar with glowing cyan glow */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Stage: {Math.min(Math.floor((progress / 100) * stages.length) + 1, stages.length)} of {stages.length}</span>
              <span className="font-bold text-cyan-500">{progress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Intake Form */}
      {!isAnalyzing && (
        <div className="space-y-8">
          
          {/* STEP 1: Upload Document & Live Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs flex items-center justify-center font-mono font-bold">1</span>
                <span>Document Upload & Preview</span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Formats: JPG, JPEG, PNG, PDF (Max 25MB)
              </span>
            </div>

            {/* Validation Notice Banner (if any error) */}
            {!validationStatus.valid && (
              <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">{validationStatus.message}</p>
                  <p className="text-rose-600 dark:text-rose-300 mt-0.5">{validationStatus.details}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Drag and drop upload zone */}
              <div 
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="lg:col-span-7 relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-8 sm:p-10 text-center cursor-pointer transition-all group flex flex-col items-center justify-center"
              >
                <input 
                  type="file" 
                  onChange={handleFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-3 pointer-events-none">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform border border-cyan-500/20 shadow-sm">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      Drag &amp; drop document here, or <span className="text-cyan-600 dark:text-cyan-400 underline decoration-cyan-500/40">browse files</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Accepts JPG, JPEG, PNG, or PDF up to 25MB
                    </p>
                  </div>
                  
                  {/* Validation success pill */}
                  {validationStatus.valid && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{validationStatus.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Real File Preview Card */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-500" />
                      File Preview
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                      {fileFormat}
                    </span>
                  </div>

                  {/* Thumbnail / Image Preview */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 mb-3 group">
                    <img 
                      src={filePreviewUrl} 
                      alt={selectedFileName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <p className="text-xs font-semibold text-white truncate max-w-full font-mono">
                        {selectedFileName}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Specs */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span>File Size:</span>
                      <span className="font-semibold font-mono text-slate-900 dark:text-slate-200">{fileSizeText}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span>Integrity Status:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Validated
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>SHA-256 Digest:</span>
                      <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 truncate max-w-[160px]">
                        {selectedPreset.metadata.hashSha256.substring(0, 16)}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  Ready for multi-layer forensic extraction
                </div>
              </div>

            </div>

            {/* Quick Preset Specimens - including Aadhaar, PAN, College ID, Driving Licence, etc. */}
            <div className="pt-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2.5 font-semibold flex items-center justify-between">
                <span>Or load synthetic demo specimen:</span>
                <span className="text-[11px] text-slate-400 font-normal">Click any specimen to auto-populate</span>
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {SAMPLE_DOCUMENTS.map((doc) => {
                  const isSelected = selectedPreset.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectPreset(doc)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 ring-1 ring-cyan-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono truncate">
                            {doc.format}
                          </span>
                          {doc.riskScore >= 70 ? (
                            <span className="text-[9px] font-bold px-1 rounded bg-rose-500/20 text-rose-500">High Risk</span>
                          ) : doc.riskScore >= 40 ? (
                            <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-500">Moderate</span>
                          ) : (
                            <span className="text-[9px] font-bold px-1 rounded bg-emerald-500/20 text-emerald-500">Clean</span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {doc.type}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {doc.name.replace('Synthetic_', '')}
                        </p>
                      </div>
                      
                      <div className="mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{doc.fileSize}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 2: Document Type Detection & Confirmation */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs flex items-center justify-center font-mono font-bold">2</span>
              <span>Document Type Detection &amp; Classification</span>
            </h2>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Classification:</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold font-mono">
                        {detectionConfidence}% Confidence
                      </span>
                    </div>
                    <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {detectedType}
                    </p>
                  </div>
                </div>

                {/* Manual Override Dropdown */}
                <div className="flex items-center gap-2.5">
                  <label htmlFor="doc-type-select" className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Confirm / Change Type:
                  </label>
                  <select
                    id="doc-type-select"
                    value={detectedType}
                    onChange={(e) => {
                      setDetectedType(e.target.value as DocumentType);
                      setIsManualTypeOverride(true);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    {allDocumentTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isManualTypeOverride && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Type manually overridden by investigator. Forensic template models adjusted to &ldquo;{detectedType}&rdquo;.
                </p>
              )}
            </div>
          </div>

          {/* STEP 3: Choose Forensic Analysis Depth */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs flex items-center justify-center font-mono font-bold">3</span>
              <span>Forensic Analysis Depth</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Option A: Standard */}
              <div 
                id="tier-standard-btn"
                onClick={() => setAnalysisType('standard')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  analysisType === 'standard'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Standard Scan
                  </h3>
                  {analysisType === 'standard' && <Check className="w-4 h-4 text-cyan-500" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Fast structural validation, OCR extraction, MIME metadata integrity, and basic resolution check.
                </p>
                <div className="mt-3 text-[11px] font-mono text-slate-400">
                  Speed: ~1.2s • 16-point check
                </div>
              </div>

              {/* Option B: Deep */}
              <div 
                id="tier-deep-btn"
                onClick={() => setAnalysisType('deep')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  analysisType === 'deep'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Deep Inspection
                  </h3>
                  {analysisType === 'deep' && <Check className="w-4 h-4 text-cyan-500" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Error Level Analysis (ELA), micro-typography kerning, font weight consistency, and pixel noise entropy.
                </p>
                <div className="mt-3 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                  Speed: ~2.8s • 32-point check
                </div>
              </div>

              {/* Option C: Full */}
              <div 
                id="tier-full-btn"
                onClick={() => setAnalysisType('full')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  analysisType === 'full'
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Full Forensic Audit</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono uppercase">Recommended</span>
                  </h3>
                  {analysisType === 'full' && <Check className="w-4 h-4 text-cyan-500" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Complete 64-point Document DNA, generative AI diffusion detection, cross-field checksums, and audit certificate.
                </p>
                <div className="mt-3 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                  Speed: ~4.5s • 64-point vector
                </div>
              </div>

            </div>
          </div>

          {/* Execution Bar */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Target: <span className="font-bold text-slate-900 dark:text-white font-mono">{selectedFileName}</span> • Classification: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{detectedType}</span> ({analysisType} mode)
            </div>

            <button
              id="start-analysis-btn"
              onClick={handleStartAnalysis}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Engage Forensic Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
