import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  ExternalLink 
} from 'lucide-react';
import { PageRoute, SyntheticDocument } from '../types';
import { MOCK_HISTORY, SAMPLE_DOCUMENTS } from '../data/mockData';
import { useLanguage } from '../i18n';

interface HistoryPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectDocument: (doc: SyntheticDocument) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, onSelectDocument }) => {
  const { t, isRTL, formatNumber } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Low' | 'Moderate' | 'High'>('All');

  const filteredItems = MOCK_HISTORY.filter(item => {
    const matchesSearch = item.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.riskLevel === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* TOP-LEFT Navigation: Back to Dashboard */}
      <div>
        <button
          id="back-to-dashboard-btn"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all shadow-xs group cursor-pointer"
          title={t('backToDashboard')}
        >
          <ArrowLeft className={`w-4 h-4 text-cyan-500 transition-transform ${isRTL ? 'group-hover:translate-x-0.5 rotate-180' : 'group-hover:-translate-x-0.5'}`} />
          <span>{t('dashboard')}</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
          {t('history')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('analysisHistoryDesc')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
            {(['All', 'Low', 'Moderate', 'High'] as const).map(filter => {
              const label = filter === 'All' 
                ? t('allRisks') 
                : filter === 'Low'
                ? t('lowRisk')
                : filter === 'Moderate'
                ? t('moderateRisk')
                : t('highRisk');
              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Clean Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">{t('document')}</th>
                <th className="py-3.5 px-4">{t('type')}</th>
                <th className="py-3.5 px-4">{t('date')}</th>
                <th className="py-3.5 px-4">{t('riskStatus')}</th>
                <th className="py-3.5 px-4">{t('score')}</th>
                <th className="py-3.5 px-6 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {filteredItems.map(item => {
                const isHigh = item.riskScore >= 70;
                const isMedium = item.riskScore >= 40 && item.riskScore < 70;
                const riskLabel = item.riskLevel === 'Low' ? t('lowRisk') : item.riskLevel === 'Moderate' ? t('moderateRisk') : t('highRisk');

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Document */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                          {item.docName}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {item.type}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {item.date}
                    </td>

                    {/* Risk Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        isHigh
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                          : isMedium
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                      }`}>
                        {riskLabel}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {formatNumber(item.riskScore)} / 100
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            const doc = SAMPLE_DOCUMENTS[0];
                            onSelectDocument(doc);
                            onNavigate('results');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t('open')}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

