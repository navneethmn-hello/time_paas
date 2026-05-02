"use client";
import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Multi-Language Support Placeholder
  const mockTranslate = (text, targetLang) => {
      if(targetLang === 'en' || !targetLang) return text;
      return `[${targetLang.toUpperCase()}] ${text}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, mockTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
