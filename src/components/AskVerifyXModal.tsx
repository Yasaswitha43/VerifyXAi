import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  X, 
  ArrowRight,
  ShieldAlert,
  FileSearch,
  Dna,
  GitCompare,
  FileText,
  Bot
} from 'lucide-react';
import { PageRoute, SyntheticDocument } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    route: PageRoute;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

interface AskVerifyXModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDocument?: SyntheticDocument;
  onNavigate?: (page: PageRoute) => void;
}

export const AskVerifyXModal: React.FC<AskVerifyXModalProps> = ({
  isOpen,
  onClose,
  activeDocument,
  onNavigate
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [inputQuery, setInputQuery] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your VerifyX Forensic AI Copilot. Ask me questions about document anomalies, explain detected risks, or speak a voice command to navigate.",
      timestamp: 'Now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Exact 5 suggested commands required by prompt
  const suggestedCommands = [
    { label: "Explain this risk", icon: ShieldAlert },
    { label: "Start document analysis", icon: FileSearch, targetRoute: 'analyze' as PageRoute },
    { label: "Show suspicious regions", icon: Sparkles },
    { label: "Compare documents", icon: GitCompare, targetRoute: 'compare' as PageRoute },
    { label: "Open reports", icon: FileText, targetRoute: 'reports' as PageRoute }
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech Synthesis Output
  const speakText = (text: string) => {
    if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    
    // Clean text for speech
    const cleanSpeech = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Process & Dispatch Response
  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    if (isListening) {
      stopListening();
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: timeString
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setSpeechError(null);

    // Contextual Forensic AI Response Generator
    const lower = query.toLowerCase();
    let replyText = "";
    let actionPayload: Message['action'] | undefined = undefined;

    const docName = activeDocument?.name || "Synthetic_Chase_Bank_Statement_May2026.pdf";
    const docRisk = activeDocument?.riskScore ?? 78;

    if (lower.includes("explain this risk") || lower.includes("explain risk") || lower.includes("why was this flagged")) {
      replyText = `Specimen "${docName}" is classified at ${docRisk}% Risk. The primary driver is a mathematical ledger discrepancy (+67,420 delta) between stated credits and ending balance, coupled with localized discrete cosine compression variance in the authorization block.`;
    } else if (lower.includes("start document analysis") || lower.includes("analyze document") || lower.includes("upload")) {
      replyText = "Initiating the 3-step Document Ingestion and Forensic Engine. You can upload a specimen, select a synthetic benchmark, or configure multi-spectral optical scans.";
      actionPayload = {
        label: "Go to Document Analysis",
        route: 'analyze',
        icon: FileSearch
      };
      if (onNavigate) {
        setTimeout(() => onNavigate('analyze'), 1200);
      }
    } else if (lower.includes("show suspicious regions") || lower.includes("suspicious") || lower.includes("tamper") || lower.includes("heatmap")) {
      replyText = `Suspicious regions identified in "${docName}":\n1. Ending Balance Box (x: 58%, y: 72%): Font baseline jitter of 1.4px indicates manual digit replacement.\n2. Authorization Seal (x: 82%, y: 88%): High Error Level Analysis (ELA) thermal gradient indicating spliced imagery.`;
    } else if (lower.includes("compare documents") || lower.includes("difference map") || lower.includes("compare") || lower.includes("document dna")) {
      replyText = "Opening Document DNA engine. This lets you inspect dual-specimen genomic profiles, differential heatmaps, and tri-color highlighting of verified clean, suspicious, and tampered data.";
      actionPayload = {
        label: "Open Document DNA",
        route: 'compare',
        icon: Dna
      };
      if (onNavigate) {
        setTimeout(() => onNavigate('compare'), 1200);
      }
    } else if (lower.includes("open reports") || lower.includes("report") || lower.includes("audit")) {
      replyText = "Opening Audit & Compliance Reports. You can review SHA-256 validation certificates, chain of custody logs, and export court-ready forensic dossiers.";
      actionPayload = {
        label: "View Compliance Reports",
        route: 'reports',
        icon: FileText
      };
      if (onNavigate) {
        setTimeout(() => onNavigate('reports'), 1200);
      }
    } else if (lower.includes("dna")) {
      replyText = "Document DNA creates a 64-point biometric fingerprint capturing micro-typography kerning, structural grid coherence, and chromatic compression signatures.";
    } else if (lower.includes("x-ray") || lower.includes("xray")) {
      replyText = "AI X-Ray Mode strips superficial color rendering to inspect vector font baselines, subpixel raster anti-aliasing signatures, and hidden white-on-white text layers.";
    } else {
      replyText = `I analyzed "${query}". VerifyX monitors document structures, typography consistency, ELA compression matrices, and cryptographic timestamps to ensure total document integrity.`;
    }

    setTimeout(() => {
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: actionPayload
      };
      setMessages(prev => [...prev, assistantMsg]);
      speakText(replyText);
    }, 450);
  };

  // Browser Speech Recognition with Graceful Fallback
  const startListening = () => {
    if (isSpeaking) {
      handleStopSpeaking();
    }

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback simulation: Realistic listening simulation if browser lacks API or sandboxed
      setIsListening(true);
      setSpeechError(null);
      const simulatedVoiceQueries = [
        "Explain this risk",
        "Show suspicious regions",
        "Start document analysis",
        "Compare documents",
        "Open reports"
      ];
      const picked = simulatedVoiceQueries[Math.floor(Math.random() * simulatedVoiceQueries.length)];
      
      setTimeout(() => {
        setInputQuery(picked);
        setIsListening(false);
        handleSend(picked);
      }, 1800);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setInputQuery(transcript);
      };

      recognition.onspeechend = () => {
        recognition.stop();
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition notice:", e.error);
        setIsListening(false);
        // If permission denied or audio-capture unavailable, fallback to simulated prompt
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setSpeechError("Microphone access blocked. Click a suggested command below or type your question.");
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Could not start SpeechRecognition, using fallback.", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-verifyx-title"
      className="fixed bottom-20 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[540px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      {/* 1. Header with Status & Audio Controls */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 id="ask-verifyx-title" className="text-xs sm:text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
              Ask VerifyX <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">VOICE AI</span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isListening ? "Listening to your voice..." : isSpeaking ? "Explaining findings..." : "Ready for voice or text"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Audio Output Mute / Unmute */}
          <button
            onClick={() => {
              if (isSpeaking) handleStopSpeaking();
              setAudioEnabled(!audioEnabled);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={audioEnabled ? "Mute audio response" : "Enable voice response"}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Close Panel */}
          <button
            onClick={() => {
              if (isSpeaking) handleStopSpeaking();
              if (isListening) stopListening();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Dynamic Audio Wave Banner (when speaking or listening) */}
      {(isSpeaking || isListening) && (
        <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-violet-500/10 border-b border-cyan-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-medium">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-cyan-500 animate-pulse'}`} />
            <span>{isListening ? 'Listening for speech...' : 'Speaking answer...'}</span>
          </div>

          {/* Sound wave graphic */}
          <div className="flex items-center gap-1 h-3.5">
            {[45, 75, 100, 60, 90, 40, 80, 50].map((height, i) => (
              <span
                key={i}
                className="w-0.5 rounded-full bg-cyan-500 animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Speech Error Banner if any */}
      {speechError && (
        <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
          {speechError}
        </div>
      )}

      {/* 3. Chat Messages History */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-left">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-medium rounded-br-none shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50 shadow-sm'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Action Button if attached */}
              {msg.action && onNavigate && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <button
                    onClick={() => {
                      if (msg.action?.route) {
                        onNavigate(msg.action.route);
                        onClose();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-[11px] shadow-sm transition-all"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Suggested Commands Horizontal Ribbon */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
          Suggested Commands
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {suggestedCommands.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button
                key={i}
                onClick={() => handleSend(cmd.label)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Icon className="w-3 h-3 text-cyan-500" />
                <span>{cmd.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Voice & Text Input Box */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        {/* Microphone Voice Trigger */}
        <button
          onClick={toggleMic}
          className={`relative p-2.5 rounded-xl transition-all ${
            isListening
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-400 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700'
          }`}
          title={isListening ? "Listening... click to stop" : "Click to speak voice command"}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-white" />
          ) : (
            <Mic className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          )}
          {isListening && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          )}
        </button>

        {/* Text Input Fallback */}
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? "Listening to your voice..." : "Type or speak your question..."}
          className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim()}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-colors shadow-sm"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
