import i18n from 'i18next';
import I18NextXhrBackend from 'i18next-xhr-backend';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
    .use(I18NextXhrBackend)
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        ns: ['translation', 'dialog', 'login'],
        defaultNS: 'translation',
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        }
    }).catch(console.error);

export default i18n;
