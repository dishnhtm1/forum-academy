// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import translationEN from "./locales/en/translation.json";
import translationJA from "./locales/ja/translation.json";

// Configure language detector to prioritize localStorage
const languageDetectorOptions = {
  order: ["localStorage", "navigator", "htmlTag"],
  lookupLocalStorage: "i18nextLng",
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"],
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
console.log("🌍 i18n Configuration [v2.0 - Nov 4, 2025]:");
console.log("  - Current Language:", i18n.language);
console.log("  - Detected Language:", localStorage.getItem("i18nextLng"));
console.log("  - Fallback Language:", i18n.options.fallbackLng);
console.log("  - Available Languages:", Object.keys(i18n.options.resources));
console.log("🔍 Translation File Sizes:");
console.log("  - EN keys count:", Object.keys(translationEN).length);
console.log("  - JA keys count:", Object.keys(translationJA).length);
console.log("🔍 Sample JA translations:");
console.log("  - admin.dashboard.welcomeBack:", translationJA.admin?.dashboard?.welcomeBack);
console.log("  - admin.dashboard.title:", translationJA.admin?.dashboard?.title);
console.log("  - common.status:", translationJA.common?.status);
console.log("🔍 i18n.t function test:");
console.log("  - i18n.t('admin.dashboard.welcomeBack'):", i18n.t('admin.dashboard.welcomeBack'));
console.log("  - i18n.t('admin.dashboard.title'):", i18n.t('admin.dashboard.title'));
console.log("✅ i18n initialized successfully [BUILD: " + new Date().toISOString() + "]");

export default i18n;
