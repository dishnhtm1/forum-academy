// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import translationEN from "./locales/en/translation.json";
import translationJA from "./locales/ja/translation.json";

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
    .init({
        resources: {
            en: { translation: translationEN },
            ja: { translation: translationJA },
        },
        fallbackLng: "en",
        debug: true,
        interpolation: {
            escapeValue: false, // React already does escaping
        },
    });

export default i18n;
