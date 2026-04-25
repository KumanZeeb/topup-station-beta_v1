import React, { createContext, useContext, useState, useEffect } from 'react';
import translationService from '../translations';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(translationService.getLanguage());

  useEffect(() => {
    const unsubscribe = translationService.addListener((newLang) => {
      setLanguage(newLang);
    });
    return unsubscribe;
  }, []);

  const value = {
    t: (key, params) => translationService.t(key, params),
    language,
    setLanguage: (lang) => translationService.setLanguage(lang),
    toggleLanguage: () => translationService.toggleLanguage(),
    has: (key) => translationService.has(key)
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};