import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (key: string, params?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const translations: { [key: string]: { [key: string]: string } } = {
  en: require('../i18n/en.json'),
  fr: require('../i18n/fr.json'),
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(
    localStorage.getItem('language') || 'en'
  );
  const [currentTranslations, setCurrentTranslations] = useState<{ [key: string]: string }>(
    translations[language]
  );

  useEffect(() => {
    localStorage.setItem('language', language);
    setCurrentTranslations(translations[language]);
  }, [language]);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  const translate = (key: string, params?: { [key: string]: string | number }): string => {
    let translatedText = currentTranslations[key] || key;
    if (params) {
      for (const paramKey in params) {
        translatedText = translatedText.replace(`{{${paramKey}}}`, String(params[paramKey]));
      }
    }
    return translatedText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
