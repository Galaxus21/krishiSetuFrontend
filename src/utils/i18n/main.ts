import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './translations/en.json';
import pnTranslation from './translations/pn.json';
import hiTranslation from './translations/hi.json';
import mrTranslation from './translations/mr.json';
import teTranslation from './translations/te.json';
import knTranslation from './translations/kn.json';

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  pn: { translation: pnTranslation },
  mr: { translation: mrTranslation },
  te: { translation: teTranslation },
  kn: { translation: knTranslation },
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { 
      escapeValue: false
    }
  });

export default i18n;