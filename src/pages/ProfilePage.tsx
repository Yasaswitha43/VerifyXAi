import React from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  Mail, 
  ShieldCheck, 
  Building, 
  CheckCircle2, 
  FileCheck 
} from 'lucide-react';
import { PageRoute, UserProfile } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  onNavigate: (page: PageRoute) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
          Account Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View your investigator profile, assigned clearance role, and account session.
        </p>
      </div>

      {/* Clean Profile Card: Avatar, Name, Email, Role, and Logout */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
          />

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user.clearanceLevel || 'Level 4 Clearance'}</span>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h2>

            <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user.email}</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                <span>Role: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{user.role}</strong> • {user.organization}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Account Details & Status */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400">Security Verification</span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Two-Factor Authentication Active
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400">Analyses Executed</span>
            <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-cyan-500" />
              {user.scansPerformed || 248} Documents Verified
            </p>
          </div>
        </div>

        {/* Logout Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onLogout}
            className="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </div>

    </div>
  );
};
