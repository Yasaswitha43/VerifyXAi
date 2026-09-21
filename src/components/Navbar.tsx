import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings, 
  FileSearch, 
  Dna,
  GitCompare, 
  History, 
  FileText, 
  LayoutDashboard,
  ArrowLeft,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageRoute, UserProfile, NotificationItem } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface NavbarProps {
  currentPage: PageRoute;
  setCurrentPage?: (page: PageRoute) => void;
  onNavigate?: (page: PageRoute) => void;
  currentUser?: UserProfile | null;
  notifications?: NotificationItem[];
  onLogout?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onNavigate,
  currentUser = null,
  onLogout = () => {},
  onOpenVoiceAssistant
}) => {
  const navigate = onNavigate || setCurrentPage || (() => {});
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Authenticated state check
  const isAuthenticated = currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup' && !!currentUser;
  const activeUser = currentUser || CURRENT_USER;

  // Is this page an inner page after dashboard?
  const isAfterDashboard = isAuthenticated && currentPage !== 'dashboard';

  // Close profile dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Landing marketing links
  const landingNavLinks = [
    { label: 'How It Works', page: 'landing' as PageRoute, hash: '#how-it-works' },
    { label: 'Features', page: 'landing' as PageRoute, hash: '#features' },
    { label: 'Security', page: 'landing' as PageRoute, hash: '#security' }
  ];

  // Authenticated navigation links (Dashboard, Analysis, Document DNA, History, Reports)
  const authNavLinks = [
    { label: 'Dashboard', page: 'dashboard' as PageRoute, icon: LayoutDashboard },
    { label: 'Analysis', page: 'analyze' as PageRoute, icon: FileSearch },
    { label: 'Document DNA', page: 'compare' as PageRoute, icon: Dna },
    { label: 'History', page: 'history' as PageRoute, icon: History },
    { label: 'Reports', page: 'reports' as PageRoute, icon: FileText }
  ];

  const handleLandingNavClick = (page: PageRoute, hash?: string) => {
    navigate(page);
    setMobileMenuOpen(false);
    if (hash && typeof window !== 'undefined') {
      setTimeout(() => {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleAuthNavClick = (page: PageRoute) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* TOP-LEFT: Brand Logo & Contextual "Back to Dashboard" button */}
        <div className="flex items-center gap-3">
          {/* Brand Logo */}
          <div 
            onClick={() => navigate(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
            title={isAuthenticated ? 'VerifyX AI Dashboard' : 'VerifyX AI Home'}
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                VERIFYX <span className="text-cyan-500 text-xs font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20">AI</span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-500 dark:text-slate-400 font-mono -mt-1 hidden sm:block">
                FORENSIC INTELLIGENCE
              </span>
            </div>
          </div>

          {/* TOP-LEFT BACK TO DASHBOARD BUTTON on every page after the dashboard */}
          {isAfterDashboard && (
            <div className="hidden sm:flex items-center pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                id="navbar-back-to-dashboard-btn"
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm group"
                title="Return to Dashboard"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>Dashboard</span>
              </button>
            </div>
          )}
        </div>

        {/* CENTER / DESKTOP NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {isAuthenticated ? (
            // Authenticated Persistent Links
            authNavLinks.map((item) => {
              const isActive = currentPage === item.page;
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => handleAuthNavClick(item.page)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/50 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })
          ) : (
            // Landing Marketing Links
            landingNavLinks.map((item, idx) => {
              const isActive = currentPage === item.page && !item.hash;
              return (
                <button
                  key={idx}
                  onClick={() => handleLandingNavClick(item.page, item.hash)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })
          )}
        </nav>

        {/* TOP-RIGHT CONTROLS: Theme Toggle & Profile Avatar Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* TOP-RIGHT PROFILE AVATAR & DROPDOWN MENU (On Dashboard & All Authenticated Pages) */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer group"
                aria-haspopup="true"
                aria-expanded={showUserMenu}
              >
                <img
                  src={activeUser.avatarUrl}
                  alt={activeUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40 group-hover:ring-cyan-500 transition-all"
                />
                <span className="hidden sm:inline-block text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                  {activeUser.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-150 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown: My Profile, Settings, Logout */}
              {showUserMenu && (
                <div 
                  id="user-profile-dropdown"
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* User identity header */}
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <img
                      src={activeUser.avatarUrl}
                      alt={activeUser.name}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {activeUser.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {activeUser.email || 'investigator@verifyx.ai'}
                      </p>
                      <span className="inline-block mt-0.5 text-[9px] font-mono font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-200 dark:border-cyan-800/60">
                        {activeUser.clearanceLevel || 'Level 4 Clearance'}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1 space-y-0.5">
                    {/* My Profile */}
                    <button
                      id="menu-item-my-profile"
                      onClick={() => {
                        navigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
                    >
                      <User className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                      <span>My Profile</span>
                    </button>

                    {/* Settings */}
                    <button
                      id="menu-item-settings"
                      onClick={() => {
                        navigate('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
                    >
                      <Settings className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  {/* Logout (Returns to Login Page) */}
                  <div className="p-1">
                    <button
                      id="menu-item-logout"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left group"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Non-authenticated Visitor CTA on landing, login, signup
            <div className="flex items-center gap-2">
              {currentPage !== 'login' && currentPage !== 'signup' ? (
                <>
                  <button
                    id="navbar-signin-btn"
                    onClick={() => navigate('login')}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    id="navbar-analyze-btn"
                    onClick={() => navigate('analyze')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                  >
                    Analyze Document
                  </button>
                </>
              ) : (
                <button
                  id="navbar-home-btn"
                  onClick={() => navigate('landing')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Home
                </button>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-1">
          {/* Mobile Back to Dashboard button on inner pages */}
          {isAfterDashboard && (
            <button
              onClick={() => { navigate('dashboard'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          )}

          {isAuthenticated ? (
            authNavLinks.map((item) => {
              const isActive = currentPage === item.page;
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  onClick={() => handleAuthNavClick(item.page)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-500" />
                  <span>{item.label}</span>
                </button>
              );
            })
          ) : (
            landingNavLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleLandingNavClick(item.page, item.hash)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {item.label}
              </button>
            ))
          )}
        </div>
      )}
    </header>
  );
};
