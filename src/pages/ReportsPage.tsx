import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  ExternalLink,
  Search
} from 'lucide-react';
import { PageRoute, SyntheticDocument } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/mockData';
import { useLanguage } from '../i18n';

interface ReportsPageProps {
  document: SyntheticDocument;
  onNavigate: (page: PageRoute) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ document: initialDoc, onNavigate }) => {
  const { t, isRTL, formatNumber } = useLanguage();
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-1');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const reportsList = [
    {
      id: 'rep-1',
      reportNumber: 'VX-CERT-2026-8891',
      documentName: 'Financial_Earnings_Report_Q3.pdf',
      documentType: 'Financial Report',
      date: 'Oct 24, 2025 • 14:32 UTC',
      riskScore: 84,
      status: 'Tampered',
      fileSize: '3.4 MB',
      findingsCount: 4,
      doc: SAMPLE_DOCUMENTS[0]
    },
    {
      id: 'rep-2',
      reportNumber: 'VX-CERT-2026-7240',
      documentName: 'US_Passport_Verification_Specimen.jpg',
      documentType: 'ID / Passport',
      date: 'Oct 23, 2025 • 09:15 UTC',
      riskScore: 12,
      status: 'Verified Clean',
      fileSize: '4.8 MB',
      findingsCount: 0,
      doc: SAMPLE_DOCUMENTS[1]
    },
    {
      id: 'rep-3',
      reportNumber: 'VX-CERT-2026-6519',
      documentName: 'Commercial_Vendor_Contract.pdf',
      documentType: 'Contract',
      date: 'Oct 22, 2025 • 18:44 UTC',
      riskScore: 62,
      status: 'Suspicious',
      fileSize: '1.2 MB',
      findingsCount: 2,
      doc: SAMPLE_DOCUMENTS[2]
    },
    {
      id: 'rep-4',
      reportNumber: 'VX-CERT-2026-5102',
      documentName: 'Commercial_Invoice_INV99281.pdf',
      documentType: 'Invoice',
      date: 'Oct 20, 2025 • 11:20 UTC',
      riskScore: 91,
      status: 'Tampered',
      fileSize: '890 KB',
      findingsCount: 5,
      doc: SAMPLE_DOCUMENTS[0]
    }
  ];

  const filteredReports = reportsList.filter(r => 
    r.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeReport = reportsList.find(r => r.id === selectedReportId) || reportsList[0];

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
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
          {t('reports')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('exportReportDesc')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('searchReportsPlaceholder')}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Reports: Clean List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {t('recentCertificates')}
        </h2>

        <div className="space-y-3">
          {filteredReports.map((report) => {
            const isSelected = selectedReportId === report.id;
            const isHigh = report.riskScore >= 70;
            const isMedium = report.riskScore >= 40 && report.riskScore < 70;
            const statusLabel = report.status === 'Tampered' 
              ? t('tampered') 
              : report.status === 'Suspicious'
              ? t('suspicious')
              : t('clean');

            return (
              <div
                key={report.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-cyan-500/80 bg-cyan-50/20 dark:bg-cyan-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                          {report.reportNumber}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{report.date}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                        {report.documentName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {report.documentType} • {formatNumber(report.findingsCount)} {t('findings')} • {report.fileSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isHigh
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                        : isMedium
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                    }`}>
                      {t('riskScore')}: {formatNumber(report.riskScore)} • {statusLabel}
                    </span>

                    <button
                      onClick={() => setSelectedReportId(report.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-500 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? t('viewing') : t('inspect')}
                    </button>

                    <button
                      onClick={handleDownload}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={t('downloadPdf')}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t('downloadPdf')}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Certificate Preview Card */}
      {activeReport && (
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>VerifyX Forensic Intelligence Lab</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('certificateNumber', { number: activeReport.reportNumber })}
              </h3>
              <p className="text-xs text-slate-400">
                Official ISO/IEC 27037 Digital Evidence Compliance Specimen Audit
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? t('downloaded') : t('downloadCertificatePdf')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">{t('specimen')}</span>
              <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1 truncate">{activeReport.documentName}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">{t('category')}</span>
              <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">{activeReport.documentType}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">{t('timestamp')}</span>
              <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">{activeReport.date}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">{t('riskVerdict')}</span>
              <p className={`text-xs font-bold mt-1 ${
                activeReport.riskScore >= 70 ? 'text-rose-500' : activeReport.riskScore >= 40 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {t('riskScore')}: {formatNumber(activeReport.riskScore)} • {activeReport.status === 'Tampered' ? t('tampered') : activeReport.status === 'Suspicious' ? t('suspicious') : t('clean')}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white">{t('auditCertificationSummary')}:</p>
            <p className="leading-relaxed">
              This document was parsed via multi-layer optical baseline scanning, error-level quantization analysis, and cryptographic digest verification. All anomalies have been calculated with 95%+ confidence.
            </p>
            <p className="text-[11px] text-slate-400 pt-1 font-mono">
              SHA-256 Digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

