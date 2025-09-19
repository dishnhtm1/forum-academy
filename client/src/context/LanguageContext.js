// src/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n'; // <-- import your i18n configuration

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('EN');

    const toggleLanguage = () => {
        const newLang = language === 'EN' ? 'JP' : 'EN';
        setLanguage(newLang);
        i18n.changeLanguage(newLang === 'EN' ? 'en' : 'ja'); // <-- change i18n language too
    };

    // Optional: update i18n on initial load
    useEffect(() => {
        i18n.changeLanguage(language === 'EN' ? 'en' : 'ja');
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
