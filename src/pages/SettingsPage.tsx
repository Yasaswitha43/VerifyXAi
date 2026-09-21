import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Sun, 
  Moon, 
  Bot, 
  Eye, 
  Shield, 
  Database, 
  Key, 
  Check, 
  Save,
  Lock,
  Volume2,
  Globe
} from 'lucide-react';
import { PageRoute } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SUPPORTED_LANGUAGES } from '../data/mockData';

interface SettingsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { theme, setTheme, toggleTheme } = useTheme();

  // Profile Settings
  const [name, setName] = useState('Dr. Elena Rostova');
  const [email, setEmail] = useState('elena.rostova@forensics.verifyx.ai');
  const [organization, setOrganization] = useState('Global Document Integrity Lab');
  const [language, setLanguage] = useState<string>(() => {
    try {
      const savedLang = localStorage.getItem('verifyx_language');
      if (savedLang) return savedLang;
      const stored = localStorage.getItem('verifyx_auth_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language) return parsed.language;
      }
    } catch (e) {}
    return 'en';
  });

  // AI Assistant Settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [assistantTone, setAssistantTone] = useState<'concise' | 'detailed'>('concise');

  // Privacy Settings
  const [zeroRetention, setZeroRetention] = useState(true);
  const [telemetry, setTelemetry] = useState(false);

  // Security Settings
  const [twoFactor, setTwoFactor] = useState(true);
  const [apiKey, setApiKey] = useState('vx_live_99a8b1c4e2074f769018e');
  const [keyRegenerated, setKeyRegenerated] = useState(false);

  // Data Retention Settings
  const [retentionPeriod, setRetentionPeriod] = useState<'ephemeral' | '24h' | '30d'>('ephemeral');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    try {
      localStorage.setItem('verifyx_language', language);
      const stored = localStorage.getItem('verifyx_auth_session');
      if (stored) {
        const user = JSON.parse(stored);
        user.name = name;
        user.email = email;
        user.organization = organization;
        user.language = language;
        localStorage.setItem('verifyx_auth_session', JSON.stringify(user));
      }
    } catch (e) {
      console.error('Error saving settings session', e);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* TOP-LEFT Navigation: Back to Dashboard */}
      <div>
        <button
          id="back-to-dashboard-btn"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all shadow-xs group"
          title="Return to Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your account preferences, system appearance, AI behavior, and data retention policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      <div className="space-y-6">
        
        {/* SECTION 1: Profile */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Organization / Laboratory
              </label>
              <input
                type="text"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-500" />
                <span>Language Option</span>
              </label>
              <div className="relative">
                <select
                  id="settings-profile-language-select"
                  value={language}
                  onChange={e => {
                    const newLang = e.target.value;
                    setLanguage(newLang);
                    try {
                      localStorage.setItem('verifyx_language', newLang);
                    } catch (err) {}
                  }}
                  className="w-full p-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-1">
                      {lang.flag} {lang.name} — {lang.nativeName} ({lang.region})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Select your preferred language for forensic investigation explanations, reports, and interface displays.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Appearance */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Appearance
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Interface Theme</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between high-contrast dark mode and refined light mode. Dark mode is default.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: AI Assistant */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              AI Assistant
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">"Ask VerifyX" Voice Assistant</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enable interactive speech responses when reviewing forensic findings.
                </p>
              </div>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  voiceEnabled ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  voiceEnabled ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Explanation Style</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select concise executive summaries or detailed technical reports.
                </p>
              </div>
              <select
                value={assistantTone}
                onChange={e => setAssistantTone(e.target.value as any)}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
              >
                <option value="concise">Concise Executive</option>
                <option value="detailed">In-Depth Technical</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: Privacy */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Privacy
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Zero-Knowledge Processing</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Documents are analyzed entirely in volatile memory and never saved to permanent disk storage.
                </p>
              </div>
              <button
                onClick={() => setZeroRetention(!zeroRetention)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  zeroRetention ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  zeroRetention ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Anonymous Telemetry</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Send anonymized performance metrics to improve detection algorithms.
                </p>
              </div>
              <button
                onClick={() => setTelemetry(!telemetry)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  telemetry ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  telemetry ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: Security */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Security
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Require hardware security keys or authenticator code on login.
                </p>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  twoFactor ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  twoFactor ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                API Key (For Python + FastAPI Backend Integration)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  readOnly
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
                <button
                  onClick={() => {
                    const newKey = 'vx_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
                    setApiKey(newKey);
                    setKeyRegenerated(true);
                    setTimeout(() => setKeyRegenerated(false), 2500);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
                >
                  {keyRegenerated ? 'Regenerated!' : 'Regenerate'}
                </button>
              </div>
              {keyRegenerated && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  ✓ Fresh API key generated and stored securely.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 6: Data Retention */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Data Retention
            </h2>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Specimen Retention Policy</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'ephemeral', label: 'Ephemeral', desc: 'Purge instantly upon session completion' },
                { id: '24h', label: '24 Hours', desc: 'Auto-wipe after 24 hours of inactivity' },
                { id: '30d', label: '30 Days', desc: 'Retain for compliance auditing period' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setRetentionPeriod(opt.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    retentionPeriod === opt.id
                      ? 'border-cyan-500 bg-cyan-50/30 dark:bg-cyan-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
