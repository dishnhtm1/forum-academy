// src/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import i18n from "../i18n"; // <-- import your i18n configuration

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize from i18n's detected language instead of hardcoding 'EN'
  // Normalize language codes: en-US -> en, ja-JP -> ja
  const normalizeLang = (lang) => {
    if (!lang) return "en";
    const normalized = lang.startsWith("ja") ? "ja" : lang.startsWith("en") ? "en" : "en";
    return normalized;
  };
  
  const [language, setLanguage] = useState(() => {
    const currentLang = i18n.language || localStorage.getItem("i18nextLng") || "en";
    const normalized = normalizeLang(currentLang);
    // Ensure i18n is also normalized
    if (i18n.language && normalizeLang(i18n.language) !== normalized) {
      i18n.changeLanguage(normalized);
    }
    return normalized === "ja" ? "JP" : "EN";
  });

  const toggleLanguage = () => {
    const newLang = language === "EN" ? "JP" : "EN";
    setLanguage(newLang);
    const i18nLang = newLang === "EN" ? "en" : "ja";
    // Ensure proper language normalization
    i18n.changeLanguage(i18nLang).then(() => {
      localStorage.setItem("i18nextLng", i18nLang); // Persist to localStorage
      console.log("🔄 Language changed to:", i18nLang);
      console.log("🔄 i18n.language is now:", i18n.language);
      // Force a re-render by triggering a language change event
      window.dispatchEvent(new Event("languagechange"));
    });
  };

  // Sync with i18n's language on mount and listen for external changes
  useEffect(() => {
    const syncLanguage = () => {
      const currentI18nLang = i18n.language;
      const contextLang = currentI18nLang.startsWith("en") ? "EN" : "JP";
      if (contextLang !== language) {
        setLanguage(contextLang);
        console.log("🔄 Synced LanguageContext with i18n:", currentI18nLang);
      }
    };

    // Sync on mount
    syncLanguage();

    // Listen for i18n language changes
    i18n.on("languageChanged", syncLanguage);

    return () => {
      i18n.off("languageChanged", syncLanguage);
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
