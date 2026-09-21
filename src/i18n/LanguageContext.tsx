import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SupportedLocale, LanguageInfo } from './types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, DEFAULT_LANGUAGE, isSupportedLocale } from './languages';

interface LanguageContextType {
  language: SupportedLocale;
  setLanguage: (lang: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatPercent: (num: number, decimals?: number) => string;
  formatCurrency: (num: number, currency?: string) => string;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  activeLanguage: LanguageInfo;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'verifyx-language';
const LEGACY_STORAGE_KEY = 'verifyx_language';

// Normalizes legacy codes like 'en', 'es', 'fr', 'pt', etc.
function normalizeLocale(raw: string | null): SupportedLocale {
  if (!raw) return DEFAULT_LANGUAGE;
  if (isSupportedLocale(raw)) return raw;

  const map: Record<string, SupportedLocale> = {
    en: 'en-US',
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    es: 'es-ES',
    'es-ES': 'es-ES',
    fr: 'fr-FR',
    'fr-FR': 'fr-FR',
    de: 'de-DE',
    'de-DE': 'de-DE',
    ja: 'ja-JP',
    'ja-JP': 'ja-JP',
    zh: 'zh-CN',
    'zh-CN': 'zh-CN',
    hi: 'hi-IN',
    'hi-IN': 'hi-IN',
    ar: 'ar-SA',
    'ar-SA': 'ar-SA',
    pt: 'pt-PT',
    'pt-PT': 'pt-PT',
    it: 'it-IT',
    'it-IT': 'it-IT',
    ko: 'ko-KR',
    'ko-KR': 'ko-KR',
  };

  return map[raw] || DEFAULT_LANGUAGE;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLocale>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      return normalizeLocale(stored);
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  const activeLanguage = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const isRTL = activeLanguage.dir === 'rtl';
  const dir = activeLanguage.dir;

  // Sync DOM attributes & localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      localStorage.setItem(LEGACY_STORAGE_KEY, language);
    } catch (e) {
      console.error('Failed to save language to localStorage', e);
    }

    // Set HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = dir;

    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language, dir, isRTL]);

  const setLanguage = useCallback((newLang: SupportedLocale) => {
    if (isSupportedLocale(newLang)) {
      setLanguageState(newLang);
    }
  }, []);

  // Translation function with parameter interpolation
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const localeDict = TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE];
    let translation = localeDict[key] || TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }

    return translation;
  }, [language]);

  // Date/Time/Number formatters using Intl
  const formatDate = useCallback((date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      if (isNaN(d.getTime())) return String(date);
      const defaultOptions: Intl.DateTimeFormatOptions = options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      return new Intl.DateTimeFormat(language, defaultOptions).format(d);
    } catch {
      return String(date);
    }
  }, [language]);

  const formatTime = useCallback((date: Date | string | number): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      if (isNaN(d.getTime())) return String(date);
      return new Intl.DateTimeFormat(language, {
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    } catch {
      return String(date);
    }
  }, [language]);

  const formatNumber = useCallback((num: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(language, options).format(num);
    } catch {
      return String(num);
    }
  }, [language]);

  const formatPercent = useCallback((num: number, decimals: number = 0): string => {
    try {
      return new Intl.NumberFormat(language, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(num > 1 ? num / 100 : num);
    } catch {
      return `${num}%`;
    }
  }, [language]);

  const formatCurrency = useCallback((num: number, currency: string = 'USD'): string => {
    try {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency
      }).format(num);
    } catch {
      return `$${num}`;
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    formatDate,
    formatTime,
    formatNumber,
    formatPercent,
    formatCurrency,
    isRTL,
    dir,
    activeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES
  }), [
    language,
    setLanguage,
    t,
    formatDate,
    formatTime,
    formatNumber,
    formatPercent,
    formatCurrency,
    isRTL,
    dir,
    activeLanguage
  ]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
