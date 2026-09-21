import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  UserCheck, 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { CURRENT_USER } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancel: () => void;
  initialMode?: 'login' | 'signup';
  existingUser?: UserProfile | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess, 
  onCancel,
  initialMode = 'login',
  existingUser = null
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  
  // Login Form State
  const [email, setEmail] = useState('elena.rostova@forensics.verifyx.ai');
  const [password, setPassword] = useState('VerifyX2026@Secure');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sign Up Form State
  const [signupName, setSignupName] = useState('Marcus Thorne');
  const [signupEmail, setSignupEmail] = useState('m.thorne@cyber-investigations.gov');
  const [signupOrg, setSignupOrg] = useState('Federal Forensic Division');
  const [signupPassword, setSignupPassword] = useState('ForensicSecurity99!');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('ForensicSecurity99!');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // 1. Handle Standard Credentials Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both your work email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Construct or match user profile
      const authenticatedUser: UserProfile = {
        name: email.includes('elena') ? CURRENT_USER.name : email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        email: email.trim(),
        role: 'Lead Forensic Examiner',
        organization: 'National Cyber Forensics Laboratory',
        badgeId: 'VX-FORENSIC-8492',
        avatarUrl: CURRENT_USER.avatarUrl,
        twoFactorEnabled: true,
        lastLogin: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scansPerformed: 128,
        clearanceLevel: 'Level 4 Clearance'
      };
      onLoginSuccess(authenticatedUser);
    }, 400);
  };

  // 2. Handle "Continue with Google" Frontend Mock Authentication Flow
  const handleContinueWithGoogle = () => {
    setIsLoading(true);
    setAuthError(null);

    // Mock Google authentication delay and payload
    setTimeout(() => {
      setIsLoading(false);
      const googleMockUser: UserProfile = {
        name: 'Alex Vance',
        email: 'alex.vance@googlemail.com',
        role: 'Senior Cryptographic Auditor',
        organization: 'Alphabet Security Alliances',
        badgeId: 'GOOG-SEC-7701',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        twoFactorEnabled: true,
        lastLogin: 'Just now via Google Account',
        scansPerformed: 42,
        clearanceLevel: 'Level 4 Clearance'
      };
      onLoginSuccess(googleMockUser);
    }, 450);
  };

  // 3. Handle Account Creation (Sign Up)
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setAuthError('Please fill in all mandatory account fields.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newAccountUser: UserProfile = {
        name: signupName.trim(),
        email: signupEmail.trim(),
        role: 'Forensic Document Specialist',
        organization: signupOrg.trim() || 'VerifyX Partner Network',
        badgeId: `VX-${Math.floor(1000 + Math.random() * 9000)}`,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        twoFactorEnabled: true,
        lastLogin: 'First Session Initialized',
        scansPerformed: 0,
        clearanceLevel: 'Level 3 Clearance'
      };
      onLoginSuccess(newAccountUser);
    }, 450);
  };

  // 4. Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSuccessMessage(`Password recovery instructions and a secure one-time verification link have been dispatched to ${forgotEmail}.`);
    }, 400);
  };

  // Quick Demo Fast Login
  const handleQuickDemo = (role: 'lead' | 'auditor') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...CURRENT_USER,
        role: role === 'lead' ? 'Lead Forensic Examiner' : 'Compliance & Risk Officer',
        clearanceLevel: role === 'lead' ? 'Level 4 Clearance' : 'Level 2 Clearance'
      });
    }, 300);
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-10 relative z-10">
      <div className="w-full max-w-md space-y-4">
        
        {/* Top-Left Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            id="login-back-to-home-btn"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all shadow-xs group"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>

          <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-BIT TLS SECURE</span>
          </span>
        </div>

        {/* Existing Active Account Alert if previously logged in */}
        {existingUser && (
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={existingUser.avatarUrl}
                alt={existingUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {existingUser.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Logged in as {existingUser.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => onLoginSuccess(existingUser)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Authentication Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl text-left space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-md shadow-cyan-500/10">
              <ShieldCheck className="w-6 h-6 text-cyan-500" />
            </div>
            
            <h1 className="text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
              {mode === 'login' && 'Sign In to VerifyX'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot-password' && 'Password Recovery'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {mode === 'login' && 'Access the forensic document intelligence platform'}
              {mode === 'signup' && 'Join the enterprise network for tamper detection and forensic verification'}
              {mode === 'forgot-password' && 'Enter your email to receive recovery instructions'}
            </p>
          </div>

          {/* Global Error Banner */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 1: LOGIN FORM                                        */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <div className="space-y-5">
              
              {/* Continue with Google (Frontend Mock Flow) */}
              <button
                id="login-continue-with-google-btn"
                type="button"
                onClick={handleContinueWithGoogle}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-3 group"
              >
                {/* Official Google G SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Minimal Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 shrink-0">
                  Or with email
                </span>
              </div>

              {/* Login Email & Password Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label 
                    htmlFor="login-email-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="login-email-input"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="investigator@verifyx.ai"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="login-password-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>
                    <button
                      id="login-forgot-password-link"
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setMode('forgot-password');
                        setResetSuccessMessage(null);
                        setAuthError(null);
                      }}
                      className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Login Button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <span>{isLoading ? 'Authenticating Specimen...' : 'Login'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Create Account Link */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button
                    id="login-create-account-btn"
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setAuthError(null);
                    }}
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline ml-1"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* Quick Demo Access Badges */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-[11px] text-slate-400 text-center font-mono uppercase tracking-wider">
                  Instant Demo Access:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="login-quick-demo-lead"
                    type="button"
                    onClick={() => handleQuickDemo('lead')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Lead Examiner</span>
                  </button>
                  <button
                    id="login-quick-demo-risk"
                    type="button"
                    onClick={() => handleQuickDemo('auditor')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Risk Officer</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: CREATE ACCOUNT (SIGN UP)                          */}
          {/* ========================================================= */}
          {mode === 'signup' && (
            <div className="space-y-4">
              
              {/* Continue with Google on Signup */}
              <button
                id="signup-continue-with-google-btn"
                type="button"
                onClick={handleContinueWithGoogle}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-3 group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign Up with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 shrink-0">
                  Or register with email
                </span>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="signup-fullname-input"
                      type="text"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      required
                      placeholder="Dr. Alex Vance"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="signup-email-input"
                      type="email"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                      placeholder="analyst@agency.gov"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization / Institution
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="signup-org-input"
                      type="text"
                      value={signupOrg}
                      onChange={e => setSignupOrg(e.target.value)}
                      placeholder="Cyber Forensic Bureau"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        id="signup-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        id="signup-confirm-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={signupConfirmPassword}
                        onChange={e => setSignupConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Create Account Submit Button */}
                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] mt-2"
                >
                  <span>{isLoading ? 'Creating Enterprise Account...' : 'Create Account & Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Already have account */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    id="signup-back-to-login-btn"
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setAuthError(null);
                    }}
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline ml-1"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: FORGOT PASSWORD                                   */}
          {/* ========================================================= */}
          {mode === 'forgot-password' && (
            <div className="space-y-4">
              {resetSuccessMessage ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs space-y-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{resetSuccessMessage}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMode('login');
                      setResetSuccessMessage(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors text-center"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Enter Account Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        id="forgot-email-input"
                        type="email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        required
                        placeholder="investigator@verifyx.ai"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Dispatching Token...' : 'Send Recovery Link'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setAuthError(null);
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
