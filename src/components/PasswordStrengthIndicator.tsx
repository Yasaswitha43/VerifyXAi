import React from 'react';
import { CheckCircle2, Circle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { validatePasswordStrength } from '../utils/authAccounts';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password,
  showDetails = true 
}) => {
  const result = validatePasswordStrength(password);
  const { hasMinLength, hasCapital, hasNumber, hasSpecial, isStrong, score } = result;

  // Determine strength level label & color
  let strengthLabel = 'Very Weak';
  let strengthColor = 'text-rose-500';
  let barColor = 'bg-rose-500';

  if (score === 1) {
    strengthLabel = 'Weak';
    strengthColor = 'text-rose-500';
    barColor = 'bg-rose-500';
  } else if (score === 2) {
    strengthLabel = 'Fair';
    strengthColor = 'text-amber-500';
    barColor = 'bg-amber-500';
  } else if (score === 3) {
    strengthLabel = 'Moderate';
    strengthColor = 'text-cyan-500';
    barColor = 'bg-cyan-500';
  } else if (score === 4) {
    strengthLabel = 'Strong & Secure';
    strengthColor = 'text-emerald-500';
    barColor = 'bg-emerald-500';
  }

  if (!password) {
    strengthLabel = 'Required';
    strengthColor = 'text-slate-400';
  }

  return (
    <div className="space-y-2 mt-2 pt-1 text-left">
      {/* Strength Bar Meter */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-slate-500 dark:text-slate-400">Password Strength:</span>
          <span className={`font-mono font-bold flex items-center gap-1 ${strengthColor}`}>
            {isStrong ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            {strengthLabel}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          {[1, 2, 3, 4].map(idx => (
            <div
              key={idx}
              className={`h-full rounded-full transition-all duration-300 ${
                score >= idx ? barColor : 'bg-slate-200 dark:bg-slate-700/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Real-time Validation Checklist */}
      {showDetails && (
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5 text-[11px]">
          <div className="font-semibold text-slate-600 dark:text-slate-300 pb-0.5 text-[10px] uppercase tracking-wider font-mono">
            Security Requirements:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
            {/* 1. At least 8 characters */}
            <div className={`flex items-center gap-1.5 transition-colors ${
              hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {hasMinLength ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
              )}
              <span>At least 8 characters</span>
            </div>

            {/* 2. Capital letter */}
            <div className={`flex items-center gap-1.5 transition-colors ${
              hasCapital ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {hasCapital ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
              )}
              <span>One capital letter (A-Z)</span>
            </div>

            {/* 3. Number */}
            <div className={`flex items-center gap-1.5 transition-colors ${
              hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {hasNumber ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
              )}
              <span>One number (0-9)</span>
            </div>

            {/* 4. Special character */}
            <div className={`flex items-center gap-1.5 transition-colors ${
              hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {hasSpecial ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
              )}
              <span>One special character (!@#$)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
