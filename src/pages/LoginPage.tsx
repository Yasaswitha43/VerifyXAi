import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { UserProfile } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { 
  authenticateWithPassword, 
  registerNewAccount, 
  generateOtpForEmail, 
  verifyOtpForEmail, 
  resetAccountPassword,
  validatePasswordStrength,
  OtpRecord
} from '../utils/authAccounts';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancel: () => void;
  initialMode?: 'login' | 'signup';
}

type ForgotStep = 'request-otp' | 'verify-otp' | 'new-password' | 'success';

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess, 
  onCancel,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  
  // Login Form State (Clean and empty - no residual logged user information)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sign Up Form State (Clean and empty)
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupOrg, setSignupOrg] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Forgot Password & OTP Flow State
  const [forgotStep, setForgotStep] = useState<ForgotStep>('request-otp');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [dispatchedOtp, setDispatchedOtp] = useState<OtpRecord | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Timer countdown for OTP resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // =========================================================================
  // 1. Handle Standard Credentials Login
  // =========================================================================
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim()) {
      setAuthError('Please enter your work email address.');
      return;
    }
    if (!password) {
      setAuthError('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const authResult = authenticateWithPassword(email, password);

      if (!authResult.success) {
        setAuthError(authResult.error || 'Authentication failed. Please verify your email and password.');
        return;
      }

      if (authResult.user) {
        onLoginSuccess(authResult.user);
      }
    }, 450);
  };

  // =========================================================================
  // 2. Handle "Continue with Google"
  // =========================================================================
  const handleContinueWithGoogle = () => {
    setIsLoading(true);
    setAuthError(null);

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

  // =========================================================================
  // 3. Handle Account Creation (Sign Up with Strong Password Enforcement)
  // =========================================================================
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setAuthError('Please fill in all mandatory account fields.');
      return;
    }

    // Strong password validation check
    const validation = validatePasswordStrength(signupPassword);
    if (!validation.isStrong) {
      const missingRules: string[] = [];
      if (!validation.hasMinLength) missingRules.push('at least 8 characters');
      if (!validation.hasCapital) missingRules.push('at least one capital letter');
      if (!validation.hasNumber) missingRules.push('at least one number');
      if (!validation.hasSpecial) missingRules.push('at least one special character');

      setAuthError(`Password is not strong enough. It must contain: ${missingRules.join(', ')}.`);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const regResult = registerNewAccount(signupName, signupEmail, signupPassword, signupOrg);

      if (!regResult.success) {
        setAuthError(regResult.error || 'Unable to register account.');
        return;
      }

      if (regResult.user) {
        onLoginSuccess(regResult.user);
      }
    }, 500);
  };

  // =========================================================================
  // 4. Forgot Password Flow: Request OTP
  // =========================================================================
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!forgotEmail.trim()) {
      setAuthError('Please enter your account email address to receive an OTP.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const record = generateOtpForEmail(forgotEmail);
      setDispatchedOtp(record);
      setResendCooldown(45); // 45 seconds cooldown
      setForgotStep('verify-otp');
    }, 500);
  };

  // Resend OTP handler
  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    setAuthError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const record = generateOtpForEmail(forgotEmail);
      setDispatchedOtp(record);
      setResendCooldown(45);
      setCopiedOtp(false);
    }, 400);
  };

  // Quick auto-fill helper for testability
  const handleAutoFillOtp = () => {
    if (dispatchedOtp) {
      setOtpValue(dispatchedOtp.otp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  // =========================================================================
  // 5. Forgot Password Flow: Verify OTP
  // =========================================================================
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!otpValue.trim() || otpValue.trim().length !== 6) {
      setAuthError('Please enter the complete 6-digit One-Time Password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const verifyResult = verifyOtpForEmail(forgotEmail, otpValue);

      if (!verifyResult.success) {
        setAuthError(verifyResult.error || 'Invalid OTP code. Please check your email.');
        return;
      }

      // Move to set new password step
      setForgotStep('new-password');
    }, 450);
  };

  // =========================================================================
  // 6. Forgot Password Flow: Set New Strong Password
  // =========================================================================
  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const validation = validatePasswordStrength(newPassword);
    if (!validation.isStrong) {
      const missing: string[] = [];
      if (!validation.hasMinLength) missing.push('at least 8 characters');
      if (!validation.hasCapital) missing.push('a capital letter');
      if (!validation.hasNumber) missing.push('a number');
      if (!validation.hasSpecial) missing.push('a special character');

      setAuthError(`New password is not strong enough. Missing: ${missing.join(', ')}.`);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAuthError('New passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const resetResult = resetAccountPassword(forgotEmail, newPassword);

      if (!resetResult.success) {
        setAuthError(resetResult.error || 'Failed to update password.');
        return;
      }

      // Success
      setForgotStep('success');
    }, 500);
  };

  // Finish reset and return to login with prefilled credentials
  const handleFinishReset = () => {
    setEmail(forgotEmail);
    setPassword(newPassword);
    setMode('login');
    setForgotStep('request-otp');
    setAuthError(null);
  };

  // Quick Demo Fast Login
  const handleQuickDemo = (role: 'lead' | 'auditor') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demoEmail = role === 'lead' ? 'elena.rostova@forensics.verifyx.ai' : 'chalapaka2022@gmail.com';
      const auth = authenticateWithPassword(demoEmail, 'VerifyX2026@Secure');
      if (auth.success && auth.user) {
        onLoginSuccess(auth.user);
      } else {
        onLoginSuccess({
          ...CURRENT_USER,
          role: role === 'lead' ? 'Lead Forensic Examiner' : 'Compliance & Risk Officer',
          clearanceLevel: role === 'lead' ? 'Level 4 Clearance' : 'Level 2 Clearance'
        });
      }
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all shadow-xs group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>

          <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-BIT TLS SECURE</span>
          </span>
        </div>

        {/* Main Authentication Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl text-left space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-md shadow-cyan-500/10">
              {mode === 'forgot-password' ? (
                <KeyRound className="w-6 h-6 text-cyan-500" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-cyan-500" />
              )}
            </div>
            
            <h1 className="text-2xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
              {mode === 'login' && 'Sign In to VerifyX'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot-password' && 'Password Recovery via OTP'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {mode === 'login' && 'Enter your verified credentials to access the forensic intelligence console'}
              {mode === 'signup' && 'Join the forensic intelligence network with strong cryptographic credentials'}
              {mode === 'forgot-password' && 'Verify your identity using a One-Time Password sent to your email'}
            </p>
          </div>

          {/* Global Error Banner */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{authError}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 1: LOGIN FORM                                        */}
          {/* ========================================================= */}
          {mode === 'login' && (
            <div className="space-y-5">
              
              {/* Continue with Google */}
              <button
                id="login-continue-with-google-btn"
                type="button"
                onClick={handleContinueWithGoogle}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-3 group cursor-pointer"
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
                <span>Continue with Google</span>
              </button>

              {/* Minimal Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 shrink-0">
                  Or login with password
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
                        setForgotStep('request-otp');
                        setAuthError(null);
                        setOtpValue('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                      }}
                      className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
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
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                >
                  <span>{isLoading ? 'Verifying Credentials...' : 'Login to Account'}</span>
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
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline ml-1 cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* Quick Demo Access Badges */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-[11px] text-slate-400 text-center font-mono uppercase tracking-wider">
                  Default Demo Credentials:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="login-quick-demo-lead"
                    type="button"
                    onClick={() => handleQuickDemo('lead')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Lead Examiner</span>
                  </button>
                  <button
                    id="login-quick-demo-risk"
                    type="button"
                    onClick={() => handleQuickDemo('auditor')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Halapaka (Executive)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: CREATE ACCOUNT (SIGN UP WITH STRONG PASSWORD)     */}
          {/* ========================================================= */}
          {mode === 'signup' && (
            <div className="space-y-4">
              
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
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Create Strong Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showSignupPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        id="signup-password-input"
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        required
                        placeholder="Must contain 8+ chars, capital, number, special"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
                      />
                    </div>

                    {/* Live Strong Password Checklist & Strength Meter */}
                    <PasswordStrengthIndicator password={signupPassword} showDetails={true} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        id="signup-confirm-password-input"
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupConfirmPassword}
                        onChange={e => setSignupConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-enter strong password"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
                      />
                    </div>
                    {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                      <p className="text-[11px] font-mono text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Passwords do not match
                      </p>
                    )}
                    {signupConfirmPassword && signupPassword === signupConfirmPassword && (
                      <p className="text-[11px] font-mono text-emerald-500 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                  </div>
                </div>

                {/* Create Account Submit Button */}
                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] mt-2 cursor-pointer"
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
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline ml-1 cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: FORGOT PASSWORD WITH EMAIL OTP                    */}
          {/* ========================================================= */}
          {mode === 'forgot-password' && (
            <div className="space-y-4">
              
              {/* STEP 1: REQUEST OTP TO USER EMAIL */}
              {forgotStep === 'request-otp' && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/30 border border-cyan-500/20 text-slate-700 dark:text-slate-300 text-xs space-y-1">
                    <p className="font-semibold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-cyan-500" />
                      <span>One-Time Password (OTP) Verification</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Enter the email address you gave for login. A secure 6-digit one-time password will be dispatched to your inbox.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Account Email Address
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
                    id="send-otp-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isLoading ? 'Dispatching OTP to Email...' : 'Send OTP to Email'}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setAuthError(null);
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      ← Return to Login
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: ENTER & VERIFY OTP */}
              {forgotStep === 'verify-otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Interactive Simulated Email Inbox Dispatch Toast */}
                  {dispatchedOtp && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in duration-300">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>OTP Dispatched to {dispatchedOtp.email}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Valid 10 mins
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-white dark:bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/30">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">Simulated Email Inbox OTP:</span>
                          <span className="text-base font-mono font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
                            {dispatchedOtp.otp}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleAutoFillOtp}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Click to auto-fill this code directly into the input"
                        >
                          {copiedOtp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedOtp ? 'Filled!' : 'Auto-Fill OTP'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Enter 6-Digit One-Time Password (OTP)
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="otp-input"
                        type="text"
                        maxLength={6}
                        value={otpValue}
                        onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                        required
                        placeholder="••••••"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-lg font-mono tracking-widest text-center text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Check your email inbox or use the simulated dispatch code above.
                    </p>
                  </div>

                  <button
                    id="verify-otp-btn"
                    type="submit"
                    disabled={isLoading || otpValue.length !== 6}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isLoading ? 'Verifying OTP Code...' : 'Verify OTP & Set New Password'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Resend OTP & Back Controls */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setForgotStep('request-otp')}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      ← Change Email
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleResendOtp}
                      className={`font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                        resendCooldown > 0 
                          ? 'text-slate-400 cursor-not-allowed' 
                          : 'text-cyan-600 dark:text-cyan-400 hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: CREATE NEW STRONG PASSWORD */}
              {forgotStep === 'new-password' && (
                <form onSubmit={handleSetNewPassword} className="space-y-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-cyan-800 dark:text-cyan-300">Identity Verified via OTP.</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Create a new strong password for account <span className="font-bold text-slate-800 dark:text-slate-200">{forgotEmail}</span>.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        New Strong Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showNewPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        id="new-password-input"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        placeholder="Enter new strong password"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
                      />
                    </div>

                    {/* Live Password Strength Indicator */}
                    <PasswordStrengthIndicator password={newPassword} showDetails={true} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        id="confirm-new-password-input"
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        required
                        placeholder="Re-type new password"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
                      />
                    </div>
                    {confirmNewPassword && newPassword !== confirmNewPassword && (
                      <p className="text-[11px] font-mono text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Passwords do not match
                      </p>
                    )}
                    {confirmNewPassword && newPassword === confirmNewPassword && (
                      <p className="text-[11px] font-mono text-emerald-500 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                  </div>

                  <button
                    id="update-password-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isLoading ? 'Updating Password...' : 'Save New Password'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 4: SUCCESS CONFIRMATION */}
              {forgotStep === 'success' && (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-emerald-900 dark:text-white">
                        Password Reset Successful!
                      </h3>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                        Your account password has been updated and securely hashed.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    You can now sign in immediately using your new password.
                  </p>

                  <button
                    id="finish-reset-btn"
                    type="button"
                    onClick={handleFinishReset}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
