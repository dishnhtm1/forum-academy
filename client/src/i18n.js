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
    // Explicitly declare namespaces and supported languages to avoid prod mismatches
    defaultNS: "translation",
    ns: ["translation"],
    supportedLngs: ["en", "ja"],
    nonExplicitSupportedLngs: true, // map en-US -> en, ja-JP -> ja
    resources: {
      en: { translation: translationEN },
      ja: { translation: translationJA },
    },
    fallbackLng: "en",
    debug: process.env.NODE_ENV !== "production",
    load: "languageOnly",
    // Normalize language codes: en-US -> en, ja-JP -> ja
    cleanCode: true,
    // Ensure proper language normalization
    lng: undefined, // Let detector handle it
    cache: {
      enabled: false, // Disable caching to ensure fresh translations
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: false, // Disable suspense to avoid loading issues
    },
  })
  .then(() => {
    // Normalize language after initialization
    const currentLang = i18n.language || "en";
    const normalizedLang = currentLang.startsWith("ja") ? "ja" : currentLang.startsWith("en") ? "en" : "en";
    if (normalizedLang !== currentLang) {
      i18n.changeLanguage(normalizedLang);
    }
  });

// Debug: Log the loaded translations and configuration
// Use setTimeout to ensure i18n is fully initialized
setTimeout(() => {
  const currentLang = i18n.language || "en";
  const normalizedLang = currentLang.startsWith("ja") ? "ja" : currentLang.startsWith("en") ? "en" : "en";
  
  console.log(
    "🌍 i18n Configuration [v4.0 - FIXED - " + new Date().toISOString() + "]:"
  );
  console.log("  - Current Language:", i18n.language);
  console.log("  - Normalized Language:", normalizedLang);
  console.log("  - Detected Language:", localStorage.getItem("i18nextLng"));
  console.log("  - Fallback Language:", i18n.options.fallbackLng);
  console.log("  - Available Languages:", Object.keys(i18n.options.resources));
  console.log("🔍 Translation File Sizes:");
  console.log("  - EN top-level keys:", Object.keys(translationEN).length);
  console.log("  - JA top-level keys:", Object.keys(translationJA).length);
  
  // Check if resources are loaded correctly
  const enResource = i18n.getResourceBundle("en", "translation");
  const jaResource = i18n.getResourceBundle("ja", "translation");
  console.log("  - EN resource loaded:", !!enResource);
  console.log("  - JA resource loaded:", !!jaResource);
  console.log("  - EN resource keys:", enResource ? Object.keys(enResource).length : 0);
  console.log("  - JA resource keys:", jaResource ? Object.keys(jaResource).length : 0);
  
  console.log("🔍 Sample JA translations (direct from file):");
  console.log(
    "  - admin.dashboard.welcomeBack:",
    translationJA.admin?.dashboard?.welcomeBack || "MISSING"
  );
  console.log(
    "  - adminSidebar.sections.main:",
    translationJA.adminSidebar?.sections?.main || "MISSING"
  );
  console.log("  - common.status:", translationJA.common?.status || "MISSING");
  
  console.log("🔍 i18n.t function test (using normalized language):");
  // Temporarily set language to ja for testing
  const testLang = normalizedLang === "ja" ? "ja" : "en";
  i18n.changeLanguage(testLang).then(() => {
    console.log(
      "  - i18n.t('admin.dashboard.welcomeBack'):",
      i18n.t("admin.dashboard.welcomeBack")
    );
    console.log(
      "  - i18n.t('adminSidebar.sections.main'):",
      i18n.t("adminSidebar.sections.main")
    );
    console.log("  - i18n.t('common.status'):", i18n.t("common.status"));
    // Restore original language
    i18n.changeLanguage(normalizedLang);
  });
  
  console.log(
    "✅ i18n initialized successfully [BUILD: " + new Date().toISOString() + "]"
  );
}, 100);

export default i18n;
