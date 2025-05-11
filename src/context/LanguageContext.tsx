import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useAuth } from './AuthContext';

// Import translations
import translationsEN from '../locales/en.json';
import translationsHI from '../locales/hi.json';
import translationsBN from '../locales/bn.json';
import translationsTE from '../locales/te.json';
import translationsTA from '../locales/ta.json';

// Configure i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationsEN },
      hi: { translation: translationsHI },
      bn: { translation: translationsBN },
      te: { translation: translationsTE },
      ta: { translation: translationsTA },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Available languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
];

// Context type
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  languages: { code: string; name: string }[];
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, updateUserLanguage } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Initialize language from user preferences if available
  useEffect(() => {
    if (state.user?.preferredLanguage) {
      i18n.changeLanguage(state.user.preferredLanguage);
      setCurrentLanguage(state.user.preferredLanguage);
    }
  }, [state.user]);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    
    // Update user's language preference if logged in
    if (state.isAuthenticated) {
      updateUserLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};