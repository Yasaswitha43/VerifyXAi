import React, { useState, useEffect } from 'react';
import { PageRoute, SyntheticDocument, UserProfile } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { AskVerifyXModal } from './components/AskVerifyXModal';
import { AnimatedSecurityBackground } from './components/AnimatedSecurityBackground';
import { initCursorInteractions } from './utils/cursorInteractions';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultsPage } from './pages/ResultsPage';
import { ComparePage } from './pages/ComparePage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SAMPLE_DOCUMENTS, CURRENT_USER } from './data/mockData';
import { Mic } from 'lucide-react';

const AUTH_STORAGE_KEY = 'verifyx_auth_session';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('landing');
  const [selectedDocument, setSelectedDocument] = useState<SyntheticDocument>(SAMPLE_DOCUMENTS[0]);
  
  // Persistent mock authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading stored user session', e);
    }
    return CURRENT_USER;
  });

  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // Initialize subtle cursor magnetic & 3D tilt interactions
  useEffect(() => {
    const cleanup = initCursorInteractions();
    return cleanup;
  }, []);

  const handleNavigate = (page: PageRoute) => {
    // Navigation security check: protected authenticated routes require active session
    const protectedRoutes: PageRoute[] = [
      'dashboard', 
      'analyze', 
      'results', 
      'compare', 
      'history', 
      'reports', 
      'settings', 
      'profile'
    ];

    if (protectedRoutes.includes(page) && !currentUser) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user session', e);
    }
    setCurrentUser(user);
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing user session', e);
    }
    setCurrentUser(null);
    setCurrentPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = (doc: SyntheticDocument) => {
    setSelectedDocument(doc);
    setCurrentPage('results');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060e24] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* Reusable Global 3D Animated Cybersecurity Background (Runs smoothly across all pages) */}
        <AnimatedSecurityBackground />

        {/* Global Navigation Bar */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        />

        {/* Dynamic Route Pages */}
        <main className="flex-1 w-full relative z-10">
          {currentPage === 'landing' && (
            <LandingPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => handleNavigate(currentUser ? 'dashboard' : 'landing')}
              initialMode="login"
              existingUser={currentUser}
            />
          )}

          {currentPage === 'signup' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => handleNavigate(currentUser ? 'dashboard' : 'landing')}
              initialMode="signup"
              existingUser={currentUser}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onSelectDocument={(doc) => {
                setSelectedDocument(doc);
                setCurrentPage('results');
              }}
            />
          )}

          {currentPage === 'analyze' && (
            <AnalyzePage
              onAnalysisComplete={handleAnalysisComplete}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'results' && (
            <ResultsPage
              document={selectedDocument}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'compare' && (
            <ComparePage onNavigate={handleNavigate} />
          )}

          {currentPage === 'history' && (
            <HistoryPage
              onNavigate={handleNavigate}
              onSelectDocument={(doc) => {
                setSelectedDocument(doc);
                setCurrentPage('results');
              }}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsPage
              document={selectedDocument}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              user={currentUser || CURRENT_USER}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Persistent Floating "Ask VerifyX" AI Voice Assistant Launcher */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            id="floating-ask-verifyx-btn"
            onClick={() => setIsVoiceAssistantOpen(prev => !prev)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900/90 dark:bg-slate-900/95 hover:bg-slate-800 text-white border border-cyan-500/30 hover:border-cyan-400 shadow-xl shadow-cyan-500/20 backdrop-blur-md transition-all duration-300"
            title="Ask VerifyX AI Voice Assistant"
          >
            {/* Pulsing indicator */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            
            <Mic className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            
            <span className="text-xs font-semibold tracking-wide font-display text-slate-100 group-hover:text-cyan-300 transition-colors">
              Ask VerifyX
            </span>

            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AI Voice
            </span>
          </button>
        </div>

        {/* Global AI Voice Assistant Modal */}
        <AskVerifyXModal
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          activeDocument={selectedDocument}
          onNavigate={handleNavigate}
        />

      </div>
    </ThemeProvider>
  );
}
