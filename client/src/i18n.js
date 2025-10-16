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
    load: "languageOnly",
    cache: {
      enabled: false, // Disable caching to ensure fresh translations
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

// Debug: Log the loaded translations
console.log("🔍 i18n Loaded - JA common.status:", translationJA.common?.status);
console.log(
  "🔍 i18n Loaded - JA common.actions:",
  translationJA.common?.actions
);
console.log("🔍 i18n Loaded - EN common.status:", translationEN.common?.status);
console.log("🔍 i18n Full JA common object:", translationJA.common);
console.log(
  "🔍 i18n resources check:",
  i18n.getResourceBundle("ja", "translation")?.common
);

export default i18n;
