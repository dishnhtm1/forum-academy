// src/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n'; // <-- import your i18n configuration

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Initialize from i18n's detected language instead of hardcoding 'EN'
    const [language, setLanguage] = useState(() => {
        const currentLang = i18n.language || localStorage.getItem('i18nextLng') || 'en';
        return currentLang.startsWith('en') ? 'EN' : 'JP';
    });

    const toggleLanguage = () => {
        const newLang = language === 'EN' ? 'JP' : 'EN';
        setLanguage(newLang);
        const i18nLang = newLang === 'EN' ? 'en' : 'ja';
        i18n.changeLanguage(i18nLang); // <-- change i18n language too
        localStorage.setItem('i18nextLng', i18nLang); // Persist to localStorage
        console.log('🔄 Language changed to:', i18nLang);
    };

    // Sync with i18n's language on mount and listen for external changes
    useEffect(() => {
        const syncLanguage = () => {
            const currentI18nLang = i18n.language;
            const contextLang = currentI18nLang.startsWith('en') ? 'EN' : 'JP';
            if (contextLang !== language) {
                setLanguage(contextLang);
                console.log('🔄 Synced LanguageContext with i18n:', currentI18nLang);
            }
        };

        // Sync on mount
        syncLanguage();

        // Listen for i18n language changes
        i18n.on('languageChanged', syncLanguage);

        return () => {
            i18n.off('languageChanged', syncLanguage);
        };
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
