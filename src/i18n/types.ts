export type SupportedLocale = 
  | 'en-US'
  | 'en-GB'
  | 'es-ES'
  | 'fr-FR'
  | 'de-DE'
  | 'ja-JP'
  | 'zh-CN'
  | 'hi-IN'
  | 'ar-SA'
  | 'pt-PT'
  | 'it-IT'
  | 'ko-KR';

export type SupportedLanguage = SupportedLocale;

export interface LanguageInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  dir: 'ltr' | 'rtl';
}

export type TranslationDictionary = Record<string, string>;
