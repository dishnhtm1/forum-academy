// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import translationEN from "./locales/en/translation.json";
import translationJA from "./locales/ja/translation.json";

// Configure language detector to prioritize localStorage
const languageDetectorOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    detection: languageDetectorOptions,
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
    react: {
      useSuspense: false, // Disable suspense to avoid loading issues
    },
  });

// Debug: Log the loaded translations and configuration
console.log("🌍 i18n Configuration:");
console.log("  - Current Language:", i18n.language);
console.log("  - Detected Language:", localStorage.getItem('i18nextLng'));
console.log("  - Fallback Language:", i18n.options.fallbackLng);
console.log("  - Available Languages:", Object.keys(i18n.options.resources));
console.log("🔍 i18n Loaded - JA common.status:", translationJA.common?.status);
console.log("🔍 i18n Loaded - JA common.actions:", translationJA.common?.actions);
console.log("🔍 i18n Loaded - EN common.status:", translationEN.common?.status);
console.log("🔍 i18n Full JA common object:", translationJA.common);
console.log("🔍 i18n resources check (JA):", i18n.getResourceBundle("ja", "translation")?.common);
console.log("🔍 i18n resources check (EN):", i18n.getResourceBundle("en", "translation")?.common);
console.log("✅ i18n initialized successfully");

export default i18n;
