import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  CheckCircle2, 
  X, 
  Clock, 
  RefreshCw, 
  ArrowRight,
  Lock,
  FileCheck
} from 'lucide-react';
import { SyntheticDocument, VerificationState } from '../types';

interface OwnerVerificationModalProps {
  document: SyntheticDocument;
  isOpen: boolean;
  onClose: () => void;
  onVerified: (updatedVerification: VerificationState) => void;
}

export const OwnerVerificationModal: React.FC<OwnerVerificationModalProps> = ({
  document,
  isOpen,
  onClose,
  onVerified
}) => {
  const [step, setStep] = useState<'request' | 'otp' | 'success'>('request');
  const [otpCode, setOtpCode] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const recipient = document.verification?.recipient || '+91 ••••• ••8912';

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    setStep('otp');
    setTimer(60);
    setErrorMsg('');
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }
    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      const token = `VX-ATTEST-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${new Date().getFullYear()}`;
      const updated: VerificationState = {
        verified: true,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        token: token,
        method: 'OTP',
        recipient: recipient
      };
      setStep('success');
      onVerified(updated);
    }, 1000);
  };

  const handleAutoFill = () => {
    setOtpCode('482910');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-left">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Request OTP */}
        {step === 'request' && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Verify Document Owner Identity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Confirm authorized possession by requesting an out-of-band One-Time Password (OTP) dispatched to the registered document holder.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Document:</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{document.name}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Registered Channel:</span>
                <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-400">{recipient}</span>
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Dispatch Secure OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Enter Verification Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A 6-digit authentication token was dispatched to <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{recipient}</span>.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full text-center tracking-[0.6em] text-2xl font-mono font-bold py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Expires in {timer}s
                </span>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
                >
                  Quick Demo: Fill 482910
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
            )}

            <button
              disabled={isVerifying}
              onClick={handleVerifyOtp}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating Ledger Token...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm &amp; Attest Identity</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Owner Identity Attested
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                OTP validated against national authority key infrastructure.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Verification State:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Cryptographically Attested</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Attestation Token:</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {document.verification?.token || 'VX-ATTEST-LIVE-OK'}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Timestamp:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
