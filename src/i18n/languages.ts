import { SupportedLocale, LanguageInfo, TranslationDictionary } from './types';
import { enUS } from './locales/en-US';
import { enGB } from './locales/en-GB';
import { esES } from './locales/es-ES';
import { frFR } from './locales/fr-FR';
import { deDE } from './locales/de-DE';
import { jaJP } from './locales/ja-JP';
import { zhCN } from './locales/zh-CN';
import { hiIN } from './locales/hi-IN';
import { arSA } from './locales/ar-SA';
import { ptPT } from './locales/pt-PT';
import { itIT } from './locales/it-IT';
import { koKR } from './locales/ko-KR';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en-US', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', region: 'United States / International', dir: 'ltr' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧', region: 'United Kingdom / Europe', dir: 'ltr' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain & Latin America', dir: 'ltr' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France & Francophonie', dir: 'ltr' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany / DACH', dir: 'ltr' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan', dir: 'ltr' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', region: 'East Asia', dir: 'ltr' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India', dir: 'ltr' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East', dir: 'rtl' },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Portugal / Europe', dir: 'ltr' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Italy', dir: 'ltr' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'South Korea', dir: 'ltr' }
];

export const TRANSLATIONS: Record<SupportedLocale, TranslationDictionary> = {
  'en-US': enUS,
  'en-GB': enGB,
  'es-ES': esES,
  'fr-FR': frFR,
  'de-DE': deDE,
  'ja-JP': jaJP,
  'zh-CN': zhCN,
  'hi-IN': hiIN,
  'ar-SA': arSA,
  'pt-PT': ptPT,
  'it-IT': itIT,
  'ko-KR': koKR
};

export const DEFAULT_LANGUAGE: SupportedLocale = 'en-US';

export function isSupportedLocale(code: string): code is SupportedLocale {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
}
