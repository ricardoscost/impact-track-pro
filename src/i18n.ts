import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/common';
import pt from './locales/pt/common';
import es from './locales/es/common';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      pt: { common: pt },
      es: { common: es },
    },
    fallbackLng: 'pt',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  const short = lng?.split('-')[0] ?? 'pt';
  if (typeof document !== 'undefined') {
    document.documentElement.lang = short;
    try {
      const t = i18n.getFixedT(short, 'common');
      document.title = t('meta.title');
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', t('meta.description'));
    } catch {}
  }
});

export default i18n;
